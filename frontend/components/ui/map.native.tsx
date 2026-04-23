import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import * as Location from "expo-location";
import { Minus, Plus, Locate, Compass, Maximize, X } from "lucide-react-native";

import { cn } from "@/lib/utils";

/**
 * Map component with the mapcn (https://www.mapcn.dev) API surface,
 * backed on native by Leaflet + OpenStreetMap inside a WebView. No
 * API key, no DOM/window dependency in the RN bundle. The public
 * props match mapcn 1:1 so calling code is portable with the web docs.
 */

// -----------------------------------------------------------------------------
// CONTEXT
// -----------------------------------------------------------------------------

type MarkerInternalId = string;
type MarkerState = {
  id: MarkerInternalId;
  lng: number;
  lat: number;
  html: string;
  onClick?: () => void;
};
type PopupState = {
  id: string;
  lng: number;
  lat: number;
  html: string;
  anchorId?: string;
  onClose?: () => void;
};
type RouteState = {
  id: string;
  coordinates: [number, number][];
  color: string;
  width: number;
  opacity: number;
  dashArray?: [number, number];
};

type MapHandle = {
  setCenter: (lng: number, lat: number, zoom?: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetBearing: () => void;
};

type MapContextValue = {
  map: MapHandle | null;
  isLoaded: boolean;
  upsertMarker: (m: MarkerState) => void;
  removeMarker: (id: string) => void;
  upsertPopup: (p: PopupState) => void;
  removePopup: (id: string) => void;
  upsertRoute: (r: RouteState) => void;
  removeRoute: (id: string) => void;
  registerMarkerPopup: (markerId: string, html: string) => void;
  unregisterMarkerPopup: (markerId: string) => void;
};
const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within a Map component");
  return { map: ctx.map, isLoaded: ctx.isLoaded };
}

function useMapInternal() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("Must be used within a Map component");
  return ctx;
}

// Per-marker context so children (MarkerContent, MarkerPopup) can find their owner.
type MarkerContextValue = { id: string; lng: number; lat: number };
const MarkerContext = createContext<MarkerContextValue | null>(null);
function useMarkerContext() {
  const m = useContext(MarkerContext);
  if (!m) throw new Error("Must be used inside a MapMarker");
  return m;
}

// -----------------------------------------------------------------------------
// VIEWPORT TYPES
// -----------------------------------------------------------------------------

export type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

function buildHtml(center: [number, number], zoom: number): string {
  const [lng, lat] = center;
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html,body,#map{margin:0;padding:0;height:100%;width:100%;background:#f5f5f4;}
  .leaflet-popup-content-wrapper{border-radius:10px;}
  .mapcn-marker{display:flex;flex-direction:column;align-items:center;pointer-events:auto;}
</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const post = (o) => window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(o));
  const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${lat}, ${lng}], ${zoom});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  const markers = {};
  const popups = {};
  const routes = {};
  const markerPopupHtml = {};

  function upsertMarker(m) {
    const icon = L.divIcon({ className: 'mapcn-marker-wrap', html: m.html, iconSize: null, iconAnchor: [14, 36] });
    if (markers[m.id]) {
      markers[m.id].setLatLng([m.lat, m.lng]);
      markers[m.id].setIcon(icon);
    } else {
      const mk = L.marker([m.lat, m.lng], { icon }).addTo(map);
      mk.on('click', () => {
        const popupHtml = markerPopupHtml[m.id];
        if (popupHtml) mk.bindPopup(popupHtml).openPopup();
        post({ type: 'markerClick', id: m.id });
      });
      markers[m.id] = mk;
    }
  }
  function removeMarker(id) { if (markers[id]) { markers[id].remove(); delete markers[id]; delete markerPopupHtml[id]; } }

  function setMarkerPopup(id, html) {
    markerPopupHtml[id] = html;
    if (markers[id]) markers[id].bindPopup(html);
  }
  function clearMarkerPopup(id) { delete markerPopupHtml[id]; if (markers[id]) markers[id].unbindPopup(); }

  function upsertPopup(p) {
    if (popups[p.id]) popups[p.id].remove();
    const popup = L.popup({ closeButton: true, autoClose: false, closeOnClick: false })
      .setLatLng([p.lat, p.lng]).setContent(p.html).openOn(map);
    popup.on('remove', () => post({ type: 'popupClose', id: p.id }));
    popups[p.id] = popup;
  }
  function removePopup(id) { if (popups[id]) { popups[id].remove(); delete popups[id]; } }

  function upsertRoute(r) {
    if (routes[r.id]) routes[r.id].remove();
    const latlngs = r.coordinates.map(c => [c[1], c[0]]);
    const opts = { color: r.color, weight: r.width, opacity: r.opacity };
    if (r.dashArray) opts.dashArray = r.dashArray.join(',');
    routes[r.id] = L.polyline(latlngs, opts).addTo(map);
  }
  function removeRoute(id) { if (routes[id]) { routes[id].remove(); delete routes[id]; } }

  function setCenter(lng, lat, zoom) { map.flyTo([lat, lng], zoom ?? map.getZoom(), { duration: 0.6 }); }
  function zoomIn() { map.zoomIn(); }
  function zoomOut() { map.zoomOut(); }
  function resetBearing() { /* Leaflet is 2D north-up; no-op */ }

  map.on('moveend', () => {
    const c = map.getCenter();
    post({ type: 'viewport', center: [c.lng, c.lat], zoom: map.getZoom(), bearing: 0, pitch: 0 });
  });

  window.mapApi = { upsertMarker, removeMarker, setMarkerPopup, clearMarkerPopup, upsertPopup, removePopup, upsertRoute, removeRoute, setCenter, zoomIn, zoomOut, resetBearing };
  map.whenReady(() => post({ type: 'ready' }));
  true;
