# MarketSphere Simulator

MarketSphere is a front-end simulation of a social commerce marketplace inspired by platforms like Facebook Marketplace. It is designed as a demo environment for testing how product discovery, seller trust, buyer messaging, and lightweight ad optimization can work together inside one marketplace experience.

## What It Is Supposed To Be

This project is meant to represent a small digital marketplace platform where:

- buyers browse listings in a feed
- sellers compete on trust, responsiveness, and visibility
- promoted listings behave like sponsored placements
- marketers tune audience, budget, and objective to influence projected results
- the platform surface combines storefront activity with campaign analytics

In other words, it acts like a mini simulation of a marketplace plus marketing dashboard rather than a full production backend.

## Simulated Output

When you open the app, the expected experience is:

1. A hero section summarizing platform activity such as active shoppers, ROAS, and message volume.
2. A marketplace feed of cards showing products, price, category, seller, location, and sponsored status.
3. Search and category filters that narrow the visible listings.
4. A campaign lab where budget, objective, and audience choices update projected reach, CTR, leads, and cost per lead.
5. A seller console that ranks listing momentum and checkout likelihood.
6. A buyer inbox simulation that updates when users message sellers or trigger campaign actions.

## Included Features

- Searchable marketplace listings
- Sponsored listing toggle
- Audience rotation and campaign simulation
- Seller reputation scoring
- Buyer messaging simulation
- Responsive UI for desktop and mobile

## Tech

- HTML
- CSS
- Vanilla JavaScript

## Run Locally

Open `index.html` in a browser.

If you want a local server instead, from this folder run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.
