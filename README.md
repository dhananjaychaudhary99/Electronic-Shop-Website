# Electronic Shop Website

A full-stack e-commerce web application inspired by Flipkart's clean white UI design. The platform features a dynamic 139-product catalog across multiple consumer electronic categories, a persistent client-side shopping cart, side-by-side product comparison, and localized Indian Rupee (₹ INR) currency formatting.

🔗 **Live Static Demo:** [Electronic Shop Website](https://dhananjaychaudhary99.github.io/Electronic-Shop-Website/)  
*(Note: The GitHub Pages version showcases client-side UI/UX. For full backend dynamic routing and API endpoints, run the Flask server locally).*

---

## Key Features

* **Flipkart-Inspired UI/UX:** Clean, high-contrast white theme featuring responsive product grid cards, badge highlights, and sticky navigation.
* **139-Item Structured Catalog:** Fully indexed dataset covering smartphones, laptops, audio peripherals, wearables, and accessories.
* **Dynamic Search & Filtering:** Instant client-side search filtering and category breakdowns with zero page reloads.
* **Interactive Shopping Cart:** Persistent state management using browser `localStorage` for item addition, quantity increments, deletion, and dynamic subtotal calculation.
* **Side-by-Side Comparison Engine:** Feature matrix enabling direct specification, rating, and price comparisons across multiple devices.
* **INR Currency Localization:** Built-in currency formatting matching standard Indian numbering conventions (Lakhs/Crores grouping).
* **Lightweight Backend Architecture:** Flask micro-framework handling static template rendering and JSON data delivery via RESTful endpoints.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.8+, Flask, Jinja2 |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5 Semantic Markup, CSS3 (Flexbox & CSS Grid) |
| **Storage / Data** | Flat-file JSON (`products.json`), Browser `localStorage` |
| **Tooling & Setup** | Git, Virtualenv, VS Code |

---

## Project Structure

```text
Electronic-Shop-Website/
│
├── app.py                     # Main Flask backend routes and API handlers
├── products.json              # Persistent database containing all 139 product items
├── requirements.txt           # Python dependencies (Flask, etc.)
│
├── templates/
│   └── index.html             # Jinja2-rendered primary storefront markup
│
├── static/
│   ├── style.css              # Main stylesheet (Flipkart-inspired white theme & media queries)
│   ├── app.js                 # UI logic (cart state, search/filter, compare, INR parsing)
│   └── images/                # Local product images, icons, and UI assets
│
├── LICENSE                    # MIT License
└── README.md                  # Comprehensive project documentation
