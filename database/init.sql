-- Tabla Location
CREATE TABLE "location" (
  id SERIAL PRIMARY KEY,
  street VARCHAR NOT NULL,
  number INTEGER NOT NULL,
  cityId INTEGER NOT NULL, 
  lat VARCHAR NOT NULL,
  ing VARCHAR NOT NULL
);

-- Tabla Order
CREATE TABLE "order" (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  restaurantId INTEGER NOT NULL,
  products INTEGER[] NOT NULL,
  location INTEGER NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  delivery INTEGER
);

-- Tabla Payment

CREATE TABLE "payment" (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  method VARCHAR NOT NULL,
  transaction_transaction_id VARCHAR NOT NULL,
  transaction_payment_id VARCHAR NOT NULL,
  transaction_transaction_status VARCHAR NOT NULL,
  payment_method VARCHAR NOT NULL,
  payment_time TIMESTAMP NOT NULL
);

