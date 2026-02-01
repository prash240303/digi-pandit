Let me re-read the PRD carefully to give you a thorough designer-style UI breakdown.Now I have everything. Here's the full designer-style UI description:

---

## DIGIPANDIT — UI Description & Layout Spec

---

### OVERALL TONE & VISUAL LANGUAGE

The app targets older adults and parents — so everything leans **warm, trustworthy, and uncluttered**. Think rich saffron and deep maroon as the dominant brand colors, soft cream/off-white backgrounds (not stark white), and large readable text throughout. No dense information. Generous spacing. Big tap targets everywhere. The feel should be close to a traditional temple aesthetic — dignified, calm, spiritually grounded — but rendered in a clean modern mobile UI. Not flashy. Not playful. Serene.

---

### ONBOARDING FLOW (Before the user ever hits the main app)

This is a linear, one-time flow. Three screens max, no scrolling on any of them.

**Screen 1 — Splash.** Full-screen. App logo centered. The name DIGIPANDIT in the brand typeface. A subtle tagline beneath it like "Your complete guide to Hindu traditions." Saffron-toned background or a soft gradient. Holds for 2–3 seconds, then auto-advances.

**Screen 2–4 — Onboarding Carousel.** Three swipeable screens, each explaining one core value of the app. Something like: "All your festivals, in one place" / "Mantras with perfect pronunciation" / "Find temples wherever you go." Each screen has a single illustrative visual (not a photo — a warm, hand-drawn or flat-design illustration), a headline, and one line of supporting text. A dot indicator at the bottom shows which of the three you're on. A "Skip" link sits in the top-right corner throughout.

**Screen 5 — Sign Up / Skip.** Options to create an account via Email, Google, or Apple sign-in. A clear "Skip for now" option below. No forced registration.

**Screen 6 — Permissions & Preferences.** Asks for Location (explained simply: "So we can find temples near you") and Notifications ("So you never miss a festival"). Below that, a quick preference picker: Region (North India / South India / East / West), Language (Hindi / English), and Date of Birth or Zodiac Sign. A "Continue" button at the bottom. This feeds personalization on the home screen.

---

### BOTTOM NAVIGATION BAR

This is the persistent anchor of the app. Five tabs, always visible at the bottom. Left to right:

**Home | Calendar | Mantras | Rituals | Temples**

Each tab has an icon above its label. The active tab is highlighted in the brand saffron/maroon. Inactive tabs are muted gray. The icons should be simple and recognizable — a house, a calendar page, a bell or hands-in-prayer, an open book, and a temple silhouette. No badges or notification dots in MVP except possibly on Calendar when a festival is coming up today.

---

### HOME SCREEN (Default landing screen after onboarding)

This is the **dashboard**. It's the only screen that pulls from every feature. It's designed to feel personalized from the moment the user lands here. It does **not** scroll endlessly — it's a curated summary, not a feed.

**Top bar:** Left side has a greeting — "Good morning, Meera" or just "Namaste" if no name is set. Right side has a profile icon (avatar or initials) that leads to settings/account.

**Hero banner / Today's card:** A prominent card just below the top bar. This is the most important piece of real estate on the screen. It shows what's relevant *today* — things like "Ekadashi today — fasting recommended" or "Maha Shivaratri in 3 days." If nothing special is happening today, it shows the next upcoming festival. This card has a subtle warm background, the name of the observance in large text, a one-line description, and a tap action that takes you deeper into that festival's detail.

**My Zodiac — a small summary card.** Below the hero, a compact card showing the user's own zodiac sign, their current monthly prediction in one sentence, and a "Read full prediction" link. This only shows if the user has set their DOB/sign during onboarding. If they haven't, it shows a gentle prompt: "Set your zodiac sign to get personalized predictions."

**My Favorites row.** A horizontal scrolling row of the user's bookmarked mantras and saved temples. If empty, it shows a soft prompt like "Start saving your favorites here." This makes return visits faster for the daily-use persona like Meera.

**Quick-access feature cards.** Four equal-sized cards in a 2x2 grid, each representing one of the four main features: Calendar, Mantras, Rituals, Temples. Each card has an icon, a short label, and maybe one line of "what's new" text (e.g., "2 festivals this week" on Calendar, or "Top pick: Hanuman Chalisa" on Mantras). Tapping any card takes you directly into that section.