</script>
</body></html>`;
}

// -----------------------------------------------------------------------------
// MAP
// -----------------------------------------------------------------------------

export type MapRef = MapHandle | null;

export type MapProps = {
  children?: ReactNode;
  className?: string;
  theme?: "light" | "dark";
  styles?: {
    light?: string;
    dark?: string;
  };
  center?: [number, number];
  zoom?: number;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (vp: MapViewport) => void;
  loading?: boolean;
  projection?: unknown;
};

export const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    center,
    zoom,
    viewport,
    onViewportChange,
    loading,
  },
  ref,
) {
  const webRef = useRef<WebView>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<Record<string, MarkerState>>({});
  const popupsRef = useRef<Record<string, PopupState>>({});
  const routesRef = useRef<Record<string, RouteState>>({});
  const onMarkerClickRef = useRef<Record<string, () => void>>({});
  const onPopupCloseRef = useRef<Record<string, () => void>>({});

  const initialCenter: [number, number] =
    viewport?.center ?? center ?? [0, 0];
  const initialZoom = viewport?.zoom ?? zoom ?? 3;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => buildHtml(initialCenter, initialZoom), []);

  const injectJS = useCallback((code: string) => {
    webRef.current?.injectJavaScript(code + "; true;");
  }, []);

  const handle: MapHandle = useMemo(
    () => ({
      setCenter: (lng, lat, z) =>
        injectJS(`window.mapApi && window.mapApi.setCenter(${lng}, ${lat}, ${z ?? "undefined"})`),
      zoomIn: () => injectJS(`window.mapApi && window.mapApi.zoomIn()`),
      zoomOut: () => injectJS(`window.mapApi && window.mapApi.zoomOut()`),
      resetBearing: () =>
        injectJS(`window.mapApi && window.mapApi.resetBearing()`),
    }),
    [injectJS],
  );

  useImperativeHandle(ref, () => handle, [handle]);

  // Controlled mode: push center/zoom from props when they change.
  const ctrlCenter = viewport?.center ?? center;
  const ctrlZoom = viewport?.zoom ?? zoom;
  useEffect(() => {
    if (!isLoaded || !ctrlCenter) return;
    handle.setCenter(ctrlCenter[0], ctrlCenter[1], ctrlZoom);
  }, [isLoaded, ctrlCenter?.[0], ctrlCenter?.[1], ctrlZoom, handle]);

  const upsertMarker = useCallback(
    (m: MarkerState) => {
      markersRef.current[m.id] = m;
      onMarkerClickRef.current[m.id] = m.onClick ?? (() => {});
      if (!isLoaded) return;
      injectJS(
        `window.mapApi && window.mapApi.upsertMarker(${JSON.stringify({
          id: m.id,
          lng: m.lng,
          lat: m.lat,
          html: m.html,
        })})`,
      );
    },
    [injectJS, isLoaded],
  );
  const removeMarker = useCallback(
    (id: string) => {
      delete markersRef.current[id];
      delete onMarkerClickRef.current[id];
      injectJS(`window.mapApi && window.mapApi.removeMarker(${JSON.stringify(id)})`);
    },
    [injectJS],
  );
  const registerMarkerPopup = useCallback(
    (id: string, htmlStr: string) => {
      injectJS(
        `window.mapApi && window.mapApi.setMarkerPopup(${JSON.stringify(id)}, ${JSON.stringify(htmlStr)})`,
      );
    },
    [injectJS],
  );
  const unregisterMarkerPopup = useCallback(
    (id: string) => {
      injectJS(
        `window.mapApi && window.mapApi.clearMarkerPopup(${JSON.stringify(id)})`,
      );
    },
    [injectJS],
  );
  const upsertPopup = useCallback(
    (p: PopupState) => {
      popupsRef.current[p.id] = p;
      onPopupCloseRef.current[p.id] = p.onClose ?? (() => {});
      if (!isLoaded) return;
      injectJS(
        `window.mapApi && window.mapApi.upsertPopup(${JSON.stringify({
          id: p.id,
          lng: p.lng,
          lat: p.lat,
          html: p.html,
        })})`,
      );
    },
    [injectJS, isLoaded],
  );
  const removePopup = useCallback(
    (id: string) => {
      delete popupsRef.current[id];
      delete onPopupCloseRef.current[id];
      injectJS(`window.mapApi && window.mapApi.removePopup(${JSON.stringify(id)})`);
    },
    [injectJS],
  );
  const upsertRoute = useCallback(
    (r: RouteState) => {
      routesRef.current[r.id] = r;
      if (!isLoaded) return;
      injectJS(
        `window.mapApi && window.mapApi.upsertRoute(${JSON.stringify(r)})`,
      );
    },
    [injectJS, isLoaded],
  );
  const removeRoute = useCallback(
    (id: string) => {
      delete routesRef.current[id];
      injectJS(`window.mapApi && window.mapApi.removeRoute(${JSON.stringify(id)})`);
    },
    [injectJS],
  );

  // On load, replay any items that were registered before ready.
  useEffect(() => {
    if (!isLoaded) return;
    Object.values(markersRef.current).forEach((m) =>
      injectJS(
        `window.mapApi && window.mapApi.upsertMarker(${JSON.stringify({
          id: m.id,
          lng: m.lng,
          lat: m.lat,
          html: m.html,
        })})`,
      ),
    );
    Object.values(popupsRef.current).forEach((p) =>
      injectJS(
        `window.mapApi && window.mapApi.upsertPopup(${JSON.stringify({
          id: p.id,
          lng: p.lng,
          lat: p.lat,
          html: p.html,
        })})`,
      ),
    );
    Object.values(routesRef.current).forEach((r) =>
      injectJS(
        `window.mapApi && window.mapApi.upsertRoute(${JSON.stringify(r)})`,
      ),
    );
  }, [isLoaded, injectJS]);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "ready") setIsLoaded(true);
      else if (msg.type === "markerClick")
        onMarkerClickRef.current[msg.id]?.();
      else if (msg.type === "popupClose")
        onPopupCloseRef.current[msg.id]?.();
      else if (msg.type === "viewport" && onViewportChange) {
        onViewportChange({
          center: msg.center,
          zoom: msg.zoom,
          bearing: msg.bearing,
          pitch: msg.pitch,
        });
      }
    } catch {}
  };

  const ctx = useMemo<MapContextValue>(
    () => ({
      map: isLoaded ? handle : null,
      isLoaded,
      upsertMarker,
      removeMarker,
      upsertPopup,
      removePopup,
      upsertRoute,
      removeRoute,
      registerMarkerPopup,
      unregisterMarkerPopup,
    }),
    [
      isLoaded,
      handle,
      upsertMarker,
      removeMarker,
      upsertPopup,
      removePopup,
      upsertRoute,
      removeRoute,
      registerMarkerPopup,
      unregisterMarkerPopup,
    ],
  );

  return (
    <MapContext.Provider value={ctx}>
      <View className={cn("relative w-full h-full flex-1", className)}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html, baseUrl: "https://localhost/" }}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
          style={StyleSheet.absoluteFillObject}
          androidLayerType="hardware"
          setSupportMultipleWindows={false}
          mixedContentMode={Platform.OS === "android" ? "always" : undefined}
        />
        {(loading || !isLoaded) && (
          <View
            style={StyleSheet.absoluteFillObject}
            className="items-center justify-center bg-white/60"
          >
            <ActivityIndicator size="large" color="#c2410c" />
          </View>
        )}
        {children}
      </View>
    </MapContext.Provider>
  );
});

// -----------------------------------------------------------------------------
// HTML HELPERS (used to render marker content into the WebView)
// -----------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// -----------------------------------------------------------------------------
// MARKER
// -----------------------------------------------------------------------------

export type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children?: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void; // web-only; no-op on native
  onMouseLeave?: () => void;
  id?: string;
};

type MarkerBuildState = { content?: string; popup?: string };
type MarkerBuildContextValue = {
  setContent: (html: string) => void;
  setPopup: (html: string | null) => void;
};
const MarkerBuildContext = createContext<MarkerBuildContextValue | null>(null);

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  id,
}: MapMarkerProps) {
  const internal = useMapInternal();
  const generatedId = useMemo(
    () => id ?? `m-${latitude.toFixed(5)}-${longitude.toFixed(5)}`,
    [id, latitude, longitude],
  );
  const [content, setContent] = useState<string>(defaultMarkerHtml());
  const [popup, setPopup] = useState<string | null>(null);

  useEffect(() => {
    internal.upsertMarker({
      id: generatedId,
      lng: longitude,
      lat: latitude,
      html: content,
      onClick,
    });
    return () => internal.removeMarker(generatedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedId, longitude, latitude, content]);

  useEffect(() => {
    if (popup) internal.registerMarkerPopup(generatedId, popup);
    else internal.unregisterMarkerPopup(generatedId);
  }, [generatedId, popup, internal]);

  const buildCtx: MarkerBuildContextValue = useMemo(
    () => ({ setContent, setPopup }),
    [],
  );
  const markerCtx: MarkerContextValue = useMemo(
    () => ({ id: generatedId, lng: longitude, lat: latitude }),
    [generatedId, longitude, latitude],
  );

  return (
    <MarkerContext.Provider value={markerCtx}>
      <MarkerBuildContext.Provider value={buildCtx}>
        {/* Subcomponents render null — their effect is to register HTML. */}
        {children}
      </MarkerBuildContext.Provider>
    </MarkerContext.Provider>
  );
}

function defaultMarkerHtml(): string {
  return `<div style="display:flex;flex-direction:column;align-items:center;">
