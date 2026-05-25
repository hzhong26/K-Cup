# 小姐牌 (K Cup)

A visually immersive social card game web app with two playable modes — 小姐牌 (Miss Card) and King's Cup. Built with React 19, TypeScript, Vite, and Tailwind CSS. No backend, no API keys, no accounts — clone, install, and play in your browser.

## Game Modes

### 小姐牌 · Miss Card

A Chinese-style social drinking game played from a **circular deck of 52 cards**. Players take turns drawing from the ring; each rank triggers a specific rule (designate a drinker, become the "Miss," willow-tree-twist chant, skip-on-seven, etc.). If the visual chain of cards breaks, play pauses until the circle is re-formed. Each card's rule is shown in **both Chinese and English** so mixed-language groups can play together.

### King's Cup · Ring of Fire

The classic Western drinking game played from a **stacked deck**. Each rank has a rule (Waterfall, Categories, Never Have I Ever, Question Master…). Four Kings end the game — drawing the fourth King means you drink the cup. Features a pour animation when each King is drawn and a live Kings-drawn counter in the header.

## Features

- **Two complete game modes** sharing one engine.
- **Bilingual rules** for 小姐牌 — Chinese title and description with English translation rendered beneath.
- **In-game rule panel** that appears when a card is drawn so players don't have to open the rulebook each round.
- **Always-accessible rules sidebar** listing every rank with full descriptions.
- **Two themes**: Dark (zinc/charcoal) and Classic (green felt table), switchable mid-game.
- **Responsive layout** — works on desktop and mobile, scales the card ring/stack to the viewport.
- **Smooth animations**: card draw, discard pile fade, chain-break notification, King-drawn pour, theme cross-fade.
- **`play k cup` shell shortcut** — type two words from anywhere in your terminal to launch the game.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes `npm`)

## Quick start (macOS / Linux)

```bash
git clone https://github.com/hzhong26/k-cup.git
cd k-cup
./install.sh
```

Open a new terminal (or `source ~/.zshrc`), then from anywhere:

```bash
play k cup
```

That's it — dependencies install on first run, the Vite dev server starts, and your default browser opens to [http://localhost:3000](http://localhost:3000). Press `Ctrl+C` in the terminal to stop the server.

The `install.sh` script adds a `play` function to your `~/.zshrc` (or `~/.bashrc`) with the repo path baked in. Re-running it is safe — it replaces any previous block instead of stacking duplicates.

## Manual launch (any platform, including Windows)

```bash
git clone https://github.com/hzhong26/k-cup.git
cd k-cup
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## How to play

1. From the home page, click **小姐牌** or **King's Cup**.
2. **Draw a card** by clicking any card in the deck. The drawn card flips to the center.
3. The **rule panel** appears below the card with the rank, title, and full description (Chinese + English for Miss Card).
4. Follow the rule with your group, then **click the center card** to discard it.
5. Open **Rules** from the header anytime to see the full ranks-to-rules list.
6. Use the **sun/moon icon** to toggle between dark and classic themes.
7. **Reset** clears the game and reshuffles the deck.

In 小姐牌, watch for the **chain-broken** notice — if the ring of remaining cards has a visible gap, click the prompt to re-form the circle before continuing.

## Scripts

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start the Vite dev server at `localhost:3000`  |
| `npm run build`  | Type-check and produce a production bundle in `dist/` |
| `npm run preview`| Serve the built bundle locally                 |

## Tech stack

- **React 19** with hooks and function components
- **TypeScript** (strict)
- **Vite 6** for dev server and bundling
- **Tailwind CSS** via CDN (no build step for styles)
- **Inter** + **Crimson Text** Google Fonts

## Project structure

```
.
├── App.tsx                       # Root, routes between HomePage / games
├── HomePage.tsx                  # Game selection menu
├── MissCardGame.tsx              # 小姐牌 — circular deck + chain mechanic
├── KingsCupGame.tsx              # King's Cup — stacked deck + King counter
├── components/
│   ├── PlayingCard.tsx           # Single card with flip animation
│   ├── RulesSidebar.tsx          # Full rules drawer
│   └── CardRuleDisplay.tsx       # Floating rule panel for the active card
├── utils/
│   ├── deck.ts                   # 52-card deck generation
│   └── gameRules.ts              # Rule data for both games
├── types.ts                      # Suit / Rank / CardStatus / Theme enums
├── install.sh                    # Registers the `play k cup` shell shortcut
├── index.html                    # Vite entry HTML
├── index.tsx                     # React root mount
└── vite.config.ts                # Vite config (no env vars needed)
```

## Adding a new rule or game mode

Rules live in [`utils/gameRules.ts`](utils/gameRules.ts) as plain `GameRule[]` arrays. Each rule needs a `rank` (`A`–`K`), a `title`, and a `desc`. Optional `titleEn` and `descEn` add an English translation that the rules sidebar and in-game rule panel both render automatically when present.
