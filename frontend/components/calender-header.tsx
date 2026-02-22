"use client";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

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
  NativeSelectScrollView,
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

const NEPALI_MONTHS: Record<number, string> = {
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
  const nepaliMonthLabel = `${NEPALI_MONTHS[month]} ${nepaliYear}`;
  const [pressed, setPressed] = useState(false);

  return (
    <View className="bg-white rounded-2xl flex-row items-center justify-between px-3 py-7 shadow-black/10  shadow-md">
      {/* Left Arrow */}
      <TouchableOpacity
        onPress={onPrevMonth}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        className={`w-8 h-8 p-2 border shadow-md shadow-black/5 rounded-md bg-white items-center justify-center ${
          pressed ? "border-slate-500" : "border-slate-100"
        }`}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} color={"#334155"} />
      </TouchableOpacity>

      {/* Center Content */}
      <View className="flex-1 items-center gap-1">
        <Text className="text-3xl font-playfair-display-bold text-slate-800 tracking-tight">
          {MONTH_NAMES[month]}
        </Text>

        <Text className="text-xs font-inter-light tracking-widest text-[#e8642a] uppercase mt-1">
          {nepaliMonthLabel}
        </Text>

        {/* Year selector pill */}
        <Select
          className="w-fit mt-3 mx-auto"
          value={yearValue ? { value: yearValue, label: yearValue } : undefined}
          onValueChange={(option) => onYearChange(option?.value ?? "")}
        >
          <SelectTrigger className="bg-slate-50  text-slate-800 border-slate-200 border rounded-full px-5 py-2.5 flex-row items-center justify-center">
            <SelectValue
              placeholder="Year"
              className="text-sm font-medium text-slate-800 text-center"
            />
          </SelectTrigger>
          <SelectContent>
            <NativeSelectScrollView>
              {years.map((y) => (
                <SelectItem key={y} label={y.toString()} value={y.toString()} />
              ))}
            </NativeSelectScrollView>
          </SelectContent>
        </Select>
      </View>

      {/* Right Arrow */}
      <TouchableOpacity
        onPress={onNextMonth}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        className={`w-8 h-8 p-2 border shadow-md shadow-black/5 rounded-md bg-white items-center justify-center ${
          pressed ? "border-slate-500" : "border-slate-100"
        }`}
      >
        <HugeiconsIcon icon={ArrowRight01FreeIcons} color={"#334155"} />
      </TouchableOpacity>
    </View>
  );
};

export default CalendarHeader;
