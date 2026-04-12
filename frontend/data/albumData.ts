// data/albumData.ts

// ─── Types ──────────────────────────────────────────────────────────────────

/** A require()-based local asset (number) or a remote/file URI */
export type TrackSource = number | { uri: string };

export interface Track {
  id: string;
  title: string; // human-readable display name
  subtitle: string; // artist / album line shown in UI
  duration: string; // display string e.g. "4:32"  (populate once known)
  source: TrackSource; // passed directly to expo-av loadAsync()
}

export interface Album {
  id: string;
  title: string;
  description: string;
  image: string; // remote URI used for artwork
  type: string; // "Bhajan" | "Mantra" | "Aarti" …
  category: "Deity" | "Festival" | "General";
  tracks: Track[];
}

// ─── Helper ─────────────────────────────────────────────────────────────────

/** Convert a CamelCase filename stem to a spaced readable title */
function toTitle(stem: string): string {
  return stem
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/-(\d)/g, " $1") // "Amrutwani-1" → "Amrutwani 1"
    .replace(/-/g, " ")
    .trim();
}

// ─── Hindi Bhajans Collection ────────────────────────────────────────────────
//
// 50 tracks successfully downloaded from:
//   https://archive.org/details/HindiBhajans-collection
//
// 3 tracks (BhaiReMatDeejo, DOHAWALI, MannNaRangay) returned 401 and are omitted.

const BHAJAN_SUBTITLE = "Hindi Bhajans Collection · Archive.org";
const BHAJAN_IMAGE = "https://archive.org/services/img/HindiBhajans-collection";

