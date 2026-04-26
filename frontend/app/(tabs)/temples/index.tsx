import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { COLOR } from "@/constants/colors";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map.web";
import TempleFilterBar from "@/components/temple-filter-bar";
import TempleDetailSheet from "@/components/temple-detail-sheet";
import { Temple, Deity } from "@/constants/temples-mock";
import { haversineKm, zoomForRadius, LatLng } from "@/lib/geo";
import { fetchHinduTemples } from "@/lib/temples-api";
import PageHeader from "@/components/ui/page-header";

const DEFAULT_CENTER: LatLng = { lat: 28.6139, lng: 77.209 }; // New Delhi

export default function TemplesScreen() {
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [deityFilter, setDeityFilter] = useState<Deity | "All">("All");
  const [radiusKm, setRadiusKm] = useState<1 | 3 | 5 | 10>(5);
  const [selected, setSelected] = useState<Temple | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mapCenter = userLoc ?? DEFAULT_CENTER;
  const mapZoom = zoomForRadius(radiusKm);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setPermissionDenied(true);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        setPermissionDenied(true);
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetchHinduTemples(mapCenter, Math.max(radiusKm, 10))
      .then((list) => {
        if (!cancelled) setTemples(list);
      })
      .catch((e: Error) => {
        if (!cancelled) setFetchError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mapCenter.lat, mapCenter.lng, radiusKm]);

  const filtered = useMemo(() => {
    return temples.filter((t) => {
      if (deityFilter !== "All" && t.deity !== deityFilter) return false;
      const d = haversineKm(mapCenter, { lat: t.lat, lng: t.lng });
      return d <= radiusKm;
    });
  }, [temples, deityFilter, radiusKm, mapCenter.lat, mapCenter.lng]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <PageHeader title="Temples" subtitle="Discover Hindu temples near you" />

      {permissionDenied && (
        <View className="px-4 pb-2">
          <Text className="text-[11px] text-stone-500 px-1">
            Location permission denied — enable location in Settings to see
            temples near you.
          </Text>
        </View>
      )}

      <TempleFilterBar
        deity={deityFilter}
        onDeityChange={setDeityFilter}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
      />

      <View className="flex-1 mt-2 mx-2 rounded-2xl overflow-hidden border border-stone-200">
        <Map center={[mapCenter.lng, mapCenter.lat]} zoom={mapZoom}>
          {userLoc && !permissionDenied && (
            <MapMarker
              id="user-location"
              longitude={userLoc.lng}
              latitude={userLoc.lat}
            >
              <MarkerContent
                html={`<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 6px rgba(59,130,246,.25);"></div>`}
              />
            </MapMarker>
          )}
          {filtered.map((t) => (
            <MapMarker
              key={t.id}
              id={t.id}
              longitude={t.lng}
              latitude={t.lat}
              onClick={() => setSelected(t)}
            >
              <MarkerContent
                html={`<div style="display:flex;flex-direction:column;align-items:center;"><div style="width:30px;height:30px;border-radius:50%;background:${
                  selected?.id === t.id ? "#7f1d1d" : "#c2410c"
                };border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:15px;">🛕</div><div style="width:8px;height:8px;background:${
                  selected?.id === t.id ? "#7f1d1d" : "#c2410c"
                };transform:rotate(45deg);margin-top:-4px;"></div></div>`}
              />
            </MapMarker>
          ))}
          <MapControls
            showZoom
            showLocate
            onLocate={(c) => setUserLoc({ lat: c.latitude, lng: c.longitude })}
          />
        </Map>

        {loading && (
          <View className="absolute top-3 left-3 right-3 bg-white/95 rounded-xl px-3 py-2 border border-stone-200 flex-row items-center justify-center gap-2">
            <ActivityIndicator size="small" color="#c2410c" />
            <Text className="text-xs text-stone-600">
              Finding Hindu temples nearby…
            </Text>
          </View>
        )}

        {!loading && fetchError && (
          <View className="absolute top-3 left-3 right-3 bg-white/95 rounded-xl px-3 py-2 border border-stone-200">
            <Text className="text-xs text-red-700 text-center">
              Could not load temples: {fetchError}
            </Text>
          </View>
        )}

        {!loading && !fetchError && filtered.length === 0 && (
          <View className="absolute top-3 left-3 right-3 bg-white/95 rounded-xl px-3 py-2 border border-stone-200">
            <Text className="text-xs text-stone-600 text-center">
              No Hindu temples match these filters within {radiusKm} km. Try a
              larger radius.
            </Text>
          </View>
        )}
      </View>

      <TempleDetailSheet
        temple={selected}
        userLoc={userLoc}
        favorite={selected ? favorites.has(selected.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}
