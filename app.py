import os
import json
import smtplib
import hashlib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
DATA_FILE = 'products.json'
USERS_FILE = 'users.json'

# --- GMAIL CONFIGURATION ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your-email@gmail.com"         # Replace with your Gmail address
SENDER_PASSWORD = "xxxx yyyy zzzz wwww"       # Replace with your 16-digit App Password
RECEIVER_EMAIL = "your-email@gmail.com"       # Notification recipient

def send_email_alert(subject, body_text):
    """Sends an email notification via Gmail SMTP."""
    if "your-email" in SENDER_EMAIL or "xxxx" in SENDER_PASSWORD:
        return False
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = subject
        msg.attach(MIMEText(body_text, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False

def load_products():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_products(products):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=4)

# --- USER MANAGEMENT FUNCTIONS ---
def hash_password(password):
    """Hash password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_users(users):
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4)

def user_exists(email):
    users = load_users()
    return any(u['email'] == email for u in users)

@app.route('/')
def index():
    products = load_products()
    categories = sorted(list({p['category'] for p in products if 'category' in p}))
    return render_template('index.html', products=products, categories=categories)

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(load_products())

@app.route('/api/add-product', methods=['POST'])
def add_product():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    brand = data.get('brand', '').strip()
    category = data.get('category', '').strip()
    price = data.get('price')
    original_price = data.get('originalPrice')
    stock = data.get('stock')
    rating = data.get('rating', 4.5)
    color = data.get('color', '').strip()
    variant = data.get('variant', '').strip()
    image = data.get('image', '').strip()

    if not name or not category or price is None or stock is None:
        return jsonify({"success": False, "error": "All required fields must be filled."}), 400

    try:
        price = float(price)
        original_price = float(original_price) if original_price is not None else price * 1.25
        stock = int(stock)
        rating = float(rating)
    except (TypeError, ValueError):
        return jsonify({"success": False, "error": "Invalid numeric value entered."}), 400

    if original_price <= 0:
        original_price = price * 1.25

    if not image:
        image = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=80"

    products = load_products()
    new_id = max([p['id'] for p in products], default=0) + 1

    new_item = {
        "id": new_id,
        "name": name,
        "brand": brand or "Brand",
        "category": category,
        "price": round(price, 2),
        "originalPrice": round(original_price, 2),
        "rating": round(rating, 1),
        "stock": stock,
        "color": color or "Black",
        "variant": variant or "Standard",
        "image": image
    }

    products.append(new_item)
    save_products(products)
    return jsonify({"success": True, "product": new_item, "message": "Product saved and published live!"})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()
    
    if len(name) < 2 or '@' not in email or len(message) < 10:
        return jsonify({"success": False, "error": "Invalid form data entered."}), 400

    email_body = f"Customer Name: {name}\nCustomer Email: {email}\n\nInquiry Message:\n{message}"
    send_email_alert(f"⚡ New Customer Inquiry from {name}", email_body)

    return jsonify({"success": True, "message": "Inquiry sent successfully! We will get back to you soon."})

# --- USER AUTHENTICATION ROUTES ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    full_name = data.get('fullName', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    confirm_password = data.get('confirmPassword', '').strip()

    # Validation
    if not full_name or len(full_name) < 2:
        return jsonify({"success": False, "error": "Full name is required (minimum 2 characters)."}), 400
    
    if not email or '@' not in email:
        return jsonify({"success": False, "error": "Valid email address is required."}), 400
    
    if not password or len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters."}), 400
    
    if password != confirm_password:
        return jsonify({"success": False, "error": "Passwords do not match."}), 400

    if user_exists(email):
        return jsonify({"success": False, "error": "Email already registered. Please login instead."}), 400

    users = load_users()
    new_user = {
        "id": max([u.get('id', 0) for u in users], default=0) + 1,
        "fullName": full_name,
        "email": email,
        "password": hash_password(password),
        "createdAt": str(__import__('datetime').datetime.now())
    }
    
    users.append(new_user)
    save_users(users)
    
    return jsonify({
        "success": True, 
        "message": "Account created successfully! Please login.",
        "user": {"id": new_user['id'], "fullName": new_user['fullName'], "email": new_user['email']}
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required."}), 400

    users = load_users()
    user = next((u for u in users if u['email'] == email), None)

    if not user or user['password'] != hash_password(password):
        return jsonify({"success": False, "error": "Invalid email or password."}), 401

    return jsonify({
        "success": True,
        "message": f"Welcome back, {user['fullName']}!",
        "user": {"id": user['id'], "fullName": user['fullName'], "email": user['email']}
    }), 200

@app.route('/api/current-user', methods=['GET'])
def current_user():
    """Check if user session exists (frontend handles this)"""
    return jsonify({"success": True, "message": "Use localStorage for session"})

@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({"success": True, "message": "Logged out successfully."})

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.get_json() or {}
    items = data.get('items', [])
    user_email = data.get('userEmail', '').strip()
    user_name = data.get('userName', '').strip()
    
    if not items:
        return jsonify({"success": False, "error": "Cart is empty."}), 400
    
    if not user_email or not user_name:
        return jsonify({"success": False, "error": "User must be logged in to checkout."}), 401

    email_body = f"New Order Placed on Electronic Shop!\n\nCustomer: {user_name} ({user_email})\n\nOrder Items:\n{json.dumps(items, indent=2)}"
    send_email_alert("⚡ New Order Notification", email_body)

    return jsonify({
        "success": True, 
        "orderId": f"ORD-{__import__('random').randint(10000, 99999)}", 
        "message": "Order placed successfully! Thank you for purchasing from ElectronicShop."
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)