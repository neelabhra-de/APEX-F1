# 🏎️ APEX — The Race, Beyond the Flag.

> A cinematic F1 frontend experience built with React, Three.js, GSAP and real Formula 1 data.

**APEX** is a frontend-focused Formula 1 experience designed around one idea:

**What if an F1 website felt like the sport itself — rather than another dashboard?**

Instead of starting with tables, cards and statistics, APEX starts with **machines, atmosphere, motion and storytelling**, and gradually transitions into real F1 data.

🌐 **Live:** https://apex-f1.vercel.app
📦 **Repository:** https://github.com/neelabhra-de/APEX-F1

---

## ✦ The Experience

APEX is structured around three stages:

```text
THE MACHINES
      ↓
THE TRIBES
      ↓
THE GRID
```

### THE MACHINES

A cinematic opening sequence built around four F1 teams:

* Ferrari — **LEGACY**
* Red Bull Racing — **AGGRESSION**
* McLaren — **AMBITION**
* Mercedes — **PRECISION**

The sequence uses real-time 3D rendering, scroll-driven choreography, camera movement, lighting transitions and layered typography.

The four teams eventually converge into the **APEX** identity.

---

### THE TRIBES

Formula 1 isn't only about the cars.

It's also about the people behind them.

The Tribes section explores four fan identities:

* **Tifosi Dreams**
* **Orange Army**
* **Silver Arrows**
* **Red Bull Fans**

The section combines horizontal scroll choreography, image parallax, typography and interactive hover states to create a more editorial experience.

---

### THE GRID

After the cinematic opening, APEX transitions into real Formula 1 information.

The current Grid experience includes:

* **Next Race**
* Race countdown
* Circuit information
* Weekend session schedule
* Driver Championship standings
* Constructor Championship standings
* Last Race results
* Expandable race classifications
* Responsive layouts

The data is sourced from the **OpenF1 API** through an Express backend.

---

# ⚡ Tech Stack

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Three.js**
* **React Three Fiber**
* **Drei**
* **GSAP**
* **GSAP ScrollTrigger**
* **Framer Motion**
* **Lucide React**

## Backend

* **Node.js**
* **Express**
* **TypeScript**
* **OpenF1 API**

## Deployment

* **Vercel** — Frontend
* **Render** — Backend

---

# 🧠 Architecture

APEX uses a separate frontend and backend architecture.

```text
                         ┌─────────────────┐
                         │     Browser     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Vercel      │
                         │ React / Vite    │
                         └────────┬────────┘
                                  │
                             /api/f1/*
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Render      │
                         │ Node / Express  │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    OpenF1 API   │
                         └─────────────────┘
```

The browser does not communicate directly with OpenF1.

Instead:

```text
Frontend
   ↓
Express API
   ↓
OpenF1
```

This keeps the data layer centralized and gives the project a foundation for future expansion.

---

# 🎬 Cinematic System

The Machines section is built around a shared 3D rendering architecture rather than separate canvases for every scene.

The experience uses:

* One shared React Three Fiber canvas
* Scroll-driven scene progress
* GSAP ScrollTrigger
* Shared camera choreography
* Dynamic lighting
* GLB vehicle models
* Scene-specific typography
* Reversible scroll transitions
* Responsive and reduced-motion behavior

### Scene progression

```text
FORMULA 1 / 2026
        ↓
FERRARI / LEGACY
        ↓
RED BULL / AGGRESSION
        ↓
McLAREN / AMBITION
        ↓
MERCEDES / PRECISION
        ↓
APEX
```

The animation system is designed around continuous progress rather than independent irreversible animations, allowing the experience to remain stable while scrolling forwards or backwards.

---

# 🏁 F1 Data Layer

APEX currently exposes the following backend endpoints:

```text
GET /api/f1/next-race
GET /api/f1/season
GET /api/f1/drivers
GET /api/f1/standings/drivers
GET /api/f1/standings/teams
GET /api/f1/last-race
```

The frontend communicates with the API through:

```text
client/src/data/f1/f1Api.ts
```

The backend is organized into:

```text
server/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── types/
└── ...
```

The frontend normalizes API responses into APEX-specific types before presenting them.

---

# 📁 Project Structure

