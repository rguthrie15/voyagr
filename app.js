// ============================================
//  VOYAGR — app.js
//  Handles form logic + Claude API calls
// ============================================

// ---------- VIBE BUTTON SELECTION ----------
const vibeButtons = document.querySelectorAll('.vibe-btn');
let selectedVibe = 'Cultural & Historical';

vibeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    vibeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedVibe = btn.dataset.vibe;
  });
});

// ---------- TAB SWITCHING ----------
document.addEventListener('click', e => {
  if (e.target.matches('.tab')) {
    const tabId = e.target.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
  }
});

// ---------- PACKING LIST CHECKBOX ----------
document.addEventListener('click', e => {
  const li = e.target.closest('.packing-items li');
  if (li) {
    li.classList.toggle('checked');
    const check = li.querySelector('.packing-check');
    check.textContent = li.classList.contains('checked') ? '✓' : '';
  }
});

// ---------- LOADING MESSAGES ----------
const loadingMessages = [
  "Crafting your itinerary...",
  "Researching the best spots...",
  "Calculating your budget...",
  "Packing the essentials...",
  "Almost ready..."
];

function cycleLoadingMessages() {
  let i = 0;
  return setInterval(() => {
    i = (i + 1) % loadingMessages.length;
    const el = document.getElementById('loader-text');
    if (el) el.textContent = loadingMessages[i];
  }, 2000);
}

// ---------- SHOW / HIDE SECTIONS ----------
function showSection(id) {
  ['hero', 'loading-section', 'results-section'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) target.style.display = (id === 'hero') ? 'flex' : 'block';
}

function resetApp() {
  showSection('hero');
  document.getElementById('error-msg').textContent = '';
}

// ---------- COLLECT FORM VALUES ----------
function getFormData() {
  const destination = document.getElementById('destination').value.trim();
  const startDate   = document.getElementById('start-date').value;
  const endDate     = document.getElementById('end-date').value;
  const travelers   = document.getElementById('travelers').value;
  const budget      = document.getElementById('budget').value;
  return { destination, startDate, endDate, travelers, budget, vibe: selectedVibe };
}

function validateForm(data) {
  if (!data.destination)       return 'Please enter a destination.';
  if (!data.startDate)         return 'Please select a departure date.';
  if (!data.endDate)           return 'Please select a return date.';
  if (data.startDate >= data.endDate) return 'Return date must be after departure date.';
  return null;
}

function formatDateRange(start, end) {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  const s = new Date(start + 'T00:00').toLocaleDateString('en-US', opts);
  const e = new Date(end   + 'T00:00').toLocaleDateString('en-US', opts);
  return `${s} → ${e}`;
}

function countNights(start, end) {
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  return Math.max(1, diff);
}

// ---------- SURPRISE ME ----------
const SURPRISE_DESTINATIONS = [
  // International gems
  'Kyoto, Japan', 'Santorini, Greece', 'Bali, Indonesia', 'Marrakech, Morocco',
  'Prague, Czech Republic', 'Lisbon, Portugal', 'Buenos Aires, Argentina',
  'Cape Town, South Africa', 'Dubrovnik, Croatia', 'Hoi An, Vietnam',
  'Cartagena, Colombia', 'Queenstown, New Zealand', 'Reykjavik, Iceland',
  'Luang Prabang, Laos', 'Valletta, Malta', 'Tbilisi, Georgia',
  'Kotor, Montenegro', 'Chefchaouen, Morocco', 'Cusco, Peru', 'Siem Reap, Cambodia',
  'Porto, Portugal', 'Tallinn, Estonia', 'Bergen, Norway', 'Bruges, Belgium',
  'Ljubljana, Slovenia', 'Plovdiv, Bulgaria', 'Merida, Mexico', 'Oaxaca, Mexico',
  'Medina, Saudi Arabia', 'Zanzibar, Tanzania', 'Phuket, Thailand',
  'Penang, Malaysia', 'Hvar, Croatia', 'Cinque Terre, Italy', 'Amalfi, Italy',
  // US hidden gems
  'Sedona, USA', 'Savannah, USA', 'Asheville, USA', 'Santa Fe, USA',
  'Moab, USA', 'Key West, USA', 'Telluride, USA', 'Charleston, USA',
  'Carmel, USA', 'Stowe, USA', 'Door County, USA', 'Marfa, USA',
  'Bar Harbor, USA', 'Jackson Hole, USA', 'Fredericksburg, USA',
  // National parks
  'Grand Canyon National Park, USA', 'Yellowstone National Park, USA',
  'Zion National Park, USA', 'Glacier National Park, USA',
  'Acadia National Park, USA', 'Great Smoky Mountains National Park, USA',
];

function surpriseMe() {
  // Pick a random destination
  const dest = SURPRISE_DESTINATIONS[Math.floor(Math.random() * SURPRISE_DESTINATIONS.length)];

  // Fill in the destination field
  document.getElementById('destination').value = dest;

  // Set random dates — between 2 weeks and 3 months from today, 3–7 nights
  const today = new Date();
  const daysUntilTrip = Math.floor(Math.random() * 75) + 14;
  const tripLength   = Math.floor(Math.random() * 5) + 3;

  const start = new Date(today);
  start.setDate(today.getDate() + daysUntilTrip);

  const end = new Date(start);
  end.setDate(start.getDate() + tripLength);

  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('start-date').value = fmt(start);
  document.getElementById('end-date').value   = fmt(end);

  // Pick a random vibe
  const vibes = document.querySelectorAll('.vibe-btn');
  vibes.forEach(b => b.classList.remove('active'));
  const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
  randomVibe.classList.add('active');
  selectedVibe = randomVibe.dataset.vibe;

  // Flash the destination field to show it changed
  const input = document.getElementById('destination');
  input.style.borderColor = 'var(--gold)';
  input.style.boxShadow = '0 0 0 3px var(--gold-dim)';
  setTimeout(() => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }, 1000);

  // Scroll to show the filled form
  document.getElementById('destination').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------- MAIN GENERATE FUNCTION ----------
async function generateTrip() {
  const data  = getFormData();
  const error = validateForm(data);
  const errEl = document.getElementById('error-msg');

  if (error) { errEl.textContent = error; return; }
  errEl.textContent = '';

  // Show loading
  showSection('loading-section');
  const loadingInterval = cycleLoadingMessages();

  // Build prompt
  const nights = countNights(data.startDate, data.endDate);
  const prompt = buildPrompt(data, nights);

  try {
    // Calls our local backend server (server.js) which securely adds the API key
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: `You are an expert travel planner. Always respond with valid JSON only — no markdown fences, no preamble, no explanation. Return exactly the JSON structure requested.`,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    clearInterval(loadingInterval);

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API error');
    }

    const result = await response.json();
    const raw    = result.content[0].text;

    let tripData;
    try {
      tripData = JSON.parse(raw);
    } catch {
      // Try stripping accidental fences
      const cleaned = raw.replace(/```json|```/g, '').trim();
      tripData = JSON.parse(cleaned);
    }

    renderResults(tripData, data, nights);

  } catch (err) {
    clearInterval(loadingInterval);
    showSection('hero');
    errEl.textContent = `Something went wrong: ${err.message}. Please try again.`;
    console.error(err);
  }
}

// ---------- PROMPT BUILDER ----------
function buildPrompt(data, nights) {
  return `
Plan a ${nights}-night trip to ${data.destination}.
Travelers: ${data.travelers} | Budget level: ${data.budget} | Vibe: ${data.vibe}
Dates: ${data.startDate} to ${data.endDate}

Return a JSON object with EXACTLY this structure:

{
  "destination": "City, Country",
  "tagline": "One evocative sentence about this destination",
  "itinerary": [
    {
      "day": 1,
      "theme": "Theme of the day",
      "activities": [
        { "time": "9:00 AM", "activity": "Description of activity" },
        { "time": "12:00 PM", "activity": "Description" },
        { "time": "3:00 PM", "activity": "Description" },
        { "time": "7:00 PM", "activity": "Description" }
      ]
    }
  ],
  "hotels": [
    { "name": "Hotel Name", "type": "Boutique Hotel", "description": "Brief description", "pricePerNight": "$120/night", "highlight": "Why it's great" },
    { "name": "Hotel Name 2", "type": "Luxury Resort", "description": "Brief description", "pricePerNight": "$280/night", "highlight": "Why it's great" },
    { "name": "Budget Option", "type": "Hostel/Guesthouse", "description": "Brief description", "pricePerNight": "$45/night", "highlight": "Why it's great" }
  ],
  "restaurants": [
    { "name": "Restaurant Name", "cuisine": "Cuisine type", "description": "Brief description", "priceRange": "$$", "mustTry": "Dish to order" },
    { "name": "Restaurant 2", "cuisine": "Cuisine type", "description": "Brief description", "priceRange": "$$$", "mustTry": "Dish to order" },
    { "name": "Restaurant 3", "cuisine": "Cuisine type", "description": "Brief description", "priceRange": "$", "mustTry": "Dish to order" },
    { "name": "Restaurant 4", "cuisine": "Cuisine type", "description": "Brief description", "priceRange": "$$", "mustTry": "Dish to order" }
  ],
  "budget": {
    "currency": "USD",
    "perPerson": true,
    "items": [
      { "category": "Accommodation", "estimated": 400, "notes": "Mid-range hotels" },
      { "category": "Food & Dining", "estimated": 250, "notes": "Mix of local and restaurants" },
      { "category": "Transportation", "estimated": 150, "notes": "Flights not included" },
      { "category": "Activities & Tours", "estimated": 200, "notes": "Entrance fees, guided tours" },
      { "category": "Shopping & Souvenirs", "estimated": 100, "notes": "Budget for extras" },
      { "category": "Miscellaneous", "estimated": 80, "notes": "Tips, emergencies" }
    ]
  },
  "packingList": {
    "Clothing": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    "Documents": ["Passport", "Travel insurance", "Hotel confirmations", "Copies of ID"],
    "Health & Wellness": ["Item 1", "Item 2", "Item 3", "Item 4"],
    "Electronics": ["Item 1", "Item 2", "Item 3"],
    "Destination Essentials": ["Item specific to ${data.destination}", "Item 2", "Item 3", "Item 4"]
  }
}

Make it specific to ${data.destination} with real local details. Itinerary must have exactly ${nights} days.`;
}

// ---------- BUILD FLIGHT SEARCH URL ----------
function buildFlightUrl(destination, startDate, endDate) {
  // Format dates as YYYY-MM-DD for Google Flights
  const dest = encodeURIComponent(destination);
  // Google Flights deep link with destination and dates
  const url = `https://www.google.com/travel/flights?q=Flights+to+${dest}&hl=en&gl=us&curr=USD`;
  return url;
}

// ---------- RENDER RESULTS ----------
function renderResults(data, formData, nights) {
  // Store for PDF download
  currentTripData = { data, formData, nights };

  // Wire up flights button with destination + dates
  const flightsBtn = document.getElementById('flights-btn');
  if (flightsBtn) {
    flightsBtn.href = buildFlightUrl(data.destination, formData.startDate, formData.endDate);
  }

  // Set header
  document.getElementById('results-title').textContent = `Your Trip to ${data.destination}`;
  document.getElementById('results-meta').textContent =
    `${formatDateRange(formData.startDate, formData.endDate)}  ·  ${nights} nights  ·  ${formData.travelers} travelers  ·  ${selectedVibe}`;

  renderItinerary(data.itinerary, data.destination, formData.startDate, formData.endDate);
  renderHotelsRestaurants(data.hotels, data.restaurants);
  renderBudget(data.budget);
  renderPacking(data.packingList);

  // Fetch weather for trip dates
  fetchWeather(data.destination, formData.startDate, formData.endDate);

  // Reset tabs
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  document.querySelectorAll('.tab-panel').forEach((p, i) => p.classList.toggle('active', i === 0));

  showSection('results-section');
}

