```markdown
# Electronic Shop Website

A full-stack e-commerce web application inspired by Flipkart's clean white UI design.
The project delivers a responsive online store with a dynamic 139-product catalog, persistent cart management, side-by-side product comparison, and localized Indian Rupee (₹ INR) currency handling.

## 🚀 Features

* Flipkart-inspired clean white user interface
* Dynamic catalog with 139 electronics items
* Real-time search and category filtering
* Persistent shopping cart using browser `localStorage`
* Side-by-side product comparison matrix
* Automated Indian Rupee (₹ INR) currency formatting
* RESTful API endpoints for product data ingestion
* Lightweight backend routing and template rendering
* Fully responsive layout across desktop, tablet, and mobile

## 🛠️ Technologies Used

* **Python 3.8+**
* **Flask & Jinja2**
* **JavaScript (ES6+)**
* **HTML5 & CSS3 (Flexbox / Grid)**
* **JSON File Handling**
* **Browser LocalStorage**

## 📂 Project Structure

```text
Electronic-Shop-Website/
│
├── app.py                     # Main Flask backend application
├── products.json              # Persistent database containing all 139 items
├── requirements.txt           # Python dependencies list
│
├── templates/
│   └── index.html             # Main storefront HTML template
│
└── static/
    ├── style.css              # Main stylesheet (Flipkart-inspired white theme)
    ├── app.js                 # Frontend interactions (catalog, cart, compare, INR conversion)
    └── images/                # Local asset and product image storage

```

## 📌 Functionalities

### Product Catalog Exploration

Displays all 139 electronic items categorized into smartphones, laptops, audio peripherals, wearables, and accessories with clear pricing, ratings, and specifications.

### Search and Filtering

Enables instant client-side text search and category-wise filtering with zero page reload overhead.

### Cart Management

Allows users to add items, increment/decrement quantities, delete items, and view real-time subtotal calculations backed by `localStorage` persistence.

### Product Comparison

Enables side-by-side specification, feature, and price comparison across multiple electronics items to help buyers make informed decisions.

### Currency Standardization

Converts and formats product prices according to the standard Indian numbering system (Lakhs and Crores) with the `₹` symbol.

### Backend Data Handling

Uses Flask routes to deliver rendered HTML templates and serve structured product data through REST endpoints:

* `GET /` — Serves the main storefront interface
* `GET /api/products` — Returns complete product list in JSON format
* `GET /api/products/<id>` — Returns specific product details by ID

## 📚 Learning Outcomes

Through this project, I gained practical experience in:

* Building full-stack web applications with Flask and Vanilla JS
* Structuring RESTful API endpoints and handling JSON data
* Client-side state persistence using `localStorage`
* Dynamic DOM manipulation and modular JavaScript architecture
* Replicating modern, production-grade e-commerce UI patterns
* Managing dependencies and local development environments with `venv`

## 🚀 Deployment

* **Local Web Server:** `http://127.0.0.1:5000/`
* **Static Deployment (GitHub Pages):** [View Static Site](https://dhananjaychaudhary99.github.io/Electronic-Shop-Website/)

## 🔮 Future Improvements

* SQLite / PostgreSQL database migration
* User authentication and authorization (JWT)
* Payment gateway sandbox integration (Razorpay / Stripe)
* Admin dashboard for product inventory management
* Order history and tracking portal

## 👨‍💻 Author

**Dhananjay Chaudhary**

* GitHub: [Electronic-Shop-Website](https://github.com/dhananjaychaudhary99/Electronic-Shop-Website)

## 📄 License

This project is open-source and available under the **MIT License**.

```

```
