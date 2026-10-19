# Maldivian Online Shop — Coming Soon (MVP)

Only the public "Coming Soon" landing page is built. No cart, checkout, admin, POS or backend exists yet.

## Run it (beginner steps)
1. Install Node.js (LTS) from https://nodejs.org (or `brew install node`).
2. Open a terminal in this folder and run `npm install`.
3. Run `npm run dev`, then open http://localhost:3000.
4. Before sharing: `npm run lint` and `npm run build`.

## Change branding
Edit `src/config/site.ts` (name, logo, contact, social links, address, map URL). Empty values are hidden automatically. Colours are in `tailwind.config.ts`.

## Notes
- Product cards use illustrative sample data in `src/lib/preview-products.ts`.
- `/terms` and `/privacy` are draft placeholders to be reviewed before launch.
