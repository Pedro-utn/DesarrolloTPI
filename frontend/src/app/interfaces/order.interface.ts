// Esta interfaz describe la estructura de la ubicación dentro de un pedido.
// Parte de la dirección del pedido.
export interface OrderLocation {
  street: string;
  number: string;
  cityId: number;
  location: {
    lat: number;
    lng: number;
  };
}

// Esta interfaz describe la estructura completa de UN SOLO PEDIDO
export interface Order {
  id: number;
  status: string;
  delivery: string | null;
  location: OrderLocation;
}

// Esta interfaz describe los parámetros que Angular le envia a la API
// en la URL para pedir la paginación
export interface PaginationQueryParams {
  page?: number;
  quantity?: number; 
}

// Esta es la interfaz para ENVIAR pedidos (POST)
export interface NewOrderRequest {
  userId: string;
  restaurantId: number;
  products: number[];
  location: {
    street: string;
    number: string;
    cityId: number;
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Esta es la interfaz que se usa para ACTUALIZAR pedidos (PUT/PATCH)
export interface OrderUpdateRequest {
  status: string;
  location: {
    street: string;
    number: string;
    cityId: number;
    location: {
      lat: number;
      lng: number;
    };
  };
}