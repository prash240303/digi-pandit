"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { TouchableOpacity, View, Text } from "react-native";
import { getPanchangam, Observer } from "@ishubhamx/panchangam-js";
import { format } from "date-fns";
import CalendarHeader from "./calender-header";

/* -------------------- Types -------------------- */
interface CalendarDayData {
  date: Date;
  panchangam: any;
}

/* -------------------- Mock Data -------------------- */
const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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

const getRahuKalam = (panchangam: any) => {
  const start = panchangam.rahuKalamStart;
  const end = panchangam.rahuKalamEnd;
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

/* -------------------- Component -------------------- */
const PanchangamCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState(null);
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

  const brahma = selectedDay ? getBrahmaMuhurta(selectedDay.panchangam) : null;
  const gulika = selectedDay ? getGulikaKalam(selectedDay.panchangam) : null;
  const rahu = selectedDay ? getRahuKalam(selectedDay.panchangam) : null;
  const yamaganda = selectedDay
    ? getYamagandaKalam(selectedDay.panchangam)
    : null;

  const router = useRouter();
  const handlePress = (selectedDay: Date) => {
    router.push({
      pathname: "/calendar/details",
      params: {
        date: selectedDay.toISOString(),
      },
    });
  };

  return (
    <View className="p-4 gap-4 flex-1">
      {/* Header Controls — now a separate component */}
      <CalendarHeader
        month={month}
        year={year}
        yearValue={yearValue}
        onPrevMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
        onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
        onYearChange={(value) => {
          setYearValue(value);
          setCurrentDate(new Date(Number(value), month, 1));
        }}
      />

      {/* --- GRID HEADER (Weekdays) --- */}
      <View className="flex-row w-full">
        {WEEKDAY_NAMES.map((d) => (
          <View
            key={d}
            style={{ width: "14.28%" }}
            className="items-center justify-center"
          >
            <Text className="text-orange-500 font-bold text-xs uppercase tracking-wider">
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* --- GRID BODY (Days) --- */}
      <View className="flex-row flex-wrap w-full">
        {weeks.flat().map((day, i) => {
          if (!day) {
            return <View key={`empty-${i}`} style={{ width: "14.28%" }} />;
          }

          const isFestival = day.panchangam.festivals.length > 0;

          return (
            <View key={i} style={{ width: "14.28%" }} className="p-[2px]">
              <TouchableOpacity
                onPress={() => handlePress(day.date)}
                className={`w-full aspect-[0.6] rounded-md h-24 border flex justify-between p-[2px] ${
                  isFestival
                    ? "bg-purple-100 border-purple-300"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                {/* Date Number & Moon Phase */}
                <View className="items-center">
                  <Text
                    className={`text-lg font-bold ${isFestival ? "text-purple-900" : "text-amber-900"}`}
                  >
                    {day.date.getDate()}
                  </Text>
                  <Text className="text-lg mt-1">
                    {getChandrabalam(day.panchangam)}
                  </Text>
                </View>

                {/* Panchang Info (Bottom aligned) */}
                <View>
                  <Text
                    numberOfLines={1}
                    className={`text-[7px] text-center font-medium leading-tight ${isFestival ? "text-purple-700" : "text-amber-700"}`}
                  >
                    {day.panchangam?.tithiTransitions[1]?.name ||
                      day.panchangam?.tithi}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-[7px] text-center text-stone-500 italic"
                  >
                    {getCurrentNakshatra(day.panchangam)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PanchangamCalendar;
