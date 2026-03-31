# ✈️ Voyagr — AI Travel Planner

> A full-stack AI-powered travel planning web app built with Node.js and the Claude AI API.

🌍 **Live Demo:** [voyagr-9haw.onrender.com](https://voyagr-9haw.onrender.com)

---

## About

Voyagr lets users generate a complete, personalized travel plan in seconds. Enter a destination, travel dates, group size, budget, and trip vibe — and Claude AI instantly produces a full itinerary, hotel and restaurant suggestions, a budget breakdown, a packing list, and much more.

---

## Features

### Core
- **AI-Generated Itineraries** — Day-by-day travel plans tailored to your style and budget
- **Hotel & Restaurant Suggestions** — Curated picks with direct Google search links
- **Budget Breakdown** — Estimated costs per category with visual progress bars
- **Interactive Packing List** — Checkable items generated based on destination and trip type
- **PDF Download** — Export the full itinerary as a clean PDF to save or share

### Smart Search
- **Destination Autocomplete** — 700+ cities, towns, national parks and destinations worldwide with flag icons
- **Scored matching** — Results ranked by relevance, not just alphabetical order

### New Features
- **✈️ Flight Search** — One-click link to Google Flights pre-filled with your destination and dates
- **🎲 Surprise Me** — Randomly picks a destination, dates, and trip vibe so you can discover somewhere new
- **🌤️ Live Weather** — Real forecast for your trip dates powered by Open-Meteo (no API key required)
- **🔗 Share Itinerary** — Generates a shareable link so travel companions can view the full plan
- **🗺️ Interactive Map** — Plots your daily activities on a live OpenStreetMap
- **⚖️ Budget vs Luxury Comparison** — Claude generates two versions of your trip side by side so you can compare options

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js (no frameworks) |
| AI | Anthropic Claude API (claude-sonnet) |
| Maps | Leaflet.js + OpenStreetMap |
| Weather | Open-Meteo API (free, no key) |
| Geocoding | Open-Meteo Geocoding API |
| Deployment | Render |
| Version Control | GitHub |

---

## How It Works

1. User fills out the trip form (destination, dates, travelers, budget, vibe)
2. Frontend sends trip details to the Node.js backend at /api/chat
3. Backend securely forwards the request to the Anthropic Claude API
4. Claude returns a structured JSON travel plan
5. Frontend renders the plan across 6 tabs — Itinerary, Hotels & Restaurants, Budget, Packing List, Map, and Compare
6. Weather data is fetched in parallel from Open-Meteo using the destination coordinates

The backend acts as a secure proxy — the API key never touches the browser.

```
Browser → POST /api/chat → server.js → Anthropic Claude API
                                      ← Structured JSON response

Browser → Open-Meteo Geocoding API   ← lat/lng coordinates
Browser → Open-Meteo Forecast API    ← weather data
Browser → OpenStreetMap tiles        ← map rendering
```

---

## Running Locally

### Prerequisites
- Node.js v18+
- An Anthropic API key (get one at console.anthropic.com)

### Setup

```bash
# Clone the repo
git clone https://github.com/rguthrie15/voyagr.git
cd voyagr

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Anthropic API key to .env

# Start the server
npm start

# Open http://localhost:3000
```

---

## Project Structure

```
voyagr/
├── index.html        # Single-page app UI — all tabs and modals
├── style.css         # All styles — dark luxury theme with gold accents
├── app.js            # Frontend logic — API calls, autocomplete, map, weather, share, compare
├── server.js         # Node.js backend — secure API proxy + static file server
├── package.json      # Project config and dependencies
├── render.yaml       # Render deployment configuration
├── .env.example      # Environment variable template
└── README.md
```

---

## Deployment

Deployed on [Render](https://render.com) as a Node.js web service.

Environment variables are configured in the Render dashboard — the Anthropic API key is never stored in the repository.

Auto-deploys on every push to the `main` branch.

---

## Screenshots

<img width="1597" height="928" alt="image" src="https://github.com/user-attachments/assets/cabd0110-743d-40d5-853a-96ff820e8f76" />
<img width="1565" height="917" alt="image" src="https://github.com/user-attachments/assets/64d2b7d9-f8ea-491a-90c1-fe3a58e88bcb" />
<img width="1398" height="836" alt="image" src="https://github.com/user-attachments/assets/09a9b019-98e9-4f6a-9faa-bbf3c333134e" />
<img width="1264" height="597" alt="image" src="https://github.com/user-attachments/assets/e405dd81-35ac-4d4b-a381-ce89136b0ac2" />
<img width="1321" height="941" alt="image" src="https://github.com/user-attachments/assets/4bd4365f-9a81-4cb7-9db7-938a559d3de6" />
<img width="1293" height="941" alt="image" src="https://github.com/user-attachments/assets/144324c1-9c9c-4fe1-802c-968459e2eaf2" />


---

## License

Copyright (c) 2026 Robbie Guthrie. All Rights Reserved.

This project is publicly visible for portfolio and review purposes only.
Copying, modifying, or redistributing this code is not permitted without explicit written permission from the author.
