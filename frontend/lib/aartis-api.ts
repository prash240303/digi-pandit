import { supabase } from "@/lib/supabase";
  import { getCachedAudio } from "@/lib/audio-cache";                                                                                                                          
                                                                                                                                                                               
  export type Aarti = {
    id: string; title: string; deity: string; storage_path: string; url: string;                                                                                               
  };                                                        
  export type Playlist = {
    id: string; slug: string; title: string; cover_emoji: string; tracks: Aarti[];                                                                                             
  };
                                                                                                                                                                               
  export async function fetchPlaylists(): Promise<Playlist[]> {
    const { data, error } = await supabase
      .from("playlists")                                                                                                                                                       
      .select(`
        id, slug, title, cover_emoji, sort_order,                                                                                                                              
        playlist_items (                                    
          position,                                                                                                                                                            
          aartis ( id, title, deity, storage_path )
        )                                                                                                                                                                      
      `)                                                    
      .order("sort_order");
    if (error) throw error;
                                                                                                                                                                               
    return (data ?? []).map((pl: any) => ({
      id: pl.id,                                                                                                                                                               
      slug: pl.slug,                                        
      title: pl.title,
      cover_emoji: pl.cover_emoji,
      tracks: pl.playlist_items                                                                                                                                                
        .sort((a: any, b: any) => a.position - b.position)
        .map((it: any) => {                                                                                                                                                    
          const a = it.aartis;                                                                                                                                                 
          const { data: pub } = supabase.storage
            .from("aartis")                                                                                                                                                    
            .getPublicUrl(a.storage_path);                  
          return { ...a, url: pub.publicUrl };                                                                                                                                 
        }),
    }));                                                                                                                                                                       
  }                                                         

  export async function resolvePlayableUri(aarti: Aarti) {                                                                                                                     
    return getCachedAudio(aarti.url);
  }                                  