# 小姐牌 (K Cup)

A visually immersive card game where players draw cards from a circular deck. Includes Kings Cup and Miss Card game modes.

Built with React 19 + TypeScript + Vite + Tailwind.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes `npm`)

## Quick start (macOS / Linux)

```bash
git clone https://github.com/hzhong26/k-cup.git
cd k-cup
./install.sh
```

Open a new terminal (or `source ~/.zshrc`), then anywhere on your machine type:

```bash
play k cup
```

That's it — dependencies install on first run, the dev server starts, and your browser opens to [http://localhost:3000](http://localhost:3000). Press `Ctrl+C` to stop the server.

The `install.sh` script adds a `play` function to your `~/.zshrc` (or `~/.bashrc`) with the repo path baked in. Re-running it is safe.

## Manual launch (any platform)

If you don't want the shortcut, or you're on Windows:

```bash
git clone https://github.com/hzhong26/k-cup.git
cd k-cup
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build      # production bundle in dist/
npm run preview    # preview the production build locally
```
