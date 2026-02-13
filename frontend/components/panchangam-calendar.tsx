"use client";
import React, { useState, useMemo } from "react";
import { ScrollView } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ChevronFirst,
  ChevronLast,
  Cancel01FreeIcons,
  HugeiconsFreeIcons,
  ArrowLeft01FreeIcons,
  ArrowRight,
  ArrowRight02FreeIcons,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { TouchableHighlight, TouchableOpacity, View, Text } from "react-native";
import {
  getNakshatra,
  getPanchangam,
  Observer,
} from "@ishubhamx/panchangam-js";
import { format, getDate, getTime, isDate, parseISO } from "date-fns";
import SunriseSunset from "./sun-moon-timings";
import PeriodCard from "./period-card";
import { PlanetaryPositions } from "./planetary-positions";

/* -------------------- Types -------------------- */
interface CalendarDayData {
  date: Date;
  panchangam: any;
}

/* -------------------- Mock Data -------------------- */
const WEEKDAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUEDAY",
  "WEDDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

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
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

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

const getBrahmaMuhurta = (panchangam: any) => {
  const bm = panchangam?.brahmaMuhurta;
  if (!bm?.start || !bm?.end) return null;

  const start = new Date(bm.start); // ISO UTC -> local Date
  const end = new Date(bm.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return {
    start: format(start, "dd MMM yyyy hh:mm a"),
    end: format(end, "dd MMM yyyy hh:mm a"),
  };
};

const getYamagandaKalam = (panchangam: any) => {
  const bm = panchangam?.yamagandaKalam;
  if (!bm?.start || !bm?.end) return null;

  const start = new Date(bm.start); // ISO UTC -> local Date
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

  const start = new Date(bm.start); // ISO UTC -> local Date
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

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  return {
    start: format(start, "dd MMM yyyy hh:mm a"),
    end: format(end, "dd MMM yyyy hh:mm a"),
  };
};

const getSunTimings = (panchangam: any) => {
  const sunrise = panchangam.sunrise;
  const sunset = panchangam.sunset;

  if (isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) return null;

  return {
    sunrise: format(sunrise, "dd MMM yyyy hh:mm a"),
    sunset: format(sunset, "dd MMM yyyy hh:mm a"),
  };
};

const getMoonTimings = (panchangam: any) => {
  const moonrise = panchangam.sunrise;
  const moonset = panchangam.sunset;

  if (isNaN(moonrise.getTime()) || isNaN(moonset.getTime())) return null;

  return {
    moonrise: format(moonrise, "dd MMM yyyy hh:mm a"),
    moonset: format(moonset, "dd MMM yyyy hh:mm a"),
  };
};

const getCurrentKarana = (panchangam: any) => {
  const karanas = panchangam?.karanas;
  if (!Array.isArray(karanas) || karanas.length === 0) return "N/A";

  console.log("karanas array:", karanas);
  return karanas[karanas.length - 1].name;
};

const getCurrentSunRashi = (panchangam: any) => {
  if (!panchangam.sunRashi) return "N/A";
  return panchangam.sunRashi.name;
};

const getChandrabalam = (panchangam: any) => {
  const value = panchangam.chandrabalam ?? 0;
  let moon = "";

  if (value >= 95) {
    moon = "🌕 ";
  } else if (value >= 80) {
    moon = "🌔 ";
  } else if (value >= 65) {
    moon = "🌓 ";
  } else if (value >= 50) {
    moon = "🌒 ";
  } else if (value >= 35) {
    moon = "🌑 ";
  } else if (value >= 25) {
    moon = "🌘 ";
  } else if (value >= 15) {
    moon = "🌗 ";
  } else {
    moon = "🌖 ";
  }

  return <Text>{moon}</Text>;
};

const getCurrentMoonRashi = (panchangam: any) => {
  if (!panchangam.moonRashi) return "N/A";
  return panchangam.moonRashi.name;
};

/* -------------------- Component -------------------- */
const PanchangamCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const [yearValue, setYearValue] = useState(year.toString());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days: (CalendarDayData | null)[] = [];
    const CalObserver = new Observer(23.1, 75.46, 494);

    for (let i = 0; i < startDay; i++) days.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      // FIX
      const date = new Date(year, month, d);
      const dayData = {
        date,
        panchangam: getPanchangam(date, CalObserver),
      };
      if (d === 3) {
        console.log("2 Jan:", dayData);
      }
      days.push(dayData);
    }

    return days;
  }, [month, year]);

  const weeks: (CalendarDayData | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  function parseTime12h(timeStr) {
    // "07:09 AM" -> { hour: 7, minute: 9 }
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return { hour: hours, minute: minutes };
  }

  const years = Array.from({ length: 100 }, (_, i) => 1980 + i);
  const brahma = selectedDay ? getBrahmaMuhurta(selectedDay.panchangam) : null;
  const gulika = selectedDay ? getGulikaKalam(selectedDay.panchangam) : null;
  const rahu = selectedDay ? getRahuKalam(selectedDay.panchangam) : null;
  const yamaganda = selectedDay
    ? getYamagandaKalam(selectedDay.panchangam)
    : null;

  const planetaryData = (selectedDay: any) => {
    const sunData = {
      degree: selectedDay.panchangam.planetaryPositions.sun.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.sun.rashiName,
    };
    const moonData = {
      degree: selectedDay.panchangam.planetaryPositions.moon.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.moon.rashiName,
    };
    const marsData = {
      degree: selectedDay.panchangam.planetaryPositions.mars.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.mars.rashiName,
    };
    const mercuryData = {
      degree: selectedDay.panchangam.planetaryPositions.mercury.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.mercury.rashiName,
    };
    const jupiterData = {
      degree: selectedDay.panchangam.planetaryPositions.jupiter.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.jupiter.rashiName,
    };
    const venusData = {
      degree: selectedDay.panchangam.planetaryPositions.venus.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.venus.rashiName,
    };
    const rahuData = {
      degree: selectedDay.panchangam.planetaryPositions.venus.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.venus.rashiName,
    };
    const ketusData = {
      degree: selectedDay.panchangam.planetaryPositions.venus.degree,
      rashiName: selectedDay.panchangam.planetaryPositions.venus.rashiName,
    };
    return {
      planetaryPositions: {
        sun: sunData,
        moon: moonData,
        mars: marsData,
        mercury: mercuryData,
        jupiter: jupiterData,
        venus: venusData,
        rahu: rahuData,
        ketu: ketusData,
      },
    };
  };
  return (
    <View className="flex-1 p-4 bg-amber-50">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Button onPress={() => setCurrentDate(new Date(year, month - 1, 1))}>
          <HugeiconsIcon icon={ChevronFirst} />
        </Button>
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl font-bold text-amber-800">
            {MONTH_NAMES[month]}
          </Text>
          <Select
            selectedValue={yearValue}
            onValueChange={(value) => {
              setYearValue(value);
              setCurrentDate(new Date(Number(value), month, 1));
            }}
          >
            <SelectTrigger>
              <SelectInput placeholder="Select year" />
              <SelectIcon />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectScrollView>
                  {years.map((y) => (
                    <SelectItem
                      key={y}
                      label={y.toString()}
                      value={y.toString()}
                    />
                  ))}
                </SelectScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>
        <Button onPress={() => setCurrentDate(new Date(year, month + 1, 1))}>
          <HugeiconsIcon icon={ChevronLast} />
        </Button>
      </View>

      {/* Weekdays */}
      <View className="flex-row mb-2">
        {WEEKDAY_NAMES.map((d) => (
          <View key={d} className="flex-1 items-center">
            <Text className="text-xs font-semibold text-amber-600">{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar */}
      <View className="flex-row flex-wrap">
        {weeks.flat().map((day, i) =>
          day ? (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setSelectedDay(day);
                setIsOpen(true);
              }}
              className={`aspect-square ${
                day.panchangam.festivals.length > 0
                  ? "bg-purple-300"
                  : "bg-amber-100"
              } p-2 rounded-lg border border-amber-200`}
              style={{ width: "14.28%" }}
            >
              <View>
                <Text className="text-sm font-bold text-amber-900">
                  {day.date.getDate()}
                </Text>
                {getChandrabalam(day.panchangam)}
                <Text className="text-xs text-amber-700">
                  {getCurrentTithi(day.panchangam).tithi} vara{" "}
                  {getCurrentTithi(day.panchangam).vara}
                </Text>
                <Text className="text-xs text-amber-600">
                  {day.panchangam?.tithiTransitions[1]?.name}
                </Text>
                <Text className="text-xs text-amber-600">
                  {getCurrentNakshatra(day.panchangam)}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View key={i} style={{ width: "14.28%" }} />
          ),
        )}
      </View>

      {/* AlertDialog */}
      <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          {/* Header */}
          <AlertDialogHeader>
            <View>
              <Text className="text-xl font-bold text-amber-900">
                {selectedDay &&
                  `${WEEKDAY_NAMES[selectedDay.date.getMonth()]} `}
                {selectedDay &&
                  `${MONTH_NAMES[selectedDay.date.getMonth()]} ${selectedDay.date.getDate()}, ${selectedDay.date.getFullYear()}`}
              </Text>
            </View>
            <AlertDialogCloseButton onPress={() => setIsOpen(false)}>
              <HugeiconsIcon icon={Cancel01FreeIcons} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>

          {/* Body */}
          <AlertDialogBody>
            {selectedDay && (
              <ScrollView className="max-h-96">
                <View className="w-full p-4 mb-6 bg-neutral-200 rounded-3xl shadow-md">
                  <View className="bg-white shadow-sm rounded-2xl p-5 flex-row flex-wrap">
                    {/* Tithi */}
                    <View className="w-1/2 mb-6">
                      <Text className="text-gray-400 text-lg font-medium">
                        Tithi
                      </Text>
                      <Text className="text-sky-500 text-2xl font-bold mt-1">
                        {getCurrentTithi(selectedDay.panchangam).tithi}
                      </Text>
                    </View>

                    {/* Nakshatra */}
                    <View className="w-1/2 mb-6">
                      <Text className="text-gray-400 text-lg font-medium">
                        Nakshatra
                      </Text>
                      <Text className="text-blue-600 text-2xl font-bold mt-1">
                        {getCurrentNakshatra(selectedDay.panchangam)}
                      </Text>
                    </View>

                    {/* Karana */}
                    <View className="w-1/2">
                      <Text className="text-gray-400 text-lg font-medium">
                        Karana
                      </Text>
                      <Text className="text-amber-500 text-2xl font-bold mt-1">
                        {getCurrentKarana(selectedDay.panchangam)}
                      </Text>
                    </View>

                    {/* Yoga */}
                    <View className="w-1/2">
                      <Text className="text-gray-400 text-lg font-medium">
                        Yoga
                      </Text>
                      <Text className="text-rose-500 text-2xl font-bold mt-1">
                        {getCurrentYoga(selectedDay.panchangam)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mb-3  p-4 rounded-lg">
                  {(() => {
                    const sunriseStr = formatTime(
                      selectedDay.panchangam.sunrise,
                    );
                    const sunsetStr = formatTime(selectedDay.panchangam.sunset);

                    const sunrise = parseTime12h(sunriseStr);
                    const sunset = parseTime12h(sunsetStr);

                    return (
                      <SunriseSunset
                        sunriseHour={sunrise.hour}
                        sunriseMinute={sunrise.minute}
                        sunsetHour={sunset.hour}
                        sunsetMinute={sunset.minute}
                      />
                    );
                  })()}
                </View>
                <View className="bg-blue-100 flex flex-col gap-2 items-center justify-center mb-3 p-4 rounded-lg">
                  <Text className="text-blue-700 text-4xl">
                    {getChandrabalam(selectedDay)}
                  </Text>
                  <Text className="text-blacl">
                    {selectedDay.panchangam.chandrabalam} % illuminated
                  </Text>
                </View>

                <PeriodCard
                  title="Brahma Muhurta"
                  start={brahma?.start}
                  end={brahma?.end}
                  status="AUSPICIOUS"
                  icon="🌅"
                />

                <PeriodCard
                  title="Rahu Kalam"
                  start={rahu?.start}
                  end={rahu?.end}
                  status="AVOID"
                  icon="🚫"
                />

                <PeriodCard
                  title="Yamaganda"
                  start={yamaganda?.start}
                  end={yamaganda?.end}
                  status="AVOID"
                  icon="⚠️"
                />

                <PlanetaryPositions data={planetaryData(selectedDay)} />
                {selectedDay.panchangam.festivals?.length > 0 && (
                  <>
                    <View className="bg-pink-100 p-4 rounded-lg">
                      <Text className="font-semibold text-pink-900 mb-2">
                        🎉 Festivals
                      </Text>
                      {selectedDay.panchangam.festivals.map(
                        (festival: string, idx: number) => (
                          <View key={idx} className="ml-2">
                            <Text className="text-pink-700">• {festival}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
};

export default PanchangamCalendar;
