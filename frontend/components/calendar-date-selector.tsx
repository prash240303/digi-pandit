import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format, addDays, subDays, isSameDay, startOfDay } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Calendar01Icon, MapPinpoint01Icon } from "@hugeicons/core-free-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const PRIMARY = "#DE6A4D";

// Width of each date card + the gap between cards
const CARD_WIDTH = 52;
const CARD_GAP = 8;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

// How many cards are visible in the strip — keep odd for a true centre
const VISIBLE_CARDS = 6;
const CENTER_INDEX = Math.floor(VISIBLE_CARDS / 2);

export default function CalendarDateSelector() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();

  const today = startOfDay(new Date());
  const selectedDate = date ? startOfDay(new Date(date)) : today;

  // ── Animation ─────────────────────────────────────────────────────────────
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // ── Day window ────────────────────────────────────────────────────────────
  // The window is always 5 days centred on `selectedDate`.
  const weekDays = Array.from({ length: VISIBLE_CARDS }).map((_, i) =>
    addDays(subDays(selectedDate, CENTER_INDEX), i),
  );

  // ── Commit the date change (called from the JS thread after animation) ────
  const commitDate = useCallback(
    (isoString: string) => {
      router.setParams({ date: isoString });
    },
    [router],
  );

  // ── Handle tile press ─────────────────────────────────────────────────────
  const handleDatePress = useCallback(
    (tappedDay: Date, tileIndex: number) => {
      const stepsFromCenter = tileIndex - CENTER_INDEX;
      if (stepsFromCenter === 0) return; // already centred

      // Slide the strip so the tapped card glides into the centre slot
      const slideTarget = -stepsFromCenter * CARD_STEP;
      const isoString = tappedDay.toISOString();

      translateX.value = withTiming(
        slideTarget,
        { duration: 280, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) {
            // Reset translate instantly — React will re-render with the new
            // selectedDate centred, so there is no visual jump.
            translateX.value = 0;
            // Update the URL param on the JS thread
            runOnJS(commitDate)(isoString);
          }
        },
      );
    },
    [translateX, commitDate],
  );

  const goToCalendarView = () => router.push("/calendar");

  return (
    <View className="flex-1 mt-4 gap-2">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View className="px-4 flex flex-row justify-between w-full">
        <View className="flex-row gap-2 items-center">
          <HugeiconsIcon icon={MapPinpoint01Icon} size={32} color={PRIMARY} />
          <View>
            <Text className="text-lg font-inter-semibold font-medium text-neutral-800">
              New Delhi, India
            </Text>
            <Text className="text-xs font-inter-light text-neutral-600">
              {format(selectedDate, "EEEE, d MMMM yyyy")}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="p-2 bg-primary rounded-full"
            onPress={goToCalendarView}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Calendar01Icon} size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Date strip ──────────────────────────────────────────────────── */}
      <View className="px-4">
        {/*
          The outer View clips overflow so cards never spill outside the strip.
          The Animated.View translates the entire row left / right.
        */}
        <View style={{ overflow: "hidden" }}>
          <Animated.View
            style={[
              {
                flexDirection: "row",
                gap: CARD_GAP,
                paddingTop: 4,
                paddingBottom: 4,
              },
              animatedStyle,
            ]}
          >
            {weekDays.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);

              return (
                <TouchableOpacity
                  key={day.toISOString()}
                  onPress={() => handleDatePress(day, index)}
                  activeOpacity={0.9}
                  className="shadow-sm"
                  style={[
                    {
                      width: CARD_WIDTH,
                      height: 72,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      backgroundColor: isSelected ? PRIMARY : "#ffffff",
                      borderColor: isToday ? PRIMARY : "transparent",
                    },
                    isSelected
                      ? {
                          shadowColor: PRIMARY,
                          shadowOffset: { width: 0, height: 10 },
                          shadowOpacity: 0.3,
                          shadowRadius: 12,
                          elevation: 10,
                        }
                      : {
                          shadowColor: "#A0aec0",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 6,
                          elevation: 2,
                        },
                  ]}
                >
                  {/* Day label  e.g. MON */}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: isSelected ? "rgba(255,255,255,0.8)" : "#9CA3AF",
                      marginBottom: 4,
                    }}
                  >
                    {format(day, "EEE").toUpperCase()}
                  </Text>

                  {/* Date number  e.g. 07 */}
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: isSelected ? "#ffffff" : "#1F2937",
                    }}
                  >
                    {format(day, "dd")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
