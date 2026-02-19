import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Svg, {
  Circle,
  Defs,
  Filter,
  FeGaussianBlur,
  FeOffset,
  FeFlood,
  FeComposite,
  FeComponentTransfer,
  FeFuncA,
  FeMerge,
  FeMergeNode,
  Path,
} from "react-native-svg";

function SunriseSunsetCards({
  sunriseHour = 7,
  sunriseMinute = 41,
  sunsetHour = 16,
  sunsetMinute = 20,
}) {
  const pad = (n) => String(n).padStart(2, "0");

  const sunriseTime = `${pad(sunriseHour)}:${pad(sunriseMinute)}`;
  const sunsetTime = `${pad(sunsetHour)}:${pad(sunsetMinute)}`;

  const totalDay =
    sunsetHour * 60 + sunsetMinute - (sunriseHour * 60 + sunriseMinute);
  const dayHours = Math.floor(totalDay / 60);
  const dayMins = totalDay % 60;

  const GlowingSun = ({ cx, cy }) => (
    <>
      <Defs>
        <Filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%">
          {/* 3. Layer Blur (0.2) - Applied to the Source */}
          <FeGaussianBlur
            in="SourceGraphic"
            stdDeviation="0.2"
            result="layerBlur"
          />

          {/* 2. Drop Shadow (0, 0, blur 4.5, spread 3) */}
          {/* Note: 'Spread' in SVG is simulated by dilating or thickening the alpha */}
          <FeGaussianBlur
            in="SourceAlpha"
            stdDeviation="4.5"
            result="dropBlur"
          />
          <FeFlood floodColor="#FFD283" result="dropColor" />
          <FeComposite
            in="dropColor"
            in2="dropBlur"
            operator="in"
            result="dropShadow"
          />

          {/* 1. Inner Shadow (0, 0, blur 7, spread 2) */}
          <FeGaussianBlur
            in="SourceAlpha"
            stdDeviation="7"
            result="innerBlur"
          />
          <FeOffset dx="0" dy="0" />
          <FeComposite
            in2="SourceAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
            result="innerShadowMask"
          />
          <FeFlood floodColor="#FFEA97" result="innerColor" />
          <FeComposite
            in="innerColor"
            in2="innerShadowMask"
            operator="in"
            result="innerShadowFinal"
          />

          {/* Composition: Put it all together */}
          <FeMerge>
            <FeMergeNode in="dropShadow" />
            <FeMergeNode in="layerBlur" />
            <FeMergeNode in="innerShadowFinal" />
          </FeMerge>
        </Filter>
      </Defs>

      <Circle cx={cx} cy={cy} r="18" fill="white" filter="url(#sunGlow)" />
    </>
  );

  return (
    <View className="flex-1 bg-slate-100 p-8 items-center justify-center">
      <View className="flex flex-col gap-6 w-full max-w-md">
        {/* Sunrise Card */}
        <View className="relative rounded-3xl shadow-2xl overflow-hidden min-h-[300px] bg-slate-800">
          <Image
            source={require("../assets/images/sunset.png")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />

          <View className="p-6">
            <Text className="text-2xl font-light text-white mb-1">
              Today's Sunrise
            </Text>
            <Text className="text-6xl font-bold text-white">
              {sunriseTime} <Text className="text-2xl font-normal">am</Text>
            </Text>
          </View>

          <View className="absolute bottom-0 w-full h-48">
            <Svg viewBox="0 0 300 150" width="100%" height="100%">
              <Circle
                cx="150"
                cy="200"
                r="180"
                fill="none"
                stroke="white"
                strokeWidth="24"
              />
              <GlowingSun cx="244" cy="46" />
            </Svg>
          </View>
        </View>

        {/* Sunrise Card */}
        <View className="relative rounded-3xl shadow-2xl overflow-hidden min-h-[300px] bg-slate-800">
          <Image
            source={require("../assets/images/sunset.png")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />

          <View className="p-6">
            <Text className="text-2xl font-light text-white mb-1">
              Today's Sunset
            </Text>
            <Text className="text-6xl font-bold text-white">
              {sunriseTime} <Text className="text-2xl font-normal">am</Text>
            </Text>
          </View>

          <View className="absolute bottom-0 w-full h-48">
            <Svg viewBox="0 0 300 150" width="100%" height="100%">
              <Circle
                cx="150"
                cy="200"
                r="180"
                fill="none"
                stroke="white"
                strokeWidth="24"
              />
              <GlowingSun cx="244" cy="46" />
            </Svg>
          </View>
        </View>

        {/* Info footer */}
        <View className="items-center">
          <Text className="text-slate-600 text-sm">
            {dayHours}h {dayMins}m of daylight
          </Text>
        </View>
      </View>
    </View>
  );
}

export default SunriseSunsetCards;
