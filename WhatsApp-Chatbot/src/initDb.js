/**
 * Database Initialization Script
 * Run this once to create tables and seed data on Render PostgreSQL
 * 
 * Usage: node src/initDb.js
 */

import db from './db.js';

const schema = `
-- =========================
-- 1. USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
        CHECK (role IN ('superadmin', 'restaurant_owner', 'staff')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 2. FOODS (MENU ITEMS)
-- =========================
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_available ON foods(available);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,

    customer_id VARCHAR(50) NOT NULL,
    platform VARCHAR(20) DEFAULT 'whatsapp',

    status VARCHAR(50) DEFAULT 'created'
        CHECK (status IN (
            'created',
            'confirmed',
            'preparing',
            'ready',
            'completed',
            'cancelled',
            'rejected'
        )),

    service_type VARCHAR(20)
        CHECK (service_type IN ('dine_in', 'delivery', 'pickup')),

    delivery_address TEXT,

    payment_method VARCHAR(20)
        CHECK (payment_method IN ('cash', 'esewa', 'khalti', 'fonepay', 'card')),

    total_amount DECIMAL(10,2),
    payment_verified BOOLEAN DEFAULT false,
    payment_screenshot_url TEXT,

    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    rejection_reason TEXT,

    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    special_instructions TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform);


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
    table_number INTEGER UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(50)
        CHECK (location IN ('indoor', 'outdoor', 'private')),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 6. RESERVATIONS
-- =========================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    table_id INTEGER REFERENCES tables(id),
    party_size INTEGER DEFAULT 2,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 7. SESSIONS (APP CONTEXT)
-- =========================
CREATE TABLE IF NOT EXISTS sessions (
    user_id VARCHAR(50) PRIMARY KEY,
    context JSONB NOT NULL,
    cart JSONB DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT NOW()
);
`;

const seedData = `
-- Insert food categories and items
INSERT INTO foods (name, description, price, category, image_url, available) VALUES
-- Momos
('Steamed Veg Momo', 'Fresh vegetables & herbs wrapped in soft dough, steamed to perfection', 180.00, 'momos', 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80', true),
('Steamed Chicken Momo', 'Juicy chicken filling in soft steamed dumplings', 220.00, 'momos', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', true),
('Fried Veg Momo', 'Crispy fried vegetable momos with crunchy exterior', 200.00, 'momos', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', true),
('Fried Chicken Momo', 'Golden fried chicken momos, crispy and delicious', 240.00, 'momos', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', true),
('Tandoori Momo', 'Momos grilled in tandoor with special spices', 260.00, 'momos', 'https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=400&q=80', true),
('Jhol Momo', 'Steamed momos served in spicy soup gravy', 250.00, 'momos', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', true),

-- Noodles
('Veg Thukpa', 'Traditional Tibetan noodle soup with vegetables', 200.00, 'noodles', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', true),
('Chicken Thukpa', 'Hearty noodle soup with tender chicken pieces', 250.00, 'noodles', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80', true),
('Veg Chowmein', 'Stir-fried noodles with fresh vegetables', 180.00, 'noodles', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80', true),
('Chicken Chowmein', 'Stir-fried noodles with chicken and vegetables', 220.00, 'noodles', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80', true),
('Veg Chopsuey', 'Crispy noodles with vegetable gravy', 220.00, 'noodles', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', true),

-- Rice Dishes
('Veg Fried Rice', 'Wok-tossed rice with mixed vegetables', 180.00, 'rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', true),
('Chicken Fried Rice', 'Delicious fried rice with chicken pieces', 220.00, 'rice', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80', true),
('Egg Fried Rice', 'Classic egg fried rice with vegetables', 190.00, 'rice', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80', true),
('Chicken Biryani', 'Aromatic basmati rice with spiced chicken', 300.00, 'rice', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', true),

-- Beverages
('Masala Tea', 'Traditional spiced tea', 40.00, 'beverages', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80', true),
('Coffee', 'Hot brewed coffee', 60.00, 'beverages', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', true),
('Fresh Lime Soda', 'Refreshing lime soda (sweet/salty)', 80.00, 'beverages', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80', true),
('Mango Lassi', 'Creamy mango yogurt drink', 100.00, 'beverages', 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80', true),
('Cold Coffee', 'Iced coffee with cream', 120.00, 'beverages', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', true)

ON CONFLICT DO NOTHING;
`;

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Create tables
    console.log('📦 Creating tables...');
    await db.query(schema);
    console.log('✅ Tables created successfully!\n');

    // Check if data already exists
    const existingData = await db.query('SELECT COUNT(*) FROM foods');
    const count = parseInt(existingData.rows[0].count);

    if (count > 0) {
      console.log(`ℹ️  Database already has ${count} food items. Skipping seed data.`);
    } else {
      // Seed data
      console.log('🌱 Seeding initial data...');
      await db.query(seedData);
      console.log('✅ Seed data inserted successfully!\n');
    }

    // Verify
    const foods = await db.query('SELECT COUNT(*) FROM foods');
    const orders = await db.query('SELECT COUNT(*) FROM orders');

    console.log('📊 Database Status:');
    console.log(`   - Foods: ${foods.rows[0].count} items`);
    console.log(`   - Orders: ${orders.rows[0].count} orders`);
    console.log('\n✅ Database initialization complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    await db.end();
    process.exit(0);
  }
}

initializeDatabase();
