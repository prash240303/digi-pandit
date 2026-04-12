import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
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
  useColorScheme,
  StyleSheet,
} from "react-native";
import MapLibreGL, {
  MapViewRef,
  CameraRef,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import {
  X,
  Minus,
  Plus,
  Locate,
  Maximize,
  Loader2,
  Compass,
} from "lucide-react-native";

import { cn } from "@/lib/utils";

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

type Theme = "light" | "dark";

function useResolvedTheme(themeProp?: "light" | "dark"): Theme {
  const systemTheme = useColorScheme();
  return themeProp ?? (systemTheme === "dark" ? "dark" : "light");
}

type MapContextValue = {
  mapRef: React.RefObject<MapViewRef> | null;
  cameraRef: React.RefObject<CameraRef> | null;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

/** Map viewport state */
export type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

type MapStyleOption = string;

export type MapRef = MapViewRef;

export type MapProps = {
  children?: ReactNode;
  className?: string;
  theme?: Theme;
  styles?: {
    light?: MapStyleOption;
    dark?: MapStyleOption;
  };
  viewport?: Partial<MapViewport>;
  onViewportChange?: (viewport: MapViewport) => void;
  // RN specific overrides to ignore web specific props like projection smoothly
  projection?: any;
} & Omit<React.ComponentProps<typeof MapLibreGL.MapView>, "mapStyle">;

function DefaultLoader() {
  return (
    <View className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
      <Loader2 size={24} color="#666" />
    </View>
  );
}

export const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme: themeProp,
    styles,
    viewport,
    onViewportChange,
    ...props
  },
  ref,
) {
  const mapRef = useRef<MapViewRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const resolvedTheme = useResolvedTheme(themeProp);

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles],
  );

  const styleURL = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

  useImperativeHandle(ref, () => mapRef.current as MapRef, []);

  const handleRegionChange = useCallback(async () => {
    if (!mapRef.current || !onViewportChange) return;
    try {
      const center = await mapRef.current.getCenter();
      const zoom = await mapRef.current.getZoom();
      // Bearing and pitch typically requires tracking state in RN,
      // provided directly if available via onRegionDidChange event.
      onViewportChange({
        center: center as [number, number],
        zoom,
        bearing: viewport?.bearing ?? 0,
        pitch: viewport?.pitch ?? 0,
      });
    } catch (e) {
      // Handle gracefully
    }
  }, [onViewportChange, viewport]);

  const contextValue = useMemo(
    () => ({
      mapRef,
      cameraRef,
      isLoaded,
    }),
    [isLoaded],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <View className={cn("relative w-full h-full flex-1", className)}>
        <MapLibreGL.MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          mapStyle={styleURL}
          logoEnabled={false}
          attributionEnabled={false}
          onDidFinishLoadingMap={() => setIsLoaded(true)}
          onRegionDidChange={handleRegionChange}
          {...props}
        >
          <MapLibreGL.Camera
            ref={cameraRef}
            zoomLevel={viewport?.zoom ?? 1}
            centerCoordinate={viewport?.center ?? [0, 0]}
            pitch={viewport?.pitch ?? 0}
            heading={viewport?.bearing ?? 0}
            animationMode="flyTo"
            animationDuration={300}
          />
          {children}
        </MapLibreGL.MapView>
        {!isLoaded && <DefaultLoader />}
      </View>
    </MapContext.Provider>
  );
});

// -----------------------------------------------------------------------------
// MARKERS & POPUPS
// -----------------------------------------------------------------------------

type MarkerContextValue = {
  coordinate: [number, number];
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

export function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("Must be used within MapMarker");
  return context;
}

export type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: () => void;
  draggable?: boolean;
};

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
}: MapMarkerProps) {
  const id = useId();

  return (
    <MarkerContext.Provider value={{ coordinate: [longitude, latitude] }}>
      <MapLibreGL.PointAnnotation
        id={`marker-${id}`}
        coordinate={[longitude, latitude]}
        onSelected={onClick}
      >
        <View>{children}</View>
      </MapLibreGL.PointAnnotation>
    </MarkerContext.Provider>
  );
}

