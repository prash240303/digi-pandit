import { ImageSourcePropType } from "react-native";

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  durationSecs: number;
  audioUrl: string;
  cover?: ImageSourcePropType;
}

export interface Album {
  id: string;
  title: string;
  type: string;
  category: "Deity" | "Festival" | "Popular";
  image: ImageSourcePropType;
  accentColor: string;
  description: string;
  tracks: Track[];
}
