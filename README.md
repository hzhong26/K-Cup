# 小姐牌 (K Cup)

A visually immersive card game where players draw cards from a circular deck. Includes Kings Cup and Miss Card game modes.

Built with React 19 + TypeScript + Vite + Tailwind.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes `npm`)

## Install

```bash
git clone https://github.com/hzhong26/k-cup.git
cd k-cup
npm install
```

## Launch

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Optional: `play k cup` shortcut (macOS / Linux)

Add this function to your `~/.zshrc` (or `~/.bashrc`) to launch the game from anywhere by typing `play k cup`:

```bash
play() {
    local game
    game="$(echo "$*" | tr '[:upper:]' '[:lower:]')"
    case "$game" in
        "k cup"|"kcup"|"kings cup"|"k-cup")
            ( sleep 2 && open "http://localhost:3000" ) &
            ( cd "/path/to/k-cup" && npm run dev )
            ;;
        *)
            echo "Unknown game: $*"
            ;;
    esac
}
```

Replace `/path/to/k-cup` with the actual path to your cloned repo, then run `source ~/.zshrc`.

## Build

```bash
npm run build      # production bundle in dist/
npm run preview    # preview the production build locally
```
