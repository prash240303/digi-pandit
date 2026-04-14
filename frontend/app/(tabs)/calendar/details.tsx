"use client";
import React from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Observer, getPanchangam } from "@ishubhamx/panchangam-js";
import { format } from "date-fns";
import { PlanetaryPositions } from "@/components/planetary-positions";
import SunriseSunsetCard from "@/components/sun-timings";
import PanchangamDetails from "@/components/core-panchang-details";
import MoonDetails from "@/components/moon-details";
import MuhurataDetails from "@/components/muhurata-details";
import CalendarDateSelector from "@/components/calendar-date-selector";
import FestivalCard from "@/components/festival-card";
import { SafeAreaView } from "react-native-safe-area-context";

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

  // Calculate Duration and Formatted Timings for Card 
  const diffMs = sunset.getTime() - sunrise.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const dayHours = Math.floor(totalSeconds / 3600);
  const dayMinutes = Math.floor((totalSeconds % 3600) / 60);
  const daySeconds = totalSeconds % 60;

  const formattedDuration = `${dayHours}h ${dayMinutes}m ${daySeconds}s`;


  // Format times using date-fns
  const sunriseTime = format(sunrise, "hh:mm");
  const sunrisePeriod = format(sunrise, "a");
  const sunsetTime = format(sunset, "hh:mm");
  const sunsetPeriod = format(sunset, "a");

  const moonriseTime = format(moonrise, "hh:mm");
  const moonrisePeriod = format(moonrise, "a");
  const moonsetTime = format(moonset, "hh:mm");
  const moonsetPeriod = format(moonset, "a"); 

  return (
    <SafeAreaView className="flex-1 bg-[#FFFAF0]">
      <ScrollView>
        {/* Header */}
        <View>
          <CalendarDateSelector />
        </View>

        <View className="px-4 py-6 flex flex-col gap-8">
          {/* Sun/Moon Timings  */}
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
          <MuhurataDetails panchangam={panchangam} />

          {/* Chandrabalam */}
          <MoonDetails
            moonriseTime={`${moonriseTime} ${moonrisePeriod}`}
            moonsetTime={`${moonsetTime} ${moonsetPeriod}`}
            panchangam={panchangam}
          />

          {/* Planetary Positions */}
          <PlanetaryPositions
            data={{ planetaryPositions: panchangam.planetaryPositions }}
          />

          {/* Festivals */}
          {panchangam.festivals.length>0 && (
            <FestivalCard festivals={panchangam.festivals} />
          )}
        </View>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
