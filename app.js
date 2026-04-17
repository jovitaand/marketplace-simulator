const listings = [
  {
    id: 1,
    title: "Vintage teak media console",
    price: 240,
    category: "Home",
    seller: "Studio North",
    location: "Downtown",
    rating: 4.9,
    responseRate: 96,
    sponsored: true,
    color: "linear-gradient(135deg, #0f766e, #f97316)",
    blurb: "Mid-century piece promoted to home upgraders with strong click-through from carousel ads.",
  },
  {
    id: 2,
    title: "Campus commuter bike",
    price: 140,
    category: "Vehicles",
    seller: "Pedal Pop",
    location: "University District",
    rating: 4.7,
    responseRate: 88,
    sponsored: false,
    color: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    blurb: "Budget-friendly bike with strong organic saves and quick message-to-sale conversion.",
  },
  {
    id: 3,
    title: "Handmade ceramic dinner set",
    price: 85,
    category: "Home",
    seller: "Clay Theory",
    location: "Old Town",
    rating: 5,
    responseRate: 98,
    sponsored: true,
    color: "linear-gradient(135deg, #7c2d12, #fdba74)",
    blurb: "Creator-led product with social proof, limited drops, and healthy repeat buyer demand.",
  },
  {
    id: 4,
    title: "Refurbished gaming laptop",
    price: 680,
    category: "Electronics",
    seller: "Byte Bazaar",
    location: "Tech Park",
    rating: 4.8,
    responseRate: 93,
    sponsored: true,
    color: "linear-gradient(135deg, #111827, #8b5cf6)",
    blurb: "High-value listing boosted for gamers and creators with aggressive retargeting.",
  },
  {
    id: 5,
    title: "Toddler activity table",
    price: 55,
    category: "Family",
    seller: "Nest & Nook",
    location: "Maple Heights",
    rating: 4.6,
    responseRate: 91,
    sponsored: false,
    color: "linear-gradient(135deg, #65a30d, #fde047)",
    blurb: "Popular with family-focused audiences and local pickup incentives.",
  },
  {
    id: 6,
    title: "Collector vinyl bundle",
    price: 120,
    category: "Collectibles",
    seller: "Needle Drop",
    location: "Riverfront",
    rating: 4.9,
    responseRate: 95,
    sponsored: true,
    color: "linear-gradient(135deg, #86198f, #f0abfc)",
    blurb: "Niche inventory that spikes when collector audiences are active and urgency messaging is used.",
  },
];

const campaignProfiles = {
  "local-families": { reach: 22400, ctr: 2.8, leadRate: 0.77, topCategory: "Family" },
  students: { reach: 31600, ctr: 3.4, leadRate: 0.62, topCategory: "Vehicles" },
  collectors: { reach: 18200, ctr: 4.2, leadRate: 0.88, topCategory: "Collectibles" },
  "home-upgraders": { reach: 26800, ctr: 3.1, leadRate: 0.81, topCategory: "Home" },
};

const state = {
  category: "All",
  search: "",
  sponsoredOnly: false,
  audience: "local-families",
  objective: "messages",
  budget: 120,
  messages: [
    {
      buyer: "Amina",
      listing: "Vintage teak media console",
      time: "2m ago",
      text: "Is delivery available this evening if I pay now?",
    },
    {
      buyer: "Leo",
      listing: "Refurbished gaming laptop",
      time: "6m ago",
      text: "Can you share benchmark screenshots and battery health details?",
    },
    {
      buyer: "Maya",
      listing: "Toddler activity table",
      time: "11m ago",
      text: "Would you bundle this with chairs if I pick up today?",
    },
  ],
};

const listingGrid = document.querySelector("#listingGrid");
const template = document.querySelector("#listingTemplate");
const categoryFilters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const sponsoredOnly = document.querySelector("#sponsoredOnly");
const sellerBoard = document.querySelector("#sellerBoard");
const messagePanel = document.querySelector("#messagePanel");
const budgetInput = document.querySelector("#budgetInput");
const budgetOutput = document.querySelector("#budgetOutput");
const objectiveSelect = document.querySelector("#objectiveSelect");
const audienceSelect = document.querySelector("#audienceSelect");
const campaignForm = document.querySelector("#campaignForm");