// ---------- RENDER ITINERARY ----------
function renderItinerary(itinerary, destination, startDate, endDate) {
  const el = document.getElementById('itinerary-content');
  if (!itinerary || !itinerary.length) {
    el.innerHTML = '<p style="color:var(--text-muted)">No itinerary data available.</p>';
    return;
  }

  const flightUrl = buildFlightUrl(destination, startDate, endDate);
  const flightBanner = `
    <div class="flight-banner">
      <div class="flight-banner-text">
        <span class="flight-banner-icon">✈️</span>
        <span>Ready to book? Find the best flights to <strong>${escHtml(destination)}</strong></span>
      </div>
      <a href="${flightUrl}" target="_blank" rel="noopener" class="flight-banner-btn">Search Flights on Google →</a>
    </div>`;

  el.innerHTML = flightBanner + itinerary.map(day => `
    <div class="day-card">
      <div class="day-label">Day ${day.day}</div>
      <div class="day-title">${escHtml(day.theme)}</div>
      <ul class="activity-list">
        ${(day.activities || []).map(a => `
          <li class="activity-item">
            <span class="activity-time">${escHtml(a.time)}</span>
            <span>${escHtml(a.activity)}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

// ---------- RENDER HOTELS & RESTAURANTS ----------
function googleSearchUrl(name, destination, type) {
  const query = encodeURIComponent(`${name} ${type} ${destination}`);
  return `https://www.google.com/search?q=${query}`;
}

function renderHotelsRestaurants(hotels, restaurants) {
  const el = document.getElementById('hotels-content');
  const dest = document.getElementById('results-title').textContent.replace('Your Trip to ', '');

  const hotelCards = (hotels || []).map(h => `
    <div class="suggest-card">
      <div class="suggest-type">🏨 ${escHtml(h.type || 'Hotel')}</div>
      <div class="suggest-name">${escHtml(h.name)}</div>
      <div class="suggest-desc">${escHtml(h.description)}</div>
      <div class="suggest-desc" style="margin-top:6px;color:#aaa;font-size:0.82rem">✦ ${escHtml(h.highlight)}</div>
      <div class="suggest-card-footer">
        <span class="suggest-price">${escHtml(h.pricePerNight)}</span>
        <a class="suggest-link" href="${googleSearchUrl(h.name, dest, 'hotel')}" target="_blank" rel="noopener">
          Search on Google →
        </a>
      </div>
    </div>
  `).join('');

  const restCards = (restaurants || []).map(r => `
    <div class="suggest-card">
      <div class="suggest-type">🍽️ ${escHtml(r.cuisine)}</div>
      <div class="suggest-name">${escHtml(r.name)}</div>
      <div class="suggest-desc">${escHtml(r.description)}</div>
      <div class="suggest-desc" style="margin-top:6px;color:#aaa;font-size:0.82rem">Must try: ${escHtml(r.mustTry)}</div>
      <div class="suggest-card-footer">
        <span class="suggest-price">${escHtml(r.priceRange)}</span>
        <a class="suggest-link" href="${googleSearchUrl(r.name, dest, 'restaurant')}" target="_blank" rel="noopener">
          Search on Google →
        </a>
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <h2 class="section-title">Where to Stay</h2>
    <div class="suggest-grid">${hotelCards}</div>
    <h2 class="section-title" style="margin-top:40px">Where to Eat</h2>
    <div class="suggest-grid">${restCards}</div>
  `;
}

// ---------- RENDER BUDGET ----------
function renderBudget(budget) {
  const el = document.getElementById('budget-content');
  if (!budget) { el.innerHTML = '<p>No budget data.</p>'; return; }

  const total = (budget.items || []).reduce((s, i) => s + (i.estimated || 0), 0);
  const max   = Math.max(...(budget.items || []).map(i => i.estimated || 0));

  const rows = (budget.items || []).map(item => `
    <tr>
      <td style="font-weight:500;color:var(--text)">${escHtml(item.category)}</td>
      <td style="color:var(--text-muted);font-size:0.83rem">${escHtml(item.notes || '')}</td>
      <td style="text-align:right;color:var(--gold-light);font-family:'Cormorant Garamond',serif;font-size:1.1rem">
        $${item.estimated.toLocaleString()}
      </td>
      <td style="width:120px">
        <div class="budget-bar-wrap">
          <div class="budget-bar" style="width:${Math.round((item.estimated / max) * 100)}%"></div>
        </div>
      </td>
    </tr>
  `).join('');

  el.innerHTML = `
    <h2 class="section-title">Estimated Budget</h2>
    <p class="section-sub">Per person estimate. Flights and visa fees not included unless noted.</p>
    <table class="budget-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Notes</th>
          <th style="text-align:right">Estimated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="budget-total">
      <div>
        <div class="budget-total-label">Total Estimated Cost</div>
        <div style="font-size:0.75rem;color:var(--text-dim);margin-top:3px">Per person · ${budget.currency || 'USD'}</div>
      </div>
      <div class="budget-total-amount">$${total.toLocaleString()}</div>
    </div>
  `;
}

// ---------- RENDER PACKING ----------
function renderPacking(packingList) {
  const el = document.getElementById('packing-content');
  if (!packingList) { el.innerHTML = '<p>No packing data.</p>'; return; }

  const categories = Object.entries(packingList).map(([cat, items]) => `
    <div class="packing-category">
      <div class="packing-cat-title">${escHtml(cat)}</div>
      <ul class="packing-items">
        ${(items || []).map(item => `
          <li>
            <span class="packing-check"></span>
            ${escHtml(item)}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  el.innerHTML = `
    <h2 class="section-title">Packing List</h2>
    <p class="section-sub">Click items to check them off as you pack.</p>
    <div class="packing-grid">${categories}</div>
  `;
}

// ---------- HELPERS ----------
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================
//  DESTINATION AUTOCOMPLETE
//  Uses restcountries + local city list
//  No API key required
// ============================================

// Top ~300 world cities with country + flag
const CITIES = [

  // US Cities - Major metros
  { city: 'Tampa', country: 'USA', flag: '🇺🇸' },
  { city: 'Orlando', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Lauderdale', country: 'USA', flag: '🇺🇸' },
  { city: 'Key West', country: 'USA', flag: '🇺🇸' },
  { city: 'Jacksonville', country: 'USA', flag: '🇺🇸' },
  { city: 'Sarasota', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Petersburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Clearwater', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Myers', country: 'USA', flag: '🇺🇸' },
  { city: 'Naples', country: 'USA', flag: '🇺🇸' },
  { city: 'Atlanta', country: 'USA', flag: '🇺🇸' },
  { city: 'Charlotte', country: 'USA', flag: '🇺🇸' },
  { city: 'Raleigh', country: 'USA', flag: '🇺🇸' },
  { city: 'Durham', country: 'USA', flag: '🇺🇸' },
  { city: 'Asheville', country: 'USA', flag: '🇺🇸' },
  { city: 'Charleston', country: 'USA', flag: '🇺🇸' },
  { city: 'Savannah', country: 'USA', flag: '🇺🇸' },
  { city: 'Richmond', country: 'USA', flag: '🇺🇸' },
  { city: 'Virginia Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Baltimore', country: 'USA', flag: '🇺🇸' },
  { city: 'Philadelphia', country: 'USA', flag: '🇺🇸' },
  { city: 'Pittsburgh', country: 'USA', flag: '🇺🇸' },
  { city: 'Buffalo', country: 'USA', flag: '🇺🇸' },
  { city: 'Albany', country: 'USA', flag: '🇺🇸' },
  { city: 'Hartford', country: 'USA', flag: '🇺🇸' },
  { city: 'Providence', country: 'USA', flag: '🇺🇸' },
  { city: 'Portland', country: 'USA', flag: '🇺🇸' },
  { city: 'Manchester', country: 'USA', flag: '🇺🇸' },
  { city: 'Burlington', country: 'USA', flag: '🇺🇸' },
  { city: 'Detroit', country: 'USA', flag: '🇺🇸' },
  { city: 'Cleveland', country: 'USA', flag: '🇺🇸' },
  { city: 'Columbus', country: 'USA', flag: '🇺🇸' },
  { city: 'Cincinnati', country: 'USA', flag: '🇺🇸' },
  { city: 'Indianapolis', country: 'USA', flag: '🇺🇸' },
  { city: 'Louisville', country: 'USA', flag: '🇺🇸' },
  { city: 'Lexington', country: 'USA', flag: '🇺🇸' },
  { city: 'Memphis', country: 'USA', flag: '🇺🇸' },
  { city: 'Birmingham', country: 'USA', flag: '🇺🇸' },
  { city: 'Montgomery', country: 'USA', flag: '🇺🇸' },
  { city: 'Jackson', country: 'USA', flag: '🇺🇸' },
  { city: 'Baton Rouge', country: 'USA', flag: '🇺🇸' },
  { city: 'Shreveport', country: 'USA', flag: '🇺🇸' },
  { city: 'Little Rock', country: 'USA', flag: '🇺🇸' },
  { city: 'Oklahoma City', country: 'USA', flag: '🇺🇸' },
  { city: 'Tulsa', country: 'USA', flag: '🇺🇸' },
  { city: 'Dallas', country: 'USA', flag: '🇺🇸' },
  { city: 'Houston', country: 'USA', flag: '🇺🇸' },
  { city: 'San Antonio', country: 'USA', flag: '🇺🇸' },
  { city: 'El Paso', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Worth', country: 'USA', flag: '🇺🇸' },
  { city: 'Waco', country: 'USA', flag: '🇺🇸' },
  { city: 'Lubbock', country: 'USA', flag: '🇺🇸' },
  { city: 'Amarillo', country: 'USA', flag: '🇺🇸' },
  { city: 'Corpus Christi', country: 'USA', flag: '🇺🇸' },
  { city: 'Albuquerque', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Fe', country: 'USA', flag: '🇺🇸' },
  { city: 'Tucson', country: 'USA', flag: '🇺🇸' },
  { city: 'Phoenix', country: 'USA', flag: '🇺🇸' },
  { city: 'Scottsdale', country: 'USA', flag: '🇺🇸' },
  { city: 'Sedona', country: 'USA', flag: '🇺🇸' },
  { city: 'Flagstaff', country: 'USA', flag: '🇺🇸' },
  { city: 'Salt Lake City', country: 'USA', flag: '🇺🇸' },
  { city: 'Provo', country: 'USA', flag: '🇺🇸' },
  { city: 'Moab', country: 'USA', flag: '🇺🇸' },
  { city: 'Boise', country: 'USA', flag: '🇺🇸' },
  { city: 'Spokane', country: 'USA', flag: '🇺🇸' },
  { city: 'Tacoma', country: 'USA', flag: '🇺🇸' },
  { city: 'Olympia', country: 'USA', flag: '🇺🇸' },
  { city: 'Eugene', country: 'USA', flag: '🇺🇸' },
  { city: 'Salem', country: 'USA', flag: '🇺🇸' },
  { city: 'Bend', country: 'USA', flag: '🇺🇸' },
  { city: 'Sacramento', country: 'USA', flag: '🇺🇸' },
  { city: 'San Diego', country: 'USA', flag: '🇺🇸' },
  { city: 'San Jose', country: 'USA', flag: '🇺🇸' },
  { city: 'Oakland', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Barbara', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Cruz', country: 'USA', flag: '🇺🇸' },
  { city: 'Monterey', country: 'USA', flag: '🇺🇸' },
  { city: 'Palm Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Napa', country: 'USA', flag: '🇺🇸' },
  { city: 'Sonoma', country: 'USA', flag: '🇺🇸' },
  { city: 'Lake Tahoe', country: 'USA', flag: '🇺🇸' },
  { city: 'Reno', country: 'USA', flag: '🇺🇸' },
  { city: 'Minneapolis', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Paul', country: 'USA', flag: '🇺🇸' },
  { city: 'Milwaukee', country: 'USA', flag: '🇺🇸' },
  { city: 'Madison', country: 'USA', flag: '🇺🇸' },
  { city: 'Green Bay', country: 'USA', flag: '🇺🇸' },
  { city: 'Kansas City', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Louis', country: 'USA', flag: '🇺🇸' },
  { city: 'Springfield', country: 'USA', flag: '🇺🇸' },
  { city: 'Omaha', country: 'USA', flag: '🇺🇸' },
  { city: 'Lincoln', country: 'USA', flag: '🇺🇸' },
  { city: 'Sioux Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Fargo', country: 'USA', flag: '🇺🇸' },
  { city: 'Bismarck', country: 'USA', flag: '🇺🇸' },
  { city: 'Billings', country: 'USA', flag: '🇺🇸' },
  { city: 'Bozeman', country: 'USA', flag: '🇺🇸' },
  { city: 'Missoula', country: 'USA', flag: '🇺🇸' },
  { city: 'Cheyenne', country: 'USA', flag: '🇺🇸' },
  { city: 'Jackson Hole', country: 'USA', flag: '🇺🇸' },
  { city: 'Anchorage', country: 'USA', flag: '🇺🇸' },
  { city: 'Fairbanks', country: 'USA', flag: '🇺🇸' },
  { city: 'Juneau', country: 'USA', flag: '🇺🇸' },
  { city: 'Maui', country: 'USA', flag: '🇺🇸' },
  { city: 'Kauai', country: 'USA', flag: '🇺🇸' },
  { city: 'Big Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Myrtle Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Hilton Head', country: 'USA', flag: '🇺🇸' },
  { city: 'Outer Banks', country: 'USA', flag: '🇺🇸' },
  { city: 'Cape Cod', country: 'USA', flag: '🇺🇸' },
  { city: 'Bar Harbor', country: 'USA', flag: '🇺🇸' },
  { city: 'Newport', country: 'USA', flag: '🇺🇸' },
  { city: 'Nantucket', country: 'USA', flag: '🇺🇸' },
  { city: "Martha's Vineyard", country: 'USA', flag: '🇺🇸' },
  { city: 'Niagara Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Mackinac Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Gatlinburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Pigeon Forge', country: 'USA', flag: '🇺🇸' },


  // Colorado
  { city: 'Denver', country: 'USA', flag: '🇺🇸' },
  { city: 'Colorado Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Boulder', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Collins', country: 'USA', flag: '🇺🇸' },
  { city: 'Aspen', country: 'USA', flag: '🇺🇸' },
  { city: 'Vail', country: 'USA', flag: '🇺🇸' },
  { city: 'Breckenridge', country: 'USA', flag: '🇺🇸' },
  { city: 'Steamboat Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Telluride', country: 'USA', flag: '🇺🇸' },
  { city: 'Durango', country: 'USA', flag: '🇺🇸' },
  { city: 'Keystone', country: 'USA', flag: '🇺🇸' },
  { city: 'Copper Mountain', country: 'USA', flag: '🇺🇸' },
  { city: 'Snowmass', country: 'USA', flag: '🇺🇸' },
  { city: 'Crested Butte', country: 'USA', flag: '🇺🇸' },
  { city: 'Glenwood Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Estes Park', country: 'USA', flag: '🇺🇸' },
  { city: 'Pueblo', country: 'USA', flag: '🇺🇸' },
  { city: 'Grand Junction', country: 'USA', flag: '🇺🇸' },
  { city: 'Silverton', country: 'USA', flag: '🇺🇸' },
  { city: 'Ouray', country: 'USA', flag: '🇺🇸' },
  { city: 'Pagosa Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Winter Park', country: 'USA', flag: '🇺🇸' },
  { city: 'Leadville', country: 'USA', flag: '🇺🇸' },
  { city: 'Salida', country: 'USA', flag: '🇺🇸' },
  { city: 'Manitou Springs', country: 'USA', flag: '🇺🇸' },

  // Alabama
  { city: 'Birmingham', country: 'USA', flag: '🇺🇸' },
  { city: 'Montgomery', country: 'USA', flag: '🇺🇸' },
  { city: 'Huntsville', country: 'USA', flag: '🇺🇸' },
  { city: 'Mobile', country: 'USA', flag: '🇺🇸' },
  { city: 'Tuscaloosa', country: 'USA', flag: '🇺🇸' },
  { city: 'Auburn', country: 'USA', flag: '🇺🇸' },
  { city: 'Gulf Shores', country: 'USA', flag: '🇺🇸' },
  { city: 'Orange Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Decatur', country: 'USA', flag: '🇺🇸' },
  { city: 'Florence', country: 'USA', flag: '🇺🇸' },

  // Alaska
  { city: 'Anchorage', country: 'USA', flag: '🇺🇸' },
  { city: 'Fairbanks', country: 'USA', flag: '🇺🇸' },
  { city: 'Juneau', country: 'USA', flag: '🇺🇸' },
  { city: 'Sitka', country: 'USA', flag: '🇺🇸' },
  { city: 'Ketchikan', country: 'USA', flag: '🇺🇸' },
  { city: 'Skagway', country: 'USA', flag: '🇺🇸' },
  { city: 'Homer', country: 'USA', flag: '🇺🇸' },
  { city: 'Seward', country: 'USA', flag: '🇺🇸' },
  { city: 'Kodiak', country: 'USA', flag: '🇺🇸' },
  { city: 'Talkeetna', country: 'USA', flag: '🇺🇸' },

  // Arizona
  { city: 'Phoenix', country: 'USA', flag: '🇺🇸' },
  { city: 'Tucson', country: 'USA', flag: '🇺🇸' },
  { city: 'Scottsdale', country: 'USA', flag: '🇺🇸' },
  { city: 'Sedona', country: 'USA', flag: '🇺🇸' },
  { city: 'Flagstaff', country: 'USA', flag: '🇺🇸' },
  { city: 'Tempe', country: 'USA', flag: '🇺🇸' },
  { city: 'Mesa', country: 'USA', flag: '🇺🇸' },
  { city: 'Chandler', country: 'USA', flag: '🇺🇸' },
  { city: 'Prescott', country: 'USA', flag: '🇺🇸' },
  { city: 'Page', country: 'USA', flag: '🇺🇸' },
  { city: 'Show Low', country: 'USA', flag: '🇺🇸' },
  { city: 'Yuma', country: 'USA', flag: '🇺🇸' },

  // Arkansas
  { city: 'Little Rock', country: 'USA', flag: '🇺🇸' },
  { city: 'Fayetteville', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Smith', country: 'USA', flag: '🇺🇸' },
  { city: 'Bentonville', country: 'USA', flag: '🇺🇸' },
  { city: 'Eureka Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Hot Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Jonesboro', country: 'USA', flag: '🇺🇸' },
  { city: 'Texarkana', country: 'USA', flag: '🇺🇸' },

  // California
  { city: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
  { city: 'San Francisco', country: 'USA', flag: '🇺🇸' },
  { city: 'San Diego', country: 'USA', flag: '🇺🇸' },
  { city: 'Sacramento', country: 'USA', flag: '🇺🇸' },
  { city: 'San Jose', country: 'USA', flag: '🇺🇸' },
  { city: 'Oakland', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Barbara', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Cruz', country: 'USA', flag: '🇺🇸' },
  { city: 'Monterey', country: 'USA', flag: '🇺🇸' },
  { city: 'Palm Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Napa', country: 'USA', flag: '🇺🇸' },
  { city: 'Sonoma', country: 'USA', flag: '🇺🇸' },
  { city: 'Lake Tahoe', country: 'USA', flag: '🇺🇸' },
  { city: 'Carmel', country: 'USA', flag: '🇺🇸' },
  { city: 'Big Sur', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Monica', country: 'USA', flag: '🇺🇸' },
  { city: 'Malibu', country: 'USA', flag: '🇺🇸' },
  { city: 'Fresno', country: 'USA', flag: '🇺🇸' },
  { city: 'Bakersfield', country: 'USA', flag: '🇺🇸' },
  { city: 'Long Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Anaheim', country: 'USA', flag: '🇺🇸' },
  { city: 'Riverside', country: 'USA', flag: '🇺🇸' },
  { city: 'Redding', country: 'USA', flag: '🇺🇸' },
  { city: 'Eureka', country: 'USA', flag: '🇺🇸' },

  // Connecticut
  { city: 'Hartford', country: 'USA', flag: '🇺🇸' },
  { city: 'New Haven', country: 'USA', flag: '🇺🇸' },
  { city: 'Stamford', country: 'USA', flag: '🇺🇸' },
  { city: 'Bridgeport', country: 'USA', flag: '🇺🇸' },
  { city: 'Mystic', country: 'USA', flag: '🇺🇸' },
  { city: 'Greenwich', country: 'USA', flag: '🇺🇸' },
  { city: 'Waterbury', country: 'USA', flag: '🇺🇸' },

  // Delaware
  { city: 'Wilmington', country: 'USA', flag: '🇺🇸' },
  { city: 'Dover', country: 'USA', flag: '🇺🇸' },
  { city: 'Rehoboth Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Lewes', country: 'USA', flag: '🇺🇸' },

  // Florida
  { city: 'Miami', country: 'USA', flag: '🇺🇸' },
  { city: 'Orlando', country: 'USA', flag: '🇺🇸' },
  { city: 'Tampa', country: 'USA', flag: '🇺🇸' },
  { city: 'Jacksonville', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Lauderdale', country: 'USA', flag: '🇺🇸' },
  { city: 'Key West', country: 'USA', flag: '🇺🇸' },
  { city: 'Sarasota', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Petersburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Clearwater', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Myers', country: 'USA', flag: '🇺🇸' },
  { city: 'Naples', country: 'USA', flag: '🇺🇸' },
  { city: 'Daytona Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Pensacola', country: 'USA', flag: '🇺🇸' },
  { city: 'Destin', country: 'USA', flag: '🇺🇸' },
  { city: 'Panama City Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Tallahassee', country: 'USA', flag: '🇺🇸' },
  { city: 'Gainesville', country: 'USA', flag: '🇺🇸' },
  { city: 'Boca Raton', country: 'USA', flag: '🇺🇸' },
  { city: 'West Palm Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Augustine', country: 'USA', flag: '🇺🇸' },
  { city: 'Amelia Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Marco Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Sanibel Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Cocoa Beach', country: 'USA', flag: '🇺🇸' },

  // Georgia
  { city: 'Atlanta', country: 'USA', flag: '🇺🇸' },
  { city: 'Savannah', country: 'USA', flag: '🇺🇸' },
  { city: 'Augusta', country: 'USA', flag: '🇺🇸' },
  { city: 'Columbus', country: 'USA', flag: '🇺🇸' },
  { city: 'Macon', country: 'USA', flag: '🇺🇸' },
  { city: 'Athens', country: 'USA', flag: '🇺🇸' },
  { city: 'Alpharetta', country: 'USA', flag: '🇺🇸' },
  { city: 'Marietta', country: 'USA', flag: '🇺🇸' },
  { city: 'Blue Ridge', country: 'USA', flag: '🇺🇸' },
  { city: 'Jekyll Island', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Simons Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Tybee Island', country: 'USA', flag: '🇺🇸' },

  // Hawaii
  { city: 'Honolulu', country: 'USA', flag: '🇺🇸' },
  { city: 'Maui', country: 'USA', flag: '🇺🇸' },
  { city: 'Kauai', country: 'USA', flag: '🇺🇸' },
  { city: 'Big Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Lahaina', country: 'USA', flag: '🇺🇸' },
  { city: 'Kona', country: 'USA', flag: '🇺🇸' },
  { city: 'Hilo', country: 'USA', flag: '🇺🇸' },
  { city: 'Waikiki', country: 'USA', flag: '🇺🇸' },
  { city: 'Molokai', country: 'USA', flag: '🇺🇸' },
  { city: 'Lanai', country: 'USA', flag: '🇺🇸' },

  // Idaho
  { city: 'Boise', country: 'USA', flag: '🇺🇸' },
  { city: 'Coeur d Alene', country: 'USA', flag: '🇺🇸' },
  { city: 'Sun Valley', country: 'USA', flag: '🇺🇸' },
  { city: 'Idaho Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Twin Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Pocatello', country: 'USA', flag: '🇺🇸' },
  { city: 'Sandpoint', country: 'USA', flag: '🇺🇸' },
  { city: 'McCall', country: 'USA', flag: '🇺🇸' },

  // Illinois
  { city: 'Chicago', country: 'USA', flag: '🇺🇸' },
  { city: 'Springfield', country: 'USA', flag: '🇺🇸' },
  { city: 'Rockford', country: 'USA', flag: '🇺🇸' },
  { city: 'Peoria', country: 'USA', flag: '🇺🇸' },
  { city: 'Champaign', country: 'USA', flag: '🇺🇸' },
  { city: 'Galena', country: 'USA', flag: '🇺🇸' },
  { city: 'Evanston', country: 'USA', flag: '🇺🇸' },
  { city: 'Oak Park', country: 'USA', flag: '🇺🇸' },

  // Indiana
  { city: 'Indianapolis', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Wayne', country: 'USA', flag: '🇺🇸' },
  { city: 'Bloomington', country: 'USA', flag: '🇺🇸' },
  { city: 'South Bend', country: 'USA', flag: '🇺🇸' },
  { city: 'Evansville', country: 'USA', flag: '🇺🇸' },
  { city: 'Carmel', country: 'USA', flag: '🇺🇸' },
  { city: 'Columbus', country: 'USA', flag: '🇺🇸' },
  { city: 'Lafayette', country: 'USA', flag: '🇺🇸' },

  // Iowa
  { city: 'Des Moines', country: 'USA', flag: '🇺🇸' },
  { city: 'Cedar Rapids', country: 'USA', flag: '🇺🇸' },
  { city: 'Iowa City', country: 'USA', flag: '🇺🇸' },
  { city: 'Davenport', country: 'USA', flag: '🇺🇸' },
  { city: 'Dubuque', country: 'USA', flag: '🇺🇸' },
  { city: 'Sioux City', country: 'USA', flag: '🇺🇸' },

  // Kansas
  { city: 'Wichita', country: 'USA', flag: '🇺🇸' },
  { city: 'Kansas City', country: 'USA', flag: '🇺🇸' },
  { city: 'Topeka', country: 'USA', flag: '🇺🇸' },
  { city: 'Lawrence', country: 'USA', flag: '🇺🇸' },
  { city: 'Overland Park', country: 'USA', flag: '🇺🇸' },
  { city: 'Manhattan', country: 'USA', flag: '🇺🇸' },

  // Kentucky
  { city: 'Louisville', country: 'USA', flag: '🇺🇸' },
  { city: 'Lexington', country: 'USA', flag: '🇺🇸' },
  { city: 'Bowling Green', country: 'USA', flag: '🇺🇸' },
  { city: 'Covington', country: 'USA', flag: '🇺🇸' },
  { city: 'Bardstown', country: 'USA', flag: '🇺🇸' },
  { city: 'Frankfort', country: 'USA', flag: '🇺🇸' },
  { city: 'Paducah', country: 'USA', flag: '🇺🇸' },
  { city: 'Berea', country: 'USA', flag: '🇺🇸' },

  // Louisiana
  { city: 'New Orleans', country: 'USA', flag: '🇺🇸' },
  { city: 'Baton Rouge', country: 'USA', flag: '🇺🇸' },
  { city: 'Shreveport', country: 'USA', flag: '🇺🇸' },
  { city: 'Lafayette', country: 'USA', flag: '🇺🇸' },
  { city: 'Lake Charles', country: 'USA', flag: '🇺🇸' },
  { city: 'Alexandria', country: 'USA', flag: '🇺🇸' },
  { city: 'Natchitoches', country: 'USA', flag: '🇺🇸' },

  // Maine
  { city: 'Portland', country: 'USA', flag: '🇺🇸' },
  { city: 'Bar Harbor', country: 'USA', flag: '🇺🇸' },
  { city: 'Kennebunkport', country: 'USA', flag: '🇺🇸' },
  { city: 'Bangor', country: 'USA', flag: '🇺🇸' },
  { city: 'Augusta', country: 'USA', flag: '🇺🇸' },
  { city: 'Ogunquit', country: 'USA', flag: '🇺🇸' },
  { city: 'Camden', country: 'USA', flag: '🇺🇸' },
  { city: 'Freeport', country: 'USA', flag: '🇺🇸' },

  // Maryland
  { city: 'Baltimore', country: 'USA', flag: '🇺🇸' },
  { city: 'Annapolis', country: 'USA', flag: '🇺🇸' },
  { city: 'Ocean City', country: 'USA', flag: '🇺🇸' },
  { city: 'Frederick', country: 'USA', flag: '🇺🇸' },
  { city: 'Rockville', country: 'USA', flag: '🇺🇸' },
  { city: 'Bethesda', country: 'USA', flag: '🇺🇸' },
  { city: 'Gaithersburg', country: 'USA', flag: '🇺🇸' },

  // Massachusetts
  { city: 'Boston', country: 'USA', flag: '🇺🇸' },
  { city: 'Cape Cod', country: 'USA', flag: '🇺🇸' },
  { city: 'Nantucket', country: 'USA', flag: '🇺🇸' },
  { city: 'Providence', country: 'USA', flag: '🇺🇸' },
  { city: 'Cambridge', country: 'USA', flag: '🇺🇸' },
  { city: 'Salem', country: 'USA', flag: '🇺🇸' },
  { city: 'Gloucester', country: 'USA', flag: '🇺🇸' },
  { city: 'Plymouth', country: 'USA', flag: '🇺🇸' },
  { city: 'Provincetown', country: 'USA', flag: '🇺🇸' },
  { city: 'Northampton', country: 'USA', flag: '🇺🇸' },
  { city: 'Lenox', country: 'USA', flag: '🇺🇸' },
  { city: 'Stockbridge', country: 'USA', flag: '🇺🇸' },
  { city: "Martha's Vineyard", country: 'USA', flag: '🇺🇸' },

  // Michigan
  { city: 'Detroit', country: 'USA', flag: '🇺🇸' },
  { city: 'Grand Rapids', country: 'USA', flag: '🇺🇸' },
  { city: 'Ann Arbor', country: 'USA', flag: '🇺🇸' },
  { city: 'Traverse City', country: 'USA', flag: '🇺🇸' },
  { city: 'Mackinac Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Lansing', country: 'USA', flag: '🇺🇸' },
  { city: 'Kalamazoo', country: 'USA', flag: '🇺🇸' },
  { city: 'Flint', country: 'USA', flag: '🇺🇸' },
  { city: 'Marquette', country: 'USA', flag: '🇺🇸' },
  { city: 'Petoskey', country: 'USA', flag: '🇺🇸' },
  { city: 'Holland', country: 'USA', flag: '🇺🇸' },
  { city: 'Saugatuck', country: 'USA', flag: '🇺🇸' },

  // Minnesota
  { city: 'Minneapolis', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Paul', country: 'USA', flag: '🇺🇸' },
  { city: 'Duluth', country: 'USA', flag: '🇺🇸' },
  { city: 'Rochester', country: 'USA', flag: '🇺🇸' },
  { city: 'Bloomington', country: 'USA', flag: '🇺🇸' },
  { city: 'Brainerd', country: 'USA', flag: '🇺🇸' },
  { city: 'Stillwater', country: 'USA', flag: '🇺🇸' },
  { city: 'Boundary Waters', country: 'USA', flag: '🇺🇸' },

  // Mississippi
  { city: 'Jackson', country: 'USA', flag: '🇺🇸' },
  { city: 'Biloxi', country: 'USA', flag: '🇺🇸' },
  { city: 'Gulfport', country: 'USA', flag: '🇺🇸' },
  { city: 'Oxford', country: 'USA', flag: '🇺🇸' },
  { city: 'Hattiesburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Natchez', country: 'USA', flag: '🇺🇸' },
  { city: 'Vicksburg', country: 'USA', flag: '🇺🇸' },

  // Missouri
  { city: 'Kansas City', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Louis', country: 'USA', flag: '🇺🇸' },
  { city: 'Branson', country: 'USA', flag: '🇺🇸' },
  { city: 'Columbia', country: 'USA', flag: '🇺🇸' },
  { city: 'Springfield', country: 'USA', flag: '🇺🇸' },
  { city: 'Jefferson City', country: 'USA', flag: '🇺🇸' },
  { city: 'St. Charles', country: 'USA', flag: '🇺🇸' },
  { city: 'Hannibal', country: 'USA', flag: '🇺🇸' },

  // Montana
  { city: 'Billings', country: 'USA', flag: '🇺🇸' },
  { city: 'Bozeman', country: 'USA', flag: '🇺🇸' },
  { city: 'Missoula', country: 'USA', flag: '🇺🇸' },
  { city: 'Great Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Helena', country: 'USA', flag: '🇺🇸' },
  { city: 'Whitefish', country: 'USA', flag: '🇺🇸' },
  { city: 'Kalispell', country: 'USA', flag: '🇺🇸' },
  { city: 'Butte', country: 'USA', flag: '🇺🇸' },
  { city: 'Livingston', country: 'USA', flag: '🇺🇸' },
  { city: 'Red Lodge', country: 'USA', flag: '🇺🇸' },

  // Nebraska
  { city: 'Omaha', country: 'USA', flag: '🇺🇸' },
  { city: 'Lincoln', country: 'USA', flag: '🇺🇸' },
  { city: 'Grand Island', country: 'USA', flag: '🇺🇸' },
  { city: 'Kearney', country: 'USA', flag: '🇺🇸' },
  { city: 'North Platte', country: 'USA', flag: '🇺🇸' },

  // Nevada
  { city: 'Las Vegas', country: 'USA', flag: '🇺🇸' },
  { city: 'Reno', country: 'USA', flag: '🇺🇸' },
  { city: 'Henderson', country: 'USA', flag: '🇺🇸' },
  { city: 'Carson City', country: 'USA', flag: '🇺🇸' },
  { city: 'Lake Tahoe', country: 'USA', flag: '🇺🇸' },
  { city: 'Laughlin', country: 'USA', flag: '🇺🇸' },
  { city: 'Virginia City', country: 'USA', flag: '🇺🇸' },

  // New Hampshire
  { city: 'Manchester', country: 'USA', flag: '🇺🇸' },
  { city: 'Concord', country: 'USA', flag: '🇺🇸' },
  { city: 'Portsmouth', country: 'USA', flag: '🇺🇸' },
  { city: 'North Conway', country: 'USA', flag: '🇺🇸' },
  { city: 'Hanover', country: 'USA', flag: '🇺🇸' },
  { city: 'Nashua', country: 'USA', flag: '🇺🇸' },
  { city: 'Hampton Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Jackson', country: 'USA', flag: '🇺🇸' },

  // New Jersey
  { city: 'Newark', country: 'USA', flag: '🇺🇸' },
  { city: 'Jersey City', country: 'USA', flag: '🇺🇸' },
  { city: 'Atlantic City', country: 'USA', flag: '🇺🇸' },
  { city: 'Princeton', country: 'USA', flag: '🇺🇸' },
  { city: 'Hoboken', country: 'USA', flag: '🇺🇸' },
  { city: 'Cape May', country: 'USA', flag: '🇺🇸' },
  { city: 'Asbury Park', country: 'USA', flag: '🇺🇸' },
  { city: 'Morristown', country: 'USA', flag: '🇺🇸' },

  // New Mexico
  { city: 'Albuquerque', country: 'USA', flag: '🇺🇸' },
  { city: 'Santa Fe', country: 'USA', flag: '🇺🇸' },
  { city: 'Taos', country: 'USA', flag: '🇺🇸' },
  { city: 'Las Cruces', country: 'USA', flag: '🇺🇸' },
  { city: 'Roswell', country: 'USA', flag: '🇺🇸' },
  { city: 'Ruidoso', country: 'USA', flag: '🇺🇸' },
  { city: 'Silver City', country: 'USA', flag: '🇺🇸' },

  // New York
  { city: 'New York City', country: 'USA', flag: '🇺🇸' },
  { city: 'Buffalo', country: 'USA', flag: '🇺🇸' },
  { city: 'Albany', country: 'USA', flag: '🇺🇸' },
  { city: 'Syracuse', country: 'USA', flag: '🇺🇸' },
  { city: 'Rochester', country: 'USA', flag: '🇺🇸' },
  { city: 'Niagara Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Saratoga Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Ithaca', country: 'USA', flag: '🇺🇸' },
  { city: 'Lake Placid', country: 'USA', flag: '🇺🇸' },
  { city: 'Cooperstown', country: 'USA', flag: '🇺🇸' },
  { city: 'Hamptons', country: 'USA', flag: '🇺🇸' },
  { city: 'Finger Lakes', country: 'USA', flag: '🇺🇸' },
  { city: 'Hudson', country: 'USA', flag: '🇺🇸' },
  { city: 'Woodstock', country: 'USA', flag: '🇺🇸' },

  // North Carolina
  { city: 'Charlotte', country: 'USA', flag: '🇺🇸' },
  { city: 'Raleigh', country: 'USA', flag: '🇺🇸' },
  { city: 'Durham', country: 'USA', flag: '🇺🇸' },
  { city: 'Asheville', country: 'USA', flag: '🇺🇸' },
  { city: 'Wilmington', country: 'USA', flag: '🇺🇸' },
  { city: 'Chapel Hill', country: 'USA', flag: '🇺🇸' },
  { city: 'Greensboro', country: 'USA', flag: '🇺🇸' },
  { city: 'Winston-Salem', country: 'USA', flag: '🇺🇸' },
  { city: 'Outer Banks', country: 'USA', flag: '🇺🇸' },
  { city: 'Boone', country: 'USA', flag: '🇺🇸' },
  { city: 'Cherokee', country: 'USA', flag: '🇺🇸' },
  { city: 'Blowing Rock', country: 'USA', flag: '🇺🇸' },
  { city: 'Wrightsville Beach', country: 'USA', flag: '🇺🇸' },

  // North Dakota
  { city: 'Fargo', country: 'USA', flag: '🇺🇸' },
  { city: 'Bismarck', country: 'USA', flag: '🇺🇸' },
  { city: 'Grand Forks', country: 'USA', flag: '🇺🇸' },
  { city: 'Minot', country: 'USA', flag: '🇺🇸' },
  { city: 'Medora', country: 'USA', flag: '🇺🇸' },

  // Ohio
  { city: 'Columbus', country: 'USA', flag: '🇺🇸' },
  { city: 'Cleveland', country: 'USA', flag: '🇺🇸' },
  { city: 'Cincinnati', country: 'USA', flag: '🇺🇸' },
  { city: 'Toledo', country: 'USA', flag: '🇺🇸' },
  { city: 'Akron', country: 'USA', flag: '🇺🇸' },
  { city: 'Dayton', country: 'USA', flag: '🇺🇸' },
  { city: 'Youngstown', country: 'USA', flag: '🇺🇸' },
  { city: 'Oxford', country: 'USA', flag: '🇺🇸' },
  { city: 'Hocking Hills', country: 'USA', flag: '🇺🇸' },
  { city: 'Sandusky', country: 'USA', flag: '🇺🇸' },

  // Oklahoma
  { city: 'Oklahoma City', country: 'USA', flag: '🇺🇸' },
  { city: 'Tulsa', country: 'USA', flag: '🇺🇸' },
  { city: 'Norman', country: 'USA', flag: '🇺🇸' },
  { city: 'Stillwater', country: 'USA', flag: '🇺🇸' },
  { city: 'Lawton', country: 'USA', flag: '🇺🇸' },
  { city: 'Broken Arrow', country: 'USA', flag: '🇺🇸' },

  // Oregon
  { city: 'Portland', country: 'USA', flag: '🇺🇸' },
  { city: 'Eugene', country: 'USA', flag: '🇺🇸' },
  { city: 'Salem', country: 'USA', flag: '🇺🇸' },
  { city: 'Bend', country: 'USA', flag: '🇺🇸' },
  { city: 'Ashland', country: 'USA', flag: '🇺🇸' },
  { city: 'Cannon Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Hood River', country: 'USA', flag: '🇺🇸' },
  { city: 'Medford', country: 'USA', flag: '🇺🇸' },
  { city: 'Corvallis', country: 'USA', flag: '🇺🇸' },
  { city: 'Astoria', country: 'USA', flag: '🇺🇸' },
  { city: 'Florence', country: 'USA', flag: '🇺🇸' },
  { city: 'Newport', country: 'USA', flag: '🇺🇸' },

  // Pennsylvania
  { city: 'Philadelphia', country: 'USA', flag: '🇺🇸' },
  { city: 'Pittsburgh', country: 'USA', flag: '🇺🇸' },
  { city: 'Allentown', country: 'USA', flag: '🇺🇸' },
  { city: 'Harrisburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Erie', country: 'USA', flag: '🇺🇸' },
  { city: 'Lancaster', country: 'USA', flag: '🇺🇸' },
  { city: 'Gettysburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Hershey', country: 'USA', flag: '🇺🇸' },
  { city: 'Scranton', country: 'USA', flag: '🇺🇸' },
  { city: 'Reading', country: 'USA', flag: '🇺🇸' },
  { city: 'Bethlehem', country: 'USA', flag: '🇺🇸' },
  { city: 'State College', country: 'USA', flag: '🇺🇸' },
  { city: 'Jim Thorpe', country: 'USA', flag: '🇺🇸' },

  // Rhode Island
  { city: 'Providence', country: 'USA', flag: '🇺🇸' },
  { city: 'Newport', country: 'USA', flag: '🇺🇸' },
  { city: 'Narragansett', country: 'USA', flag: '🇺🇸' },
  { city: 'Bristol', country: 'USA', flag: '🇺🇸' },

  // South Carolina
  { city: 'Charleston', country: 'USA', flag: '🇺🇸' },
  { city: 'Myrtle Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Hilton Head', country: 'USA', flag: '🇺🇸' },
  { city: 'Columbia', country: 'USA', flag: '🇺🇸' },
  { city: 'Greenville', country: 'USA', flag: '🇺🇸' },
  { city: 'Beaufort', country: 'USA', flag: '🇺🇸' },
  { city: 'Pawleys Island', country: 'USA', flag: '🇺🇸' },

  // South Dakota
  { city: 'Sioux Falls', country: 'USA', flag: '🇺🇸' },
  { city: 'Rapid City', country: 'USA', flag: '🇺🇸' },
  { city: 'Deadwood', country: 'USA', flag: '🇺🇸' },
  { city: 'Custer', country: 'USA', flag: '🇺🇸' },
  { city: 'Pierre', country: 'USA', flag: '🇺🇸' },
  { city: 'Spearfish', country: 'USA', flag: '🇺🇸' },
  { city: 'Hot Springs', country: 'USA', flag: '🇺🇸' },

  // Tennessee
  { city: 'Nashville', country: 'USA', flag: '🇺🇸' },
  { city: 'Memphis', country: 'USA', flag: '🇺🇸' },
  { city: 'Knoxville', country: 'USA', flag: '🇺🇸' },
  { city: 'Chattanooga', country: 'USA', flag: '🇺🇸' },
  { city: 'Gatlinburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Pigeon Forge', country: 'USA', flag: '🇺🇸' },
  { city: 'Clarksville', country: 'USA', flag: '🇺🇸' },
  { city: 'Murfreesboro', country: 'USA', flag: '🇺🇸' },
  { city: 'Franklin', country: 'USA', flag: '🇺🇸' },
  { city: 'Johnson City', country: 'USA', flag: '🇺🇸' },

  // Texas
  { city: 'Houston', country: 'USA', flag: '🇺🇸' },
  { city: 'Dallas', country: 'USA', flag: '🇺🇸' },
  { city: 'Austin', country: 'USA', flag: '🇺🇸' },
  { city: 'San Antonio', country: 'USA', flag: '🇺🇸' },
  { city: 'Fort Worth', country: 'USA', flag: '🇺🇸' },
  { city: 'El Paso', country: 'USA', flag: '🇺🇸' },
  { city: 'Lubbock', country: 'USA', flag: '🇺🇸' },
  { city: 'Amarillo', country: 'USA', flag: '🇺🇸' },
  { city: 'Corpus Christi', country: 'USA', flag: '🇺🇸' },
  { city: 'Galveston', country: 'USA', flag: '🇺🇸' },
  { city: 'Waco', country: 'USA', flag: '🇺🇸' },
  { city: 'Plano', country: 'USA', flag: '🇺🇸' },
  { city: 'Irving', country: 'USA', flag: '🇺🇸' },
  { city: 'Arlington', country: 'USA', flag: '🇺🇸' },
  { city: 'Fredericksburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Marfa', country: 'USA', flag: '🇺🇸' },
  { city: 'South Padre Island', country: 'USA', flag: '🇺🇸' },
  { city: 'New Braunfels', country: 'USA', flag: '🇺🇸' },
  { city: 'San Marcos', country: 'USA', flag: '🇺🇸' },
  { city: 'Boerne', country: 'USA', flag: '🇺🇸' },

  // Utah
  { city: 'Salt Lake City', country: 'USA', flag: '🇺🇸' },
  { city: 'Moab', country: 'USA', flag: '🇺🇸' },
  { city: 'Park City', country: 'USA', flag: '🇺🇸' },
  { city: 'St. George', country: 'USA', flag: '🇺🇸' },
  { city: 'Provo', country: 'USA', flag: '🇺🇸' },
  { city: 'Ogden', country: 'USA', flag: '🇺🇸' },
  { city: 'Cedar City', country: 'USA', flag: '🇺🇸' },
  { city: 'Springdale', country: 'USA', flag: '🇺🇸' },
  { city: 'Kanab', country: 'USA', flag: '🇺🇸' },
  { city: 'Torrey', country: 'USA', flag: '🇺🇸' },

  // Vermont
  { city: 'Burlington', country: 'USA', flag: '🇺🇸' },
  { city: 'Stowe', country: 'USA', flag: '🇺🇸' },
  { city: 'Montpelier', country: 'USA', flag: '🇺🇸' },
  { city: 'Woodstock', country: 'USA', flag: '🇺🇸' },
  { city: 'Manchester', country: 'USA', flag: '🇺🇸' },
  { city: 'Brattleboro', country: 'USA', flag: '🇺🇸' },
  { city: 'Middlebury', country: 'USA', flag: '🇺🇸' },
  { city: 'Bennington', country: 'USA', flag: '🇺🇸' },

  // Virginia
  { city: 'Virginia Beach', country: 'USA', flag: '🇺🇸' },
  { city: 'Richmond', country: 'USA', flag: '🇺🇸' },
  { city: 'Norfolk', country: 'USA', flag: '🇺🇸' },
  { city: 'Arlington', country: 'USA', flag: '🇺🇸' },
  { city: 'Alexandria', country: 'USA', flag: '🇺🇸' },
  { city: 'Charlottesville', country: 'USA', flag: '🇺🇸' },
  { city: 'Williamsburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Roanoke', country: 'USA', flag: '🇺🇸' },
  { city: 'Lynchburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Fredericksburg', country: 'USA', flag: '🇺🇸' },
  { city: 'Staunton', country: 'USA', flag: '🇺🇸' },
  { city: 'Luray', country: 'USA', flag: '🇺🇸' },
  { city: 'Abingdon', country: 'USA', flag: '🇺🇸' },

  // Washington
  { city: 'Seattle', country: 'USA', flag: '🇺🇸' },
  { city: 'Spokane', country: 'USA', flag: '🇺🇸' },
  { city: 'Tacoma', country: 'USA', flag: '🇺🇸' },
  { city: 'Olympia', country: 'USA', flag: '🇺🇸' },
  { city: 'Bellingham', country: 'USA', flag: '🇺🇸' },
  { city: 'Leavenworth', country: 'USA', flag: '🇺🇸' },
  { city: 'Walla Walla', country: 'USA', flag: '🇺🇸' },
  { city: 'Port Townsend', country: 'USA', flag: '🇺🇸' },
  { city: 'Whidbey Island', country: 'USA', flag: '🇺🇸' },
  { city: 'San Juan Islands', country: 'USA', flag: '🇺🇸' },
  { city: 'Wenatchee', country: 'USA', flag: '🇺🇸' },
  { city: 'Yakima', country: 'USA', flag: '🇺🇸' },

  // West Virginia
  { city: 'Charleston', country: 'USA', flag: '🇺🇸' },
  { city: 'Huntington', country: 'USA', flag: '🇺🇸' },
  { city: 'Morgantown', country: 'USA', flag: '🇺🇸' },
  { city: 'Harpers Ferry', country: 'USA', flag: '🇺🇸' },
  { city: 'White Sulphur Springs', country: 'USA', flag: '🇺🇸' },
  { city: 'Lewisburg', country: 'USA', flag: '🇺🇸' },

  // Wisconsin
  { city: 'Milwaukee', country: 'USA', flag: '🇺🇸' },
  { city: 'Madison', country: 'USA', flag: '🇺🇸' },
  { city: 'Green Bay', country: 'USA', flag: '🇺🇸' },
  { city: 'Appleton', country: 'USA', flag: '🇺🇸' },
  { city: 'Door County', country: 'USA', flag: '🇺🇸' },
  { city: 'Wausau', country: 'USA', flag: '🇺🇸' },
  { city: 'Eau Claire', country: 'USA', flag: '🇺🇸' },
  { city: 'La Crosse', country: 'USA', flag: '🇺🇸' },
  { city: 'Bayfield', country: 'USA', flag: '🇺🇸' },

  // Wyoming
  { city: 'Cheyenne', country: 'USA', flag: '🇺🇸' },
  { city: 'Jackson Hole', country: 'USA', flag: '🇺🇸' },
  { city: 'Casper', country: 'USA', flag: '🇺🇸' },
  { city: 'Laramie', country: 'USA', flag: '🇺🇸' },
  { city: 'Cody', country: 'USA', flag: '🇺🇸' },
  { city: 'Sheridan', country: 'USA', flag: '🇺🇸' },
  { city: 'Lander', country: 'USA', flag: '🇺🇸' },
  { city: 'Dubois', country: 'USA', flag: '🇺🇸' },

  // Washington DC
  { city: 'Washington DC', country: 'USA', flag: '🇺🇸' },

  // US National Parks
  { city: 'Grand Canyon National Park', country: 'USA', flag: '🏜️' },
  { city: 'Yellowstone National Park', country: 'USA', flag: '🌋' },
  { city: 'Yosemite National Park', country: 'USA', flag: '🏔️' },
  { city: 'Zion National Park', country: 'USA', flag: '🏜️' },
  { city: 'Bryce Canyon National Park', country: 'USA', flag: '🏜️' },
  { city: 'Arches National Park', country: 'USA', flag: '🏜️' },
  { city: 'Canyonlands National Park', country: 'USA', flag: '🏜️' },
  { city: 'Capitol Reef National Park', country: 'USA', flag: '🏜️' },
  { city: 'Great Smoky Mountains National Park', country: 'USA', flag: '🌲' },
  { city: 'Rocky Mountain National Park', country: 'USA', flag: '🏔️' },
  { city: 'Olympic National Park', country: 'USA', flag: '🌲' },
  { city: 'Crater Lake National Park', country: 'USA', flag: '🏔️' },
  { city: 'Mount Rainier National Park', country: 'USA', flag: '🏔️' },
  { city: 'North Cascades National Park', country: 'USA', flag: '🏔️' },
  { city: 'Glacier National Park', country: 'USA', flag: '🏔️' },
  { city: 'Grand Teton National Park', country: 'USA', flag: '🏔️' },
  { city: 'Joshua Tree National Park', country: 'USA', flag: '🏜️' },
  { city: 'Death Valley National Park', country: 'USA', flag: '🏜️' },
  { city: 'Sequoia National Park', country: 'USA', flag: '🌲' },
  { city: 'Kings Canyon National Park', country: 'USA', flag: '🌲' },
  { city: 'Redwood National Park', country: 'USA', flag: '🌲' },
  { city: 'Acadia National Park', country: 'USA', flag: '🌲' },
  { city: 'Shenandoah National Park', country: 'USA', flag: '🌲' },
  { city: 'Everglades National Park', country: 'USA', flag: '🌿' },
  { city: 'Biscayne National Park', country: 'USA', flag: '🌊' },
  { city: 'Dry Tortugas National Park', country: 'USA', flag: '🌊' },
  { city: 'Congaree National Park', country: 'USA', flag: '🌿' },
  { city: 'Hot Springs National Park', country: 'USA', flag: '♨️' },
  { city: 'Mammoth Cave National Park', country: 'USA', flag: '🦇' },
  { city: 'Cuyahoga Valley National Park', country: 'USA', flag: '🌲' },
  { city: 'Isle Royale National Park', country: 'USA', flag: '🌲' },
  { city: 'Voyageurs National Park', country: 'USA', flag: '🌲' },
  { city: 'Badlands National Park', country: 'USA', flag: '🏜️' },
  { city: 'Wind Cave National Park', country: 'USA', flag: '🏔️' },
  { city: 'Theodore Roosevelt National Park', country: 'USA', flag: '🏜️' },
  { city: 'Mesa Verde National Park', country: 'USA', flag: '🏜️' },
  { city: 'Black Canyon of the Gunnison', country: 'USA', flag: '🏜️' },
  { city: 'Great Sand Dunes National Park', country: 'USA', flag: '🏜️' },
  { city: 'Great Basin National Park', country: 'USA', flag: '🏔️' },
  { city: 'Petrified Forest National Park', country: 'USA', flag: '🏜️' },
  { city: 'Saguaro National Park', country: 'USA', flag: '🏜️' },
  { city: 'Guadalupe Mountains National Park', country: 'USA', flag: '🏜️' },
  { city: 'Big Bend National Park', country: 'USA', flag: '🏜️' },
  { city: 'Carlsbad Caverns National Park', country: 'USA', flag: '🦇' },
  { city: 'White Sands National Park', country: 'USA', flag: '🏜️' },
  { city: 'Haleakala National Park', country: 'USA', flag: '🌋' },
  { city: 'Hawaii Volcanoes National Park', country: 'USA', flag: '🌋' },
  { city: 'Denali National Park', country: 'USA', flag: '🏔️' },
  { city: 'Kenai Fjords National Park', country: 'USA', flag: '🌊' },
  { city: 'Wrangell-St. Elias National Park', country: 'USA', flag: '🏔️' },
  { city: 'Glacier Bay National Park', country: 'USA', flag: '🏔️' },
  { city: 'Virgin Islands National Park', country: 'USA', flag: '🌊' },

  // Europe
  { city: 'Paris', country: 'France', flag: '🇫🇷' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { city: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { city: 'Madrid', country: 'Spain', flag: '🇪🇸' },
  { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { city: 'Berlin', country: 'Germany', flag: '🇩🇪' },
  { city: 'Munich', country: 'Germany', flag: '🇩🇪' },
  { city: 'Vienna', country: 'Austria', flag: '🇦🇹' },
  { city: 'Prague', country: 'Czech Republic', flag: '🇨🇿' },
  { city: 'Budapest', country: 'Hungary', flag: '🇭🇺' },
  { city: 'Athens', country: 'Greece', flag: '🇬🇷' },
  { city: 'Santorini', country: 'Greece', flag: '🇬🇷' },
  { city: 'Lisbon', country: 'Portugal', flag: '🇵🇹' },
  { city: 'Porto', country: 'Portugal', flag: '🇵🇹' },
  { city: 'Brussels', country: 'Belgium', flag: '🇧🇪' },
  { city: 'Zurich', country: 'Switzerland', flag: '🇨🇭' },
  { city: 'Geneva', country: 'Switzerland', flag: '🇨🇭' },
  { city: 'Copenhagen', country: 'Denmark', flag: '🇩🇰' },
  { city: 'Stockholm', country: 'Sweden', flag: '🇸🇪' },
  { city: 'Oslo', country: 'Norway', flag: '🇳🇴' },
  { city: 'Helsinki', country: 'Finland', flag: '🇫🇮' },
  { city: 'Reykjavik', country: 'Iceland', flag: '🇮🇸' },
  { city: 'Dublin', country: 'Ireland', flag: '🇮🇪' },
  { city: 'Edinburgh', country: 'Scotland', flag: '🇬🇧' },
  { city: 'Florence', country: 'Italy', flag: '🇮🇹' },
  { city: 'Venice', country: 'Italy', flag: '🇮🇹' },
  { city: 'Milan', country: 'Italy', flag: '🇮🇹' },
  { city: 'Naples', country: 'Italy', flag: '🇮🇹' },
  { city: 'Amalfi', country: 'Italy', flag: '🇮🇹' },
  { city: 'Seville', country: 'Spain', flag: '🇪🇸' },
  { city: 'Valencia', country: 'Spain', flag: '🇪🇸' },
  { city: 'Ibiza', country: 'Spain', flag: '🇪🇸' },
  { city: 'Dubrovnik', country: 'Croatia', flag: '🇭🇷' },
  { city: 'Split', country: 'Croatia', flag: '🇭🇷' },
  { city: 'Warsaw', country: 'Poland', flag: '🇵🇱' },
  { city: 'Krakow', country: 'Poland', flag: '🇵🇱' },
  { city: 'Bucharest', country: 'Romania', flag: '🇷🇴' },
  { city: 'Sofia', country: 'Bulgaria', flag: '🇧🇬' },
  { city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { city: 'Cappadocia', country: 'Turkey', flag: '🇹🇷' },
  { city: 'Antalya', country: 'Turkey', flag: '🇹🇷' },
  { city: 'Tallinn', country: 'Estonia', flag: '🇪🇪' },
  { city: 'Riga', country: 'Latvia', flag: '🇱🇻' },
  { city: 'Vilnius', country: 'Lithuania', flag: '🇱🇹' },
  { city: 'Bratislava', country: 'Slovakia', flag: '🇸🇰' },
  { city: 'Ljubljana', country: 'Slovenia', flag: '🇸🇮' },
  { city: 'Valletta', country: 'Malta', flag: '🇲🇹' },
  { city: 'Nicosia', country: 'Cyprus', flag: '🇨🇾' },
  { city: 'Monaco', country: 'Monaco', flag: '🇲🇨' },
  { city: 'Nice', country: 'France', flag: '🇫🇷' },
  { city: 'Lyon', country: 'France', flag: '🇫🇷' },
  { city: 'Marseille', country: 'France', flag: '🇫🇷' },
  { city: 'Bordeaux', country: 'France', flag: '🇫🇷' },

  // Asia
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { city: 'Kyoto', country: 'Japan', flag: '🇯🇵' },
  { city: 'Osaka', country: 'Japan', flag: '🇯🇵' },
  { city: 'Hiroshima', country: 'Japan', flag: '🇯🇵' },
  { city: 'Hokkaido', country: 'Japan', flag: '🇯🇵' },
  { city: 'Nara', country: 'Japan', flag: '🇯🇵' },
  { city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { city: 'Chiang Mai', country: 'Thailand', flag: '🇹🇭' },
  { city: 'Phuket', country: 'Thailand', flag: '🇹🇭' },
  { city: 'Koh Samui', country: 'Thailand', flag: '🇹🇭' },
  { city: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾' },
  { city: 'Penang', country: 'Malaysia', flag: '🇲🇾' },
  { city: 'Hanoi', country: 'Vietnam', flag: '🇻🇳' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', flag: '🇻🇳' },
  { city: 'Hoi An', country: 'Vietnam', flag: '🇻🇳' },
  { city: 'Ha Long Bay', country: 'Vietnam', flag: '🇻🇳' },
  { city: 'Siem Reap', country: 'Cambodia', flag: '🇰🇭' },
  { city: 'Phnom Penh', country: 'Cambodia', flag: '🇰🇭' },
  { city: 'Yangon', country: 'Myanmar', flag: '🇲🇲' },
  { city: 'Manila', country: 'Philippines', flag: '🇵🇭' },
  { city: 'Cebu', country: 'Philippines', flag: '🇵🇭' },
  { city: 'Boracay', country: 'Philippines', flag: '🇵🇭' },
  { city: 'Beijing', country: 'China', flag: '🇨🇳' },
  { city: 'Shanghai', country: 'China', flag: '🇨🇳' },
  { city: 'Chengdu', country: 'China', flag: '🇨🇳' },
  { city: "Xi'an", country: 'China', flag: '🇨🇳' },
  { city: 'Guilin', country: 'China', flag: '🇨🇳' },
  { city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { city: 'Macau', country: 'Macau', flag: '🇲🇴' },
  { city: 'Taipei', country: 'Taiwan', flag: '🇹🇼' },
  { city: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
  { city: 'Busan', country: 'South Korea', flag: '🇰🇷' },
  { city: 'Jeju Island', country: 'South Korea', flag: '🇰🇷' },
  { city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵' },
  { city: 'Pokhara', country: 'Nepal', flag: '🇳🇵' },
  { city: 'Delhi', country: 'India', flag: '🇮🇳' },
  { city: 'Mumbai', country: 'India', flag: '🇮🇳' },
  { city: 'Jaipur', country: 'India', flag: '🇮🇳' },
  { city: 'Agra', country: 'India', flag: '🇮🇳' },
  { city: 'Goa', country: 'India', flag: '🇮🇳' },
  { city: 'Kerala', country: 'India', flag: '🇮🇳' },
  { city: 'Varanasi', country: 'India', flag: '🇮🇳' },
  { city: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰' },
  { city: 'Dhaka', country: 'Bangladesh', flag: '🇧🇩' },
  { city: 'Islamabad', country: 'Pakistan', flag: '🇵🇰' },
  { city: 'Lahore', country: 'Pakistan', flag: '🇵🇰' },
  { city: 'Kabul', country: 'Afghanistan', flag: '🇦🇫' },
  { city: 'Tashkent', country: 'Uzbekistan', flag: '🇺🇿' },
  { city: 'Samarkand', country: 'Uzbekistan', flag: '🇺🇿' },
  { city: 'Almaty', country: 'Kazakhstan', flag: '🇰🇿' },
  { city: 'Tbilisi', country: 'Georgia', flag: '🇬🇪' },
  { city: 'Yerevan', country: 'Armenia', flag: '🇦🇲' },
  { city: 'Baku', country: 'Azerbaijan', flag: '🇦🇿' },
  { city: 'Tehran', country: 'Iran', flag: '🇮🇷' },
  { city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { city: 'Abu Dhabi', country: 'UAE', flag: '🇦🇪' },
  { city: 'Doha', country: 'Qatar', flag: '🇶🇦' },
  { city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦' },
  { city: 'Muscat', country: 'Oman', flag: '🇴🇲' },
  { city: 'Kuwait City', country: 'Kuwait', flag: '🇰🇼' },
  { city: 'Beirut', country: 'Lebanon', flag: '🇱🇧' },
  { city: 'Amman', country: 'Jordan', flag: '🇯🇴' },
  { city: 'Petra', country: 'Jordan', flag: '🇯🇴' },
  { city: 'Jerusalem', country: 'Israel', flag: '🇮🇱' },
  { city: 'Tel Aviv', country: 'Israel', flag: '🇮🇱' },
  { city: 'Ulaanbaatar', country: 'Mongolia', flag: '🇲🇳' },

  // Americas
  { city: 'New York', country: 'USA', flag: '🇺🇸' },
  { city: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
  { city: 'San Francisco', country: 'USA', flag: '🇺🇸' },
  { city: 'Miami', country: 'USA', flag: '🇺🇸' },
  { city: 'Chicago', country: 'USA', flag: '🇺🇸' },
  { city: 'Las Vegas', country: 'USA', flag: '🇺🇸' },
  { city: 'New Orleans', country: 'USA', flag: '🇺🇸' },
  { city: 'Nashville', country: 'USA', flag: '🇺🇸' },
  { city: 'Seattle', country: 'USA', flag: '🇺🇸' },
  { city: 'Boston', country: 'USA', flag: '🇺🇸' },
  { city: 'Washington DC', country: 'USA', flag: '🇺🇸' },
  { city: 'Austin', country: 'USA', flag: '🇺🇸' },
  { city: 'Denver', country: 'USA', flag: '🇺🇸' },
  { city: 'Honolulu', country: 'USA', flag: '🇺🇸' },
  { city: 'Toronto', country: 'Canada', flag: '🇨🇦' },
  { city: 'Vancouver', country: 'Canada', flag: '🇨🇦' },
  { city: 'Montreal', country: 'Canada', flag: '🇨🇦' },
  { city: 'Quebec City', country: 'Canada', flag: '🇨🇦' },
  { city: 'Mexico City', country: 'Mexico', flag: '🇲🇽' },
  { city: 'Cancun', country: 'Mexico', flag: '🇲🇽' },
  { city: 'Tulum', country: 'Mexico', flag: '🇲🇽' },
  { city: 'Oaxaca', country: 'Mexico', flag: '🇲🇽' },
  { city: 'Guadalajara', country: 'Mexico', flag: '🇲🇽' },
  { city: 'Havana', country: 'Cuba', flag: '🇨🇺' },
  { city: 'San José', country: 'Costa Rica', flag: '🇨🇷' },
  { city: 'Panama City', country: 'Panama', flag: '🇵🇦' },
  { city: 'Bogotá', country: 'Colombia', flag: '🇨🇴' },
  { city: 'Medellín', country: 'Colombia', flag: '🇨🇴' },
  { city: 'Cartagena', country: 'Colombia', flag: '🇨🇴' },
  { city: 'Lima', country: 'Peru', flag: '🇵🇪' },
  { city: 'Cusco', country: 'Peru', flag: '🇵🇪' },
  { city: 'Machu Picchu', country: 'Peru', flag: '🇵🇪' },
  { city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷' },
  { city: 'Mendoza', country: 'Argentina', flag: '🇦🇷' },
  { city: 'Santiago', country: 'Chile', flag: '🇨🇱' },
  { city: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷' },
  { city: 'São Paulo', country: 'Brazil', flag: '🇧🇷' },
  { city: 'Salvador', country: 'Brazil', flag: '🇧🇷' },
  { city: 'Quito', country: 'Ecuador', flag: '🇪🇨' },
  { city: 'Galápagos Islands', country: 'Ecuador', flag: '🇪🇨' },
  { city: 'La Paz', country: 'Bolivia', flag: '🇧🇴' },
  { city: 'Montevideo', country: 'Uruguay', flag: '🇺🇾' },
  { city: 'Asunción', country: 'Paraguay', flag: '🇵🇾' },
  { city: 'Caracas', country: 'Venezuela', flag: '🇻🇪' },
  { city: 'Punta Cana', country: 'Dominican Republic', flag: '🇩🇴' },
  { city: 'Nassau', country: 'Bahamas', flag: '🇧🇸' },
  { city: 'Kingston', country: 'Jamaica', flag: '🇯🇲' },
  { city: 'Bridgetown', country: 'Barbados', flag: '🇧🇧' },

  // Africa
  { city: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
  { city: 'Luxor', country: 'Egypt', flag: '🇪🇬' },
  { city: 'Marrakech', country: 'Morocco', flag: '🇲🇦' },
  { city: 'Casablanca', country: 'Morocco', flag: '🇲🇦' },
  { city: 'Fez', country: 'Morocco', flag: '🇲🇦' },
  { city: 'Tunis', country: 'Tunisia', flag: '🇹🇳' },
  { city: 'Algiers', country: 'Algeria', flag: '🇩🇿' },
  { city: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Mombasa', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Zanzibar', country: 'Tanzania', flag: '🇹🇿' },
  { city: 'Dar es Salaam', country: 'Tanzania', flag: '🇹🇿' },
  { city: 'Cape Town', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Durban', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Accra', country: 'Ghana', flag: '🇬🇭' },
  { city: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Abuja', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Dakar', country: 'Senegal', flag: '🇸🇳' },
  { city: 'Addis Ababa', country: 'Ethiopia', flag: '🇪🇹' },
  { city: 'Kampala', country: 'Uganda', flag: '🇺🇬' },
  { city: 'Kigali', country: 'Rwanda', flag: '🇷🇼' },
  { city: 'Lusaka', country: 'Zambia', flag: '🇿🇲' },
  { city: 'Harare', country: 'Zimbabwe', flag: '🇿🇼' },
  { city: 'Antananarivo', country: 'Madagascar', flag: '🇲🇬' },
  { city: 'Mauritius', country: 'Mauritius', flag: '🇲🇺' },
  { city: 'Seychelles', country: 'Seychelles', flag: '🇸🇨' },
  { city: 'Tripoli', country: 'Libya', flag: '🇱🇾' },
  { city: 'Khartoum', country: 'Sudan', flag: '🇸🇩' },

  // Oceania
  { city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { city: 'Melbourne', country: 'Australia', flag: '🇦🇺' },
  { city: 'Brisbane', country: 'Australia', flag: '🇦🇺' },
  { city: 'Perth', country: 'Australia', flag: '🇦🇺' },
  { city: 'Cairns', country: 'Australia', flag: '🇦🇺' },
  { city: 'Auckland', country: 'New Zealand', flag: '🇳🇿' },
  { city: 'Queenstown', country: 'New Zealand', flag: '🇳🇿' },
  { city: 'Wellington', country: 'New Zealand', flag: '🇳🇿' },
  { city: 'Fiji', country: 'Fiji', flag: '🇫🇯' },
  { city: 'Bora Bora', country: 'French Polynesia', flag: '🇵🇫' },
  { city: 'Tahiti', country: 'French Polynesia', flag: '🇵🇫' },
  { city: 'Maldives', country: 'Maldives', flag: '🇲🇻' },
  { city: 'Papeete', country: 'French Polynesia', flag: '🇵🇫' },
];

// ---- AUTOCOMPLETE LOGIC ----
(function () {
  const input   = document.getElementById('destination');
  const list    = document.getElementById('autocomplete-list');
  let activeIdx = -1;

  function showSuggestions(query) {
    list.innerHTML = '';
    activeIdx = -1;
    if (!query || query.length < 2) return;

    const q = query.toLowerCase();

    // Score matches: city starts-with = 3, city includes = 2, country starts-with = 1
    const scored = CITIES.map(c => {
      const city    = c.city.toLowerCase();
      const country = c.country.toLowerCase();
      let score = 0;
      if (city === q)               score = 4;
      else if (city.startsWith(q))  score = 3;
      else if (city.includes(q))    score = 2;
      else if (country.startsWith(q)) score = 1;
      else if (country.includes(q)) score = 0.5;
      return { ...c, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

    scored.forEach(m => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="city-flag">${m.flag}</span>
        <span>
          <span class="city-name">${m.city}</span>
          <span class="city-country">, ${m.country}</span>
        </span>`;
      li.addEventListener('mousedown', () => {
        input.value = `${m.city}, ${m.country}`;
        list.innerHTML = '';
      });
      list.appendChild(li);
    });
  }

  function setActive(items, idx) {
    items.forEach(i => i.classList.remove('active'));
    if (idx >= 0 && idx < items.length) items[idx].classList.add('active');
  }

  input.addEventListener('input', () => showSuggestions(input.value));

  input.addEventListener('keydown', e => {
    const items = list.querySelectorAll('li');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      setActive(items, activeIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      setActive(items, activeIdx);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      items[activeIdx].dispatchEvent(new Event('mousedown'));
    } else if (e.key === 'Escape') {
      list.innerHTML = '';
    }
  });

  // Close on click outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.autocomplete-wrap')) list.innerHTML = '';
  });
})();

// ============================================
//  PDF DOWNLOAD
//  Builds a hidden print-ready div and triggers
//  the browser's native Save as PDF dialog
// ============================================

// Store trip data globally so PDF can access it
let currentTripData = null;

function downloadPDF() {
  if (!currentTripData) return;

  const { data, formData, nights } = currentTripData;

  // Build PDF HTML
  const html = buildPDFHTML(data, formData, nights);

  // Create or replace hidden PDF container
  let container = document.getElementById('pdf-content');
  if (container) container.remove();
  container = document.createElement('div');
  container.id = 'pdf-content';
  container.innerHTML = html;
  document.body.appendChild(container);

  // Trigger print → Save as PDF
  const originalTitle = document.title;
  document.title = `Voyagr — ${data.destination} Trip`;
  window.print();
  document.title = originalTitle;
}

function buildPDFHTML(data, formData, nights) {
  const meta = `${formatDateRange(formData.startDate, formData.endDate)} · ${nights} nights · ${formData.travelers} travelers · ${selectedVibe}`;

  // Itinerary
  const itineraryHTML = (data.itinerary || []).map(day => `
    <div class="pdf-day">
      <div class="pdf-day-label">Day ${day.day}</div>
      <div class="pdf-day-theme">${escHtml(day.theme)}</div>
      ${(day.activities || []).map(a => `
        <div class="pdf-activity">
          <span class="pdf-time">${escHtml(a.time)}</span>
          <span>${escHtml(a.activity)}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  // Hotels
  const hotelsHTML = (data.hotels || []).map(h => `
    <div class="pdf-card">
      <div class="pdf-card-name">🏨 ${escHtml(h.name)}</div>
      <div class="pdf-card-desc">${escHtml(h.description)}</div>
      <div class="pdf-card-detail">${escHtml(h.pricePerNight)} · ${escHtml(h.highlight)}</div>
    </div>
  `).join('');

  // Restaurants
  const restsHTML = (data.restaurants || []).map(r => `
    <div class="pdf-card">
      <div class="pdf-card-name">🍽️ ${escHtml(r.name)} <span style="font-weight:400;color:#888">(${escHtml(r.cuisine)})</span></div>
      <div class="pdf-card-desc">${escHtml(r.description)}</div>
      <div class="pdf-card-detail">Must try: ${escHtml(r.mustTry)} · ${escHtml(r.priceRange)}</div>
    </div>
  `).join('');

  // Budget
  const total = (data.budget?.items || []).reduce((s, i) => s + (i.estimated || 0), 0);
  const budgetHTML = (data.budget?.items || []).map(item => `
    <div class="pdf-budget-row">
      <span>${escHtml(item.category)}</span>
      <span>$${item.estimated.toLocaleString()}</span>
    </div>
  `).join('') + `
    <div class="pdf-budget-total">
      <span>Total Estimated (per person)</span>
      <span>$${total.toLocaleString()}</span>
    </div>`;

  // Packing list
  const packingHTML = Object.entries(data.packingList || {}).map(([cat, items]) => `
    <div>
      <div class="pdf-packing-cat">${escHtml(cat)}</div>
      ${(items || []).map(item => `<div class="pdf-packing-item">${escHtml(item)}</div>`).join('')}
    </div>
  `).join('');

  return `
    <div class="pdf-header">
      <div class="pdf-logo">VOYAGR</div>
      <div class="pdf-title">Your Trip to ${escHtml(data.destination)}</div>
      <div class="pdf-meta">${escHtml(meta)}</div>
    </div>

    <div class="pdf-section-title">📅 Day-by-Day Itinerary</div>
    ${itineraryHTML}

    <div class="pdf-section-title">🏨 Where to Stay</div>
    <div class="pdf-two-col">${hotelsHTML}</div>

    <div class="pdf-section-title">🍽️ Where to Eat</div>
    <div class="pdf-two-col">${restsHTML}</div>

    <div class="pdf-section-title">💰 Budget Breakdown</div>
    ${budgetHTML}

    <div class="pdf-section-title">🎒 Packing List</div>
    <div class="pdf-packing-grid">${packingHTML}</div>

    <div style="margin-top:32px;text-align:center;font-size:0.75rem;color:#aaa">
      Generated by Voyagr · voyagr-9haw.onrender.com
    </div>
  `;
}

// ============================================
//  WEATHER WIDGET
//  Uses Open-Meteo (free, no API key needed)
//  + Geocoding API to convert city to coords
// ============================================

const WMO_CODES = {
  0: { icon: '☀️', desc: 'Clear' },
  1: { icon: '🌤️', desc: 'Mostly clear' },
  2: { icon: '⛅', desc: 'Partly cloudy' },
  3: { icon: '☁️', desc: 'Overcast' },
  45: { icon: '🌫️', desc: 'Foggy' },
  48: { icon: '🌫️', desc: 'Icy fog' },
  51: { icon: '🌦️', desc: 'Light drizzle' },
  53: { icon: '🌦️', desc: 'Drizzle' },
  55: { icon: '🌧️', desc: 'Heavy drizzle' },
  61: { icon: '🌧️', desc: 'Light rain' },
  63: { icon: '🌧️', desc: 'Rain' },
  65: { icon: '🌧️', desc: 'Heavy rain' },
  71: { icon: '🌨️', desc: 'Light snow' },
  73: { icon: '🌨️', desc: 'Snow' },
  75: { icon: '❄️', desc: 'Heavy snow' },
  80: { icon: '🌦️', desc: 'Showers' },
  81: { icon: '🌧️', desc: 'Rain showers' },
  82: { icon: '⛈️', desc: 'Heavy showers' },
  95: { icon: '⛈️', desc: 'Thunderstorm' },
  99: { icon: '⛈️', desc: 'Severe storm' },
};

async function fetchWeather(destination, startDate, endDate) {
  const strip   = document.getElementById('weather-strip');
  const loading = document.getElementById('weather-loading');
  const daysEl  = document.getElementById('weather-days');

  strip.style.display = 'block';
  loading.style.display = 'block';
  daysEl.innerHTML = '';

  try {
    // Step 1: Geocode destination to lat/lng
    const cityName = destination.split(',')[0].trim();
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || !geoData.results.length) {
      loading.textContent = '🌍 Weather unavailable for this destination.';
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Fetch forecast for trip dates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&start_date=${startDate}&end_date=${endDate}`
    );
    const weatherData = await weatherRes.json();

    loading.style.display = 'none';

    if (!weatherData.daily || !weatherData.daily.time.length) {
      loading.style.display = 'block';
      loading.textContent = '🌍 Weather data not available for these dates.';
      return;
    }

    const days    = weatherData.daily.time;
    const codes   = weatherData.daily.weathercode;
    const maxTemps = weatherData.daily.temperature_2m_max;
    const minTemps = weatherData.daily.temperature_2m_min;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    daysEl.innerHTML = days.map((date, i) => {
      const d    = new Date(date + 'T00:00');
      const code = codes[i];
      const w    = WMO_CODES[code] || { icon: '🌡️', desc: 'Variable' };
      const max  = Math.round(maxTemps[i]);
      const min  = Math.round(minTemps[i]);
      const label = i === 0 ? 'Today' : dayNames[d.getDay()];

      return `
        <div class="weather-day">
          <div class="weather-day-label">${label}</div>
          <div class="weather-day-icon">${w.icon}</div>
          <div class="weather-day-temp">${max}° / ${min}°</div>
          <div class="weather-day-desc">${w.desc}</div>
        </div>`;
    }).join('') + `<div class="weather-note">📍 ${name}, ${country} · °F · Forecast via Open-Meteo</div>`;

  } catch (err) {
    loading.textContent = '🌍 Could not load weather for this destination.';
    console.error('Weather error:', err);
  }
}

// ============================================
//  SAVE & SHARE ITINERARY
//  Encodes trip data into a URL parameter
//  so anyone with the link can view the trip
// ============================================

function shareItinerary() {
  if (!currentTripData) return;

  // Compress trip data into base64 URL param
  const payload = JSON.stringify({
    data:     currentTripData.data,
    formData: currentTripData.formData,
    nights:   currentTripData.nights,
    vibe:     selectedVibe,
  });

  const encoded = btoa(unescape(encodeURIComponent(payload)));
  const shareUrl = `${window.location.origin}${window.location.pathname}?trip=${encoded}`;

  document.getElementById('share-link-input').value = shareUrl;
  document.getElementById('share-overlay').style.display = 'block';
  document.getElementById('share-modal').style.display   = 'flex';
  document.getElementById('share-copy-btn').textContent  = 'Copy';
}

function closeShareModal() {
  document.getElementById('share-overlay').style.display = 'none';
  document.getElementById('share-modal').style.display   = 'none';
}

function copyShareLink() {
  const input = document.getElementById('share-link-input');
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById('share-copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

// On page load — check if there's a shared trip in the URL
(function loadSharedTrip() {
  const params = new URLSearchParams(window.location.search);
  const trip   = params.get('trip');
  if (!trip) return;

  try {
    const decoded  = JSON.parse(decodeURIComponent(escape(atob(trip))));
    const { data, formData, nights, vibe } = decoded;
    selectedVibe = vibe || 'Cultural & Historical';
    renderResults(data, formData, nights);
  } catch (e) {
    console.error('Could not load shared trip:', e);
  }
})();

// ============================================
//  INTERACTIVE MAP
//  Uses Leaflet.js + OpenStreetMap (free)
//  Geocodes each day's activities and plots them
// ============================================

let mapInstance = null;

async function renderMap(itinerary, destination) {
  // Wait for tab to be visible
  await new Promise(r => setTimeout(r, 100));

  const mapEl = document.getElementById('trip-map');
  if (!mapEl) return;

  // Destroy existing map instance
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // Geocode the destination first for initial view
  try {
    const geoRes  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination.split(',')[0])}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    const result  = geoData.results?.[0];

    const lat = result?.latitude  || 20;
    const lng = result?.longitude || 0;

    mapInstance = L.map('trip-map').setView([lat, lng], 12);

    // Use OpenStreetMap tiles (free, no key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Day colors
    const colors = ['#c9a96e', '#4a7fa5', '#6eb5c0', '#a07840', '#7a9fc0', '#e8c98a', '#5a8fb5'];

    // Plot each day's activities
    const bounds = [];
    for (let i = 0; i < itinerary.length; i++) {
      const day   = itinerary[i];
      const color = colors[i % colors.length];

      for (const activity of (day.activities || [])) {
        // Extract location hint from activity text
        const locationHint = extractLocation(activity.activity, destination);
        if (!locationHint) continue;

        try {
          const aRes  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationHint)}&count=1&language=en&format=json`);
          const aData = await aRes.json();
          const loc   = aData.results?.[0];
          if (!loc) continue;

          // Only use results near the destination
          const dist = Math.abs(loc.latitude - lat) + Math.abs(loc.longitude - lng);
          if (dist > 5) continue;

          const marker = L.circleMarker([loc.latitude, loc.longitude], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          }).addTo(mapInstance);

          marker.bindPopup(`
            <div style="font-family:sans-serif;min-width:180px">
              <div style="font-size:0.7rem;color:${color};font-weight:600;text-transform:uppercase;letter-spacing:0.1em">Day ${day.day} · ${activity.time}</div>
              <div style="margin-top:4px;font-size:0.88rem">${activity.activity}</div>
            </div>
          `);

          bounds.push([loc.latitude, loc.longitude]);
        } catch { continue; }
      }
    }

    // Fit map to all markers
    if (bounds.length > 1) {
      mapInstance.fitBounds(bounds, { padding: [40, 40] });
    }

  } catch (err) {
    document.getElementById('map-content').innerHTML = '<p style="color:var(--text-muted);padding:20px">Map could not be loaded for this destination.</p>';
    console.error('Map error:', err);
  }
}

function extractLocation(activityText, destination) {
  // Try to extract a named place from the activity description
  const city = destination.split(',')[0].trim();
  // Look for "at [Place]" or "visit [Place]" patterns
  const patterns = [
    /\bat\s+([A-Z][A-Za-z\s]{3,30}?)(?:\s+(?:for|to|and|,|\.|\bwhere\b))/,
    /\bvisit\s+(?:the\s+)?([A-Z][A-Za-z\s]{3,30}?)(?:\s+(?:for|to|and|,|\.))/,
    /\bexplore\s+(?:the\s+)?([A-Z][A-Za-z\s]{3,30}?)(?:\s+(?:for|to|and|,|\.))/,
    /\b([A-Z][A-Za-z\s]{3,25}(?:Museum|Park|Temple|Palace|Garden|Tower|Bridge|Square|Market|Beach|Castle|Cathedral|Monument|Center|Centre|Station))\b/,
  ];

  for (const pattern of patterns) {
    const match = activityText.match(pattern);
    if (match) return `${match[1].trim()} ${city}`;
  }
  return null;
}

// Wire map tab click to render map
document.addEventListener('click', e => {
  if (e.target.matches('.tab') && e.target.dataset.tab === 'map') {
    if (currentTripData) {
      setTimeout(() => renderMap(currentTripData.data.itinerary, currentTripData.data.destination), 200);
    }
  }
});

// ============================================
//  TRIP COMPARISON
//  Generates budget vs luxury versions of the
//  same trip side by side using Claude
// ============================================

async function generateComparison() {
  if (!currentTripData) return;

  const btn     = document.getElementById('compare-btn');
  const results = document.getElementById('compare-results');
  const intro   = document.querySelector('.compare-intro');

  btn.disabled    = true;
  btn.textContent = 'Generating...';
  results.style.display  = 'block';
  results.innerHTML      = '<div class="compare-loading">✨ Generating your budget vs luxury comparison...</div>';

  const { data, formData, nights } = currentTripData;

  try {
    const prompt = `Compare a ${nights}-night trip to ${data.destination} for ${formData.travelers} travelers.

Return ONLY valid JSON with this exact structure:
{
  "budget": {
    "title": "Budget Trip",
    "subtitle": "Smart savings without sacrificing fun",
    "accommodation": ["Hotel name — brief description — ~$X/night", "..."],
    "dining": ["Restaurant — type — ~$X per person", "..."],
    "activities": ["Activity — brief note — ~$X", "..."],
    "transport": ["Transport tip", "..."],
    "totalPerPerson": 800
  },
  "luxury": {
    "title": "Luxury Trip",
    "subtitle": "The finest experiences money can buy",
    "accommodation": ["Hotel name — brief description — ~$X/night", "..."],
    "dining": ["Restaurant — type — ~$X per person", "..."],
    "activities": ["Activity — brief note — ~$X", "..."],
    "transport": ["Transport tip", "..."],
    "totalPerPerson": 3500
  }
}

Give 3 options each for accommodation, dining, activities, and transport. Make them specific to ${data.destination}.`;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: 'You are a travel expert. Respond with valid JSON only — no markdown, no preamble.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const json = await res.json();
    let raw = json.content[0].text;
    raw = raw.replace(/```json|```/g, '').trim();
    const comparison = JSON.parse(raw);

    results.innerHTML = renderComparison(comparison);
    intro.style.display = 'none';

  } catch (err) {
    results.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center">Could not generate comparison. Please try again.</p>';
    btn.disabled    = false;
    btn.textContent = '⚖️ Generate Comparison';
    console.error(err);
  }
}

function renderComparison(c) {
  function renderCol(plan, type) {
    const sections = [
      { key: 'accommodation', label: '🏨 Accommodation' },
      { key: 'dining',        label: '🍽️ Dining' },
      { key: 'activities',    label: '🎯 Activities' },
      { key: 'transport',     label: '🚌 Transport' },
    ];

    const sectionsHTML = sections.map(s => `
      <div class="compare-section-title">${s.label}</div>
      ${(plan[s.key] || []).map(item => `<div class="compare-item">${escHtml(item)}</div>`).join('')}
    `).join('');

    return `
      <div class="compare-col ${type}">
        <div class="compare-col-header">
          ${escHtml(plan.title)}
          <div style="font-size:0.8rem;font-family:'DM Sans',sans-serif;font-weight:300;margin-top:4px;opacity:0.8">${escHtml(plan.subtitle)}</div>
        </div>
        <div class="compare-col-body">
          ${sectionsHTML}
          <div class="compare-total">~$${(plan.totalPerPerson || 0).toLocaleString()} <span style="font-size:1rem;color:var(--text-muted)">per person</span></div>
        </div>
      </div>`;
  }

  return `<div class="compare-grid">
    ${renderCol(c.budget, 'budget')}
    ${renderCol(c.luxury, 'luxury')}
  </div>`;
}
