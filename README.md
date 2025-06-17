# Microservicio: Order y Payment

Gestiona la creacion, modificacion y eliminacion, de ordenes y los pagos sobre las mismas.

---

## Endpoints

### Ordenes

#### `POST /order`

Crea un nuevo pedido, incluyendo la ubicación del cliente.

```json
Request:
{
  "userId": 1,
  "restaurantId": 1,
  "products": [1, 2],
  "location": {
   "street": "Av. Siempre Viva",
   "number": "742",
   "cityId": 1,
   "location": {
     "lat": -31.4,
     "lng": -64.2
    }
  }
}

Response:
{
  "id": 1,
  "status": "pending",
  "delivery": null,
  "location": {
   "street": "Av. Siempre Viva",
   "number": "742",
   "cityId": 1,
   "location": {
    "lat": -31.4,
    "lng": -64.2
    }
  }
}
```

#### `GET /order`

Obtiene todos los pedidos realizados.

```json
Response:
[
 {
  "id": 1,
  "status": "pending",
  "delivery": null,
  "location": {
   "street": "Av. Siempre Viva",
   "number": "742",
   "cityId": 1,
   "location": {
    "lat": -31.4,
    "lng": -64.2
   }
  }
 }
]
```

#### `GET /order/:id`

Obtiene un pedido específico por su ID. 

```json
Response:
{
  "id": 1,
  "status": "pending",
  "delivery": null,
  "location": {
   "street": "Av. Siempre Viva",
   "number": "742",
   "cityId": 1,
   "location": {
    "lat": -31.4,
    "lng": -64.2
    }
  }
}
```

#### `PUT /order/:id`

Actualiza completamente un pedido.

```json
Request:
{
  "status": "in_progress",
  "delivery": null,
  "location": {
   "street": "Av. Nueva",
   "number": "843",
   "cityId": 2,
   "location": {
    "lat": -32.0,
    "lng": -63.1
    }
  }
}

Response:
{
  "id": 1,
  "status": "in_progress",
  "delivery": null,
  "location": {
   "street": "Av. Nueva",
   "number": "843",
   "cityId": 2,
   "location": {
    "lat": -32.0,
    "lng": -63.1
    }
  }
}
```

#### `PATCH /order/:id`

Actualiza parcialmente un pedido (por ejemplo, el estado).

```json
Request:
{
  "status": "delivered"
}

Response:
{
  "id": 1,
  "status": "delivered",
  "delivery": null,
  "location": {
   "street": "Av. Nueva",
   "number": "843",
   "cityId": 2,
   "location": {
    "lat": -32.0,
    "lng": -63.1
    }
  }
}
```

#### `DELETE /order/:id`

Elimina un pedido del sistema.

```json
Response:
{
  "message": "deleted"
}
```

---

### Pagos

#### `POST /payment`

Realiza un pago para un pedido.

```json
Request:
{
 "orderId": 1,
 "amount": 300,
 "method": "MP",
 "transactionDetails": {
  "transactionId": "txn_12345",
  "paymentStatus": "completed"
  }
}

Response:
{
 "id": 1,
 "orderId": 1,
 "status": "paid",
 "transactionDetails": {
  "transactionId": "txn_12345",
  "paymentStatus": "completed"
 },
 "paymentMethod": "MP",
 "paymentTime": "2025-04-25T10:00:00Z"
}
```

#### `GET /payment`

Obtiene todos los pagos realizados.

```json
Response:
[
 {
  "id": 1,
  "orderId": 1,
  "status": "paid",
  "transactionDetails": {
   "transactionId": "txn_12345",
   "paymentStatus": "completed"
  },
  "paymentMethod": "MP",
  "paymentTime": "2025-04-25T10:00:00Z"
 }
]
```

#### `GET /payment/:id`

Obtiene los detalles de un pago específico por ID.

```json
Response:
{
 "id": 1,
 "orderId": 1,
 "status": "paid",
 "transactionDetails": {
  "transactionId": "txn_12345",
  "paymentStatus": "completed"
 },
 "paymentMethod": "MP",
 "paymentTime": "2025-04-25T10:00:00Z"
}
```

#### `PUT /payment/:id/status`

Actualiza el estado de un pago (por ejemplo, de "pendiente" a "completado").

```json
Request:
{
 "status": "completed"
}

Response:
{
 "id": 1,
 "orderId": 1,
 "status": "completed",
 "transactionDetails": {
  "transactionId": "txn_12345",
  "paymentStatus": "completed"
 },
 "paymentMethod": "MP",
 "paymentTime": "2025-04-25T10:00:00Z"
}
```

#### `POST /payment/:id/refund`

Solicita la devolución de un pago realizado.

```json
Request:
{
 "reason": "Customer requested a refund"
}

Response:
{
 "id": 1,
 "orderId": 1,
 "status": "refunded",
 "transactionDetails": {
  "transactionId": "txn_12345",
  "paymentStatus": "completed"
 },
 "paymentMethod": "MP",
 "paymentTime": "2025-04-25T10:00:00Z"
}
```

#### `DELETE /payment/:id`

Elimina un pago (si es necesario).

```json
Response:
{
 "message": "deleted"
}
```
---

### Descripcion de Estados:
#### Estados de los Pedidos:
- `pending`: Pedido pendiente.
- `in_progress`: Pedido en proceso.
- `delivered`: Pedido entregado.

#### Estados de los Pagos:
- `pending`: Pago pendiente.
- `completed`: Pago completado.
- `refunded`: Pago reembolsado.

---

## Guia

Para levantar el docker lo unico que es necesario hacer, es hacer un:

```bash
docker compose up --build
```

Solo esto es necesario ya que el backend y la base de datos se carga cuando se levanta el **Docker**.

Luego, en una cmd con **Curl** o si se quiere por otro metodo como **ThunderClient**(el cual utilizamos).

La url es:

- **http://localhost:3000/**