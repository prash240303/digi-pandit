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

const TEMPLE_MARKER_SVG = `<svg width="18" height="24" viewBox="0 0 390 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M201.215 54H216.04C217.195 54.4144 218.866 54.582 220.114 54.723C223.74 55.1326 227.143 55.7918 230.69 56.6682C242.918 59.6401 254.42 65.0455 264.511 72.5616C267.527 74.7933 276.157 81.1293 267.953 86.1293C265.099 87.8685 255.846 86.4513 252.433 87.4895C235.652 89.1318 215.058 94.9711 200.658 104.015C200.514 106.268 200.496 108.911 200.565 111.171C200.739 116.866 200.311 122.884 200.621 128.545L213.496 139.884C227.915 152.559 230.584 157.094 230.917 175.368C230.933 176.18 234.7 185.037 235.359 186.664L244.158 208.48L272.636 279.044C280.655 279.465 287.49 277.717 293.5 284.395C295.473 286.547 296.761 289.237 297.201 292.125C297.583 294.473 297.464 299.812 297.464 302.346L297.466 319.465L297.462 347.183C297.46 351.984 297.513 356.803 297.411 361.598C297.253 364.012 297.223 365.189 295.363 366.897C293.032 369.04 288.804 368.784 286.949 366.25C285.037 363.639 285.539 358.302 285.57 355.144C285.598 351.937 285.602 348.729 285.586 345.522L285.588 307.854C285.59 303.272 285.963 297.226 285.023 292.794C284.549 290.557 276.969 291.07 274.864 291.07L261.856 291.076L217.513 291.08L143.988 291.076L120.767 291.068C116.439 291.068 111.042 290.914 106.799 291.264C105.959 291.842 104.806 292.686 104.682 293.768C104.307 297.062 104.442 301.084 104.444 304.408L104.459 326.044L104.458 408.602L104.473 433.979C104.477 436.967 104.675 443.878 104.397 446.497C108.636 446.734 113.299 446.702 117.569 446.635C127.725 446.473 138.05 446.868 148.186 446.619C148.196 409.838 143.508 370.99 173.245 343.322C176.338 340.073 180.56 336.772 183.724 333.78C187.654 330.063 193.354 324.624 199.137 328.592C205.432 332.913 212.714 339.65 218.275 344.935C239.608 365.211 243.69 393.284 242.817 421.404C242.663 429.468 242.936 438.425 242.576 446.538C256.717 446.902 271.334 446.523 285.529 446.645L285.576 405.179L285.572 392.814C285.57 390.43 285.456 387.072 285.817 384.781C285.985 383.671 286.501 382.642 287.291 381.844C289.752 379.348 293.964 379.705 296.149 382.312C297.182 383.545 297.241 384.588 297.379 386.15C297.537 389.784 297.466 393.604 297.462 397.258V417.496L297.466 436.341C297.466 439.053 297.612 444.048 297.363 446.56C308.017 446.785 318.707 446.527 329.365 446.621C334.239 446.665 339.301 446.414 344.144 446.862C347.373 447.16 349.279 450.18 348.967 453.234C348.617 456.082 346.95 457.19 344.685 458.485H45.3731C43.5065 457.385 41.4568 456.113 41.0784 453.803C40.5799 450.757 42.4959 447.19 45.761 446.837C46.9871 446.704 48.1964 446.594 49.4312 446.621C53.3036 446.619 57.1731 446.615 61.0439 446.615L92.5736 446.659C92.3274 442.689 92.6027 435.492 92.6064 431.271L92.6098 399.509L92.5952 300.268C92.5964 293.553 92.2077 288.748 97.3601 283.47C102.545 278.16 110.383 279.121 117.392 279.153L130.654 246.299L134.668 236.341C135.336 234.684 136.52 231.56 137.392 230.124C137.977 229.165 138.841 228.409 139.868 227.955C144.244 225.973 149.422 230.137 147.891 234.881C147.197 237.031 146.46 238.893 145.616 240.986L141.842 250.334C138.064 259.691 134.268 269.517 130.362 278.778C139.121 278.594 148.375 278.736 157.162 278.738L206.694 278.736H241.016C246.745 278.736 253.992 278.543 259.623 278.827C255.505 267.749 250.482 255.942 246.028 244.901L220.882 182.531L184.982 182.539C182.078 182.525 179.174 182.535 176.27 182.568C174.176 182.601 171.269 182.764 169.306 182.493C165.772 190.022 162.921 198.045 159.815 205.771C158.691 208.567 157.149 213.608 155.339 215.892C154.411 217.063 152.871 217.927 151.384 218.082C149.787 218.248 148.235 217.627 147.023 216.608C145.823 215.6 145.105 214.27 144.987 212.704C144.684 208.694 157.059 182.458 158.992 175.834C159.574 173.837 159.327 171.589 159.393 169.53C159.599 163.088 161.297 157.047 164.901 151.657C168.897 145.681 177.288 139.133 182.892 134.273C184.783 132.633 186.845 131.012 188.505 129.137C188.554 129.081 188.601 129.025 188.65 128.969C188.966 124.172 188.725 116.17 188.724 111.211L188.714 76.8489C188.712 72.3678 188.169 62.1681 189.602 57.8661C190.734 54.4714 198.073 55.1493 201.215 54ZM197.097 446.495H218.562C222.421 446.495 227.021 446.388 230.813 446.58C230.495 444.125 230.724 440.613 230.748 438.03L230.963 420.047C231.135 396.26 229.626 375.41 213.101 356.742C207.77 350.718 201.626 345.828 195.466 340.681C195.124 340.395 194.986 340.284 194.577 340.09C189.815 344.382 184.229 348.877 179.876 353.499C168.027 366.167 161.064 382.634 160.229 399.961C159.984 404.605 160.06 409.311 160.059 413.966L160.071 434.631C160.073 438.107 160.219 443.11 160.007 446.475L197.097 446.495ZM171.166 170.382C179.108 170.587 187.355 170.474 195.32 170.465L210.61 170.464C213.101 170.464 216.514 170.364 218.945 170.515C218.145 160.558 214.849 156.234 207.166 150.134C204.535 148.046 197.346 140.761 194.873 139.65L183.628 149.462C176.291 155.919 171.979 159.072 171.225 169.52L171.166 170.382ZM200.664 66.306C200.388 72.205 200.674 78.2513 200.573 84.1642C200.54 86.2103 200.559 88.3913 200.66 90.4299C207.01 86.6879 224.692 80.1339 232.006 78.8549C235.079 78.0866 238.18 77.4376 241.302 76.9097C243.419 76.5629 245.973 76.2996 248.007 75.9007C236.671 70.4684 227.765 67.0293 214.928 66.2011C211.483 65.979 208.122 65.7636 204.652 66.1244C203.255 66.2543 202.064 66.4071 200.664 66.306Z" fill="white"/></svg>`;

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
                html={`<div style="display:flex;flex-direction:column;align-items:center;"><div style="width:34px;height:34px;border-radius:50%;background:#9a2a23;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;">${TEMPLE_MARKER_SVG}</div><div style="width:8px;height:8px;background:#9a2a23;transform:rotate(45deg);margin-top:-4px;"></div></div>`}
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
