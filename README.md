# Midnight Event Fireworks Template

Standalone React + Vite template for creating a cinematic midnight event page with:

- Opening typed intro
- Sky-pan transition
- Fireworks scene
- Interactive candle scene
- Finale and epilogue sections

This copy was created from a personal project and sanitized for generic reuse.

## Quick start

1. Install dependencies:
   `npm install`
2. Run locally:
   `npm run dev`
3. Build production bundle:
   `npm run build`
4. Format the codebase:
   `npm run format`

## Main files to customize

- `src/components/OpeningScene.tsx`: intro typing lines
- `src/components/FireworksExperience.tsx`: main message lines
- `src/components/FinaleScene.tsx`: large finale headline
- `src/components/LetterSection.tsx`: long-form text section
- `src/components/MomentsSection.tsx`: event highlight cards
- `src/components/EndingScene.tsx`: closing lines
- `src/config.ts`: audio file paths
- `index.html`: page title and meta description

## Audio setup

Place your audio files in:

- `public/audio/music.mp3` (main track)
- optional ambience file in `public/audio/`

Then update `src/config.ts`:

- `musicUrl`: background music path
- `ambienceUrl`: optional ambience path (leave empty to disable)

## Personalization checklist

- Replace all placeholder texts with your event copy
- Update color palette/classes if needed
- Replace or add scenes/components as desired
- Add your own favicon/title in `index.html`
- Test on mobile and desktop (`npm run dev`)

## Notes

- Your original website remains unchanged.
- This folder is standalone and safe to edit independently.
