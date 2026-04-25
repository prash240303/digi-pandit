// ─── Mock Data ────────────────────────────────────────────────
const USER_ZODIAC_SET = true; // toggle to test unset state
const USER_ZODIAC = {
  sign: "Scorpio",
  icon: "♏",
  prediction:
    "A period of deep introspection brings clarity to a lingering decision.",
};

const TODAY_OBSERVANCE = {
  name: "Ekadashi",
  description:
    "Fasting day observed on the 11th lunar day — a practice of spiritual discipline and detox.",
  isToday: true,
  daysAway: 0,
  iconName: "leaf-outline" as const,
};

export const ZODIAC_META: Record<string, { icon: string; prediction: string }> = {
  Aries:       { icon: "♈", prediction: "Bold moves bring rewards this month." },
  Taurus:      { icon: "♉", prediction: "Stability and growth are your themes." },
  Gemini:      { icon: "♊", prediction: "Communication opens new doors." },
  Cancer:      { icon: "♋", prediction: "Home and heart are your anchors." },
  Leo:         { icon: "♌", prediction: "Your energy draws people to you." },
  Virgo:       { icon: "♍", prediction: "Precision leads to breakthroughs." },
  Libra:       { icon: "♎", prediction: "Balance brings unexpected joy." },
  Scorpio:     { icon: "♏", prediction: "Deep intuition guides your path." },
  Sagittarius: { icon: "♐", prediction: "Adventure awaits — say yes." },
  Capricorn:   { icon: "♑", prediction: "Discipline pays off this cycle." },
  Aquarius:    { icon: "♒", prediction: "Innovation is your superpower." },
  Pisces:      { icon: "♓", prediction: "Creativity and dreams align." },
};

const FAVORITES = [
  { id: "1", label: "Hanuman Chalisa", type: "mantra", icon: "book-outline" },
  {
    id: "2",
    label: "Tirupati Balaji",
    type: "temple",
    icon: "location-outline",
  },
  { id: "3", label: "Gayatri Mantra", type: "mantra", icon: "book-outline" },
  {
    id: "4",
    label: "Shirdi Sai Baba",
    type: "temple",
    icon: "location-outline",
  },
  { id: "5", label: "Om Jai Jagdish", type: "mantra", icon: "book-outline" },
];


export { USER_ZODIAC, USER_ZODIAC_SET, FAVORITES, TODAY_OBSERVANCE}