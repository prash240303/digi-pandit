"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { getPanchangam, Observer } from "@ishubhamx/panchangam-js";
import CalendarHeader from "./calender-header";

/* -------------------- Types -------------------- */
interface CalendarDayData {
  date: Date;
  panchangam: any;
}

/* -------------------- Mock Data -------------------- */
const WEEKDAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

/* -------------------- Helper Functions -------------------- */
const getCurrentNakshatra = (panchangam: any) => {
  if (!panchangam.nakshatras || panchangam.nakshatras.length === 0)
    return "N/A";
  return panchangam?.nakshatras[1]?.name;
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
  return moon;
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/* -------------------- Component -------------------- */
const PanchangamCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isReady, setIsReady] = useState(false);
  const [isComputing, setIsComputing] = useState(true);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const [yearValue, setYearValue] = useState(year.toString());

  // Defer heavy panchangam computation until after the tab transition paints,
  // so the loading indicator is visible immediately when the tab is tapped.
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  // Recompute flag when month/year changes so the spinner shows during re-compute.
  useEffect(() => {
    setIsComputing(true);
  }, [month, year]);

  const calendarDays = useMemo(() => {
    if (!isReady) return [] as (CalendarDayData | null)[];
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
      days.push(dayData);
    }
    return days;
  }, [month, year, isReady]);

  useEffect(() => {
    if (isReady) setIsComputing(false);
  }, [calendarDays, isReady]);

  const weeks: (CalendarDayData | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

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
    <View className="p-2 gap-4 flex-1">
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
      <View className="flex-row w-full  gap-[1px] ">
        {WEEKDAY_NAMES.map((d) => (
          <View
            key={d}
            style={{ width: "14.28%" }}
            className="items-center justify-center"
          >
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* --- GRID BODY (Days) --- */}
      {!isReady || isComputing ? (
        <View className="w-full items-center justify-center py-24 gap-3">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-amber-700 text-sm">Loading calendar…</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap w-full">
          {weeks.flat().map((day, i) => {
            if (!day) {
              return (
                <View
                  key={`empty-${i}`}
                  style={{ width: "14.25%", height: "auto" }}
                />
              );
            }

            const isFestival = day.panchangam.festivals.length > 0;
            const isCurrentDay = isToday(day.date);

            return (
              <View
                key={i}
                style={{ width: "14.28%", height: "auto" }}
                className="overflow-hidden p-px"
              >
                <TouchableOpacity
                  onPress={() => handlePress(day.date)}
                  className={`flex-1 h-fit rounded-md border flex-col justify-between px-px py-1 ${
                    isCurrentDay
                      ? "bg-primary-soft border-primary"
                      : isFestival
                        ? "bg-gold-soft/90 border-gold"
                        : "bg-orange-50 border-orange-200"
                  }`}
                >
                  {/* Date Number & Moon Phase */}
                  <View className="items-center">
                    <Text
                      className={`text-lg font-fraunces font-bold text-primary`}
                    >
                      {day.date.getDate()}
                    </Text>
                    <Text className="text-lg mt-1">
                      {getChandrabalam(day.panchangam)}
                    </Text>
                  </View>

                  {/* Panchang Info */}
                  <View className="pb-1">
                    <Text
                      numberOfLines={2} // allow wrap
                      className={`text-[7px] text-center font-medium leading-tight ${
                        isCurrentDay
                          ? "text-primary"
                          : isFestival
                            ? "text-yellow-600"
                            : "text-amber-700"
                      }`}
                    >
                      {day.panchangam?.tithiTransitions?.[1]?.name ||
                        day.panchangam?.tithi ||
                        "N/A"}
                    </Text>
                    <Text
                      numberOfLines={2}
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
      )}
    </View>
  );
};

export default PanchangamCalendar;
