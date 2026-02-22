import { COLOR } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
export default function TabTwoScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <ScrollView className="px-1 pb-2 text-black">rituals</ScrollView>
    </SafeAreaView>
  );
}
