import { Pool } from "pg";

export const DEFAULT_RESTAURANT_ID = "main-kitchen";

const rawConnectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_DB_URL ||
  "";

const connectionString = (() => {
  try {
    const url = new URL(rawConnectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("channel_binding");
    url.searchParams.delete("uselibpqcompat");
    return url.toString();
  } catch {
    return rawConnectionString;
  }
})();

const useSSL =
  rawConnectionString.includes("neon.tech") ||
  rawConnectionString.includes("sslmode=require") ||
  process.env.PGSSL === "true" ||
  process.env.PGSSLMODE === "require";

const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_SIZE || 20),
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
});

let schemaReady = false;

const seedRestaurants = async () => {
  await pool.query(
    `
      INSERT INTO restaurants (id, name, description, location, image, rating, is_open, opening_hours)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8),
        ('harbor-bistro', 'Harbor Bistro', 'Casual coastal dishes and daily specials.', 'Downtown', '', 4.7, true, '09:00-22:00'),
        ('garden-grill', 'Garden Grill', 'Fresh bowls, grilled mains, and seasonal plates.', 'Uptown', '', 4.6, true, '10:00-21:30')
      ON CONFLICT (id) DO NOTHING;
    `,
    [
      DEFAULT_RESTAURANT_ID,
      "Tomato Kitchen",
      "Default restaurant for the food delivery menu.",
      "Online",
      "",
      4.8,
      true,
      "09:00-23:00",
    ]
  );
};