export type MarkerContentProps = {
  children?: ReactNode;
  className?: string;
};

export function MarkerContent({ children, className }: MarkerContentProps) {
  return (
    <View className={cn("relative items-center justify-center", className)}>
      {children || <DefaultMarkerIcon />}
    </View>
  );
}

function DefaultMarkerIcon() {
  return (
    <View className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
  );
}

export type MarkerPopupProps = {
  children: ReactNode;
  className?: string;
  closeButton?: boolean;
};

export function MarkerPopup({ children, className }: MarkerPopupProps) {
  return (
    <MapLibreGL.Callout>
      <View
        className={cn(
          "rounded-md bg-white p-3 shadow-md min-w-[100px]",
          className,
        )}
      >
        {children}
      </View>
    </MapLibreGL.Callout>
  );
}

export type MarkerTooltipProps = MarkerPopupProps;
export const MarkerTooltip = MarkerPopup;

export type MarkerLabelProps = {
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom";
};

export function MarkerLabel({
  children,
  className,
  position = "top",
}: MarkerLabelProps) {
  return (
    <View
      className={cn(
        "absolute",
        position === "top" ? "-top-6" : "-bottom-6",
        className,
      )}
    >
      <Text className="text-[10px] font-medium text-black bg-white/80 px-1 rounded overflow-hidden">
        {children}
      </Text>
    </View>
  );
}

export type MapPopupProps = {
  longitude: number;
  latitude: number;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  closeButton?: boolean;
};

export function MapPopup({
  longitude,
  latitude,
  children,
  className,
  closeButton,
  onClose,
}: MapPopupProps) {
  const id = useId();
  // Using MarkerView for floating free popups
  return (
    <MapLibreGL.MarkerView
      id={`popup-${id}`}
      coordinate={[longitude, latitude]}
    >
      <View
        className={cn("rounded-md bg-white p-3 shadow-md relative", className)}
      >
        {closeButton && (
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-1 right-1 z-10 p-1"
          >
            <X size={14} color="#000" />
          </TouchableOpacity>
        )}
        {children}
      </View>
    </MapLibreGL.MarkerView>
  );
}

// -----------------------------------------------------------------------------
// CONTROLS
// -----------------------------------------------------------------------------

export type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean; // Note: Fullscreen is conceptual in RN, you might want to wire this to a parent state
  className?: string;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

const positionClasses = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-12 right-4", // Adjust for safe areas
};

export function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  className,
  onLocate,
}: MapControlsProps) {
  const { cameraRef, mapRef } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleZoomIn = async () => {
    if (!mapRef?.current || !cameraRef?.current) return;
    const currentZoom = await mapRef.current.getZoom();
    cameraRef.current.zoomTo(currentZoom + 1, 300);
  };

  const handleZoomOut = async () => {
    if (!mapRef?.current || !cameraRef?.current) return;
    const currentZoom = await mapRef.current.getZoom();
    cameraRef.current.zoomTo(currentZoom - 1, 300);
  };

  const handleResetBearing = () => {
    cameraRef?.current?.setCamera({
      heading: 0,
      pitch: 0,
      animationDuration: 300,
    });
  };

  const handleLocate = async () => {
    setWaitingForLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      };

      cameraRef?.current?.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: 14,
        animationDuration: 1500,
      });

      onLocate?.(coords);
    } catch (error) {
      console.warn("Location error:", error);
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
      {showZoom && (
        <View className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={handleZoomIn}
            className="p-2 border-b border-gray-100 flex items-center justify-center"
          >
            <Plus size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleZoomOut}
            className="p-2 flex items-center justify-center"
          >
            <Minus size={20} color="#333" />
          </TouchableOpacity>
        </View>
      )}
      {showCompass && (
        <View className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={handleResetBearing}
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
              <Loader2 size={20} color="#333" /> // Note: Native Lucide Loader doesn't animate out of box without reanimated. Use ActivityIndicator if preferred.
            ) : (
              <Locate size={20} color="#333" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// -----------------------------------------------------------------------------
// ROUTES & LAYERS
// -----------------------------------------------------------------------------

export type MapRouteProps = {
  id?: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: [number, number];
  onClick?: () => void;
};

export function MapRoute({
  id: propId,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
}: MapRouteProps) {
  const autoId = useId();
  const id = propId ?? autoId;

  const feature: GeoJSON.Feature<GeoJSON.LineString> = useMemo(
    () => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    }),
    [coordinates],
  );

  return (
    <MapLibreGL.ShapeSource id={`route-source-${id}`} shape={feature}>
      <MapLibreGL.LineLayer
        id={`route-layer-${id}`}
        style={{
          lineColor: color,
          lineWidth: width,
          lineOpacity: opacity,
          ...(dashArray ? { lineDasharray: dashArray } : {}),
          lineJoin: "round",
          lineCap: "round",
        }}
      />
    </MapLibreGL.ShapeSource>
  );
}

