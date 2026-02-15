import FadeSlideIn from "@/components/ui/fade-in-slide";
import { HStack } from "@/components/ui/hstack";
import { COLOR } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { USER_NAME } from "@/constants/user-mock-data";
import { Text as GText, Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Platform, TouchableOpacity, View } from "react-native";
import { Box } from "@/components/ui/box";
import { getPanchangam } from "@ishubhamx/panchangam-js";
import { Observer, yogaNames } from "@ishubhamx/panchangam-js";
import {
  HugeiconsFreeIcons,
  Moon01FreeIcons,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import PanchangamCalendar from "@/components/panchangam-calendar";
import { Link } from "expo-router";
import { Button } from "@/components/ui/button";

// function TopBar({ name }: { name: string | null }) {
//   return (
//     <HStack className="items-center justify-between">
//       <PanchangamCalendar />

//       <Heading
//         size="lg"
//         style={{
//           color: COLOR.ink,
//           fontFamily: Platform.select({
//             ios: "Georgia",
//             android: "serif",
//             web: "Georgia, serif",
//           }),
//         }}
//       >
//         Calendar
//       </Heading>

//       <TouchableOpacity>
//         <Box
//           className="rounded-full items-center justify-center"
//           style={{
//             width: 40,
//             height: 40,
//             backgroundColor: COLOR.terracotta + "18",
//             borderWidth: 2,
//             borderColor: COLOR.terracotta + "40",
//           }}
//         >
//           <GText
//             size="sm"
//             style={{ color: COLOR.terracotta, fontWeight: "700" }}
//           >
//             {name ? name.charAt(0).toUpperCase() : "M"}
//           </GText>
//         </Box>
//       </TouchableOpacity>
//     </HStack>
//   );
// }

// {
//   date: 15,
//   weekday: 0–6,
//   isCurrentMonth: true,

//   panchangam: {
//     tithi: "Amavasya",
//     nakshatra: "Rohini",
//     sunrise: "06:12",
//     rahuKalam: ["13:30", "15:00"]
//   },

//   flags: {
//     isAmavasya: true,
//     isPurnima: false
//   }
// }
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// function getSunriseBasedPanchang(
//   year: number,
//   month: number, // 1–12
//   day: number,
//   observer: Observer,
// ) {
//   // Step 1: temporary date just to get sunrise
//   const tempDate = new Date(year, month - 1, day, 6, 0, 0);
//   const tempPanchang = getPanchangam(tempDate, observer);

//   const sunrise = tempPanchang.sunrise;

//   // Step 2: anchor time = sunrise + 1 hour
//   const anchorDate = new Date(sunrise.getTime() + 60 * 60 * 1000);

//   // Step 3: final Panchang for the day
//   return getPanchangam(anchorDate, observer);
// }

export default function TabTwoScreen() {
  const CalObserver = new Observer(23.1, 75.46, 494);
  const date = new Date("2026-01-01"); // or new Date('2025-06-15')
  const panchangam = getPanchangam(date, CalObserver);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      {/* <FadeSlideIn delay={80}>
        <TopBar name={USER_NAME} />
      </FadeSlideIn> */}
  
      <View className="px-4 py-6 text-black">
        <PanchangamCalendar />
      </View>
    </SafeAreaView>
  );
}