const categories = ["All", ...new Set(listings.map((listing) => listing.category))];

// Formats numeric values as whole-dollar USD prices for cards and controls.
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

// Applies the current search, category, and sponsorship filters to the listing set.
function getFilteredListings() {
  return listings.filter((listing) => {
    const categoryMatch = state.category === "All" || listing.category === state.category;
    const sponsoredMatch = !state.sponsoredOnly || listing.sponsored;
    const searchMatch = [listing.title, listing.seller, listing.category, listing.blurb]
      .join(" ")
      .toLowerCase()
      .includes(state.search.toLowerCase());
    return categoryMatch && sponsoredMatch && searchMatch;
  });
}

// Builds the category chip row and keeps the active filter visually in sync with state.
function renderCategories() {
  categoryFilters.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip ${state.category === category ? "is-active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.category = category;
      renderCategories();
      renderListings();
    });
    categoryFilters.appendChild(button);
  });
}

// Renders marketplace cards based on the current filters and wires up seller messaging.
function renderListings() {
  listingGrid.innerHTML = "";
  const filteredListings = getFilteredListings();

  if (!filteredListings.length) {
    const empty = document.createElement("div");
    empty.className = "message-card";
    empty.innerHTML = "<strong>No listings match this audience mix.</strong><p>Try another category, keyword, or sponsored toggle.</p>";
    listingGrid.appendChild(empty);
    return;
  }

  filteredListings.forEach((listing, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".listing-card");
    const image = node.querySelector(".listing-card__image");
    const category = node.querySelector(".pill--category");
    const sponsoredBadge = node.querySelector(".pill--sponsored");
    const title = node.querySelector("h3");
    const price = node.querySelector(".listing-card__price");
    const meta = node.querySelector(".listing-card__meta");
    const blurb = node.querySelector(".listing-card__blurb");
    const sellerMini = node.querySelector(".seller-mini");
    const messageButton = node.querySelector(".button");

    card.style.animationDelay = `${index * 80}ms`;
    image.style.background = listing.color;
    category.textContent = listing.category;
    sponsoredBadge.hidden = !listing.sponsored;
    title.textContent = listing.title;
    price.textContent = formatCurrency(listing.price);
    meta.textContent = `${listing.location} • ${listing.rating}★ rating • ${listing.responseRate}% response rate`;
    blurb.textContent = listing.blurb;
    sellerMini.textContent = `${listing.seller}`;

    messageButton.addEventListener("click", () => {
      const note = {
        buyer: "You",
        listing: listing.title,
        time: "now",
        text: `Hi ${listing.seller}, I saw your ${listing.category.toLowerCase()} listing. Is this still available?`,
      };
      state.messages.unshift(note);
      state.messages = state.messages.slice(0, 5);
      updateHeroStats();
      renderMessages();
    });

    listingGrid.appendChild(node);
  });
}

// Converts listing performance into seller momentum cards for the reputation panel.
function renderSellerBoard() {
  sellerBoard.innerHTML = "";
  const sellers = listings.map((listing) => {
    const momentum = Math.round((listing.responseRate + listing.rating * 20 + (listing.sponsored ? 10 : 0)) / 2);
    return {
      seller: listing.seller,
      listing: listing.title,
      momentum,
      conversion: Math.min(92, Math.round(listing.responseRate * 0.66)),
    };
  });

  sellers
    .sort((a, b) => b.momentum - a.momentum)
    .forEach((seller) => {
      const row = document.createElement("article");
      row.className = "seller-row";
      row.innerHTML = `
        <div class="seller-row__top">
          <div>
            <strong>${seller.seller}</strong>
            <span class="seller-row__label">${seller.listing}</span>
          </div>
          <strong>${seller.momentum}</strong>
        </div>
        <div class="progress" aria-label="Momentum score">
          <span style="width:${seller.momentum}%"></span>
        </div>
        <p class="seller-row__label">Checkout likelihood: ${seller.conversion}%</p>
      `;
      sellerBoard.appendChild(row);
    });
}

// Repaints the inbox simulation with the latest buyer and system-generated messages.
function renderMessages() {
  messagePanel.innerHTML = "";
  state.messages.forEach((message) => {
    const card = document.createElement("article");
    card.className = "message-card";
    card.innerHTML = `
      <div class="message-card__meta">
        <strong>${message.buyer}</strong>
        <span>${message.time}</span>
      </div>
      <p><strong>${message.listing}</strong></p>
      <p>${message.text}</p>
    `;
    messagePanel.appendChild(card);
  });
}

