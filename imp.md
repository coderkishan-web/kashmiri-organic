# Kashmiri Organic - Developer & Deployment Manual (`imp.md`)

Welcome to the technical handbook for the **Kashmiri Organic** web application. This document details the project structure, API architecture, database connection strategies, secure Hostinger deployment steps, authentication mechanisms, and guidelines for integrating Stripe payments.

---

## Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Database Connection & Fallback Mechanism](#2-database-connection--fallback-mechanism)
3. [SQL Schema Definitions](#3-sql-schema-definitions)
4. [API Architecture & Documentation](#4-api-architecture--documentation)
5. [Authentication & Roles (Admin, Super Admin, Customer)](#5-authentication--roles-admin-super-admin-customer)
6. [Stripe Payment Integration Guide](#6-stripe-payment-gateway-integration)
7. [Hostinger Deployment Guide (with Perfect Security)](#7-hostinger-deployment-guide-with-perfect-security)

---

## 1. Project Overview & Architecture

Kashmiri Organic is built on a modern full-stack architecture using **Next.js (App Router)** and styled with **Tailwind CSS**. It serves as a premium B2C e-commerce platform and a B2B catalog for Kashmiri export products.

### Tech Stack Details
- **Frontend Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS 4 with custom variables
- **State & Transitions:** Framer Motion (animations), Swiper (carousel sliders)
- **Backend Database Driver:** `mysql2/promise`
- **Session Security:** JSON Web Tokens (JWT) stored in HTTP-Only cookies
- **Hashing:** `bcryptjs` for secure password storage

---

## 2. Database Connection & Fallback Mechanism

The core database connection resides in `src/lib/db.ts`. It utilizes a **zero-configuration hybrid approach** that automatically decides where to write/read data.

### Hybrid Strategy
1. **Fallback (Local JSON) Mode:**
   - Activated automatically if database environment variables (`DB_HOST`, `DB_USER`, `DB_NAME`) are not provided.
   - Reads/writes to `data/db.json` inside the root workspace folder.
   - Useful for zero-setup local development, testing, and debugging.
2. **Production SQL Mode:**
   - Active when database env variables are present.
   - Uses `mysql2/promise` to establish a connection pool with wait queues and limits.
   - Executes queries directly against your MySQL server.

### Local vs. Live Live Configuration
In your root `.env` file, toggle the database mode:

**For Local Fallback Development:**
```env
# Leave empty to trigger local JSON fallback mode automatically
JWT_SECRET=kashmiri-organic-valley-secret-key-2026
```

**For Live MySQL Database (Local or Hostinger):**
```env
DB_HOST=127.0.0.1          # Use Hostinger localhost for live, or IP for remote
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=your_db_name
DB_PORT=3306
JWT_SECRET=any_high_entropy_random_string_secret
```

---

## 3. SQL Schema Definitions

Execute this SQL schema on your local database or using Hostinger phpMyAdmin to prepare the database structure:

```sql
-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL UNIQUE,
  `password_hash` VARCHAR(500) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'customer',
  `phone` VARCHAR(100) NULL UNIQUE,
  `otp` VARCHAR(20) NULL,
  `otp_expiry` VARCHAR(100) NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NULL,
  `pinCode` VARCHAR(20) NULL,
  `country` VARCHAR(100) NULL,
  `created_at` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Product Types
CREATE TABLE IF NOT EXISTS `product_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create Materials
CREATE TABLE IF NOT EXISTS `materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `overview` TEXT NOT NULL,
  `origin` VARCHAR(255) NOT NULL,
  `manufacturing_process` TEXT NOT NULL,
  `sustainability` TEXT NOT NULL,
  `benefits` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `history` TEXT NULL,
  `gallery_urls` TEXT NULL,
  `extraction_story` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `short_description` VARCHAR(500) NOT NULL,
  `long_description` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `gallery_urls` TEXT NOT NULL,
  `availability` VARCHAR(255) NOT NULL,
  `certified` TINYINT(1) DEFAULT 0,
  `export_quality` TINYINT(1) DEFAULT 0,
  `moq` VARCHAR(255) NOT NULL,
  `packaging` VARCHAR(255) NOT NULL,
  `shipping` VARCHAR(255) NOT NULL,
  `sub_category` VARCHAR(255) NULL,
  `price` DECIMAL(10,2) NULL,
  `discount_price` DECIMAL(10,2) NULL,
  `sku` VARCHAR(100) NULL,
  `stock` INT DEFAULT 0,
  `season` VARCHAR(50) DEFAULT 'all',
  `created_at` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(100) PRIMARY KEY,
  `user_phone` VARCHAR(100) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `user_email` VARCHAR(255) NULL,
  `items` LONGTEXT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `shipping_address` TEXT NOT NULL,
  `payment_method` VARCHAR(100) NOT NULL,
  `created_at` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Join tables for relations
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` INT,
  `category_id` INT,
  PRIMARY KEY (`product_id`, `category_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `product_types_mapping` (
  `product_id` INT,
  `type_id` INT,
  PRIMARY KEY (`product_id`, `type_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`type_id`) REFERENCES `product_types`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `product_materials` (
  `product_id` INT,
  `material_id` INT,
  PRIMARY KEY (`product_id`, `material_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE
);
```

---

## 4. API Architecture & Documentation

All API endpoints are implemented as Next.js route handlers under `src/app/api/`.

### Client APIs (`/api/customer/...`)
- **`POST /api/customer/auth/send-otp`**
  - **Purpose:** Generates a 6-digit OTP for customer login/registration.
  - **Request Body:** `{ identifier: "email@domain.com" }` OR `{ identifier: "9876543210" }`
  - **Response:** `{ success: true, message: "...", otp: "123456" }` (OTP is returned in response only during simulated testing/local environment).
- **`POST /api/customer/auth/verify-otp`**
  - **Purpose:** Verifies the 6-digit OTP code. Sets a secure HTTP-Only JWT session cookie `customer_token` on success.
  - **Request Body:** `{ identifier: "email@domain.com", otp: "123456" }`
  - **Response:** `{ success: true, user: { id, email, phone, role } }`
- **`GET /api/customer/profile`**
  - **Purpose:** Returns the current logged-in customer's details and recent sourcing inquiries.
  - **Auth Required:** Valid cookie `customer_token`.
- **`PUT /api/customer/profile`**
  - **Purpose:** Updates user profile name and email address.

### Administration APIs (`/api/admin/...`)
- **`POST /api/admin/login`**
  - **Purpose:** Password authentication for administrators. Sets secure HTTP-Only JWT cookie `admin_token`.
  - **Request Body:** `{ email: "admin@kashmiriorganic.com", password: "your_password" }`
- **`GET /api/admin/me`**
  - **Purpose:** Checks current session validity and details for administrative dashboards.
- **`GET /api/admin/super`**
  - **Purpose:** Fetches admin activities logs and full admin users list.
  - **Auth Required:** Valid cookie `admin_token` with role `super_admin`.
- **`POST /api/admin/super`**
  - **Purpose:** Registers a new standard sub-administrator.
  - **Request Body:** `{ name: "New Admin", email: "new@domain.com", password: "securepassword" }`
- **`GET / PATCH /api/admin/orders`**
  - **Purpose:** View all orders or update an order status (e.g. pending, paid, shipped, cancelled).
- **`GET / POST / PUT / DELETE /api/admin/products`**
  - **Purpose:** Complete CRUD control over the products catalog.

---

## 5. Authentication & Roles (Admin, Super Admin, Customer)

Three security tiers exist within the application:

### Tier 1: Customers
- **Authentication Method:** OTP Verification (sent to Mobile Number or Email Address).
- **Database Entry:** A user row with `role = 'customer'` is created if they do not exist.
- **Storage:** Session details encoded inside a JWT payload stored in the `customer_token` cookie. Expiration set to 7 days.

### Tier 2: Standard Admins
- **Authentication Method:** Traditional Email + Password combinations.
- **Database Entry:** A user row with `role = 'admin'`.
- **Authorization:** Can manage products, categories, materials, inquiries, and update order statuses.

### Tier 3: Super Admins
- **Authentication Method:** Email + Password.
- **Database Entry:** A user row with `role = 'super_admin'`.
- **Default Seeding Credentials (Local testing and initial login):**
  - **Email:** `admin@kashmiriorganic.com` (or mock `admin@kashmiri.organic`)
  - **Password:** `kashmir@123` (or mock `kashmiri@organic2026`)
- **Authorization:** Access to `/admin` dashboard. Full capability to create/delete other admin accounts and read admin audit trail logs.

---

## 6. Stripe Payment Gateway Integration

To implement payment checkout, follow this standard workflow.

### Step 1: Install Stripe Helper
Ensure Stripe packages are installed:
```bash
npm install stripe @stripe/stripe-js
```

### Step 2: Configure Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Create Checkout Route (`src/app/api/checkout/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
});

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await req.json();

    // Map checkout items to Stripe's line items format
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Create Checkout Sessions
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}&order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?error=payment_cancelled`,
      metadata: {
        orderId: orderId,
      },
      customer_email: customerEmail,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Step 4: Create Webhook Route (`src/app/api/webhooks/stripe/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { executeQuery } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature validation failed: ${err.message}` }, { status: 400 });
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      // Update order status to 'paid' in the database
      const sql = 'UPDATE orders SET status = ? WHERE id = ?';
      await executeQuery(sql, ['paid', orderId]);
      console.log(`Order ${orderId} successfully updated to status PAID`);
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 7. Hostinger Deployment Guide (with Perfect Security)

### Deployment Steps
1. **Set up the Node.js application container:**
   - Go to your Hostinger hPanel > **Websites > Manage**.
   - Search for **Node.js Dashboard** and click **Setup**.
   - Assign Node.js version **20.x** (or later).
   - Enter your preferred subdirectory name (e.g. `public_html`).
2. **Setup the Database:**
   - Under hPanel, go to **Databases > MySQL Databases**.
   - Create a clean database name, username, and secure password.
   - Access **phpMyAdmin** and import the SQL statements described in [Section 3](#3-sql-schema-definitions).
3. **Deploy the Code:**
   - Clone your git repository using the Hostinger panel git integrations, or access SSH terminal in Hostinger and clone it directly:
     ```bash
     git clone <your-git-repo-url> .
     ```
   - Install all required dependencies:
     ```bash
     npm install
     ```
4. **Configure Production Env:**
   - Create a `.env` file in the root directory and add production database details, secret strings, and application URLs.
5. **Build and Run:**
   - Run the compiler build command inside the Hostinger terminal:
     ```bash
     npm run build
     ```
   - Start your server application. Hostinger automatically configures passenger/PM2. If starting manually:
     ```bash
     npm run start
     ```

### Perfect Security Architecture
- **HTTPS Enforcement:** Always redirect HTTP traffic to HTTPS via Hostinger SSL Manager (install free Let's Encrypt certificates).
- **HTTP-Only Cookies:** Ensure the JWT tokens are signed using high entropy hashes and served strictly via `httpOnly: true`, `secure: true`, and `sameSite: "lax"` cookie parameters (already built into `/api/admin/login` and `/api/customer/auth/verify-otp`).
- **Database Access Control:** Never expose remote database access ports globally. Keep `DB_HOST` configured as `localhost` or `127.0.0.1`. Disable the Hostinger remote SQL feature unless explicitly whitelist-filtering your dev IP address.
- **Hide Server Headers:** Configure Next.js config to omit standard generator headers to prevent revealing software versions to malicious scanners.
