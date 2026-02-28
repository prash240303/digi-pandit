// Cleaned up imports
import { COLOR } from "@/constants/colors";
import { View } from "react-native";
import { Map, MapControls } from "@/components/ui/map";

export default function TabTwoScreen() {
  return (
    <View className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <Map>
        <MapControls />
      </Map>
    </View>
  );
}