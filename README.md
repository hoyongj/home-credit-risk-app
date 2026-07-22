# home-credit-risk-app

Loan approval web app with a React frontend and FastAPI backend.

## 🚀 1. To run everything (Frontend + Backend)
Make sure you are in the main project folder and type this:

```sh
docker compose up --build
```

*(To stop it later, just click on the terminal and press `Ctrl + C`!)*

👉 **Enter here:** [http://localhost:3000](http://localhost:3000)

---

## 🎨 2. To run the frontend only (You'll use this the most!)

When you just want to edit the design and UI, use these commands:

```sh
cd front
npm install # one time installation
npm run dev

```

Once you run it, you'll see a link like [http://localhost:5173](http://localhost:5173) in the terminal. Just click it or copy-paste it into your browser to see our site!

> **Tip:** The best part is the screen will update automatically every time you save your code. Let me know if you get stuck!

---

## 🌍 3. Deploying to production (Cloudflare Pages + Render)

The same code runs locally (Docker) and in production — the only difference is two environment variables. Nothing needs to be forked or rewritten per host.

- Locally, the frontend calls a relative `/api/...` path, which nginx (in `front/Dockerfile`) proxies to the backend container.
- In production, the frontend calls the Render backend's URL directly, via the `VITE_API_URL` build-time env var.

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com) from this repo.
2. Set **Root Directory** to `back`.
3. Set **Environment** to **Docker** (Render will detect `back/Dockerfile` automatically). Render injects a `$PORT` env var at runtime and the Dockerfile already binds to it, so no start command is needed.
4. Add an environment variable:
   - `ALLOWED_ORIGINS` = your Cloudflare Pages URL (e.g. `https://your-app.pages.dev`) — see `back/.env.example`.
5. Deploy. Note the resulting service URL (e.g. `https://your-api.onrender.com`) — you'll need it for the frontend below.

### Frontend → Cloudflare Pages

1. Create a new project on [Cloudflare Pages](https://pages.cloudflare.com) from this repo.
2. Set **Root directory** to `front`.
3. Set **Build command** to `npm run build`, and **Build output directory** to `dist`.
4. Add an environment variable:
   - `VITE_API_URL` = your Render backend URL from above (e.g. `https://your-api.onrender.com`) — see `front/.env.example`. No trailing slash.
5. Deploy.

`front/Dockerfile` and `docker-compose.yml` aren't used by Cloudflare Pages or Render's Docker deploy of the backend — Pages builds the static site directly, and Render builds `back/Dockerfile` itself. They only matter for local development.

---
