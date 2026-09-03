# CraveWave • Modern Food Delivery Customer App

A modern, fast, and feature-rich food delivery **Customer Application** built with React 19, TypeScript, Vite, Tailwind CSS v4, and Leaflet.

## ✨ Features

- **Mobile OTP Authentication**: 10-digit mobile login with simulated SMS OTP generation, 30s resend timer, and one-tap auto-fill.
- **GPS Location & Manual Address Selector**: Browser Geolocation API detection, reverse geocoding simulation, address search, and saved addresses (Home, Work, Other).
- **Discovery & Home Feed**:
  - Promotional carousel banners with discount tags and coupon claim buttons.
  - Interactive cuisine categories (Biryani, Pizza, Burgers, Rolls, South Indian, Pan-Asian, Healthy, Desserts, Beverages).
  - Quick filter pills (Pure Veg, Ratings 4.0+, Fast Delivery <25m, Offers & Deals) and sorting.
  - Curated sections: Nearby Restaurants, Top-Rated Delights (4.6★+), and Trending Today.
- **Search**: Instant debounced search querying restaurants, cuisines, and dish names.
- **Restaurant Details & Categorized Menus**:
  - Hero header with ratings, distance, delivery ETA, cost for two, and FSSAI hygiene badge.
  - In-menu search and Veg/Non-Veg filter.
  - Categorized jump tabs (Bestsellers, Appetizers, Mains, Breads & Rice, Desserts, Beverages).
  - Standard Veg (green dot) and Non-Veg (brown triangle) indicators.
- **Food Customization**: Modal selector for sizes, portions, spice levels, and add-on toppings with live price calculation.
- **Smart Cart Management**:
  - Multi-restaurant conflict detection and confirmation modal.
  - Line items with customization details and quantity controls.
  - Coupon engine (CRAVE50, WELCOME100, FREEDEL, FEAST20, PARTY300) with automatic savings calculations.
  - Cooking instructions and delivery instructions chips (Leave at door, Don't ring bell, etc.).
  - Itemized bill breakdown with free delivery threshold indicator.
- **Multi-Method Checkout**:
  - Instant UPI (Google Pay, PhonePe, Paytm, and custom UPI ID verification).
  - Credit & Debit Cards (Card number, MM/YY, CVV).
  - Net Banking with major banks.
  - CraveWave Wallet balance with 1-tap checkout.
  - Cash on Delivery (COD) / QR on arrival.
- **Live Order Tracking & Route Map**:
  - Celebratory confetti fireworks on order placement.
  - 6-stage lifecycle progression with live timestamps and "Next Status >>" fast-forward button.
  - Interactive Leaflet map with restaurant pin, customer home pin with pulsing ripple, and moving delivery scooter icon.
  - Delivery partner card with in-app call dialer simulation and live chat dialog.
- **Order History & One-Click Reorder**:
  - Past orders feed with status badges.
  - 1-click reorder button that repopulates cart with previous dishes and customizations.
  - Itemized tax invoice viewer with print/PDF capability.
  - Multi-star ratings and reviews for food and delivery partner.
- **AI Customer Support Assistant**: 24x7 conversational help bot handling order queries, cancellations with instant wallet refunds, and compensation credits.
- **Profile & Preferences**: Name/Email editor, wallet top-up, address book manager, Dark/Light mode theme switch, and Pure Veg mode.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run Oxlint
npm run lint
```