```text
APEX F1/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── models/
│   │   ├── data/
│   │   │   └── f1/
│   │   ├── sections/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   │
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Running Locally

## Prerequisites

* Node.js
* npm
* Git

Clone the repository:

```bash
git clone https://github.com/neelabhra-de/APEX-F1.git
cd APEX-F1
```

---

## 1. Install frontend dependencies

```bash
cd client
npm install
```

---

## 2. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 3. Configure environment variables

Create the backend environment file:

```text
server/.env
```

Example:

```env
PORT=8787
F1_SEASON=2026
```

For the frontend, production deployments can use:

```env
VITE_API_BASE_URL=https://your-render-backend-url
```

When `VITE_API_BASE_URL` is not provided, the frontend uses relative `/api/...` paths for local Vite development.

---

## 4. Start the backend

Inside `server`:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:8787
```

---

## 5. Start the frontend

Inside `client`:

```bash
npm run dev
```

Vite will start the frontend locally.

The development architecture is:

```text
Browser
   ↓
Vite :5173
   ↓
/api/f1/*
   ↓
Express :8787
   ↓
OpenF1
```

---

# 🌐 Production Deployment

APEX currently uses:

```text
Frontend → Vercel
Backend  → Render
```

Production flow:

```text
Vercel
  │
  └── VITE_API_BASE_URL
             │
             ▼
        Render API
             │
             ▼
           OpenF1
```

The frontend API base is configured through:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

---

# 📱 Responsive & Accessibility

APEX isn't designed only for desktop screens.

The current implementation includes:

* Responsive layouts
* Mobile-safe navigation
* Safe-area-aware menu positioning
* Keyboard navigation
* Visible focus states
* Escape-to-close navigation menu
* Focus restoration
* Background scroll locking
* Reduced-motion support
* Responsive Tribe layouts
* Mobile-friendly Grid sections

For users with reduced-motion preferences, the cinematic experience adapts rather than simply removing all content.

---

# ⚡ Performance Considerations

The project intentionally prioritizes visual quality in the current portfolio-focused version.

The cinematic experience currently loads multiple 3D vehicle assets and high-resolution visual assets because smooth transitions between the Machines scenes are important to the experience.

Future versions can introduce:

* Progressive 3D asset loading
* More aggressive code splitting
* Asset compression
* Better image optimization
* Scene-level prefetching
* More granular loading states

These optimizations are intentionally left for a later iteration rather than compromising the current cinematic experience.

---

# 🛠️ Current Scope

APEX is currently a **frontend-focused F1 experience**, not a complete F1 platform.

### Current

* Cinematic 3D opening
* Scroll-driven storytelling
* Interactive fan section
* Real F1 data
* Next Race
* Championship standings
* Last Race
* Responsive design
* Accessibility support
* Vercel + Render deployment

### Not yet implemented

* User authentication
* Database
* User profiles
* Personalization
* Driver detail pages
* Team detail pages
* Race detail pages
* Live timing
* Pit stop analytics
* Tire strategy visualization
* Race telemetry
* Notifications
* User accounts
* Advanced personalization

These are potential future directions rather than requirements for the current version.

---

# 🔮 Future Direction

APEX is designed so the cinematic frontend can eventually evolve into a much larger F1 product.

Potential future systems include:

```text
Driver Profiles
      ↓
Team Profiles
      ↓
Race Detail Pages
      ↓
Live Timing
      ↓
Telemetry
      ↓
Pit Stops
      ↓
Tyre Strategy
      ↓
Race Timeline
      ↓
Personalization
      ↓
User Accounts
```

The idea is to preserve the **visual identity and editorial experience** even as the underlying product becomes more data-driven.

---

# 🎯 Why I Built It

Most F1 websites naturally become information-heavy.

Tables.

Statistics.

Cards.

Dashboards.

APEX started from a different question:

> **Can an F1 website make you feel the sport before it asks you to read the data?**

That question shaped the entire project.

The 3D models, motion design, typography, transitions and real F1 data are not intended to exist independently.

They form one experience:

**Feel F1 → Experience F1 → Understand F1**

---

# 📌 Project Status

**APEX V1 — Live**

The current version is primarily a **frontend and visual engineering project**, with a working backend and real F1 data integration.

It is intentionally being developed in stages rather than trying to build every possible F1 feature at once.

---

# 👨‍💻 Author

**Neelabhra De**

B.Tech IT — Netaji Subhash Engineering College, Kolkata

Building things around:

* Frontend Engineering
* Creative Development
* 3D Web Experiences
* Full-Stack Development
* AI-powered applications

---

## ⭐ If you like the project

Feel free to explore the live experience and the source code.

**APEX — THE RACE, BEYOND THE FLAG.**
