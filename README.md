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

<img width="1899" height="964" alt="image" src="https://github.com/user-attachments/assets/9933355e-5128-43cf-8690-cd8f0e0c2bf3" />
<img width="1565" height="917" alt="image" src="https://github.com/user-attachments/assets/64d2b7d9-f8ea-491a-90c1-fe3a58e88bcb" />
<img width="1398" height="836" alt="image" src="https://github.com/user-attachments/assets/09a9b019-98e9-4f6a-9faa-bbf3c333134e" />
<img width="1264" height="597" alt="image" src="https://github.com/user-attachments/assets/e405dd81-35ac-4d4b-a381-ce89136b0ac2" />
<img width="1321" height="941" alt="image" src="https://github.com/user-attachments/assets/4bd4365f-9a81-4cb7-9db7-938a559d3de6" />
<img width="1293" height="941" alt="image" src="https://github.com/user-attachments/assets/144324c1-9c9c-4fe1-802c-968459e2eaf2" />






---

## License

MIT — feel free to use this as inspiration for your own projects.
