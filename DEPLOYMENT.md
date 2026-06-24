# Mission Green Plate — Deployment Guide

## Architecture

```
┌──────────────────────────────────────────────────┐
│                 MONOREPO MODE (Recommended)       │
│                                                   │
│   Browser → Railway/Render (Node.js)              │
│               ├── GET /* → frontend/dist/ (Vite)  │
│               └── /api/* → Express routes         │
│                   └── data/greenplate.db (SQLite) │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              SPLIT MODE (Optional)               │
│                                                   │
│   Browser → Vercel (frontend/dist/)               │
│   Browser → Railway (Express API only)            │
└──────────────────────────────────────────────────┘
```

---

## Option A: Railway (Full-Stack — Recommended)

One deployment, one URL. Express serves both the API and the static Vite build.

### Steps

**1. Push code to GitHub**
```bash
cd "mission green plate"
git init && git add . && git commit -m "Initial commit"
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

**2. Create Railway project**
- Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
- Select your repository
- Railway auto-detects `railway.json` and runs the build

**3. Add a Volume (for SQLite persistence)**
- In your Railway service → Storage → Add Volume
- Mount path: `/data`
- Update the backend `.env` (via Railway Variables):

```
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate a strong secret>
DEMO_MODE=true
DEMO_RESET_SECRET=your_reset_secret
```

**4. Done!**
- Railway gives you a URL like `https://mission-green-plate-production.up.railway.app`
- Visit it → the app runs immediately with seed data

---

## Option B: Render (Full-Stack)

`render.yaml` at the project root is pre-configured.

### Steps

**1. Push to GitHub** (same as above)

**2. Create Render Web Service**
- Go to [render.com](https://render.com) → New → Web Service
- Connect your GitHub repo
- Render reads `render.yaml` automatically

**3. Set Environment Variables** in Render dashboard:
```
NODE_ENV=production
JWT_SECRET=<strong secret>
DEMO_MODE=true
```

**4. The Disk** in `render.yaml` auto-mounts `/opt/render/project/src/data`
- SQLite file persists across deploys

---

## Option C: Vercel (Frontend) + Railway (API)

Use this if you want Vercel's CDN for the frontend.

### Backend on Railway (API only)

Same as Option A, but set `NODE_ENV=api` (Express won't serve static files):
```
NODE_ENV=api
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend on Vercel

```bash
cd frontend
npm run build   # test the build locally first
```

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory**: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
6. Deploy → `vercel.json` handles SPA routing (`/*` → `index.html`)

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | Yes (prod) | `production` or `development` |
| `JWT_SECRET` | **Yes** | Secret for signing JWTs — use a long random string in production |
| `FRONTEND_URL` | Split mode | Frontend URL for CORS (e.g. `https://app.vercel.app`) |
| `DEMO_MODE` | No | `true` to enable demo features |
| `DEMO_RESET_SECRET` | No | Secret for `POST /api/demo/reset` endpoint |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Split mode only | Backend API URL (e.g. `https://api.railway.app/api`) |

> In monorepo mode, `VITE_API_URL` is not needed — the frontend and API share the same origin.

---

## Demo Accounts

| Role | Username | Password | Classroom |
|------|----------|----------|-----------|
| ครู | `teacher01` | `password123` | 3/1 |
| ครู | `teacher02` | `password123` | 3/2 |
| นักเรียน ⭐ | `32002` | `pass32002` | 3/2 (Perfect score!) |
| นักเรียน | `31001` | `pass31001` | 3/1 |
| นักเรียน | `31002` | `pass31002` | 3/1 |
| นักเรียน | `32005` | `pass32005` | 3/2 |

---

## IoT Simulator (Demo Panel)

The floating **📡 IoT Simulator** button (bottom-right) lets you simulate RFID scans without hardware.

**Demo flow to showcase:**
1. Login as **student** (`32002`)
2. Open IoT Simulator → select the same student → **กินไม่หมด** → Simulate Scan
   - Watch the game lock instantly
3. Open IoT Simulator → same student → **กินหมด** → Simulate Scan
   - Game unlocks, points increase, notifications appear
4. Use skill buttons to attack the monster
5. Login as **teacher** (`teacher01`) and see the roster update in real-time

---

## Resetting Demo Data

### Option 1: API call
```bash
curl -X POST https://your-app.railway.app/api/demo/reset \
  -H "Content-Type: application/json" \
  -d '{"secret":"reset_greenplate_demo"}'
```

### Option 2: Delete database and restart
```bash
# On Railway: use the Railway CLI
railway run rm data/greenplate.db && railway run node backend/db/init.js

# Locally:
rm data/greenplate.db
node backend/db/init.js
```

### Option 3: Force re-seed (keeps file, overwrites data)
```bash
node backend/db/init.js --reset
```

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Set `DEMO_RESET_SECRET` to something non-default
- [ ] Configure a Railway/Render Volume for SQLite persistence
- [ ] Test `GET /api/health` returns `{ status: "ok" }`
- [ ] Test login with demo accounts
- [ ] Test IoT Simulator Panel → verify real-time updates