<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.3);"></div>
</div>`;
}

// -----------------------------------------------------------------------------
// MARKER CONTENT / LABEL
// -----------------------------------------------------------------------------

/**
 * React renders MarkerContent's children into HTML via a small RN→HTML
 * converter. We only support <Text>, emoji, and nested Views with basic
 * styles — enough for pins/labels. For richer layouts, pass raw html
 * through `html` prop.
 */
export type MarkerContentProps = {
  children?: ReactNode;
  className?: string;
  html?: string; // escape hatch: raw HTML
};

export function MarkerContent({ children, html }: MarkerContentProps) {
  const build = useContext(MarkerBuildContext);
  useEffect(() => {
    if (!build) return;
    const resolved = html ?? reactToHtml(children);
    build.setContent(resolved || defaultMarkerHtml());
  }, [children, html, build]);
  return null;
}

export type MarkerLabelProps = {
  children?: ReactNode;
  className?: string;
  position?: "top" | "bottom";
};

export function MarkerLabel({
  children,
  position = "top",
}: MarkerLabelProps) {
  const build = useContext(MarkerBuildContext);
  useEffect(() => {
    if (!build) return;
    const label = `<div style="font:600 10px -apple-system,Segoe UI,Roboto,sans-serif;background:rgba(255,255,255,.9);padding:2px 6px;border-radius:6px;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,.15);">${escapeHtml(
      String(children ?? ""),
    )}</div>`;
    const pin = defaultMarkerHtml();
    build.setContent(
      position === "top"
        ? `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">${label}${pin}</div>`
        : `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">${pin}${label}</div>`,
    );
  }, [children, position, build]);
  return null;
}

