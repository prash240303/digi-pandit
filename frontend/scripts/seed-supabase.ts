                                                                                                                                                                             
  import { createClient } from "@supabase/supabase-js";
  import fs from "node:fs";                                                                                                                                                    
                                                            
  const supabase = createClient(                                                                                                                                               
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_SUPABASE_SERVICE_KEY!,
  );                                                        

  type Row = { storage_path: string; title: string; deity: string };                                                                                                           
  const rows: Row[] = JSON.parse(
    fs.readFileSync("music_data/aartis.seed.json", "utf-8"),                                                                                                                   
  );                                                                                                                                                                           
  
  async function main() {                                                                                                                                                      
    const { data: aartis, error: aErr } = await supabase    
      .from("aartis")                                                                                                                                                          
      .upsert(rows, { onConflict: "storage_path" })
      .select();                                                                                                                                                               
    if (aErr) throw aErr;                                   
                                                                                                                                                                               
    const deities = Array.from(new Set(rows.map((r) => r.deity)));
    const playlists = [                                                                                                                                                        
      { slug: "all", title: "All Aartis", deity: null, cover_emoji: "🕉️ ", sort_order: 0 },                                                                                     
      { slug: "aartis", title: "Aartis", deity: null, cover_emoji: "🪔", sort_order: 1 },                                                                                      
      ...deities.map((d, i) => ({                                                                                                                                              
        slug: d.toLowerCase(),                                                                                                                                                 
        title: d,                                                                                                                                                              
        deity: d,                                                                                                                                                              
        cover_emoji: emojiFor(d),
        sort_order: 10 + i,                                                                                                                                                    
      })),                                                  
    ];
    const { data: pls, error: pErr } = await supabase                                                                                                                          
      .from("playlists")
      .upsert(playlists, { onConflict: "slug" })                                                                                                                               
      .select();                                                                                                                                                               
    if (pErr) throw pErr;
                                                                                                                                                                               
    const items: { playlist_id: string; aarti_id: string; position: number }[] = [];                                                                                           
    for (const pl of pls!) {
      let pos = 0;                                                                                                                                                             
      const members = aartis!.filter((a) => {               
        if (pl.slug === "all") return true;                                                                                                                                    
        if (pl.slug === "aartis") return /aarti/i.test(a.title);
        return a.deity === pl.deity;                                                                                                                                           
      });                                                   
      for (const a of members) {                                                                                                                                               
        items.push({ playlist_id: pl.id, aarti_id: a.id, position: pos++ });
      }                                                                                                                                                                        
    }
    await supabase.from("playlist_items").delete().neq("position", -1);                                                                                                        
    const { error: iErr } = await supabase.from("playlist_items").insert(items);                                                                                               
    if (iErr) throw iErr;
                                                                                                                                                                               
    console.log(`Seeded ${aartis!.length} aartis, ${pls!.length} playlists, ${items.length} items`);
  }                                                                                                                                                                            
                                                            
  function emojiFor(d: string) {                                                                                                                                               
    return ({ Shiva: "🔱", Vishnu: "🌀", Krishna: "🪈", Rama: "🏹",
      Hanuman: "🐒", Ganesha: "🐘", Devi: "🌺", Lakshmi: "💰",                                                                                                                 
      Saraswati: "📖", Santoshi: "🌼", Ganga: "🌊",         
      Gayatri: "☀️ ", General: "🎶", Other: "🎵" } as Record<string, string>)[d] ?? "🎵";                                                                                       
  }                                                                                                                                                                            
                                                                                                                                                                               
  main().catch((e) => { console.error(e); process.exit(1); });                                                                                                                 
                                                            

