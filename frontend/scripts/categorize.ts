import fs from "node:fs";                                                                                                                                                    
  import path from "node:path";                             
                                                                                                                                                                               
  type Deity =
    | "Shiva" | "Vishnu" | "Krishna" | "Rama" | "Hanuman"                                                                                                                      
    | "Ganesha" | "Devi" | "Lakshmi" | "Saraswati"                                                                                                                             
    | "Santoshi" | "Ganga" | "Gayatri" | "General" | "Other";
                                                                                                                                                                               
  const RULES: [RegExp, Deity][] = [                                                                                                                                           
    [/hanuman|chalisa|bajrang/i, "Hanuman"],                                                                                                                                   
    [/ganesh|vinayak|ganapati/i, "Ganesha"],                                                                                                                                   
    [/shiv|mahadev|shambhu|omkara|rudra/i, "Shiva"],                                                                                                                           
    [/krishna|gopal|kunj bihari|govind/i, "Krishna"],                                                                                                                          
    [/ram\b|ramayan|raghav/i, "Rama"],                                                                                                                                         
    [/lakshmi|laxmi/i, "Lakshmi"],                                                                                                                                             
    [/saraswati/i, "Saraswati"],                                                                                                                                               
    [/santoshi/i, "Santoshi"],                                                                                                                                                 
    [/gange|ganga mata/i, "Ganga"],                                                                                                                                            
    [/gayatri/i, "Gayatri"],                                                                                                                                                   
    [/ambe|gauri|durga|kali|devi|mata\b/i, "Devi"],                                                                                                                            
    [/vishnu|jagdish|narayan/i, "Vishnu"],                                                                                                                                     
  ];                                                                                                                                                                           
                                                                                                                                                                               
  function cleanTitle(filename: string) {                                                                                                                                      
    return filename                                                                                                                                                            
      .replace(/\.mp3$/i, "")                               
      .replace(/_spotdown\.org$/i, "")
      .replace(/_/g, " ")                                                                                                                                                      
      .trim();
  }                                                                                                                                                                            
                                                            
  function classify(filename: string): Deity {                                                                                                                                 
    for (const [re, deity] of RULES) if (re.test(filename)) return deity;
    if (/aarti|bhajan|mantra/i.test(filename)) return "General";                                                                                                               
    return "Other";                                                                                                                                                            
  }                                                                                                                                                                            
                                                                                                                                                                               
  const raw = JSON.parse(                                   
    fs.readFileSync(path.resolve("music_data/songs.json"), "utf-8"),
  ) as string[];                                                                                                                                                               
  
  const rows = raw.map((file) => ({                                                                                                                                            
    storage_path: file,                                     
    title: cleanTitle(file),                                                                                                                                                   
    deity: classify(file),                                  
  }));

  fs.writeFileSync(                                                                                                                                                            
    path.resolve("music_data/aartis.seed.json"),
    JSON.stringify(rows, null, 2),                                                                                                                                             
  );                                                        
  console.table(rows);
