# Sharath Chandra — Creative Portfolio

Static portfolio featuring selected video editing, motion design, and wedding films.

## Run locally

From the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open http://localhost:8000.

## Deploy to Vercel

Import this GitHub repository into Vercel. Use the repository root, the **Other** framework preset, and `dist` as the output directory. No install or build command is needed; `vercel.json` includes these settings.

The deployable site and its assets are in `dist/`. Python helper scripts and the reference screen recording are retained in the repository for editing the portfolio. Project videos open from the linked Google Drive archive.
