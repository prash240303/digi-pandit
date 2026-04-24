import * as FileSystem from "expo-file-system/legacy";
  import * as Crypto from "expo-crypto";
  import { Platform } from "react-native";                                                                                                                                       
   
  const CACHE_DIR = FileSystem.cacheDirectory + "aartis/";                                                                                                                     
  const MAX_CACHE_BYTES = 150 * 1024 * 1024;                
  const MIN_FREE_DISK_BYTES = 200 * 1024 * 1024;                                                                                                                               
                                                                                                                                                                               
  async function ensureDir() {
    const info = await FileSystem.getInfoAsync(CACHE_DIR);                                                                                                                     
    if (!info.exists) await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });                                                                                 
  }
                                                                                                                                                                               
  async function keyFor(url: string) {                                                                                                                                         
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, url);
  }                                                                                                                                                                            
                                                            
  async function dirSize(): Promise<number> {                                                                                                                                  
    const names = await FileSystem.readDirectoryAsync(CACHE_DIR).catch(() => []);
    let total = 0;                                                                                                                                                             
    for (const n of names) {                                
      const info = await FileSystem.getInfoAsync(CACHE_DIR + n);                                                                                                               
      if (info.exists && !info.isDirectory) total += info.size ?? 0;
    }                                                                                                                                                                          
    return total;                                           
  }                                                                                                                                                                            
                                                            
  async function evictIfNeeded(incoming: number) {
    let used = await dirSize();
    if (used + incoming <= MAX_CACHE_BYTES) return;                                                                                                                            
    const names = await FileSystem.readDirectoryAsync(CACHE_DIR);
    const items = await Promise.all(                                                                                                                                           
      names.map(async (n) => {                                                                                                                                                 
        const info = await FileSystem.getInfoAsync(CACHE_DIR + n);                                                                                                             
        return { path: CACHE_DIR + n, size: info.size ?? 0, mtime: info.modificationTime ?? 0 };                                                                               
      }),                                                                                                                                                                      
    );                                                                                                                                                                         
    items.sort((a, b) => a.mtime - b.mtime);                                                                                                                                   
    for (const it of items) {                                                                                                                                                  
      if (used + incoming <= MAX_CACHE_BYTES) break;        
      await FileSystem.deleteAsync(it.path, { idempotent: true });                                                                                                             
      used -= it.size;
    }                                                                                                                                                                          
  }                                                                                                                                                                            
   
  export async function getCachedAudio(url: string): Promise<string> {
    if (Platform.OS === "web") return url;
    await ensureDir();                                      
    const key = await keyFor(url);
    const localPath = `${CACHE_DIR}${key}.mp3`;
                                                                                                                                                                               
    const info = await FileSystem.getInfoAsync(localPath);
    if (info.exists && (info.size ?? 0) > 0) return localPath;                                                                                                                 
                                                                                                                                                                               
    const free = await FileSystem.getFreeDiskStorageAsync();                                                                                                                   
    if (free < MIN_FREE_DISK_BYTES) return url;                                                                                                                                
                                                                                                                                                                               
    const head = await fetch(url, { method: "HEAD" }).catch(() => null);                                                                                                       
    const expected = Number(head?.headers.get("content-length") ?? 0);
    if (expected) await evictIfNeeded(expected);                                                                                                                               
                                                            
    const { uri } = await FileSystem.downloadAsync(url, localPath);                                                                                                            
    return uri;                                             
  }                                                                                                                                                                            
                                                            
  export async function clearAudioCache() {                                                                                                                                    
    await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
  }                                                                                                                                                                            
                          