**No ads on Home for free users** — the Home screen stays clean. Ads appear inside individual feature sections.

---

### CALENDAR SCREEN

**Top bar:** The word "Calendar" as the title. A region/tradition filter button on the right (lets you toggle between North Indian, South Indian, etc.).

**View toggle:** Just below the top bar, two options side by side — a calendar grid icon and a list icon. This lets the user switch between a monthly grid view and a scrollable list view. **The default view is the calendar grid.**

**Calendar grid (default):** A standard monthly calendar. Each day is a large, easy-tap cell. Days that have a festival or auspicious date are marked with a colored dot beneath the number — saffron for major festivals, a softer gold for minor observances. The current day is circled or highlighted distinctly. Left and right arrows (or swipe gesture) let you move between months. A month/year header sits above the grid.

**List view (alternate):** A vertical scrollable list of all upcoming festivals and auspicious dates, sorted chronologically. Each item is a row: the date on the left in bold, the festival name, and a small regional tag (e.g., "All India" or "South India"). Easier for scanning if you just want to know what's coming up.

**Tapping a festival date** opens a detail card (either a bottom sheet sliding up or a full detail screen). This card shows: festival name in large text, the exact date, a short paragraph on its significance, key rituals to observe, and a "Notify Me" button to set a reminder. If the user is on the free tier and tries to access deeper detail or yearly planning, a soft paywall prompt appears here.

---

### MANTRAS & AARTI SCREEN

**Top bar:** Title "Mantras & Aarti." A search icon on the right that expands into a search bar when tapped.

**Category filter row:** A horizontally scrollable row of pill-shaped filter buttons just below the top bar. These are deity-based: Shiva, Vishnu, Hanuman, Durga, Ganesha, Lakshmi, etc. An "All" pill is selected by default. Tapping one filters the list below. This row stays sticky as you scroll.

**Mantra list:** A vertical list of mantra/aarti cards. Each card shows: the title of the mantra, the deity it belongs to, the duration of the audio (e.g., "4 min 32 sec"), available languages (Sanskrit, Hindi, Regional), and a small play button on the right edge so users can preview without opening the full detail. Premium-only mantras have a small lock icon and a subtle "Premium" tag. Free users see these but get a paywall when they try to play them.

**Tapping a mantra card** opens the **Mantra Detail Screen:**

This is a full screen. The top section has the mantra title, deity name, and language options (tabs or a dropdown to switch between Sanskrit / Hindi / Regional). Below that is the **lyrics text** — displayed in a large, readable font, with the currently playing line highlighted or visually distinct. Below the lyrics is the **audio player**: a progress bar, play/pause button, and current time. The lyrics auto-scroll in sync with the audio as it plays. At the bottom, two action buttons: a heart/bookmark icon to save to favorites, and a download icon (premium only — free users see it grayed out with a lock).

A persistent mini audio player bar appears at the very bottom of the screen (above the nav bar) if the user navigates away while something is still playing. It shows the mantra name, a play/pause toggle, and a close button.

---

### RITUALS & FESTIVALS SCREEN

**Top bar:** Title "Rituals & Festivals." A search icon on the right.

**Category filter row:** Horizontally scrollable pills again, but this time organized by content type or theme: All, Festivals, Daily Rituals, Fasting, Puja Guides, etc.

**Featured section:** At the top of the scrollable content, one or two "featured" articles displayed as larger cards with an illustration or image, the article title, and a short description. These are editorially picked — likely tied to what's upcoming on the calendar (e.g., if Diwali is next month, a Diwali guide gets featured here).

**Article list:** Below the featured section, a standard vertical list of article cards. Each card has: a small illustrative thumbnail on the left, the article title, its category tag, and an estimated read time. Premium articles have a lock icon. Free users can see the first few lines but hit a paywall prompt mid-article when they've used up their 5 free article limit.

**Tapping an article** opens a clean, blog-style reading screen: large readable text, images/illustrations inline, step-by-step instructions broken into numbered sections with visual aids where relevant. A bookmark icon in the top-right lets users save it. The reading experience should feel calm and unhurried — generous line spacing, warm background tone.

