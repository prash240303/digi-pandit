"use client";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Observer, getPanchangam } from "@ishubhamx/panchangam-js";
import { format } from "date-fns";
import { PlanetaryPositions } from "@/components/planetary-positions";
import SunriseSunsetCard from "@/components/sun-moon-timings";
import PanchangamDetails from "@/components/core-panchang-details";
import MoonDetails from "@/components/moon-details";
import MuhurataDetails from "@/components/muhurata-details";

/* -------------------- Helper Functions -------------------- */
export default function DetailsPage() {
  const { date } = useLocalSearchParams();

  // Parse date and regenerate panchangam
  const selectedDate = new Date(date as string);
  const observer = new Observer(23.1, 75.46, 494);
  const panchangam = getPanchangam(selectedDate, observer);

  // Get sunrise/sunset Dates
  const sunrise = new Date(panchangam.sunrise);
  const sunset = new Date(panchangam.sunset);
  const moonrise = new Date(panchangam.moonrise);
  const moonset = new Date(panchangam.moonset);

  console.log("moon", moonrise, moonset);

  // --- NEW: Calculate Duration and Formatted Timings for Card ---
  const diffMs = sunset.getTime() - sunrise.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const dayHours = Math.floor(totalSeconds / 3600);
  const dayMinutes = Math.floor((totalSeconds % 3600) / 60);
  const daySeconds = totalSeconds % 60;

  const formattedDuration = `${dayHours}h ${dayMinutes}m ${daySeconds}s`;

  // Format times using date-fns
  const sunriseTime = format(sunrise, "hh:mm");
  const sunrisePeriod = format(sunrise, "a"); // "AM"
  const sunsetTime = format(sunset, "hh:mm");
  const sunsetPeriod = format(sunset, "a"); // "PM"

  const moonriseTime = format(moonrise, "hh:mm");
  const moonrisePeriod = format(moonrise, "a"); // "AM"
  const moonsetTime = format(moonset, "hh:mm");
  const moonsetPeriod = format(moonset, "a"); // "PM"
  // --------------------------------------------------------------

  return (
    <ScrollView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="w-full bg-white py-4 border-b border-neutral-200 flex flex-col items-center justify-center shadow-sm">
        <Text className="text-xl font-bold text-neutral-900 mb-1">
          {format(selectedDate, "MMMM dd, yyyy")}
        </Text>
        <Text className="text-sm uppercase tracking-wider text-neutral-500 font-medium">
          {panchangam.masa.name} {panchangam.paksha} Paksha
        </Text>
      </View>

      <View className="px-4 py-6 flex flex-col gap-6">
        {/* Sun/Moon Timings - UPDATED */}
        <View>
          <SunriseSunsetCard
            duration={formattedDuration}
            sunriseTime={sunriseTime}
            sunrisePeriod={sunrisePeriod}
            sunsetTime={sunsetTime}
            sunsetPeriod={sunsetPeriod}
          />
        </View>

        {/* Panchang Details */}
        <PanchangamDetails panchangam={panchangam} />

        {/* Chandrabalam */}
        <MoonDetails
          moonriseTime={`${moonriseTime} ${moonrisePeriod}`}
          moonsetTime={`${moonsetTime} ${moonsetPeriod}`}
          panchangam={panchangam}
        />

        <MuhurataDetails panchangam={panchangam} />

        {/* Planetary Positions */}
        <PlanetaryPositions
          data={{ planetaryPositions: panchangam.planetaryPositions }}
        />

        {/* Festivals */}
        {panchangam.festivals?.length > 0 && (
          <View className="bg-pink-50 p-4 rounded-xl border border-pink-100">
            <Text className="font-semibold text-pink-700 mb-2 flex-row items-center">
              🎉 <Text className="ml-2">Festivals</Text>
            </Text>
            {panchangam.festivals.map((festival: string, i: number) => (
              <Text
                key={i}
                className="text-pink-600 ml-2 mb-1 text-sm font-medium"
              >
                • {festival}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}
