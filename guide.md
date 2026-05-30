# Kashmiri Organic Project Guide & Deployment Manual

Welcome to the **Kashmiri Organic** web application guide. This project is built using **Next.js (App Router)**, styled with **Tailwind CSS**, and architected to support both local development (using JSON) and production scale (using SQL).

---

## Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Dynamic Database Design (JSON vs SQL)](#2-dynamic-database-design-json-vs-sql)
3. [Deployment Guides](#3-deployment-guides)
   - [Option A: Deploying on Hostinger (Recommended)](#option-a-deploying-on-hostinger-recommended)
   - [Option B: Deploying on Netlify](#option-b-deploying-on-netlify)
4. [Live SQL Integration & Setup](#4-live-sql-integration--setup)
   - [Step 1: SQL Schema Definition](#step-1-sql-schema-definition)
   - [Step 2: Environment Setup](#step-2-environment-setup)
   - [Step 3: Seeding Database](#step-3-seeding-database)
5. [Key Swiper Features & Styling Guidelines](#5-key-swiper-features--styling-guidelines)

---

## 1. Project Overview & Architecture

Kashmiri Organic is a premium e-commerce and B2B catalog application designed with high-end typography, dynamic framer-motion transitions, and premium responsive image assets.

### High-Level Folder Structure
```bash
kashmiriorganci/
├── data/                      # Local JSON storage folder
│   └── db.json                # Fallback database file
├── public/                    # Static assets (images, icons, etc.)
├── src/
│   ├── app/                   # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── admin/             # Secure Administrative Panel
│   │   ├── api/               # API Routes (Inquiries, Blogs, Products, etc.)
│   │   ├── materials/         # Material Discovery Detail Pages
│   │   ├── products/          # Products Catalog List & Details
│   │   ├── globals.css        # Global CSS stylesheet & Tailwind setup
│   │   └── page.tsx           # Homepage structure
│   ├── components/            # Reusable components (Header, Footer, Swiper, etc.)
│   └── lib/
│       └── db.ts              # Unified Database abstraction (MySQL & Local JSON)
├── package.json               # Package scripts and dependencies
├── next.config.ts             # Next.js configuration properties
└── guide.md                   # This project guide file
```

---

## 2. Dynamic Database Design (JSON vs SQL)

The project includes an intelligent, **zero-config database layer** inside `src/lib/db.ts` that dynamically transitions between a live SQL database and a lightweight local JSON file.

### How it Works
1. **Fallback (Local JSON) Mode**: If database environment variables (`DB_HOST`, `DB_USER`, `DB_NAME`) are not provided, the database driver automatically instantiates and loads seed values from `data/db.json`. Writes and administrative edits are saved straight back into this JSON file.
2. **Production SQL Mode**: When env variables are present, the driver initializes a MySQL connection pool (`mysql2`) and reads/writes straight to your production database without requiring any changes to application routes.

> [!IMPORTANT]
> Because Serverless environments (like Netlify) have read-only/stateless filesystems, administrative modifications to `db.json` will not persist across requests. In serverless hosting, you **must** connect to a live SQL database.

---

## 3. Deployment Guides

### Option A: Deploying on Hostinger (Recommended)
Hostinger's VPS or premium cloud hosting plans support standard **Node.js applications** alongside native **MySQL databases**, making it the absolute ideal home for this full-stack project.

#### Steps to Deploy:
1. **Set up Node.js Application on Hostinger Panel:**
   - Log into your Hostinger control panel.
   - Go to **Websites > Create/Migrate Website** and select **Node.js Application**.
   - Set the Node.js version to `20.x` or later.
   - Configure your application root directory and select the domain name.

2. **Create MySQL Database on Hostinger:**
   - Navigate to **Databases > MySQL Databases**.
   - Create a new database name, username, and password. Copy these credentials down.
   - Set **Remote MySQL** to allowed if you plan to administer it from your local machine, or use Hostinger's **phpMyAdmin** dashboard to import the tables.

3. **Install and Build Project:**
   - Push your project code to a private GitHub repository.
   - In Hostinger's terminal (SSH), clone the repository:
     ```bash
     git clone <your-repo-link> .
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure Environment Variables (create a `.env` file in the root):
     ```env
     DB_HOST=127.0.0.1
     DB_USER=u123456789_kashmiri
     DB_PASSWORD=your_secure_mysql_password
     DB_NAME=u123456789_kashmiri_db
     JWT_SECRET=your_super_secret_jwt_hash
     NEXT_PUBLIC_APP_URL=https://yourdomain.com
     ```
   - Build and Start Application:
     ```bash
     npm run build
     npm run start
     ```

---

### Option B: Deploying on Netlify
Netlify excels at frontend static hosting, but since this is a dynamic **Next.js App Router** project with API endpoints, Netlify will package Next.js dynamic endpoints into Serverless Functions.

#### Steps to Deploy:
1. **Import Repository to Netlify:**
   - Log in to your Netlify dashboard and click **Add new site > Import an existing project**.
   - Select your Git provider and choose the repository.

2. **Configure Build Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - Netlify will automatically detect Next.js and apply its Next.js Runtime builder.

3. **Set Up Environment Variables:**
   - Go to **Site Configuration > Environment Variables**.
   - Add the following keys (You must hook it up to a live remote MySQL database since Netlify's filesystem is stateless!):
     - `DB_HOST`: Host address of your remote MySQL database (e.g., Aiven, PlanetScale, or Hostinger Remote SQL).
     - `DB_USER`: Remote database username.
     - `DB_PASSWORD`: Remote database password.
     - `DB_NAME`: Remote database name.
     - `JWT_SECRET`: Random string secure hash.

4. **Trigger Deploy:**
   - Click **Deploy Site**. Netlify will execute `next build` and allocate serverless containers for dynamic routing.

---

## 4. Live SQL Integration & Setup

To transition from the local JSON fallback database to a high-speed production MySQL database, execute the following three steps:

### Step 1: SQL Schema Definition
Run the following SQL script inside your database manager (phpMyAdmin, DBeaver, or Hostinger terminal) to create the schema:

```sql
-- 1. Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `image_url` VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Materials
CREATE TABLE IF NOT EXISTS `materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `overview` TEXT,
  `origin` VARCHAR(255),
  `manufacturing_process` TEXT,
  `sustainability` TEXT,
  `benefits` TEXT,
  `image_url` VARCHAR(500),
  `history` TEXT,
  `gallery_urls` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `short_description` VARCHAR(500) NOT NULL,
  `long_description` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `gallery_urls` TEXT,
  `availability` VARCHAR(255) DEFAULT 'bulk,retail',
  `certified` TINYINT DEFAULT 1,
  `export_quality` TINYINT DEFAULT 1,
  `moq` VARCHAR(100),
  `packaging` VARCHAR(255),
  `shipping` VARCHAR(255),
  `price` DECIMAL(10,2) DEFAULT NULL,
  `discount_price` DECIMAL(10,2) DEFAULT NULL,
  `sku` VARCHAR(100),
  `stock` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Relations Mapping
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` INT,
  `category_id` INT,
  PRIMARY KEY (`product_id`, `category_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `product_materials` (
  `product_id` INT,
  `material_id` INT,
  PRIMARY KEY (`product_id`, `material_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE
);

-- 5. Blogs
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(500),
  `category` VARCHAR(100),
  `tags` VARCHAR(255),
  `author` VARCHAR(100) DEFAULT 'Kashmiri Organic Admin',
  `publish_date` VARCHAR(100),
  `status` VARCHAR(50) DEFAULT 'published',
  `seo_title` VARCHAR(255),
  `seo_description` VARCHAR(255),
  `related_products` VARCHAR(255) DEFAULT '[]',
  `related_materials` VARCHAR(255) DEFAULT '[]'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Inquiries
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100),
  `company_name` VARCHAR(255),
  `inquiry_type` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `product_id` INT NULL,
  `status` VARCHAR(50) DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(500) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### Step 2: Environment Setup
Add your newly created SQL parameters directly inside your production Environment Variable panel or in your local `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kashmiri_organic
JWT_SECRET=supersecurejwtkey
```

### Step 3: Seeding Database
When you run the project for the first time, your database is empty. You can write a quick custom seed script to insert initial records, or log into the administrative panel `/admin` to start creating your categories, materials, and premium products directly!

*To Seed automatically:*
The codebase includes standard initialization functions. Logging in as the default administrator (`admin@kashmiriorganic.com` / password: `kashmir@123`) will allow you to import all existing elements via the database tools in the admin panel.

---

## 5. Key Swiper Features & Styling Guidelines

The **Material Discovery** section uses a customized **Swiper Slider** to showcase high-altitude valley organic ingredients (Saffron, Wild Honey, Walnut Wood, Walnuts, Alpine Herbs, Royal Pahalgam Lavender).

### Styling Customizations (`globals.css`)
We have completely unified the navigation controls and responsive card widths according to your specific specifications:
- **Responsive Layout:** 
  - **Desktop (1024px+):** Exactly **4 cards** visible simultaneously (`slidesPerView: 4`).
  - **Tablet (768px - 1023px):** Exactly **3 cards** visible simultaneously (`slidesPerView: 3`).
  - **Mobile (< 768px):** Exactly **1.5 cards** visible, providing a premium peek into next slides (`slidesPerView: 1.5`).
- **Brand-Integrated Navigation:**
  - Standard side arrows are disabled. Beautiful custom circular green border control buttons (`<` and `>`) are placed at the bottom center.
  - Active pagination dots stretch dynamically into capsule shapes using the brand’s Kashmiri Gold color (`#C68A2D`) and Forest Green.

This setup ensures optimal UX across all device forms!
