# RFP Insights Dashboard (Frontend)

This is the React + Vite dashboard that uploads PDFs, starts processing jobs, and shows every extracted trait plus evidence. Follow the steps below like a checklist.

---

## 1. What you need first

### Linux / Ubuntu
```bash
sudo apt update
sudo apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Node 20.19+ or 22.12+ is required.

### Windows 11 / 10
Open **PowerShell** and run:
```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```
Close and reopen PowerShell so `node` and `npm` are available.

You also need the backend running somewhere (default `http://localhost:8000`). See the backend README for setup.

---

## 2. Clone the repo
```bash
git clone https://github.com/harish-bodduna/rfp_insights_dashboard.git
cd rfp_insights_dashboard
```

---

## 3. Install dependencies
```bash
npm install
```
This downloads all packages into `node_modules`.

---

## 4. Tell the UI where the API lives
Create `.env.local` (or edit it if it already exists) and point it at your backend URL.

### Linux / Ubuntu
```bash
cp env.example .env.local   # creates the file if it does not exist
printf 'VITE_API_BASE_URL=http://localhost:8000\n' > .env.local
```

### Windows (PowerShell)
```powershell
copy env.example .env.local
Set-Content -Path .env.local -Value "VITE_API_BASE_URL=http://localhost:8000"
```

If you need to hit the backend from another machine, replace `localhost` with that machine’s LAN IP (for example `http://192.168.0.191:8000`).

---

## 5. Run the app

### Development mode (hot reload)
```bash
npm run dev -- --host 0.0.0.0 --port 5173
```
- On the same machine open `http://localhost:5173`.
- From another device on the same network use `http://<your-ip>:5173`.

### Production preview
```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

---

## 6. What you should see
1. Upload section lets you pick PDFs and send them to the backend.
2. Uploaded list shows statuses (`Uploaded`, `In Flight`, `Processing`, `Completed`, `Failed`).
3. Processed list + Summary table display every trait with value + evidence inline.
4. CSV export button downloads the currently visible table.

If the UI shows “Network Error”, double-check `.env.local` and ensure the backend URL is reachable from your browser (try `curl http://<backend>/health`).

---

## 7. Handy commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Compiles for production |
| `npm run preview` | Serves the production bundle locally |
| `npm run lint` | Runs ESLint (optional) |

---

## 8. Tips for 0-to-hero setup
- Keep the backend and frontend in separate terminals so logs are easy to read.
- If Node complains about the version, install the latest LTS and rerun `npm install`.
- When exposing to a LAN, make sure firewalls allow ports 8000 (backend) and 5173 (frontend).
- Copy `.env.local` between machines if you need identical settings.

Follow the checklist once and you’ll have the dashboard running even if you’ve never touched Vite before.
