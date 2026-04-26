import { supabase } from "./supabase";
import { format } from "date-fns";

// ─── Block types (flat — no nesting) ─────────────────────────────────────────

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface HeadingBlock {
  type: "heading";
  level?: 2 | 3;
  text: string;
}

export interface TipBlock {
  type: "tip";
  text: string;
  icon?: string;
}

export interface ChecklistBlock {
  type: "checklist";
  title?: string;
  items: string[];
}

export interface ImageBlock {
  type: "image";
  uri: string;
  caption?: string;
}

export interface StepBlock {
  type: "step";
  number: number;
  title: string;
  description: string;
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | TipBlock
  | ChecklistBlock
  | ImageBlock
  | StepBlock;

// ─── Screen-facing types ──────────────────────────────────────────────────────

export interface Article {
  id: string;
  ritualId: string;
  category: string;
  title: string;
  readTime: string;
  locked: boolean;
  imageUri: string;
}

export interface GuideDetail {
  id: string;
  heroImage: string;
  category: string;
  readTime: string;
  title: string;
  author: {
    name: string;
    avatarUri: string;
    updatedAt: string;
  };
  pullQuote: string;
  content: Block[];
  likes: number;
  comments: number;
  nextGuide: {
    id: string;
    title: string;
  };
}

// ─── DB row type ──────────────────────────────────────────────────────────────

interface RitualRow {
  id: string;
  category: string;
  title: string;
  title_hindi: string | null;
  read_time: string;
  hero_image: string | null;
  locked: boolean;
  featured: boolean;
  pull_quote: string | null;
  author_name: string;
  author_avatar: string | null;
  deity: string | null;
  content: Block[];
  likes: number;
  comments: number;
  source_url: string | null;
  language: string;
  created_at: string;
}

// ─── Image fallbacks by category ─────────────────────────────────────────────

const FALLBACK_IMAGE: Record<string, string> = {
  Festivals:
    "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=600&q=80",
  "Daily Rituals":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  Fasting:
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&q=80",
  Puja: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1544376798-89aa6b0523a4?w=600&q=80";

function heroFor(row: RitualRow): string {
  if (row.hero_image) return row.hero_image;
  return FALLBACK_IMAGE[row.category] ?? DEFAULT_IMAGE;
}

// ─── Transforms ───────────────────────────────────────────────────────────────

function rowToArticle(row: RitualRow): Article {
  return {
    id: row.id,
    ritualId: row.id,
    category: row.category,
    title: row.title,
    readTime: row.read_time,
    locked: row.locked,
    imageUri: heroFor(row),
  };
}

function rowToGuide(row: RitualRow, nextRow?: RitualRow | null): GuideDetail {
  const createdAt = row.created_at
    ? format(new Date(row.created_at), "MMMM yyyy")
    : "2025";

  return {
    id: row.id,
    heroImage: heroFor(row),
    category: row.category.toUpperCase(),
    readTime: row.read_time,
    title: row.title,
    author: {
      name: row.author_name,
      avatarUri: row.author_avatar ?? "",
      updatedAt: `Updated ${createdAt}`,
    },
    pullQuote: row.pull_quote ?? "",
    content: Array.isArray(row.content) ? row.content : [],
    likes: row.likes,
    comments: row.comments,
    nextGuide: nextRow
      ? { id: nextRow.id, title: nextRow.title }
      : { id: "", title: "" },
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchRituals(category?: string): Promise<Article[]> {
  let query = supabase
    .from("rituals")
    .select("id, category, title, read_time, locked, hero_image, created_at")
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.ilike("category", `%${category}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as RitualRow[]).map(rowToArticle);
}

export async function fetchFeaturedRitual(): Promise<Article | null> {
  const { data, error } = await supabase
    .from("rituals")
    .select("id, category, title, read_time, locked, hero_image, created_at")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? rowToArticle(data as RitualRow) : null;
}

export async function fetchRitualById(id: string): Promise<GuideDetail | null> {
  const { data, error } = await supabase
    .from("rituals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const { data: nextData } = await supabase
    .from("rituals")
    .select("id, title, created_at")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return rowToGuide(data as RitualRow, nextData as RitualRow | null);
}
