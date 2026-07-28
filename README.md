# For Alina

A cinematic, interactive apology experience built with React + Vite.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Add the music: drop your **Love Story** MP3 file into the `public/` folder
   and name it exactly `love-story.mp3` (I can't ship the actual copyrighted
   audio file, so this step is on you — any MP3 works, it just needs that
   filename). The music starts automatically the moment the heart in Scene 2
   is clicked.
3. Run it locally:
   ```
   npm run dev
   ```
   Then open the URL Vite prints (usually http://localhost:5173).

## Build for sharing

```
npm run build
```
This outputs a static site into `dist/` that you can deploy anywhere
(Vercel, Netlify, GitHub Pages, or just open `dist/index.html` directly).

## Editing the content

- The letter text lives in `src/App.jsx` inside the "SCENE 6" section.
- The healing quotes are in the `quotes` array in `src/App.jsx`.
- The sign-off name ("Huzaifa") appears in the letter and in the final scene
  text array — search and replace if needed.
- Colors, fonts, and layout are all in `src/style.css`.
