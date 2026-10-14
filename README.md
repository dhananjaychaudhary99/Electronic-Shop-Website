# Electronic Shop Website

A full-stack e-commerce web application built with **Python, Flask, JavaScript, HTML, and CSS**, featuring a clean, Flipkart-inspired user interface. The application provides a dynamic catalog of 139 electronics products, real-time search and filtering, persistent shopping cart management, side-by-side product comparison, and Indian Rupee (₹ INR) price formatting.

---

## 🚀 Features

- **Modern E-Commerce UI:** Clean, responsive storefront inspired by Flipkart's white design.
- **Dynamic Product Catalog:** Browse 139 electronics products across multiple categories.
- **Real-Time Search:** Find products instantly without reloading the page.
- **Category Filtering:** Filter products by category.
- **Persistent Shopping Cart:** Add, remove, and update product quantities using browser `localStorage`.
- **Product Comparison:** Compare multiple products side by side based on price, specifications, and features.
- **Indian Currency Formatting:** Display prices in Indian Rupees (₹) using the Indian numbering system.
- **RESTful API:** Retrieve product collections and individual product details through Flask endpoints.
- **Responsive Design:** Adapt the interface to desktop, tablet, and mobile screens.
- **JSON-Based Data Storage:** Manage product catalog data through a structured JSON file.
- **Dynamic UI Updates:** Update product listings, cart totals, and comparison views through JavaScript.

---

## 🛠️ Technologies Used

- **Python 3.8+** — Backend programming
- **Flask** — Web framework and routing
- **Jinja2** — HTML template rendering
- **JavaScript (ES6+)** — Frontend logic and DOM manipulation
- **HTML5** — Web page structure
- **CSS3** — Responsive layouts using Flexbox and Grid
- **JSON** — Product catalog storage and API responses
- **Browser LocalStorage** — Persistent client-side cart state
- **Virtual Environment (`venv`)** — Python dependency isolation

---

## 📂 Project Structure

```text
Electronic-Shop-Website/
│
├── app.py                     # Flask backend application
├── products.json              # Product catalog containing 139 items
├── requirements.txt           # Python dependencies
│
├── templates/
│   └── index.html             # Main storefront template
│
├── static/
│   ├── style.css              # Responsive storefront styling
│   ├── app.js                 # Search, cart, comparison, and UI logic
│   └── images/                # Product images and static assets
│
└── README.md                  # Project documentation
```

---

## 📌 Functionalities

### 1. Product Catalog

Displays 139 electronics products across categories such as:

- Smartphones
- Laptops
- Audio peripherals
- Wearables
- Accessories

Product listings present relevant details, including product names, prices, ratings, and specifications, according to the available catalog data.

### 2. Search and Category Filtering

Enables users to search products by text and filter the catalog by category.

- Updates displayed products dynamically.
- Combines search and category filtering where supported.
- Avoids full-page reloads during client-side filtering.

### 3. Shopping Cart Management

Provides an interactive cart with persistent state using browser `localStorage`.

- Add products to the cart.
- Increase or decrease quantities.
- Remove products.
- Calculate subtotals and the overall cart total.
- Restore saved cart state after refreshing or reopening the browser.

**Note:** `localStorage` persists data in the user's browser. It does not provide server-side cart synchronization across devices or accounts.

### 4. Product Comparison

Allows users to compare selected electronics products side by side.

- Review product prices and specifications.
- Identify differences between product features.
- Evaluate available product information in a comparison matrix.

### 5. Indian Rupee Currency Formatting

Formats prices using the ₹ symbol and Indian number-grouping conventions.

Example:

```javascript
const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
```

Example output: `₹1,25,000.00`

The displayed precision can be adjusted to match the application's pricing requirements.

### 6. Backend and RESTful API

The Flask backend renders the storefront and provides product information through API endpoints.

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Renders the main storefront |
| `/api/products` | `GET` | Returns the product catalog in JSON format |
| `/api/products/<id>` | `GET` | Returns details for a specific product ID |

The individual-product endpoint should return an appropriate `404 Not Found` response when the requested product does not exist.

### 7. Responsive User Interface

Uses CSS Flexbox, Grid, and responsive styling to adapt the storefront to different screen sizes while maintaining usability across desktop, tablet, and mobile devices.

---

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Python 3.8 or later
- pip, the Python package installer
- Git, if cloning the repository

Verify your installation:

```bash
python --version
pip --version
git --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/dhananjaychaudhary99/Electronic-Shop-Website.git
```

### 2. Navigate to the Project Directory

```bash
cd Electronic-Shop-Website
```

### 3. Create a Virtual Environment

**Windows PowerShell:**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```bat
python -m venv venv
venv\Scripts\activate.bat
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Start the Flask Application

```bash
python app.py
```

### 6. Open the Website

Visit the following address in your browser:

**http://127.0.0.1:5000/**

The application will be available locally while the Flask development server is running.

---

## 📚 Learning Outcomes

Through this project, I gained practical experience in:

- Developing full-stack web applications using Python and Flask.
- Creating RESTful API endpoints for structured product data.
- Rendering dynamic HTML templates with Jinja2.
- Building interactive interfaces using vanilla JavaScript.
- Managing browser-side state with `localStorage`.
- Implementing search, category filtering, and product comparison.
- Formatting prices according to Indian currency conventions.
- Designing responsive layouts using CSS Flexbox and Grid.
- Organizing frontend assets and backend application logic.
- Managing Python dependencies and virtual environments.
- Separating product data from application logic using JSON.

---

## 🌐 Deployment

- **Local Development:** [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
- **GitHub Repository:** [Electronic Shop Website](https://github.com/dhananjaychaudhary99/Electronic-Shop-Website)
- **GitHub Pages:** [View Static Deployment](https://dhananjaychaudhary99.github.io/Electronic-Shop-Website/)

**Deployment note:** GitHub Pages supports static HTML, CSS, and JavaScript but does not execute a Python Flask backend. Therefore, Flask API functionality requires a compatible Python hosting platform. A GitHub Pages version can provide a static storefront if its frontend and product data are configured to work without Flask.

---

## 🔮 Future Improvements

- **Database Integration:** Replace JSON-based catalog storage with SQLite or PostgreSQL.
- **User Authentication:** Add secure registration, login, and authorization.
- **Payment Integration:** Implement sandbox payments using Razorpay or Stripe.
- **Admin Dashboard:** Manage products, prices, categories, and inventory.
- **Order Management:** Add order placement, order history, and shipment tracking.
- **Wishlist:** Allow users to save products for later.
- **Inventory Management:** Track available stock and prevent invalid purchases.
- **Backend Cart Persistence:** Synchronize carts across authenticated devices.
- **Security Enhancements:** Validate inputs, protect sensitive endpoints, and apply appropriate CSRF and authorization controls.
- **Testing:** Add automated tests for API endpoints, cart calculations, filtering, and comparison.
- **Production Deployment:** Configure environment variables, logging, error handling, and a production-ready WSGI server.

---

## 👨‍💻 Author

**Dhananjay Chaudhary**

- **GitHub Profile:** [dhananjaychaudhary99](https://github.com/dhananjaychaudhary99)
- **Project Repository:** [Electronic Shop Website](https://github.com/dhananjaychaudhary99/Electronic-Shop-Website)

---

## 📄 License

This project is intended to be available under the **MIT License**. Check the repository's `LICENSE` file to verify the applicable terms before redistributing or modifying the project.

---

## ⭐ Support

If you find this project useful, consider starring the repository on GitHub.

**Built with Python, Flask, and JavaScript to demonstrate full-stack web development, interactive e-commerce features, and responsive UI design.**