const seedFoods = async () => {
  const seededFoods = [
    {
      id: "seed-food-1",
      name: "Greek Salad Bowl",
      description: "Crisp lettuce, feta cubes, olives, and a lemon-herb dressing.",
      price: 12,
      image: "1722865444288food_1.png",
      category: "Salad",
    },
    {
      id: "seed-food-2",
      name: "Avocado Crunch Salad",
      description: "Mixed greens, avocado slices, cucumber, and roasted seeds.",
      price: 14,
      image: "1722865514626food_2.png",
      category: "Salad",
    },
    {
      id: "seed-food-3",
      name: "Citrus Quinoa Salad",
      description: "Protein-packed quinoa with oranges, greens, and toasted almonds.",
      price: 15,
      image: "1722865628915food_3.png",
      category: "Salad",
    },
    {
      id: "seed-food-4",
      name: "Protein Garden Salad",
      description: "Fresh veggies, chickpeas, and house vinaigrette for a light meal.",
      price: 13,
      image: "1722865668073food_4.png",
      category: "Salad",
    },
    {
      id: "seed-food-5",
      name: "Paneer Tikka Roll",
      description: "Spiced paneer, onions, and mint chutney wrapped in soft flatbread.",
      price: 11,
      image: "1722865738489food_5.png",
      category: "Rolls",
    },
    {
      id: "seed-food-6",
      name: "Peri Peri Chicken Roll",
      description: "Smoky chicken strips with peri peri sauce and crunchy lettuce.",
      price: 13,
      image: "1722865934153food_6.png",
      category: "Rolls",
    },
    {
      id: "seed-food-7",
      name: "Veggie Spring Roll",
      description: "Crispy veggie filling with chili garlic dip on the side.",
      price: 10,
      image: "1722865976487food_7.png",
      category: "Rolls",
    },
    {
      id: "seed-food-8",
      name: "Egg Mayo Roll",
      description: "Creamy egg mayo with fresh herbs wrapped in a toasted roll.",
      price: 10.5,
      image: "1722866043779food_8.png",
      category: "Rolls",
    },
    {
      id: "seed-food-9",
      name: "Ripple Ice Cream",
      description: "Classic ripple dessert with creamy texture and sweet finish.",
      price: 8,
      image: "1722866109947food_9.png",
      category: "Deserts",
    },
    {
      id: "seed-food-10",
      name: "Fruit Sundae",
      description: "Fresh seasonal fruits served over chilled vanilla cream.",
      price: 9.5,
      image: "1722866148130food_10.png",
      category: "Deserts",
    },
    {
      id: "seed-food-11",
      name: "Choco Brownie Jar",
      description: "Layered brownie crumbs, cream, and chocolate sauce in a jar.",
      price: 9,
      image: "1722866329894food_11.png",
      category: "Deserts",
    },
    {
      id: "seed-food-12",
      name: "Vanilla Bean Scoop",
      description: "Premium vanilla bean scoop topped with caramel drizzle.",
      price: 7.5,
      image: "1722866385025food_12.png",
      category: "Deserts",
    },
    {
      id: "seed-food-13",
      name: "Grilled Chicken Sandwich",
      description: "Juicy grilled chicken, lettuce, and aioli in toasted bread.",
      price: 12,
      image: "1722866412882food_13.png",
      category: "Sandwich",
    },
    {
      id: "seed-food-14",
      name: "Veg Club Sandwich",
      description: "Layered vegetables, cheese, and tangy sauce in triple slices.",
      price: 11.5,
      image: "1722866469319food_14.png",
      category: "Sandwich",
    },
    {
      id: "seed-food-15",
      name: "Pesto Mozzarella Melt",
      description: "Basil pesto, mozzarella, and tomato grilled to perfection.",
      price: 12.5,
      image: "1722866504992food_15.png",
      category: "Sandwich",
    },
    {
      id: "seed-food-16",
      name: "Smoked Paneer Sandwich",
      description: "Smoky paneer stuffing with onion rings and mint chutney.",
      price: 12,
      image: "1722866560218food_16.png",
      category: "Sandwich",
    },
    {
      id: "seed-food-17",
      name: "Red Velvet Slice",
      description: "Soft red velvet cake slice with cream cheese frosting.",
      price: 8.5,
      image: "1722866610567food_17.png",
      category: "Cake",
    },
    {
      id: "seed-food-18",
      name: "Belgian Chocolate Cake",
      description: "Rich chocolate layers with smooth ganache topping.",
      price: 9.5,
      image: "1722866647952food_18.png",
      category: "Cake",
    },
    {
      id: "seed-food-19",
      name: "Butterscotch Crunch Cake",
      description: "Creamy butterscotch frosting with caramel crunch bits.",
      price: 9,
      image: "1722866694357food_19.png",
      category: "Cake",
    },
    {
      id: "seed-food-20",
      name: "Pineapple Cream Cake",
      description: "Light sponge cake with pineapple chunks and whipped cream.",
      price: 8.75,
      image: "1722866729053food_20.png",
      category: "Cake",
    },
    {
      id: "seed-food-21",
      name: "Garlic Mushroom Stir Fry",
      description: "Sauteed mushrooms with garlic, herbs, and mild spices.",
      price: 11,
      image: "1722866777756food_21.png",
      category: "Pure Veg",
    },
    {
      id: "seed-food-22",
      name: "Fried Cauliflower Bites",
      description: "Golden cauliflower bites tossed in signature seasoning.",
      price: 10.5,
      image: "1722866830901food_22.png",
      category: "Pure Veg",
    },
    {
      id: "seed-food-23",
      name: "Mix Veg Pulao",
      description: "Fragrant basmati rice with mixed vegetables and whole spices.",
      price: 10,
      image: "1722866871307food_23.png",
      category: "Pure Veg",
    },
    {
      id: "seed-food-24",
      name: "Rice Zucchini Medley",
      description: "Steamed rice with zucchini, herbs, and roasted garlic.",
      price: 10.25,
      image: "1722866909328food_24.png",
      category: "Pure Veg",
    },
    {
      id: "seed-food-25",
      name: "Creamy Alfredo Pasta",
      description: "Creamy white-sauce pasta with herbs and parmesan.",
      price: 12.5,
      image: "1722866948105food_25.png",
      category: "Pasta",
    },
    {
      id: "seed-food-26",
      name: "Tomato Basil Pasta",
      description: "Fresh tomato sauce pasta with basil and olive oil.",
      price: 12,
      image: "1722867018540food_26.png",
      category: "Pasta",
    },
    {
      id: "seed-food-27",
      name: "Arrabbiata Penne",
      description: "Spicy red sauce penne with chili flakes and garlic.",
      price: 12.75,
      image: "1722867053413food_27.png",
      category: "Pasta",
    },
    {
      id: "seed-food-28",
      name: "Herbed Mushroom Pasta",
      description: "Sauteed mushrooms tossed in creamy herb-infused sauce.",
      price: 13.25,
      image: "1722867110108food_28.png",
      category: "Pasta",
    },
    {
      id: "seed-food-29",
      name: "Butter Garlic Noodles",
      description: "Noodles stir fried with butter, garlic, and spring onions.",
      price: 11.5,
      image: "1722867144188food_29.png",
      category: "Noodles",
    },
    {
      id: "seed-food-30",
      name: "Veg Hakka Noodles",
      description: "Classic wok tossed noodles with crunchy vegetables.",
      price: 11,
      image: "1722867222977food_30.png",
      category: "Noodles",
    },
    {
      id: "seed-food-31",
      name: "Somen Sesame Noodles",
      description: "Light somen noodles with sesame dressing and greens.",
      price: 12,
      image: "1722867254829food_31.png",
      category: "Noodles",
    },
    {
      id: "seed-food-32",
      name: "Chilli Garlic Noodles",
      description: "Hot and flavorful noodles with chili garlic glaze.",
      price: 12.25,
      image: "1722867630288food_32.png",
      category: "Noodles",
    },
  ];

  for (const food of seededFoods) {
    await pool.query(
      `
        INSERT INTO foods (id, restaurant_id, name, description, price, image, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE
        SET
          restaurant_id = EXCLUDED.restaurant_id,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          image = EXCLUDED.image,
          category = EXCLUDED.category;
      `,
      [
        food.id,
        DEFAULT_RESTAURANT_ID,
        food.name,
        food.description,
        food.price,
        food.image,
        food.category,
      ]
    );
  }
};

