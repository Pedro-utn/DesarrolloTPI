-- Tabla Location (sin cambios, la incluyo para contexto)
CREATE TABLE "location" (
  id SERIAL PRIMARY KEY,
  street VARCHAR NOT NULL,
  number INTEGER NOT NULL,
  cityId INTEGER NOT NULL,
  lat VARCHAR NOT NULL,
  ing VARCHAR NOT NULL
);

CREATE TABLE "order" (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  restaurantId INTEGER NOT NULL,
  products INTEGER[] NOT NULL,
  location INTEGER NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  delivery INTEGER
);

-- Esta tabla contendrá los detalles específicos de cada transacción,
-- cuya clave primaria será un string (VARCHAR) para IDs generados por pasarelas.
CREATE TABLE "transaction_detail" (
  transaction_id VARCHAR PRIMARY KEY, -- Clave primaria de tipo VARCHAR (string)
  payment_id VARCHAR,                -- Podría ser un ID interno del sistema de pagos
  payment_status VARCHAR NOT NULL,   -- Estado del pago (completed, pending, failed, etc.)
  payment_method VARCHAR NOT NULL,   -- Método de pago (MP, Credit Card, Debit Card, etc.)
  payment_time TIMESTAMP NOT NULL   -- Fecha y hora del pago
);

-- Nueva Tabla para Detalles de Reembolso
-- Se añade una restricción UNIQUE en transaction_id para asegurar
-- que solo haya un reembolso por cada transacción.
CREATE TABLE "refund_detail" (
  refund_id VARCHAR PRIMARY KEY,       -- ID único del reembolso
  transaction_id VARCHAR NOT NULL UNIQUE, -- Clave foránea a transaction_detail, AHORA ES ÚNICA
  refund_status VARCHAR NOT NULL,      -- Estado del reembolso (completed, pending, failed)
  reason VARCHAR,                      -- Razón del reembolso
  refund_time TIMESTAMP NOT NULL,      -- Fecha y hora del reembolso
  FOREIGN KEY (transaction_id) REFERENCES "transaction_detail"(transaction_id)
);

-- Tabla Payment (modificada para relacionarse con transaction_detail)
CREATE TABLE "payment" (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  method VARCHAR NOT NULL, -- "MP", "Credit Card", etc. (si es distinto del payment_method de transaction_detail)
  transaction_detail_id VARCHAR NOT NULL, -- Clave foránea a la tabla transaction_detail
  status VARCHAR NOT NULL DEFAULT 'pending', -- Estado del pago (paid, refunded, pending, completed)
  refund_detail_id VARCHAR UNIQUE, -- Clave foránea a la tabla refund_detail, AHORA ES ÚNICA Y PUEDE SER NULL

  FOREIGN KEY (order_id) REFERENCES "order"(id),
  FOREIGN KEY (transaction_detail_id) REFERENCES "transaction_detail"(transaction_id),
  FOREIGN KEY (refund_detail_id) REFERENCES "refund_detail"(refund_id)
);
