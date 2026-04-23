export type Deity =
  | "Shiva"
  | "Vishnu"
  | "Hanuman"
  | "Devi"
  | "Ganesha"
  | "Other";

export type TempleType = "Ancient" | "Modern" | "Heritage";

export type Temple = {
  id: string;
  name: string;
  deity: Deity;
  type: TempleType;
  lat: number;
  lng: number;
  openTime: string;
  closeTime: string;
  phone?: string;
  address?: string;
};

export const DEITIES: (Deity | "All")[] = [
  "All",
  "Shiva",
  "Vishnu",
  "Hanuman",
  "Devi",
  "Ganesha",
];

export const RADIUS_OPTIONS: (1 | 3 | 5 | 10)[] = [1, 3, 5, 10];

// Seed set — spread around New Delhi; easy to see on default map.
export const TEMPLES: Temple[] = [
  {
    id: "t-akshardham",
    name: "Akshardham Temple",
    deity: "Vishnu",
    type: "Modern",
    lat: 28.6127,
    lng: 77.2773,
    openTime: "09:30",
    closeTime: "18:30",
    phone: "+911143442344",
    address: "Noida Mor, Pandav Nagar, New Delhi",
  },
  {
    id: "t-chhatarpur",
    name: "Shri Adya Katyayani Shakti Peeth Mandir",
    deity: "Devi",
    type: "Heritage",
    lat: 28.5049,
    lng: 77.1762,
    openTime: "04:00",
    closeTime: "22:00",
    phone: "+911126802360",
    address: "Chhatarpur, New Delhi",
  },
  {
    id: "t-iskcon-delhi",
    name: "ISKCON Temple",
    deity: "Vishnu",
    type: "Modern",
    lat: 28.5555,
    lng: 77.2529,
    openTime: "04:30",
    closeTime: "21:00",
    phone: "+911126235133",
    address: "Hare Krishna Hill, East of Kailash, New Delhi",
  },
  {
    id: "t-hanuman-cp",
    name: "Hanuman Mandir, Connaught Place",
    deity: "Hanuman",
    type: "Ancient",
    lat: 28.6281,
    lng: 77.2197,
    openTime: "05:00",
    closeTime: "22:00",
    address: "Baba Kharak Singh Marg, Connaught Place",
  },
  {
    id: "t-jhandewalan",
    name: "Jhandewalan Temple",
    deity: "Devi",
    type: "Heritage",
    lat: 28.6442,
    lng: 77.2048,
    openTime: "05:30",
    closeTime: "22:00",
    phone: "+911123525842",
    address: "Deshbandhu Gupta Road, Jhandewalan",
  },
  {
    id: "t-gauri-shankar",
    name: "Gauri Shankar Temple",
    deity: "Shiva",
    type: "Ancient",
    lat: 28.6562,
    lng: 77.2316,
    openTime: "04:30",
    closeTime: "23:00",
    address: "Chandni Chowk, Old Delhi",
  },
  {
    id: "t-kalkaji",
    name: "Kalkaji Mandir",
    deity: "Devi",
    type: "Ancient",
    lat: 28.5499,
    lng: 77.2588,
    openTime: "04:00",
    closeTime: "23:30",
    address: "Kalkaji, New Delhi",
  },
  {
    id: "t-birla",
    name: "Laxminarayan Temple (Birla Mandir)",
    deity: "Vishnu",
    type: "Heritage",
    lat: 28.6324,
    lng: 77.2004,
    openTime: "04:30",
    closeTime: "21:30",
    phone: "+911123363637",
    address: "Mandir Marg, New Delhi",
  },
  {
    id: "t-prachin-hanuman",
    name: "Prachin Hanuman Mandir",
    deity: "Hanuman",
    type: "Ancient",
    lat: 28.6320,
    lng: 77.2190,
    openTime: "05:00",
    closeTime: "22:30",
    address: "Baba Kharak Singh Marg",
  },
  {
    id: "t-siddhi-ganesh",
    name: "Siddhi Vinayak Ganesh Mandir",
    deity: "Ganesha",
    type: "Modern",
    lat: 28.5722,
    lng: 77.2210,
    openTime: "05:30",
    closeTime: "21:30",
    address: "Safdarjung Enclave",
  },
];
