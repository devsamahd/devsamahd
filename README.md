# Abdulsamad’s portfolio

Backend/platform portfolio with a private content and CV studio.

- Run: `npm install && npm run dev`
- Edit: `/studio`; tailor CVs, save presets, and export Word/text/PDF at `/studio/cv`.
- Check: `npm test && npm run build`

Local Studio opens on localhost. Production needs the secrets in `.env.example` and a Node.js server with persistent disk at `CMS_DATA_DIR` (not an ephemeral/serverless filesystem). Back up that directory. Initial portfolio content: `data/portfolio.json`.

Optional AI tailoring uses `OPENAI_API_KEY` and `OPENAI_MODEL`. Without them, manual editing, presets, and exports still work. AI suggestions require review before use.