const initializeSchema = async () => {
  if (schemaReady) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      cart_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
      is_open BOOLEAN NOT NULL DEFAULT true,
      opening_hours TEXT NOT NULL DEFAULT '09:00-23:00',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      restaurant_id TEXT NOT NULL DEFAULT '${DEFAULT_RESTAURANT_ID}' REFERENCES restaurants(id) ON DELETE SET DEFAULT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      restaurant_id TEXT NOT NULL DEFAULT '${DEFAULT_RESTAURANT_ID}' REFERENCES restaurants(id) ON DELETE SET DEFAULT,
      items JSONB NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      address JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'Food Processing',
      payment BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL DEFAULT 'stripe',
      session_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending',
      currency TEXT NOT NULL DEFAULT 'usd',
      amount NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
      partner_name TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      gps_lat NUMERIC(10,7),
      gps_lng NUMERIC(10,7),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(
    `ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`
  );
  await pool.query(
    `ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`
  );
  await pool.query(
    `ALTER TABLE foods ADD COLUMN IF NOT EXISTS restaurant_id TEXT NOT NULL DEFAULT '${DEFAULT_RESTAURANT_ID}'`
  );
  await pool.query(
    `ALTER TABLE orders ADD COLUMN IF NOT EXISTS restaurant_id TEXT NOT NULL DEFAULT '${DEFAULT_RESTAURANT_ID}'`
  );

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_foods_restaurant_category ON foods (restaurant_id, category);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders (user_id, created_at DESC);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_payments_order ON payments (order_id);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_deliveries_order ON deliveries (order_id);
  `);

  await seedRestaurants();
  await seedFoods();
  schemaReady = true;
};

export const connectDB = async () => {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing. Add your Neon PostgreSQL connection string to backend/.env."
    );
  }

  await pool.query("SELECT 1");
  await initializeSchema();
  console.log("PostgreSQL Connected");
};

export const query = (text, params = []) => pool.query(text, params);
