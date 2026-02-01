import FadeSlideIn from "@/components/ui/fade-in-slide";
import { HStack } from "@/components/ui/hstack";
import { COLOR } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { USER_NAME } from "@/constants/user-mock-data";

import { Text as GText } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Platform, TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";

function TopBar({ name }: { name: string | null }) {
  return (
    <HStack className="items-center justify-between">
      <Heading
        size="lg"
        style={{
          color: COLOR.ink,
          fontFamily: Platform.select({
            ios: "Georgia",
            android: "serif",
            web: "Georgia, serif",
          }),
        }}
      >
        Calendar
      </Heading>

      <TouchableOpacity>
        <Box
          className="rounded-full items-center justify-center"
          style={{
            width: 40,
            height: 40,
            backgroundColor: COLOR.terracotta + "18",
            borderWidth: 2,
            borderColor: COLOR.terracotta + "40",
          }}
        >
          <GText
            size="sm"
            style={{ color: COLOR.terracotta, fontWeight: "700" }}
          >
            {name ? name.charAt(0).toUpperCase() : "M"}
          </GText>
        </Box>
      </TouchableOpacity>
    </HStack>
  );
}

export default function TabTwoScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <FadeSlideIn delay={80}>
        <TopBar name={USER_NAME} />
      </FadeSlideIn>
      <view className="text-black">hi</view>
    </SafeAreaView>
  );
}
