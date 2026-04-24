import { supabase } from "@/lib/supabase";
import { Album, Track } from "./types";
import { coverFor } from "./covers";

export async function fetchAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select(
      `id, slug, title, deity, cover_emoji, sort_order,
       playlist_items ( position,
         aartis ( id, title, deity, storage_path )
       )`,
    )
    .order("sort_order");
  if (error) throw error;

  return (data ?? []).map((pl: any): Album => {
    const albumCover = coverFor(pl.deity ?? pl.slug);

    const tracks: Track[] = (pl.playlist_items ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((it: any) => {
        const a = it.aartis;
        const { data: pub } = supabase.storage
          .from("aartis")
          .getPublicUrl(a.storage_path);
        return {
          id: a.id,
          title: a.title,
          subtitle: a.deity,
          duration: "--:--",
          durationSecs: 0,
          audioUrl: pub.publicUrl,
          cover: coverFor(a.deity),
        };
      });

    return {
      id: pl.id,
      title: pl.title,
      type: pl.slug === "aartis" ? "Aartis" : "Bhajans",
      category:
        pl.slug === "aartis" || pl.slug === "all" ? "Popular" : "Deity",
      image: albumCover,
      accentColor: "#E8590C",
      description: pl.deity
        ? `Aartis & bhajans for ${pl.deity}`
        : "Devotional music",
      tracks,
    };
  });
}

export async function fetchAlbumById(id: string): Promise<Album | null> {
  const all = await fetchAlbums();
  return all.find((a) => a.id === id) ?? null;
}
