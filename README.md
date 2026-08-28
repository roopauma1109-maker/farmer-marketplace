# AgriDirect — Farmer-to-Buyer Marketplace

> **Sell Directly. Connect Easily. Get Better Value.**

## 🌾 Project Overview

**AgriDirect** is a simple agricultural marketplace that connects farmers directly with buyers.

Farmers can:

* Add their crops
* Set quantity and price
* View their listed crops
* Receive buyer enquiries

Buyers can:

* Browse available crops
* Search and filter crops
* View crop and farmer details
* Send purchase enquiries

The platform also provides **market price information** to help farmers understand current prices before selling their crops.

---

## 🎯 Main Features

### 👨‍🌾 Farmer

* Farmer Dashboard
* Add Crop
* View My Crops
* Edit Crop
* Delete Crop
* Mark Crop as Sold
* View Buyer Enquiries
* Farmer Details

### 🛒 Buyer

* Browse Marketplace
* Search Crops
* Filter Crops
* View Crop Details
* View Farmer Details
* Send Purchase Enquiry
* View Enquiry Status

### 📊 Market Prices

* View market prices
* View minimum price
* View maximum price
* View average price
* Search price by crop

### 🌐 Language

* English
* Tamil

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* CSS
* JavaScript

### Backend

* Python

### Database

* SQL

---

## 📂 Project Structure

```text
farmer-marketplace/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── CropCard.jsx
│   │   │   └── MarketPriceCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── CropDetailsPage.jsx
│   │   │   ├── MarketPricesPage.jsx
│   │   │   ├── FarmerDashboardPage.jsx
│   │   │   ├── FarmerMyCropsPage.jsx
│   │   │   ├── FarmerAddCropPage.jsx
│   │   │   ├── FarmerEnquiriesPage.jsx
│   │   │   └── BuyerPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── routes/
│   │       ├── crops.py
│   │       ├── farmers.py
│   │       ├── buyers.py
│   │       ├── enquiries.py
│   │       └── market_prices.py
│   │
│   └── requirements.txt
│
└── README.md
```

---

## 🗄️ Database

### Farmers

Stores farmer details.

| Field    | Description     |
| -------- | --------------- |
| id       | Farmer ID       |
| name     | Farmer name     |
| mobile   | Mobile number   |
| location | Farmer location |

### Crops

Stores farmer crop listings.

| Field        | Description        |
| ------------ | ------------------ |
| id           | Crop ID            |
| farmer_id    | Farmer ID          |
| crop_name    | Crop name          |
| quantity     | Available quantity |
| unit         | kg / quintal / ton |
| price        | Expected price     |
| location     | Crop location      |
| description  | Crop details       |
| availability | Available / Sold   |

### Buyers

Stores buyer details.

| Field    | Description    |
| -------- | -------------- |
| id       | Buyer ID       |
| name     | Buyer name     |
| mobile   | Mobile number  |
| location | Buyer location |

### Enquiries

Stores buyer requests.

| Field             | Description                   |
| ----------------- | ----------------------------- |
| id                | Enquiry ID                    |
| crop_id           | Crop ID                       |
| buyer_id          | Buyer ID                      |
| farmer_id         | Farmer ID                     |
| required_quantity | Required quantity             |
| message           | Buyer message                 |
| status            | Pending / Accepted / Rejected |

### Market Prices

Stores market price information.

| Field         | Description   |
| ------------- | ------------- |
| id            | Price ID      |
| crop_name     | Crop name     |
| market        | Market name   |
| district      | District      |
| min_price     | Minimum price |
| max_price     | Maximum price |
| average_price | Average price |
| price_date    | Price date    |

---

## 🔄 Application Flow

```text
                 USER
                  │
          ┌───────┴───────┐
          ↓               ↓
       FARMER           BUYER
          │               │
          ↓               ↓
     Add Crop        Browse Crops
          │               │
          ↓               ↓
      Marketplace ← Search / Filter
          │               │
          └───────┬───────┘
                  ↓
            Crop Details
                  ↓
           Buyer Enquiry
                  ↓
           Farmer Response
                  ↓
             Direct Deal
```

### Market Price Flow

```text
Market Price Data
       ↓
   Backend
       ↓
Market Price Page
       ↓
   View Price
       ↓
Farmer Decides Price
```

---

## 🚀 How to Run

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app/main.py
```

### Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

---

## 📡 Main APIs

| Method | Endpoint                 | Purpose                |
| ------ | ------------------------ | ---------------------- |
| GET    | `/crops`                 | View marketplace crops |
| GET    | `/crops/{id}`            | View crop details      |
| GET    | `/crops/my`              | View farmer crops      |
| POST   | `/crops`                 | Add crop               |
| PUT    | `/crops/{id}`            | Update crop            |
| DELETE | `/crops/{id}`            | Delete crop            |
| PATCH  | `/crops/{id}/sold`       | Mark crop as sold      |
| GET    | `/farmers/{id}`          | View farmer details    |
| POST   | `/enquiries`             | Send enquiry           |
| GET    | `/enquiries/farmer`      | View farmer enquiries  |
| GET    | `/enquiries/buyer`       | View buyer enquiries   |
| PATCH  | `/enquiries/{id}/status` | Update enquiry         |
| GET    | `/market-prices`         | View market prices     |
| GET    | `/market-prices/{crop}`  | View crop price        |

---

## 💡 Project Goal

The main goal of **AgriDirect** is to make agricultural buying and selling simple.

**Farmer → Add Crop → Buyer Finds Crop → Buyer Sends Enquiry → Farmer Responds → Direct Deal**

The platform provides a simple way for farmers and buyers to connect directly and view useful market price information.

