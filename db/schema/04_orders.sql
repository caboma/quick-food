DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
<<<<<<< HEAD
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  total_amount INTEGER DEFAULT 0,
  status VARCHAR(255)
=======
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE DEFAULT 1,
  ready_for_pickup BOOLEAN DEFAULT FALSE,
  fulfilled BOOLEAN DEFAULT FALSE
>>>>>>> feature-additems
  );
