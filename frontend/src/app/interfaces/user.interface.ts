// Define la estructura esperada para la respuesta del endpoint '/me' del backend,
// que proporciona información sobre el usuario actualmente autenticado.
export interface MeResponse {
  email: string;
  id: number;
}