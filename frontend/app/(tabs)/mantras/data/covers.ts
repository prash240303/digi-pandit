import { ImageSourcePropType } from "react-native";

const COVERS: Record<string, ImageSourcePropType> = {
  shiva: require("@/assets/images/deities/shiva.png"),
  vishnu: require("@/assets/images/deities/vishnu.png"),
  krishna: require("@/assets/images/deities/krishna.png"),
  rama: require("@/assets/images/deities/ram.png"),
  hanuman: require("@/assets/images/deities/hanuman.png"),
  ganesha: require("@/assets/images/deities/ganesha.png"),
  devi: require("@/assets/images/deities/devi.png"),
  lakshmi: require("@/assets/images/deities/laxmi.png"),
  saraswati: require("@/assets/images/deities/saraswati.png"),
  santoshi: require("@/assets/images/deities/santoshi.png"),
  ganga: require("@/assets/images/deities/ganga.png"),
  gayatri: require("@/assets/images/deities/gayatri.png"),
  general: require("@/assets/images/deities/general.png"),
  other: require("@/assets/images/deities/other.png"),
  all: require("@/assets/images/deities/all.png"),
  aartis: require("@/assets/images/deities/aartis.png"),
};

const FALLBACK: ImageSourcePropType = require("@/assets/images/deities/other.png");

export function coverFor(key?: string | null): ImageSourcePropType {
  if (!key) return FALLBACK;
  return COVERS[key.toLowerCase()] ?? FALLBACK;
}