// Very small RN→HTML converter. Supports <Text>, nested <View>, string children.
function reactToHtml(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number")
    return escapeHtml(String(node));
  if (Array.isArray(node)) return node.map(reactToHtml).join("");
  if (React.isValidElement(node)) {
    const type = node.type as
      | string
      | { displayName?: string; name?: string };
    const name =
      typeof type === "string"
        ? type
        : (type as { displayName?: string; name?: string }).displayName ??
          (type as { name?: string }).name ??
          "";
    const children = reactToHtml((node.props as { children?: ReactNode }).children);
    if (name === "Text") return `<span>${children}</span>`;
    return `<div>${children}</div>`;
  }
  return "";
}

// -----------------------------------------------------------------------------
// MARKER POPUP / TOOLTIP
// -----------------------------------------------------------------------------

export type MarkerPopupProps = {
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
};

export function MarkerPopup({ children }: MarkerPopupProps) {
  const build = useContext(MarkerBuildContext);
  useEffect(() => {
    if (!build) return;
    build.setPopup(`<div>${reactToHtml(children)}</div>`);
    return () => build.setPopup(null);
  }, [children, build]);
  return null;
}

// Tooltip on touch devices behaves the same as a popup.
export const MarkerTooltip = MarkerPopup;
export type MarkerTooltipProps = MarkerPopupProps;

