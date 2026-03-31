# ✈️ Voyagr — AI Travel Planner

An AI-powered travel itinerary planner built with plain HTML/CSS/JS and a Node.js backend powered by Claude.

## Features
- 📅 Day-by-day itineraries
- 🏨 Hotel & restaurant suggestions
- 💰 Budget breakdown
- 🎒 Interactive packing checklist

---

## 🚀 Getting Started

### 1. Get your Anthropic API Key
Go to [console.anthropic.com](https://console.anthropic.com) → sign up → create an API key.

### 2. Clone this repo
```bash
git clone https://github.com/YOUR_USERNAME/voyagr.git
cd voyagr
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up your API key
```bash
# Copy the example env file
cp .env.example .env

# Open .env and paste your API key
ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Run the app
```bash
npm start
```

Then open your browser to: **http://localhost:3000**

---

## 📁 Project Structure

```
voyagr/
├── index.html       ← App UI
├── style.css        ← All styles
├── app.js           ← Frontend logic
├── server.js        ← Node.js backend (keeps API key safe)
├── package.json     ← Project config
├── .env.example     ← Template for your API key
├── .gitignore       ← Keeps .env off GitHub
└── README.md
```

---

## ⚠️ Important Security Note

Your `.env` file contains your secret API key. The `.gitignore` file makes sure it is **never uploaded to GitHub**. Always keep your API key private!

---

## 🌍 Deploying (Optional)

You can deploy this to [Render](https://render.com) or [Railway](https://railway.app) for free:
1. Push your code to GitHub
2. Connect your repo to Render/Railway
3. Add `ANTHROPIC_API_KEY` as an environment variable in their dashboard
4. Deploy!
