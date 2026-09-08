# Timothy Joshua Ago-Larsey — Portfolio (Full-Stack)

A dynamic portfolio site with a real backend: Node.js + Express API, a SQLite
database, full CRUD on every content type, and an admin dashboard for editing
everything without touching code.

## Stack

- **Backend:** Node.js, Express
- **Database:** SQLite (via `better-sqlite3`) — a single file, no server to run
- **Auth:** none — the public site and the admin dashboard are both open, no login anywhere (see the security note below)
- **Frontend:** Vanilla HTML/CSS/JS (no build step) — fetches everything from the API at page load
- **Admin dashboard:** `/admin` — add/edit/delete for every section of the site, no login required

## What's dynamic

Nothing on the public site is hardcoded. Every section — hero/profile, stats,
skills, services, projects, blog, references, FAQs — is a database table you
edit from `/admin`, read live by the homepage on every visit.

## Project structure

```
portfolio-site/
├── server.js              # Express app entrypoint
├── db/
│   ├── database.js        # schema (all tables)
│   ├── seed.js            # first-run seed data (from your CV) — safe to re-run
│   └── portfolio.db       # created automatically on first run (gitignored)
├── routes/                 # one file per resource + a generic CRUD factory
└── public/
    ├── index.html          # the public site
    ├── admin.html           # the admin dashboard
    ├── css/, js/            # styles + fetch/render logic
    └── assets/              # your CV PDF lives here
```

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Then open:
- **http://localhost:3000** — the public site
- **http://localhost:3000/admin** — the admin dashboard

First run automatically creates and seeds the database.

## ⚠️ Keeping `/admin` private

There's no login on this app — anyone who loads `/admin` (or hits the API
directly with `curl`) can add, edit, or delete anything on your site,
including your profile info. That's fine for a personal portfolio as long as
you're deliberate about who can find that URL. A few ways to add a real layer
of protection without touching the app's code:

- **Don't link to it anywhere public** — I removed the footer link on the homepage; bookmark `/admin` yourself instead.
- **Basic Auth at the host/proxy level** — most hosts (Render, Railway, Nginx, Caddy) let you put a username/password prompt in front of a specific path like `/admin` without the app knowing about it at all. This is the most reliable option if the site is genuinely public.
- **IP allowlisting** — if you'll only ever edit from your own devices, some hosts let you restrict a path to specific IPs.

If any of that sounds like more than you want to deal with, the original
version of this project (JWT login + password on `/admin`) is easy to bring
back — just say the word.

## Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Port the server listens on (default 3000) |

⚠️ `.env` is in `.gitignore` on purpose — never commit it, even though it's
just a port number today; it's a good habit for when you add real secrets later.

## A privacy note on the References section

Your CV lists three references with their personal email/phone. I seeded them
into the database, but set `contact_visible` to **off** by default, so the
public site currently shows just their name, title, and organization — not
their contact details. That's a judgment call to avoid putting your
references' personal contact info on the open internet without asking them
first. If you'd rather show full contact info (or remove them entirely),
that's editable from `/admin` → References.

## Deploying it

This is a single Node.js process serving both the API and the static
frontend, so it deploys as one service. A few good options:

**Render / Railway / Fly.io** (easiest — free tiers available)
1. Push this folder to a GitHub repo (making sure `.env` and `node_modules` stay out — see `.gitignore`)
2. Create a new "Web Service" from the repo
3. Build command: `npm install` · Start command: `npm start`
4. Set `PORT` in the host's environment variable settings if it doesn't auto-detect one (most platforms set this for you)
5. **Important:** SQLite writes to a file on disk. Render/Railway's default filesystem is ephemeral on redeploy — add a persistent volume/disk mounted at the `db/` folder (both platforms support this) so your edits survive deploys.

**A VPS (e.g. DigitalOcean, a university server, etc.)**
1. `git clone` your repo, `npm install`, set up `.env`
2. Run it behind a process manager so it survives reboots: `npm install -g pm2 && pm2 start server.js --name portfolio && pm2 save && pm2 startup`
3. Put Nginx in front for HTTPS (Let's Encrypt via `certbot`) and to proxy port 80/443 → 3000

**Note:** Vercel/Netlify won't work well here as-is — they're built for
stateless serverless functions, and this app needs a persistent SQLite file
on disk. Render, Railway, Fly.io, or a plain VPS are the right fit.

## Extending it

To add a new content type (say, "Certifications"):
1. Add a `CREATE TABLE` block in `db/database.js`
2. Add a seed block in `db/seed.js` (optional)
3. Mount a route in `server.js`: `app.use('/api/certifications', crudRouter('certifications', ['name', 'issuer', 'year']))` — CRUD comes for free
4. Add a matching entry to `RESOURCES` in `public/js/admin.js` so it shows up in the dashboard
5. Add a render function + section in `public/index.html` / `public/js/main.js` to display it publicly