// Refreshes the top-level platform summary using the current campaign and inbox state.
function updateHeroStats() {
  const shoppers = 18000 + state.budget * 7 + (state.audience === "students" ? 900 : 0);
  const roasBase = state.objective === "sales" ? 5.4 : state.objective === "awareness" ? 3.6 : 4.8;
  const audienceBonus = campaignProfiles[state.audience].ctr / 10;

  document.querySelector("#activeShoppers").textContent = shoppers.toLocaleString();
  document.querySelector("#platformRoas").textContent = `${(roasBase + audienceBonus).toFixed(1)}x`;
  document.querySelector("#messageCount").textContent = (1240 + state.messages.length * 19).toLocaleString();
}

// Calculates projected campaign performance metrics from the selected audience, goal, and budget.
function updateCampaignMetrics() {
  const profile = campaignProfiles[state.audience];
  const objectiveMultiplier =
    state.objective === "sales" ? 1.16 : state.objective === "awareness" ? 0.85 : 1;
  const reach = Math.round(profile.reach + state.budget * 34 * objectiveMultiplier);
  const ctr = (profile.ctr + state.budget / 300).toFixed(1);
  const leads = Math.round((reach * (Number(ctr) / 100) * profile.leadRate) / 3.6);
  const cpl = (state.budget / Math.max(leads, 1)).toFixed(2);

  document.querySelector("#projectedReach").textContent = reach.toLocaleString();
  document.querySelector("#projectedCtr").textContent = `${ctr}%`;
  document.querySelector("#projectedLeads").textContent = leads.toLocaleString();
  document.querySelector("#projectedCpl").textContent = `$${cpl}`;
  updateHeroStats();
}

// Cycles through predefined audiences to simulate quick testing of targeting segments.
function rotateAudience() {
  const keys = Object.keys(campaignProfiles);
  const nextIndex = (keys.indexOf(state.audience) + 1) % keys.length;
  state.audience = keys[nextIndex];
  audienceSelect.value = state.audience;
  updateCampaignMetrics();
}

document.querySelector("#boostTopSeller").addEventListener("click", () => {
  const bestListing = listings.reduce((best, current) => {
    const bestScore = best.rating + best.responseRate / 100 + (best.sponsored ? 0.25 : 0);
    const currentScore = current.rating + current.responseRate / 100 + (current.sponsored ? 0.25 : 0);
    return currentScore > bestScore ? current : best;
  });

  if (!bestListing.sponsored) {
    bestListing.sponsored = true;
  }

  state.messages.unshift({
    buyer: "Growth Bot",
    listing: bestListing.title,
    time: "just now",
    text: `${bestListing.seller} was auto-boosted after a strong response-rate trend.`,
  });
  state.messages = state.messages.slice(0, 5);
  renderListings();
  renderSellerBoard();
  renderMessages();
  updateHeroStats();
});

document.querySelector("#cycleAudience").addEventListener("click", rotateAudience);

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  renderListings();
});

sponsoredOnly.addEventListener("change", (event) => {
  state.sponsoredOnly = event.target.checked;
  renderListings();
});

budgetInput.addEventListener("input", (event) => {
  state.budget = Number(event.target.value);
  budgetOutput.textContent = formatCurrency(state.budget);
  updateCampaignMetrics();
});

campaignForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.objective = objectiveSelect.value;
  state.audience = audienceSelect.value;
  updateCampaignMetrics();

  const profile = campaignProfiles[state.audience];
  const matchingCategory = profile.topCategory;
  state.category = matchingCategory;
  renderCategories();
  renderListings();

  state.messages.unshift({
    buyer: "Campaign Engine",
    listing: `${matchingCategory} category`,
    time: "just now",
    text: `Simulation focused budget toward ${matchingCategory.toLowerCase()} shoppers inside the ${state.audience.replace("-", " ")} audience.`,
  });
  state.messages = state.messages.slice(0, 5);
  renderMessages();
});

renderCategories();
renderListings();
renderSellerBoard();
renderMessages();
updateCampaignMetrics();
