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

## Admin portal
- Open http://localhost:3000/admin. The first time, it asks you to create the admin account (password 10+ characters). That setup page locks itself once an account exists.
- Sections: Dashboard, Products (with photo upload), Orders, Customers, Settings (shop name, contact, social links, map, GST).
- Everything is stored in `data/atollcart.db` (SQLite) and `data/uploads/`. This folder is git-ignored; back it up if the shop matters.
- Needs Node 22.5+ (it uses Node's built-in SQLite).
- The public shop has no checkout yet, so orders are entered by hand in the admin.

## Putting the shop online
The shop needs a real server (database + admin login), so GitHub Pages can't host it.
1. Push this repo to GitHub.
2. On a host such as Railway, Fly.io or Render, create a service from the repo (it uses the `Dockerfile`).
3. Add a persistent disk/volume mounted at `/data`, and set these variables:
   - `DATA_DIR=/data`
   - `ADMIN_SETUP_TOKEN=` a long random secret (needed once, to create the first admin account)
4. Deploy, open `/admin`, create the admin account straight away, then fill in Settings (shop name, contact, bank details, delivery fee).
Without the persistent disk the database is erased on every redeploy.

## Hosting on a Synology NAS (or any Docker machine)
Needs DSM 7.2+ with **Container Manager** and an Intel/AMD or 64-bit ARM NAS.
1. Copy the project folder to the NAS (for example `/volume1/docker/atollcart`), or `git clone` it over SSH.
2. Edit `docker-compose.yml` and replace `ADMIN_SETUP_TOKEN` with your own long random secret.
3. Container Manager → Project → Create → pick that folder → it builds from `docker-compose.yml` and starts the shop on port 3000.
4. Open `http://<nas-ip>:3000/` on your network. Your data is kept in the `shop-data` folder next to the compose file.
5. **For the internet, use HTTPS.** Logins use secure cookies, which browsers only accept over HTTPS. Easiest ways:
   - DSM → Control Panel → Login Portal → Advanced → Reverse Proxy: map `https://shop.yourname.synology.me` to `http://localhost:3000`, and add a free Let's Encrypt certificate in Security → Certificate (a free `*.synology.me` name comes from Control Panel → External Access → DDNS); forward ports 80/443 on your router; or
   - a Cloudflare Tunnel (no router changes, works behind CGNAT).
6. Open `/admin`, enter your setup token and create the admin account straight away.
