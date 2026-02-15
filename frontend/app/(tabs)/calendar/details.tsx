"use client";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Observer, getPanchangam } from "@ishubhamx/panchangam-js";
import { format } from "date-fns";
import SunriseSunset from "@/components/sun-moon-timings-v2";
import PeriodCard from "@/components/period-card";
import { PlanetaryPositions } from "@/components/planetary-positions";
import SunriseSunsetCards from "@/components/sun-moon-timings";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* -------------------- Helper Functions -------------------- */
const getCurrentTithi = (
  panchangam: any,
): { tithi: string; vara: string } | null => {
  if (!panchangam?.tithis || panchangam.tithis.length === 0) {
    return null;
  }
  return {
    tithi: panchangam.tithi,
    vara: panchangam.vara,
  };
};

const getCurrentNakshatra = (panchangam: any) => {
  if (!panchangam.nakshatras || panchangam.nakshatras.length === 0)
    return "N/A";
  return panchangam?.nakshatras[1]?.name;
};

const getCurrentYoga = (panchangam: any) => {
  if (!panchangam.yogas) return "N/A";
  return panchangam?.yogas[1]?.name;
};

const getCurrentKarana = (panchangam: any) => {
  const karanas = panchangam?.karanas;
  if (!Array.isArray(karanas) || karanas.length === 0) return "N/A";
  return karanas[karanas.length - 1].name;
};

const getBrahmaMuhurta = (panchangam: any) => {
  const bm = panchangam?.brahmaMuhurta;
  if (!bm?.start || !bm?.end) return null;

  const start = new Date(bm.start);
  const end = new Date(bm.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return {
    start: format(start, "dd MMM yyyy hh:mm a"),
    end: format(end, "dd MMM yyyy hh:mm a"),
  };
};

const getRahuKalam = (panchangam: any) => {
  const start = panchangam.rahuKalamStart;
  const end = panchangam.rahuKalamEnd;

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime()))
    return null;

  return {
    start: format(start, "dd MMM yyyy hh:mm a"),
    end: format(end, "dd MMM yyyy hh:mm a"),
  };
};