const hindiBhajanstracks: Track[] = [
  {
    id: "hb-01",
    title: toTitle("AaoJiGharmeinpadharogajanandji"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/AaoJiGharmeinpadharogajanandji.mp3"),
  },
  {
    id: "hb-02",
    title: toTitle("BajeChe"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/BajeChe.mp3"),
  },
  {
    id: "hb-03",
    title: toTitle("BhajManRamCharan"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/BhajManRamCharan.mp3"),
  },
  {
    id: "hb-04",
    title: toTitle("BhalaKisiKaKarNaSakoTo"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/BhalaKisiKaKarNaSakoTo.mp3"),
  },
  {
    id: "hb-05",
    title: toTitle("BhataktaDoleKaahePrani"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/BhataktaDoleKaahePrani.mp3"),
  },
  {
    id: "hb-06",
    title: toTitle("ChaleChaleReUmra"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ChaleChaleReUmra.mp3"),
  },
  {
    id: "hb-07",
    title: toTitle("ChamreKiPutli"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ChamreKiPutli.mp3"),
  },
  {
    id: "hb-08",
    title: toTitle("ChetRe"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ChetRe.mp3"),
  },
  {
    id: "hb-09",
    title: toTitle("ChitrakootKeGhaatPer"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ChitrakootKeGhaatPer.mp3"),
  },
  {
    id: "hb-10",
    title: toTitle("DekhTamasaLakdiKa"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/DekhTamasaLakdiKa.mp3"),
  },
  {
    id: "hb-11",
    title: toTitle("DekoVrindavan"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/DekoVrindavan.mp3"),
  },
  {
    id: "hb-12",
    title: toTitle("DoDinKiHaiSagai"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/DoDinKiHaiSagai.mp3"),
  },
  {
    id: "hb-13",
    title: toTitle("GhanaDin"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/GhanaDin.mp3"),
  },
  {
    id: "hb-14",
    title: "Guruji Bhajans (Part 2)",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/GurujiBhajansAvseq02.mp3"),
  },
  {
    id: "hb-15",
    title: "Joban",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/JOBAN.mp3"),
  },
  {
    id: "hb-16",
    title: toTitle("JayRaghunandanJaySiyaram"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/JayRaghunandanJaySiyaram.mp3"),
  },
  {
    id: "hb-17",
    title: toTitle("JisBhajanMeinRamKaNaam"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/JisBhajanMeinRamKaNaam.mp3"),
  },
  {
    id: "hb-18",
    title: toTitle("KabhiRamBanke"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KabhiRamBanke.mp3"),
  },
  {
    id: "hb-19",
    title: "Kabir Amrutwani (Part 1)",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KabirAmrutwani-1.mp3"),
  },
  {
    id: "hb-20",
    title: "Kabir Amrutwani (Part 2)",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KabirAmrutwani-2.mp3"),
  },
  {
    id: "hb-21",
    title: toTitle("KadAabolaSanweriya"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KadAabolaSanweriya.mp3"),
  },
  {
    id: "hb-22",
    title: toTitle("KaloJiKalo"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KaloJiKalo.mp3"),
  },
  {
    id: "hb-23",
    title: toTitle("KamreMeinKhadaYu"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KamreMeinKhadaYu.mp3"),
  },
  {
    id: "hb-24",
    title: toTitle("KhilonaMatiKa"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KhilonaMatiKa.mp3"),
  },
  {
    id: "hb-25",
    title: toTitle("KoiMahaneKahiyoRe"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/KoiMahaneKahiyoRe.mp3"),
  },
  {
    id: "hb-26",
    title: toTitle("MaanLe"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/MaanLe.mp3"),
  },
  {
    id: "hb-27",
    title: toTitle("ManLago"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ManLago.mp3"),
  },
  {
    id: "hb-28",
    title: toTitle("MeraChhotaSaSansar"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/MeraChhotaSaSansar.mp3"),
  },
  {
    id: "hb-29",
    title: toTitle("MereBholeBabaKo"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/MereBholeBabaKo.mp3"),
  },
  {
    id: "hb-30",
    title: toTitle("MurliwaleNeGherLayee"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/MurliwaleNeGherLayee.mp3"),
  },
  {
    id: "hb-31",
    title: toTitle("NaJaneTeraSaheb"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/NaJaneTeraSaheb.mp3"),
  },
  {
    id: "hb-32",
    title: toTitle("NaamLeLoShivKa"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/NaamLeLoShivKa.mp3"),
  },
  {
    id: "hb-33",
    title: toTitle("NainaNeecharKarLe"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/NainaNeecharKarLe.mp3"),
  },
  {
    id: "hb-34",
    title: toTitle("NatwarNagarNanda"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/NatwarNagarNanda.mp3"),
  },
  {
    id: "hb-35",
    title: toTitle("RahenaNahiDesBirana"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/RahenaNahiDesBirana.mp3"),
  },
  {
    id: "hb-36",
    title: "Ram Dhun",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/RamDhun.mp3"),
  },
  {
    id: "hb-37",
    title: toTitle("RasKunjanMain"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/RasKunjanMain.mp3"),
  },
  {
    id: "hb-38",
    title: "Sa Sa Ri",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/SaSaRee.mp3"),
  },
  {
    id: "hb-39",
    title: toTitle("SabMitJasi"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/SabMitJasi.mp3"),
  },
  {
    id: "hb-40",
    title: toTitle("SamajhMan"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/SamajhMan.mp3"),
  },
  {
    id: "hb-41",
    title: "Shri Ram Chandra Kripalu",
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ShriRamChandraKripalu.mp3"),
  },
  {
    id: "hb-42",
    title: toTitle("ShyamAanBasoVrindavanMein"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ShyamAanBasoVrindavanMein.mp3"),
  },
  {
    id: "hb-43",
    title: toTitle("ShyamChudiBechneAaya"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ShyamChudiBechneAaya.mp3"),
  },
  {
    id: "hb-44",
    title: toTitle("SiddhChoupaiyan"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/SiddhChoupaiyan.mp3"),
  },
  {
    id: "hb-45",
    title: toTitle("SukritKarleRamSamar"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/SukritKarleRamSamar.mp3"),
  },
  {
    id: "hb-46",
    title: toTitle("TajDiyaPranKaya"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/TajDiyaPranKaya.mp3"),
  },
  {
    id: "hb-47",
    title: toTitle("TaraHaiSaraJamana"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/TaraHaiSaraJamana.mp3"),
  },
  {
    id: "hb-48",
    title: toTitle("TeriGathariMeinLagaChor"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/TeriGathariMeinLagaChor.mp3"),
  },
  {
    id: "hb-49",
    title: toTitle("ThaliBharKeLeyai"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/ThaliBharKeLeyai.mp3"),
  },
  {
    id: "hb-50",
    title: toTitle("TuneHeeroSoJanam"),
    subtitle: BHAJAN_SUBTITLE,
    duration: "0:00",
    source: require("../music_data/hindi_bhajans/TuneHeeroSoJanam.mp3"),
  },
];

// ─── Album registry ──────────────────────────────────────────────────────────

export const ALBUMS: Album[] = [
  {
    id: "1",
    title: "Hindi Bhajans",
    description:
      "50 devotional bhajans — Ram, Shyam, Shiv, Kabir & more. Public domain collection from Archive.org.",
    image: BHAJAN_IMAGE,
    type: "Bhajan",
    category: "General",
    tracks: hindiBhajanstracks,
  },

  // ── Add more albums here as you download them ──
  // {
  //   id: "2",
  //   title: "Gayatri Mantra",
  //   description: "108 repetitions of the Gayatri Mantra",
  //   image: "https://...",
  //   type: "Mantra",
  //   category: "Deity",
  //   tracks: [ ... ],
  // },
];

// ─── Helpers used by screens ─────────────────────────────────────────────────

export function getAlbumById(id: string): Album | undefined {
  return ALBUMS.find((a) => a.id === id);
}
