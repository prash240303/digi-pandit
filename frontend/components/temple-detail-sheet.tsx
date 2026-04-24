import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
import {
  X,
  Navigation,
  Heart,
  Phone,
  Clock,
  MapPin,
} from "lucide-react-native";
import { Temple } from "@/constants/temples-mock";
import { haversineKm, LatLng } from "@/lib/geo";

type Props = {
  temple: Temple | null;
  userLoc: LatLng | null;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
};

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = Math.min(Math.round(SCREEN_H * 0.35), 520);

export default function TempleDetailSheet({
  temple,
  userLoc,
  favorite,
  onToggleFavorite,
  onClose,
}: Props) {
  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (temple) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 180,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.35,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_H,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [temple, translateY, backdropOpacity]);

  if (!temple) return null;

  const distance =
    userLoc != null
      ? haversineKm(userLoc, { lat: temple.lat, lng: temple.lng })
      : null;

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  const callPhone = () => {
    if (temple.phone) Linking.openURL(`tel:${temple.phone}`);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      className="z-20"
    >
      <Pressable onPress={onClose} style={{ flex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "#000",
            opacity: backdropOpacity,
          }}
        />
      </Pressable>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: SHEET_H,
          transform: [{ translateY }],
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 16,
          zIndex: 10,
        }}
      >
        <View className="items-center pt-2">
          <View className="w-10 h-1 rounded-full bg-stone-300" />
        </View>

        <View className="flex-row items-start justify-between px-5 pt-3 pb-2">
          <View className="flex-1 pr-3">
            <Text className="text-xl font-bold text-stone-900">
              {temple.name}
            </Text>
            <View className="flex-row gap-2 mt-2">
              <View className="bg-orange-100 px-2 py-0.5 rounded-full">
                <Text className="text-[11px] text-orange-700 font-semibold">
                  {temple.deity}
                </Text>
              </View>
              {distance != null && (
                <View className="bg-stone-100 px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <MapPin size={10} color="#57534e" />
                  <Text className="text-[11px] text-stone-700 font-semibold">
                    {distance.toFixed(1)} km away
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 -mr-1 rounded-full bg-stone-100"
          >
            <X size={16} color="#44403c" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="px-5"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-2 py-2">
            <Clock size={14} color="#c2410c" />
            <Text className="text-sm text-stone-700">
              {temple.openTime} – {temple.closeTime}
            </Text>
          </View>

          {temple.phone && (
            <TouchableOpacity
              onPress={callPhone}
              className="flex-row items-center gap-2 py-2"
            >
              <Phone size={14} color="#c2410c" />
              <Text className="text-sm text-orange-700 underline">
                {temple.phone}
              </Text>
            </TouchableOpacity>
          )}

          {temple.address && (
            <View className="flex-row items-start gap-2 py-2">
              <MapPin size={14} color="#c2410c" style={{ marginTop: 2 }} />
              <Text className="text-sm text-stone-600 flex-1">
                {temple.address}
              </Text>
            </View>
          )}

          <View className="flex-row gap-2 mt-3">
            <TouchableOpacity
              onPress={openDirections}
              className="flex-1 flex-row items-center justify-center gap-2 bg-orange-500 py-3 rounded-xl"
            >
              <Navigation size={16} color="#fff" />
              <Text className="text-white font-semibold">Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onToggleFavorite(temple.id)}
              className={`px-4 items-center justify-center rounded-xl border ${
                favorite
                  ? "bg-red-50 border-red-300"
                  : "bg-white border-stone-200"
              }`}
            >
              <Heart
                size={20}
                color={favorite ? "#dc2626" : "#78716c"}
                fill={favorite ? "#dc2626" : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
