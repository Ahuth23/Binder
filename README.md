# Binder

An offline first Pokémon TCG binder and deck workbench. One HTML file, no accounts, no server, no subscription. Your collection lives in your browser's local database (IndexedDB) and works with no signal; card data and market prices come from the free, open source TCGdex API whenever you are online.

## What is in the folder 

| File | Purpose |
|---|---|
| `index.html` | The whole app (HTML, CSS and JavaScript in one file) |
| `sw.js` | Service worker: keeps the app shell and card art available offline |
| `manifest.webmanifest` | Lets phones install it as a home screen app |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons |

## Getting it running

The app is plain static files, so anything that serves files over https works. Two easy free options:

**GitHub Pages (recommended, permanent URL)**
1. Create a new public repository on github.com, for example `binder`.
2. Upload all six files to the root of the repository.
3. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)` → Save.
4. After a minute your app is at `https://<your-username>.github.io/binder/`.

**Netlify Drop (fastest, no account needed to try)**
1. Go to app.netlify.com/drop.
2. Drag the folder onto the page. You get a URL immediately.

**Just double-click `index.html`** also works on a Mac for a quick look. Everything except the offline service worker runs on `file://`, so this is fine for trying it, but use a hosted URL for daily use so the browser treats it as a real site and keeps its storage.

## Putting it on your iPhone

Open the hosted URL in Safari → Share button → **Add to Home Screen**. It then opens full screen like a native app, keeps its own storage, and works offline. On a Mac, Safari's File → Add to Dock or Chrome's "Install app" do the same.

The first launch needs a connection: it downloads the list of every set (a few hundred KB) and caches it. After that only new lookups, name searches, scans and price refreshes need the network.

## Using it

**Add tab.** Pick the set (type any part of its name, its code like SVI or MEW, or its number), type the number printed before the slash on the card, and press Look up. The card appears with every finish TCGdex knows for that print (Normal, Holo, Reverse holo, plus a catch all "Other finish" for stamped and pattern variants). Choose the finish, quantity and optional condition, then add. "By name" searches every card ever printed. "Scan" uses the camera and reads the collector number and set code off the bottom of the card, then shows the matches so you confirm one; typing set + number is still the fastest path.

**Binder tab.** Search, filter by set / finish / type, sort, and tap any card for the full details: attacks, abilities, weakness, resistance, retreat, regulation mark, market prices per finish, and steppers to change how many you own. Refresh prices from the button at the top (it skips anything fetched in the last six hours).

**Decks tab.** Build decks from your binder or from every card. Standard, Expanded and Unlimited formats. Checks: 60 cards, max 4 with the same name (basic Energy exempt), one ACE SPEC, one Radiant, one of each Prism Star, at least one Basic Pokémon, and rotation by regulation mark. Older prints of reprinted cards (Rare Candy, Professor's Research, basic Energy from any set) are recognised as legal: when online the app looks up whether an identical current print exists and remembers the answer. Each row shows how many you own versus how many the deck needs, with the cost to complete. Export writes the Pokémon TCG Live text format; Import list pastes one back in (Live, Limitless and most decklist sites use the same format).

**Settings tab.** Price source (TCGplayer $ or Cardmarket €), the lowest legal regulation mark for Standard (H for the 2026 season; bump it each April), whether "same name from any set" or "exact print" counts as owned for decks, offline image caching, and your data: **Back up** downloads a JSON of everything, **Restore** merges one back in, **Export CSV** gives a spreadsheet of your collection with prices.

## Good to know

- Make a backup now and then (Settings → Back up) and keep it somewhere like iCloud Drive. Browsers can evict site data if a site is not opened for a long time; the app asks for persistent storage and installed home screen apps are much safer, but the JSON backup is the real safety net. It also moves your binder between devices.
- Prices are TCGdex's mirror of TCGplayer and Cardmarket market data. They are indicative, can lag a day, and very occasionally two printings map to the same listing. Cardmarket only splits "normal" and "foil", so holo and reverse holo share a price there.
- Legality checks follow the printed regulation marks and the reprint rule. Promo card quirks and any banned list are not tracked, so check the official list before an event.
- Card data is fetched live from `api.tcgdex.net`, and card art from `assets.tcgdex.net`. If a lookup fails with an odd message, the API format may have shifted; the error text is enough to fix it.
- Nothing is ever uploaded. There is no analytics, no account and no sync; your data stays in the browser it was entered in unless you back it up.
