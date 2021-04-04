DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR (255) NOT NULL,
  time_to_ready INTEGER NOT NULL,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  image TEXT NOT NULL
);
