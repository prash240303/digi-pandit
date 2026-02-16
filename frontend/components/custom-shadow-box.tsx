import {
  Canvas,
  RoundedRect,
  Shadow,
  BlurMask,
  Group,
} from "@shopify/react-native-skia";

const CustomShadowBox = () => {
  return (
    <Canvas style={{ width: 200, height: 200 }}>
      {/* 3. Layer Blur (Applied to the whole group) */}
      <Group>
        <BlurMask blur={0.2} style="normal" />

        <RoundedRect
          x={50}
          y={50}
          width={100}
          height={100}
          r={15}
          color="white"
        >
          {/* 2. Drop Shadow: 0, 0, blur 4.5, spread 3, #FFD283 */}
          <Shadow dx={0} dy={0} blur={4.5} color="#FFD283" />

          {/* 1. Inner Shadow: 0, 0, blur 7, spread 2, #FFEA97 */}
          <Shadow dx={0} dy={0} blur={7} color="#FFEA97" inner />
        </RoundedRect>
      </Group>
    </Canvas>
  );
};

export default CustomShadowBox;
