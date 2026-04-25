"use client";
import React, { useState } from "react";
import { TouchableOpacity, ScrollView, View, Text } from "react-native";

import {
  ArrowLeft01Icon,
  ArrowRight01FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

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

const HINDU_MONTHS: Record<number, string> = {
  0: "POUSH — MAGH",
  1: "MAGHA — PHALGUNA",
  2: "FALGUN — CHAITRA",
  3: "CHAITRA — BAISAKH",
  4: "BAISAKH — JESTHA",
  5: "JESTHA — ASHADH",
  6: "ASHADH — SHRAWAN",
  7: "SHRAWAN — BHADRA",
  8: "BHADRA — ASHWIN",
  9: "ASHWIN — KARTIK",
  10: "KARTIK — MANGSIR",
  11: "MANGSIR — POUSH",
};

const NEPALI_YEAR_OFFSET = 56;

interface CalendarHeaderProps {
  month: number;
  year: number;
  yearValue: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (value: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  month,
  year,
  yearValue,
  onPrevMonth,
  onNextMonth,
  onYearChange,
}) => {
  const years = Array.from({ length: 100 }, (_, i) => 1980 + i);
  const nepaliYear = parseInt(yearValue || String(year)) + NEPALI_YEAR_OFFSET;
  const hinduMonthLabel = `${HINDU_MONTHS[month]} ${nepaliYear}`;

  return (
    <View className="flex flex-col gap-2 w-full">
      <View className=" rounded-2xl flex-row items-center justify-betwee pt-5">
        {/* Left Arrow */}
        <TouchableOpacity
          onPress={onPrevMonth}
          className={`w-8 h-8 p-2 border shadow-md shadow-black/5 rounded-md bg-white items-center justify-center border-line`}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} color={"#334155"} />
        </TouchableOpacity>

        {/* Center Content */}
        <View className="flex-1 items-center gap-1">
          <Text className="text-3xl font-fraunces text-slate-800 tracking-tight">
            {MONTH_NAMES[month]}
          </Text>

          <Text className="text-xs font-inter tracking-widest text-primary uppercase mt-1">
            {hinduMonthLabel}
          </Text>
        </View>

        {/* Right Arrow */}
        <TouchableOpacity
          onPress={onNextMonth}
          className={`w-8 h-8 p-2 border shadow-md shadow-black/5 rounded-md bg-white items-center justify-center border-line`}
        >
          <HugeiconsIcon icon={ArrowRight01FreeIcons} color={"#334155"} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row w-full justify-between items-center">
        <Select
          className="w-fit flex-1 mx-auto"
          value={yearValue ? { value: yearValue, label: yearValue } : undefined}
          onValueChange={(option) => onYearChange(option?.value ?? "")}
        >
          <SelectTrigger className="bg-white  text-slate-800 border-line border rounded-lg px-3 py-2 flex-row items-center justify-center">
            <SelectValue
              placeholder="Year"
              className="text-sm font-medium text-slate-800 text-center"
            />
          </SelectTrigger>
          <SelectContent>
            <ScrollView
              style={{ maxHeight: 250 }}
              showsVerticalScrollIndicator
              nestedScrollEnabled
            >
              {years.map((y) => (
                <SelectItem key={y} label={y.toString()} value={y.toString()} />
              ))}
            </ScrollView>
          </SelectContent>
        </Select>
        <View className="flex  flex-row gap-4">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-red" />
            <Text className="text-ink-muted">Today</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-gold" />
            <Text className="text-ink-muted">Festival</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CalendarHeader;
