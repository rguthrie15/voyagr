# ✈️ Voyagr — AI Travel Planner

> A full-stack AI-powered travel planning web app built with Node.js and the Claude AI API.

🌍 **Live Demo:** [voyagr-9haw.onrender.com](https://voyagr-9haw.onrender.com)

---

## About

Voyagr lets users generate a complete, personalized travel plan in seconds. Enter a destination, travel dates, group size, budget, and trip vibe — and Claude AI instantly produces a full itinerary, hotel and restaurant suggestions, a budget breakdown, and a custom packing list.

---

## Features

- **AI-Generated Itineraries** — Day-by-day travel plans tailored to your style and budget
- **Hotel & Restaurant Suggestions** — Curated picks with Google search links
- **Budget Breakdown** — Estimated costs per category with visual bars
- **Interactive Packing List** — Checkable items generated based on destination and trip type
- **Destination Autocomplete** — 700+ cities, towns, and US National Parks
- **PDF Download** — Export the full itinerary as a PDF to save or share
- **Fully Responsive** — Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js (no frameworks) |
| AI | Anthropic Claude API (claude-sonnet) |
| Deployment | Render |
| Version Control | GitHub |

---

## How It Works

1. User fills out the trip form (destination, dates, travelers, budget, vibe)
2. Frontend sends the trip details to the Node.js backend at /api/chat
3. Backend securely forwards the request to the Anthropic Claude API
4. Claude returns a structured JSON travel plan
5. Frontend parses and renders the plan across 4 tabs

The backend acts as a secure proxy — the API key never touches the browser.

```
Browser → POST /api/chat → server.js → Anthropic API
                                      ← Structured JSON response
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
├── index.html        # Single-page app UI
├── style.css         # All styles — dark luxury theme
├── app.js            # Frontend logic, API calls, autocomplete
├── server.js         # Node.js backend — API proxy + static file server
├── package.json      # Dependencies
├── render.yaml       # Render deployment config
└── .env.example      # Environment variable template
```

---

## Deployment

Deployed on Render as a Node.js web service. Environment variables are set in the Render dashboard — the API key is never stored in the repository.

---

## Screenshots

*(Add screenshots here — drag and drop images into this README on GitHub)*

---

## License

MIT — feel free to use this as inspiration for your own projects.
