-- ==========================================
-- MULTI-TENANT RESTAURANT SaaS SCHEMA
-- ==========================================

-- =========================
-- 0. RESTAURANTS (TENANTS)
-- =========================
CREATE TABLE IF NOT EXISTS restaurant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    greeting_text TEXT,
    language VARCHAR(10) DEFAULT 'en',
    tone VARCHAR(20) DEFAULT 'neutral',
    upsell_enabled BOOLEAN DEFAULT TRUE,
    operating_hours JSONB, -- e.g., {"monday": "9-21", "tuesday": "9-21"}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 1. USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'restaurant_owner', 'staff')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_users_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE,
    CONSTRAINT users_restaurant_required CHECK (role = 'superadmin' OR restaurant_id IS NOT NULL)
);

-- =========================
-- 2. FOODS (MENU ITEMS)
-- =========================
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_foods_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_available ON foods(available);
CREATE INDEX IF NOT EXISTS idx_foods_restaurant ON foods(restaurant_id);

-- =========================
-- 3. ORDERS
-- =========================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    platform VARCHAR(20) DEFAULT 'whatsapp',
    service_type VARCHAR(20) CHECK (service_type IN ('dine_in', 'delivery', 'pickup')),
    status VARCHAR(50) DEFAULT 'created'
        CHECK (status IN ('created','pending','accepted','confirmed','preparing','ready','completed','cancelled','rejected')),
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash','esewa','khalti','fonepay','card')),
    payment_verified BOOLEAN DEFAULT false,
    payment_screenshot_url TEXT,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_orders_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);

-- =========================
-- 4. ORDER ITEMS
-- =========================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =========================
-- 5. TABLES (DINE-IN)
-- =========================
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    table_number INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(50) CHECK (location IN ('indoor','outdoor','private')),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_tables_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE
);

-- Unique table_number per restaurant
CREATE UNIQUE INDEX IF NOT EXISTS uniq_table_per_restaurant ON tables (restaurant_id, table_number);

-- =========================
-- 6. RESERVATIONS
-- =========================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    customer_id VARCHAR(50),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    platform VARCHAR(20),
    table_id INTEGER REFERENCES tables(id),
    party_size INTEGER DEFAULT 2,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_reservations_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);

-- =========================
-- 7. SESSIONS (APP CONTEXT)
-- =========================
CREATE TABLE IF NOT EXISTS sessions (
    user_id VARCHAR(50) PRIMARY KEY,
    restaurant_id INTEGER,
    context JSONB NOT NULL,
    cart JSONB DEFAULT '[]',
    payment_method VARCHAR(20),
    service_type VARCHAR(20),
    delivery_address TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_sessions_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE
);

-- =========================
-- 8. INSERT SAMPLE FOODS
-- =========================
INSERT INTO foods (restaurant_id, name, description, price, category, image_url, available) VALUES
-- Replace restaurant_id = 1 for demo
(1, 'Steamed Veg Momo', 'Fresh vegetables & herbs wrapped in soft dough, steamed to perfection', 180.00, 'momos', 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80', true),
(1, 'Steamed Chicken Momo', 'Juicy chicken filling in soft steamed dumplings', 220.00, 'momos', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', true),
(1, 'Fried Veg Momo', 'Crispy fried vegetable momos with crunchy exterior', 200.00, 'momos', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', true),
(1, 'Fried Chicken Momo', 'Golden fried chicken momos, crispy and delicious', 240.00, 'momos', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', true),
(1, 'Tandoori Momo', 'Momos grilled in tandoor with special spices', 260.00, 'momos', 'https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=400&q=80', true),
(1, 'Jhol Momo', 'Steamed momos served in spicy soup gravy', 250.00, 'momos', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', true)
ON CONFLICT DO NOTHING;

-- =========================
-- 9. WHATSAPP CREDENTIALS
-- =========================
CREATE TABLE IF NOT EXISTS whatsapp_credentials (
    user_id VARCHAR(50) PRIMARY KEY,
    access_token TEXT NOT NULL,
    phone_number_id VARCHAR(50) NOT NULL,
    whatsapp_business_account_id VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP,
    phone_number VARCHAR(50),
    display_phone_number VARCHAR(50),
    quality_rating VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP DEFAULT NOW(),
    last_verified_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
-- Facebook Page Integration Credentials Table
CREATE TABLE IF NOT EXISTS facebook_credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Facebook Page credentials
    page_id VARCHAR(255) NOT NULL,
    page_name VARCHAR(255),
    page_access_token TEXT NOT NULL,
    
    -- Connection status
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id),
    UNIQUE(page_id)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_facebook_user_id ON facebook_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_facebook_page_id ON facebook_credentials(page_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_credentials_user_id ON whatsapp_credentials(user_id);
