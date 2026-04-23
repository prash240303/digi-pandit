import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";

// Leaflet is a browser-only library; importing it is safe here because this
// file is only bundled for web via the .web.tsx extension.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const L: typeof import("leaflet") =
  typeof window !== "undefined" ? require("leaflet") : (null as never);
if (typeof document !== "undefined") {
  const id = "leaflet-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
}

type LMap = import("leaflet").Map;
type LMarker = import("leaflet").Marker;

type MapHandle = {
  setCenter: (lng: number, lat: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetBearing: () => void;
};

type MapCtx = { map: MapHandle | null; isLoaded: boolean; leaflet: LMap | null };
const MapContext = createContext<MapCtx | null>(null);
export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within a Map component");
  return ctx;
}

export type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};
export type MapRef = MapHandle;

export type MapProps = {
  children?: ReactNode;
  className?: string;
  center?: [number, number];
  zoom?: number;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (vp: MapViewport) => void;
  loading?: boolean;
  theme?: "light" | "dark";
  styles?: { light?: string; dark?: string };
  projection?: unknown;
};

export const Map = forwardRef<MapRef, MapProps>(function Map(
  { children, className, center, zoom, viewport, onViewportChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const initialCenter = viewport?.center ?? center ?? [77.209, 28.6139];
  const initialZoom = viewport?.zoom ?? zoom ?? 12;

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !L) return;
    const m = L.map(containerRef.current, {
      center: [initialCenter[1], initialCenter[0]],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(m);
    mapRef.current = m;
    setIsLoaded(true);

    const emit = () => {
      if (!onViewportChange) return;
      const c = m.getCenter();
      onViewportChange({
        center: [c.lng, c.lat],
        zoom: m.getZoom(),
        bearing: 0,
        pitch: 0,
      });
    };
    m.on("moveend", emit);
    m.on("zoomend", emit);

    return () => {
      m.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !center) return;
    const cur = m.getCenter();
    if (Math.abs(cur.lng - center[0]) > 1e-6 || Math.abs(cur.lat - center[1]) > 1e-6) {
      m.setView([center[1], center[0]], zoom ?? m.getZoom());
    } else if (zoom != null && zoom !== m.getZoom()) {
      m.setZoom(zoom);
    }
  }, [center?.[0], center?.[1], zoom]);

  const handle = useMemo<MapHandle>(
    () => ({
      setCenter: (lng, lat) => mapRef.current?.panTo([lat, lng]),
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      resetBearing: () => {},
    }),
    [],
  );

  useImperativeHandle(ref, () => handle, [handle]);

  const ctx = useMemo<MapCtx>(
    () => ({ map: isLoaded ? handle : null, isLoaded, leaflet: mapRef.current }),
    [isLoaded, handle],
  );

  return (
    <MapContext.Provider value={ctx}>
      <View className={cn("relative w-full h-full flex-1", className)}>
        <div
          ref={containerRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        {isLoaded && children}
      </View>
    </MapContext.Provider>
  );
});

// ---- Marker ---------------------------------------------------------------

type MarkerCtx = {
  marker: LMarker | null;
  setPopupContent: (html: string) => void;
  setTooltipContent: (html: string, position: "top" | "bottom") => void;
};
const MarkerContext = createContext<MarkerCtx | null>(null);

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
}: {
  longitude: number;
  latitude: number;
  children?: ReactNode;
  onClick?: () => void;
  id?: string;
}) {
  const ctx = useContext(MapContext);
  const markerRef = useRef<LMarker | null>(null);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const leaflet = ctx?.leaflet;
    if (!leaflet || !L) return;
    const icon = L.divIcon({
      html: html || `<div style="width:12px;height:12px;border-radius:50%;background:#c2410c;border:2px solid #fff;"></div>`,
      className: "mapcn-marker",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
    const m = L.marker([latitude, longitude], { icon });
    m.addTo(leaflet);
    if (onClick) m.on("click", onClick);
    markerRef.current = m;
    return () => {
      m.remove();
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.leaflet, html]);

  useEffect(() => {
    markerRef.current?.setLatLng([latitude, longitude]);
  }, [latitude, longitude]);

  const mctx = useMemo<MarkerCtx>(
    () => ({
      marker: null,
      setPopupContent: (h) => markerRef.current?.bindPopup(h),
      setTooltipContent: (h, position) =>
        markerRef.current?.bindTooltip(h, { direction: position }),
    }),
    [],
  );

  return (
    <MarkerContext.Provider value={mctx}>
      <MarkerHtmlSetter setHtml={setHtml}>{children}</MarkerHtmlSetter>
    </MarkerContext.Provider>
  );
}

function MarkerHtmlSetter({
  children,
  setHtml,
}: {
  children?: ReactNode;
  setHtml: (h: string) => void;
}) {
  return (
    <HtmlCaptureContext.Provider value={setHtml}>{children}</HtmlCaptureContext.Provider>
  );
}

const HtmlCaptureContext = createContext<((h: string) => void) | null>(null);

export function MarkerContent({ html }: { children?: ReactNode; className?: string; html?: string }) {
  const setHtml = useContext(HtmlCaptureContext);
  useEffect(() => {
    if (setHtml && html) setHtml(html);
  }, [setHtml, html]);
  return null;
}

export function MarkerLabel({
  children,
  position = "bottom",
}: {
  children?: ReactNode;
  className?: string;
  position?: "top" | "bottom";
}) {
  const ctx = useContext(MarkerContext);
  useEffect(() => {
    if (!ctx || typeof children !== "string") return;
    ctx.setTooltipContent(children, position);
  }, [ctx, children, position]);
  return null;
}

export function MarkerPopup({ children }: { children?: ReactNode; className?: string; closeButton?: boolean }) {
  const ctx = useContext(MarkerContext);
  useEffect(() => {
    if (!ctx || typeof children !== "string") return;
    ctx.setPopupContent(children);
  }, [ctx, children]);
  return null;
}
export const MarkerTooltip = MarkerPopup;

export function MapPopup({
  longitude,
  latitude,
  children,
  onClose,
}: {
  longitude: number;
  latitude: number;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
}) {
  const ctx = useContext(MapContext);
  useEffect(() => {
    if (!ctx?.leaflet || !L) return;
    const content = typeof children === "string" ? children : "";
    const popup = L.popup()
      .setLatLng([latitude, longitude])
      .setContent(content)
      .openOn(ctx.leaflet);
    if (onClose) popup.on("remove", onClose);
    return () => {
      popup.remove();
    };
  }, [ctx?.leaflet, longitude, latitude, children]);
  return null;
}

export function MapRoute({
  coordinates,
  color = "#c2410c",
  width = 4,
  opacity = 0.9,
  dashArray,
}: {
  id?: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: [number, number];
  interactive?: boolean;
  onClick?: () => void;
}) {
  const ctx = useContext(MapContext);
  useEffect(() => {
    if (!ctx?.leaflet || !L) return;
    const latlngs = coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
    const line = L.polyline(latlngs, {
      color,
      weight: width,
      opacity,
      dashArray: dashArray ? dashArray.join(",") : undefined,
    }).addTo(ctx.leaflet);
    return () => {
      line.remove();
    };
  }, [ctx?.leaflet, coordinates, color, width, opacity, dashArray]);
  return null;
}

export type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  className?: string;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

export function MapControls({
  position = "top-right",
  showZoom,
  showLocate,
  onLocate,
}: MapControlsProps) {
  const { map } = useMap();
  const ctx = useContext(MapContext);

  const handleLocate = () => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      ctx?.leaflet?.setView([latitude, longitude], ctx.leaflet.getZoom());
      onLocate?.({ latitude, longitude });
    });
  };

  const posStyle: Record<string, object> = {
    "top-left": { top: 12, left: 12 },
    "top-right": { top: 12, right: 12 },
    "bottom-left": { bottom: 12, left: 12 },
    "bottom-right": { bottom: 12, right: 12 },
  };

  return (
    <View
      className="absolute z-10 gap-2"
      style={posStyle[position] as object}
      pointerEvents="box-none"
    >
      {showZoom && (
        <View className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow">
          <TouchableOpacity
            onPress={() => map?.zoomIn()}
            className="w-9 h-9 items-center justify-center border-b border-stone-200"
          >
            <Text className="text-lg">+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => map?.zoomOut()}
            className="w-9 h-9 items-center justify-center"
          >
            <Text className="text-lg">−</Text>
          </TouchableOpacity>
        </View>
      )}
      {showLocate && (
        <TouchableOpacity
          onPress={handleLocate}
          className="w-9 h-9 bg-white rounded-xl items-center justify-center border border-stone-200 shadow"
        >
          <Text className="text-base">◎</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