// -----------------------------------------------------------------------------
// MAP POPUP (standalone)
// -----------------------------------------------------------------------------

export type MapPopupProps = {
  longitude: number;
  latitude: number;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
};

export function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
}: MapPopupProps) {
  const internal = useMapInternal();
  const idRef = useRef(
    `p-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`,
  );
  const htmlStr = useMemo(() => reactToHtml(children), [children]);

  useEffect(() => {
    internal.upsertPopup({
      id: idRef.current,
      lng: longitude,
      lat: latitude,
      html: htmlStr,
      onClose,
    });
    const id = idRef.current;
    return () => internal.removePopup(id);
  }, [longitude, latitude, htmlStr, onClose, internal]);
  return null;
}

// -----------------------------------------------------------------------------
// MAP ROUTE
// -----------------------------------------------------------------------------

export type MapRouteProps = {
  id?: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: [number, number];
  onClick?: () => void;
  interactive?: boolean;
};

export function MapRoute({
  id,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
}: MapRouteProps) {
  const internal = useMapInternal();
  const idRef = useRef(
    id ?? `r-${Math.random().toString(36).slice(2, 9)}`,
  );
  useEffect(() => {
    internal.upsertRoute({
      id: idRef.current,
      coordinates,
      color,
      width,
      opacity,
      dashArray,
    });
    const rid = idRef.current;
    return () => internal.removeRoute(rid);
  }, [coordinates, color, width, opacity, dashArray, internal]);
  return null;
}

// -----------------------------------------------------------------------------
// CONTROLS
// -----------------------------------------------------------------------------

export type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  className?: string;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

const positionClasses = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-12 right-4",
};

export function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}: MapControlsProps) {
  const { map } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleLocate = async () => {
    if (!map) return;
    setWaitingForLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");
      const pos = await Location.getCurrentPositionAsync({});
      const coords = {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
      };
      map.setCenter(coords.longitude, coords.latitude, 14);
      onLocate?.(coords);
    } catch (e) {
      console.warn("Location error:", e);
    } finally {
      setWaitingForLocation(false);
    }
  };

  return (
    <View
      className={cn(
        "absolute z-10 flex flex-col gap-2",
        positionClasses[position],
        className,
      )}
    >
      {showZoom && map && (
        <View className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={map.zoomIn}
            className="p-2 border-b border-gray-100 flex items-center justify-center"
          >
            <Plus size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={map.zoomOut}
            className="p-2 flex items-center justify-center"
          >
            <Minus size={20} color="#333" />
          </TouchableOpacity>
        </View>
      )}
      {showCompass && map && (
        <View className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={map.resetBearing}
            className="p-2 flex items-center justify-center"
          >
            <Compass size={20} color="#333" />
          </TouchableOpacity>
        </View>
      )}
      {showLocate && (
        <View className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={handleLocate}
            disabled={waitingForLocation}
            className="p-2 flex items-center justify-center"
          >
            {waitingForLocation ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
              <Locate size={20} color="#333" />
            )}
          </TouchableOpacity>
        </View>
      )}
      {showFullscreen && (
        <View className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden opacity-60">
          <View className="p-2 flex items-center justify-center">
            <Maximize size={20} color="#333" />
          </View>
        </View>
      )}
    </View>
  );
}

// Re-export unused icons so that tree-shaking doesn't strip them from
// downstream custom consumers that import from this file.
export { X };
