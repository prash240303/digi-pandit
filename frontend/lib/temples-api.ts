import { Temple, Deity } from "@/constants/temples-mock";
import { LatLng } from "@/lib/geo";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function inferDeity(tags: Record<string, string>): Deity {
  const fields = [
    tags["deity"],
    tags["deity:en"],
    tags["name"],
    tags["name:en"],
    tags["name:hi"],
    tags["alt_name"],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/hanuman|bajrang|balaji/.test(fields)) return "Hanuman";
  if (/ganesh|ganapati|vinayak/.test(fields)) return "Ganesha";
  if (/shiv|mahadev|bholenath|nataraj|rudra|shankar|lingam|jyotirlinga/.test(fields))
    return "Shiva";
  if (
    /vishnu|ram\b|rama|krishna|jagannath|venkate|tirupati|narayan|lakshmi narayan|laxmi narayan|balaji/.test(
      fields,
    )
  )
    return "Vishnu";
  if (
    /durga|kali|devi|amba|ambaji|mata|maa |shakti|gauri|parvati|laxmi|lakshmi|saraswati/.test(
      fields,
    )
  )
    return "Devi";
  return "Other";
}

function isHinduTemple(tags: Record<string, string>): boolean {
  if (tags["amenity"] !== "place_of_worship") return false;
  const religion = tags["religion"]?.toLowerCase();
  return religion === "hindu";
}

function toTemple(el: OverpassElement): Temple | null {
  const tags = el.tags ?? {};
  if (!isHinduTemple(tags)) return null;
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;
  const name =
    tags["name:en"] ?? tags["name"] ?? tags["alt_name"] ?? "Hindu Temple";
  const opening = tags["opening_hours"];
  let openTime = "06:00";
  let closeTime = "20:00";
  if (opening && /\d{2}:\d{2}-\d{2}:\d{2}/.test(opening)) {
    const m = opening.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
    if (m) {
      openTime = m[1];
      closeTime = m[2];
    }
  }
  return {
    id: `${el.type[0]}${el.id}`,
    name,
    deity: inferDeity(tags),
    type: "Ancient",
    lat,
    lng: lon,
    openTime,
    closeTime,
    phone: tags["phone"] ?? tags["contact:phone"],
    address:
      tags["addr:full"] ??
      ([tags["addr:street"], tags["addr:city"], tags["addr:state"]]
        .filter(Boolean)
        .join(", ") ||
        undefined),
  };
}

export async function fetchHinduTemples(
  center: LatLng,
  radiusKm: number,
): Promise<Temple[]> {
  const radiusM = Math.max(1000, Math.round(radiusKm * 1000));
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="hindu"](around:${radiusM},${center.lat},${center.lng});
      way["amenity"="place_of_worship"]["religion"="hindu"](around:${radiusM},${center.lat},${center.lng});
      relation["amenity"="place_of_worship"]["religion"="hindu"](around:${radiusM},${center.lat},${center.lng});
    );
    out center tags;
  `;

  let lastErr: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = (await res.json()) as { elements: OverpassElement[] };
      const temples = json.elements
        .map(toTemple)
        .filter((t): t is Temple => t != null);
      const seen = new Map<string, Temple>();
      for (const t of temples) {
        const key = `${t.name}|${t.lat.toFixed(4)}|${t.lng.toFixed(4)}`;
        if (!seen.has(key)) seen.set(key, t);
      }
      return Array.from(seen.values());
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Overpass failed");
}