export type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  clusterMaxZoom?: number;
  clusterRadius?: number;
  clusterColors?: [string, string, string];
  clusterThresholds?: [number, number];
  pointColor?: string;
  onPointClick?: (feature: any, coordinates: [number, number]) => void;
  onClusterClick?: (
    clusterId: number,
    coordinates: [number, number],
    pointCount: number,
  ) => void;
};

export function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  clusterMaxZoom = 14,
  clusterRadius = 50,
  clusterColors = ["#22c55e", "#eab308", "#ef4444"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>) {
  const id = useId();
  const { cameraRef, mapRef } = useMap();

  const handlePress = async (e: any) => {
    const feature = e.features?.[0];
    if (!feature) return;

    const isCluster = feature.properties?.cluster;
    const coords = feature.geometry.coordinates as [number, number];

    if (isCluster) {
      if (onClusterClick) {
        onClusterClick(
          feature.properties.cluster_id,
          coords,
          feature.properties.point_count,
        );
      } else {
        // Default cluster zoom
        const currentZoom = (await mapRef?.current?.getZoom()) ?? 10;
        cameraRef?.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: Math.min(currentZoom + 2, clusterMaxZoom),
          animationDuration: 500,
        });
      }
    } else {
      if (onPointClick) {
        onPointClick(feature, coords);
      }
    }
  };

  // Convert URLs to RN friendly props
  const shapeSourceProps =
    typeof data === "string"
      ? { url: data }
      : { shape: data as GeoJSON.FeatureCollection };

  return (
    <MapLibreGL.ShapeSource
      id={`cluster-source-${id}`}
      {...shapeSourceProps}
      cluster
      clusterRadius={clusterRadius}
      clusterMaxZoomLevel={clusterMaxZoom}
      onPress={handlePress}
    >
      <MapLibreGL.CircleLayer
        id={`clusters-${id}`}
        filter={["has", "point_count"]}
        style={{
          circleColor: [
            "step",
            ["get", "point_count"],
            clusterColors[0],
            clusterThresholds[0],
            clusterColors[1],
            clusterThresholds[1],
            clusterColors[2],
          ],
          circleRadius: [
            "step",
            ["get", "point_count"],
            20,
            clusterThresholds[0],
            30,
            clusterThresholds[1],
            40,
          ],
          circleStrokeWidth: 1,
          circleStrokeColor: "#fff",
          circleOpacity: 0.85,
        }}
      />
      <MapLibreGL.SymbolLayer
        id={`cluster-count-${id}`}
        filter={["has", "point_count"]}
        style={{
          textField: "{point_count_abbreviated}",
          textSize: 12,
          textColor: "#fff",
        }}
      />
      <MapLibreGL.CircleLayer
        id={`unclustered-point-${id}`}
        filter={["!", ["has", "point_count"]]}
        style={{
          circleColor: pointColor,
          circleRadius: 5,
          circleStrokeWidth: 2,
          circleStrokeColor: "#fff",
        }}
      />
    </MapLibreGL.ShapeSource>
  );
}
