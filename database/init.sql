CREATE TABLE "location" (
  id SERIAL PRIMARY KEY,
  street VARCHAR NOT NULL,
  number VARCHAR NOT NULL,
  "cityId" INTEGER NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);

CREATE TABLE "order" (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  restaurantId INTEGER NOT NULL,
  products INTEGER[] NOT NULL,
  location_id INTEGER NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  delivery INTEGER,
  FOREIGN KEY (location_id) REFERENCES "location"(id)
);

CREATE TABLE "transaction_detail" (
  transaction_id VARCHAR PRIMARY KEY,
  payment_id VARCHAR,
  payment_status VARCHAR NOT NULL,
  payment_method VARCHAR NOT NULL,  
  payment_time TIMESTAMP NOT NULL   
);

CREATE TABLE "refund_detail" (
  refund_id VARCHAR PRIMARY KEY,
  transaction_id VARCHAR NOT NULL UNIQUE,
  refund_status VARCHAR NOT NULL,
  reason VARCHAR,
  refund_time TIMESTAMP NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES "transaction_detail"(transaction_id)
);

CREATE TABLE "payment" (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  method VARCHAR NOT NULL, 
  transaction_detail_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  refund_detail_id VARCHAR UNIQUE,

  FOREIGN KEY (order_id) REFERENCES "order"(id),
  FOREIGN KEY (transaction_detail_id) REFERENCES "transaction_detail"(transaction_id),
  FOREIGN KEY (refund_detail_id) REFERENCES "refund_detail"(refund_id)
);