---

### TEMPLE LOCATOR SCREEN

**Top bar:** Title "Temple Finder." A search/location bar below it where the user can type a city or pin code manually (important fallback if location permission is denied).

**Filter bar:** A row of filter options: by Deity (Shiva, Vishnu, Hanuman, etc.), by Distance (1 km, 3 km, 5 km, 10 km), and by Temple Type if applicable. These can be pill buttons or a collapsible filter panel.

**Map view (default):** A full-width map taking up most of the screen, showing the user's current location as a pin and nearby temples as distinct markers (temple-icon pins in saffron or maroon). The default radius shown is 5 km. The map is interactive — pinch to zoom, drag to pan.

**Tapping a temple marker** pulls up a **detail card** as a bottom sheet (slides up from the bottom, partially covering the map). This card shows: temple name, the deity it's dedicated to, distance from the user, opening and closing timings, a phone number or contact info, and two action buttons — "Get Directions" (opens Google/Apple Maps) and a heart icon to save to favorites. If the user scrolls down in this card, they can see reviews from other users (Phase 2 feature, but the space is reserved).

**Ad placement for free users:** A small banner ad sits at the very bottom of the screen, below the map or below the bottom sheet. It disappears for premium users.

---

### ZODIAC PREDICTIONS SCREEN

This screen is not in the bottom nav directly. It's accessed from the **Home screen's zodiac card** or could be tucked under a "More" option. But based on the PRD's user journeys, it behaves like a dedicated tab the user navigates to.

**Top bar:** Title "Zodiac Predictions." A small gear or edit icon that lets the user change their zodiac sign or DOB.

**User's sign hero:** A large card at the top showing the user's own zodiac sign (with its symbol and Sanskrit/Hindi name like "Mesha — Aries"), and their monthly prediction summary. This is the first thing they see — personal and immediate.

**Prediction categories:** Below the hero, the monthly prediction is broken into four sections, each as its own card or expandable section: Career, Health, Relationships, Finance. Each has a short readable paragraph. No charts, no numbers — just plain, reassuring text in a warm tone.

**Other signs:** Below the user's own prediction, a grid or list of the remaining 11 zodiac signs. Each is a compact card with the sign name and symbol. Tapping one shows that sign's monthly prediction (useful for checking on family members, as the narrative describes). **Yearly predictions** are locked behind the premium paywall — when a free user taps into yearly view, they see a blurred preview with an upgrade prompt.

**If no sign is set:** The entire screen shows a friendly prompt — "Tell us your zodiac sign to get started" — with a quick inline picker (just a date of birth field or a sign selector). No need to leave the screen to set it up.

---

### PROFILE / SETTINGS SCREEN

Accessed by tapping the profile icon in the top-right of the Home screen.

A simple, single-column settings list. Sections include: Account (name, email, sign-in method), Preferences (Region, Language, Zodiac sign/DOB), Notifications (toggle for festival alerts, choose how far in advance), Premium (current subscription status, upgrade button if free), and a Help/About section at the bottom. Clean, no visual clutter. Large tap targets on every row.

---

### GLOBAL ELEMENTS & PATTERNS

**Persistent mini audio player.** Whenever a mantra is playing and the user navigates away, a slim bar stays pinned just above the bottom nav bar. It shows the mantra name, play/pause, and a close (X) button. This is critical for the morning puja use case — Meera wants to play audio and then browse other parts of the app simultaneously.

**Paywall prompts.** These are not jarring full-screen blocks. They appear as soft, inline prompts — a blurred content preview with a card overlaid that says something like "Unlock the full experience" with a brief list of what premium includes and a single "Upgrade" button. Warm, not aggressive. The user can always dismiss and keep using free content.

**Offline state.** When there's no internet, cached content (previously viewed articles, downloaded mantras for premium users) still works. For features that need the network (map, predictions), a friendly banner appears: "You're offline — some features are unavailable." No crash, no blank screen.

**Accessibility.** Text sizes follow the device's dynamic text setting. All tap targets are large (minimum 44x44 points). High-contrast mode is supported. Audio alternatives exist where possible. The whole app is designed so that a 60-year-old with glasses on a bright afternoon can use it comfortably without squinting or mis-tapping.