const getYamagandaKalam = (panchangam: any) => {
  const bm = panchangam?.yamagandaKalam;
  if (!bm?.start || !bm?.end) return null;

  const start = new Date(bm.start);
  const end = new Date(bm.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return {
    start: format(start, "dd MMM yyyy hh:mm a"),
    end: format(end, "dd MMM yyyy hh:mm a"),
  };
};

const getGulikaKalam = (panchangam: any) => {
  const bm = panchangam?.gulikaKalam;
  if (!bm?.start || !bm?.end) return null;

  const start = new Date(bm.start);
  const end = new Date(bm.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return {
    start: format(start, "dd MMM yyyy hh:mm a"),
    end: format(end, "dd MMM yyyy hh:mm a"),
  };
};

const getChandrabalam = (panchangam: any) => {
  const value = panchangam.chandrabalam ?? 0;
  let moon = "";

  if (value >= 95) {
    moon = "🌕";
  } else if (value >= 80) {
    moon = "🌔";
  } else if (value >= 65) {
    moon = "🌓";
  } else if (value >= 50) {
    moon = "🌒";
  } else if (value >= 35) {
    moon = "🌑";
  } else if (value >= 25) {
    moon = "🌘";
  } else if (value >= 15) {
    moon = "🌗";
  } else {
    moon = "🌖";
  }

  return moon;
};

export default function DetailsPage() {
  const { date } = useLocalSearchParams();

  // Parse date and regenerate panchangam
  const selectedDate = new Date(date as string);
  const observer = new Observer(23.1, 75.46, 494);
  const panchangam = getPanchangam(selectedDate, observer);

  // Get sunrise/sunset
  const sunrise = new Date(panchangam.sunrise);
  const sunset = new Date(panchangam.sunset);

  // Get special periods
  const brahma = getBrahmaMuhurta(panchangam);
  const rahu = getRahuKalam(panchangam);
  const yamaganda = getYamagandaKalam(panchangam);
  const gulika = getGulikaKalam(panchangam);

  return (
    <ScrollView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="w-full bg-white pt-2 border-b border-neutral-300 text-center flex flex-col items-center justify-center">
        <Text className="text-2xl font-bold text-neutral-900 mb-2">
          {format(selectedDate, "MMMM dd, yyyy")}
        </Text>
        <Text className="text-base uppercase text-neutarl-800 mb-6">
          {panchangam.masa.name} {panchangam.paksha} Paksha
        </Text>
      </View>

      <View className="p-4">
        {/* Panchang Details */}
        <View className="grid p-2 gap-2 grid-cols-2">
          <View className=" rounded-md p-2 flex flex-col items-center justify-center bg-white shadow-sm">
            <Text className="text-gray-400 text-base uppercase font-medium">
              Tithi
            </Text>
            <Text className="text-sky-500 text-2xl font-bold mt-1">
              {getCurrentTithi(panchangam)?.tithi || "N/A"}
            </Text>
          </View>

          <View className="rounded-md p-2 flex flex-col items-center justify-center bg-white shadow-sm">
            <Text className="text-gray-400 text-base uppercase font-medium">
              Nakshatra
            </Text>
            <Text className="text-blue-600 text-2xl font-bold mt-1">
              {getCurrentNakshatra(panchangam)}
            </Text>
          </View>

          <View className=" rounded-md p-2 flex flex-col items-center justify-center bg-white shadow-sm">
            <Text className="text-gray-400 text-base uppercase font-medium">
              Karana
            </Text>
            <Text className="text-neutral-500 text-2xl font-bold mt-1">
              {getCurrentKarana(panchangam)}
            </Text>
          </View>

          <View className="rounded-md p-2 flex flex-col items-center justify-center bg-white shadow-sm">
            <Text className="text-gray-400 text-base uppercase font-medium">
              Yoga
            </Text>
            <Text className="text-rose-500 text-2xl font-bold mt-1">
              {getCurrentYoga(panchangam)}
            </Text>
          </View>
        </View>

        {/* Sun/Moon Timings */}
        <View className="mb-4">
          <SunriseSunsetCards
            sunriseHour={sunrise.getHours()}
            sunriseMinute={sunrise.getMinutes()}
            sunsetHour={sunset.getHours()}
            sunsetMinute={sunset.getMinutes()}
          />
        </View>

        {/* Chandrabalam */}
        <View className="bg-blue-100 flex flex-col gap-2 items-center justify-center mb-4 p-4 rounded-lg">
          <Text className="text-blue-700 text-4xl">
            {getChandrabalam(panchangam)}
          </Text>
          <Text className="text-black">
            {panchangam.chandrabalam}% illuminated
          </Text>
        </View>

        {/* Brahma Muhurta */}
        {brahma && (
          <PeriodCard
            title="Brahma Muhurta"
            start={brahma.start}
            end={brahma.end}
            status="AUSPICIOUS"
            icon="🌅"
          />
        )}

        {/* Rahu Kalam */}
        {rahu && (
          <PeriodCard
            title="Rahu Kalam"
            start={rahu.start}
            end={rahu.end}
            status="AVOID"
            icon="🚫"
          />
        )}

        {/* Yamaganda Kalam */}
        {yamaganda && (
          <PeriodCard
            title="Yamaganda Kalam"
            start={yamaganda.start}
            end={yamaganda.end}
            status="AVOID"
            icon="⚠️"
          />
        )}

        {/* Gulika Kalam */}
        {gulika && (
          <PeriodCard
            title="Gulika Kalam"
            start={gulika.start}
            end={gulika.end}
            status="AVOID"
            icon="⚠️"
          />
        )}

        {/* Planetary Positions */}
        <PlanetaryPositions
          data={{ planetaryPositions: panchangam.planetaryPositions }}
        />

        {/* Festivals */}
        {panchangam.festivals?.length > 0 && (
          <View className="bg-pink-100 p-4 rounded-lg mt-4 mb-4">
            <Text className="font-semibold text-pink-900 mb-2">
              🎉 Festivals
            </Text>
            {panchangam.festivals.map((festival: string, i: number) => (
              <Text key={i} className="text-pink-700 ml-2">
                • {festival}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
