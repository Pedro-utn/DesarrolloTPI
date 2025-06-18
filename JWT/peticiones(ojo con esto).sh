#!/bin/bash

API_URL="http://localhost:3001"
DLV_URL="http://localhost:3000"
JWT_FILE=".jwt_token"

function register() {
  echo "Registrando usuario pepito..."
  curl -s --location "$API_URL/register" \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "email": "pepito@normal.com",
      "password": "pepito"
    }' | jq
}

function login_as_admin() {
  echo "Logueando como admin..."
  RESPONSE=$(curl -s --location "$API_URL/login" \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "email": "admin@sistema.com",
      "password": "admin123"
    }')

  echo "$RESPONSE" | jq

  JWT=$(echo "$RESPONSE" | jq -r '.accessToken')

  if [[ "$JWT" == "null" || -z "$JWT" ]]; then
    echo "❌ No se pudo obtener el JWT."
  else
    echo "✅ JWT obtenido y guardado."
    echo "$JWT" > "$JWT_FILE"
  fi
}

function login_as_user() {
  echo "Logueando como pepito..."
  RESPONSE=$(curl -s --location "$API_URL/login" \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "email": "pepito@normal.com",
      "password": "pepito"
    }')

  echo "$RESPONSE" | jq

  JWT=$(echo "$RESPONSE" | jq -r '.accessToken')

  if [[ "$JWT" == "null" || -z "$JWT" ]]; then
    echo "❌ No se pudo obtener el JWT."
  else
    echo "✅ JWT obtenido y guardado."
    echo "$JWT" > "$JWT_FILE"
  fi
}

function get_permissions() {
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  echo "Consultando /permissions con JWT..."
  curl -s --location "$API_URL/permissions/" \
    --header "Authorization: Bearer $JWT" | jq
}

function get_roles() {
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  echo "Consultando /roles con JWT..."
  curl -s --location "$API_URL/roles/" \
    --header "Authorization: Bearer $JWT" | jq
}

function delivery_assign_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location "$DLV_URL/api/v1/delivery/1/assignZone" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer $JWT" \
    --data-raw '{
      "zoneIds": [1]
    }' | jq
}

function delete_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request DELETE "$DLV_URL/api/v1/zones/3" \
    --header "Authorization: Bearer $JWT" | jq
}

function put_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request PUT "$DLV_URL/api/v1/zones/1" \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $JWT" \
  --data '{
    "name": "Zona Sur",
    "radius": 20,
    "location": {
        "lat": 12.0,
        "lng": 11.0
    }
  }' | jq
}

function patch_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request PATCH "$DLV_URL/api/v1/zones/1" \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $JWT" \
  --data '{
    "name": "Zona Centro"
  }' | jq
}

function get_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location "$DLV_URL/api/v1/zones" \
    --header "Authorization: Bearer $JWT" | jq
}

function get_zone_pag(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location "$DLV_URL/api/v1/zones?page=1&quantity=10" \
    --header "Authorization: Bearer $JWT" | jq
}

function get_zone_by_id(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location "$DLV_URL/api/v1/zones/1" \
    --header "Authorization: Bearer $JWT" | jq
}

function post_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request POST "$DLV_URL/api/v1/zones" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $JWT" \
    -d '{
      "name": "Teatro Belgrano",
      "radius": 10,
      "location": {
        "lat": -93.7637,
        "lng": -81.5906
      }
    }' | jq
}

function get_delivery_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")
 
  curl -s --location "$DLV_URL/api/v1/delivery/1/zones?page=1&limit=10" \
    --header "Authorization: Bearer $JWT" | jq

}

function post_delivery(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request POST "$DLV_URL/api/v1/deliveries" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer $JWT" \
    --data-raw '{
      "personId": "2",
      "location": { "lat": -31.4, "lng": -64.2 },
      "radius": 5
    }' | jq
}

function put_delivery_location(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request PUT "$DLV_URL/api/v1/deliveries/1/location" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer $JWT" \
    --data-raw '{
    "location": { "lat": -31.41, "lng": -64.23 }
    }' | jq
}

function put_delivery_status(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request PUT "$DLV_URL/api/v1/deliveries/1/status" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer $JWT" \
    --data-raw '{
      "status": "in_route"
    }' | jq
}

function delete_delivery_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request DELETE "$DLV_URL/api/v1/delivery/1/zone/1" \
    --header "Authorization: Bearer $JWT" | jq
}

function delete_delivery(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request DELETE "$DLV_URL/api/v1/deliveries/1" \
    --header "Authorization: Bearer $JWT" | jq
}

function get_delivery_find_by_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location "$DLV_URL/api/v1/deliveries/findByZone?zoneId=1&page=1&quantity=5" \
    --header "Authorization: Bearer $JWT" \
    --header "Content-Type: application/json" | jq
}

function get_delivery_find_by_proximity(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location "$DLV_URL/api/v1/deliveries/findByProximity?lat=-93.7637&lng=-81.5906&radius=999999999&page=1&quantity=5" \
    --header "Authorization: Bearer $JWT" \
    --header "Content-Type: application/json" | jq
}

function post_delivery_zone(){
  if [ ! -f "$JWT_FILE" ]; then
    echo "❌ No hay JWT guardado. Hacé login primero."
    return
  fi

  JWT=$(cat "$JWT_FILE")

  curl -s --location --request POST "$DLV_URL/api/v1/deliveries/1/assignZone" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $JWT" \
  --data-raw '{
    "zoneIds": [1, 2]
  }' | jq
}

function menu() {
  clear
  echo "=============================="
  echo "  🚀 Menú de API Bash Client"
  echo "=============================="
  echo "1) Registrar a pepito"
  echo "2) Login como admin"
  echo "3) Login como pepito"
  echo "4) Consultar /permissions"
  echo "5) Consultar /roles"
  echo "6) GET /zone"
  echo "7) GET /zone (Con paginación pag = 1, cant = 10)"
  echo "8) GET /zone/:id (id = 1)" 
  echo "9) POST /zone"
  echo "10) DELETE /zone/:id (id = 1)"
  echo "11) PUT /zone/:id (id = 1)"
  echo "12) PATCH /zone/:id (id = 1)"
  echo "13) GET /delivery/:id/zones (Con paginación pag = 1, cant = 10)"
  echo "14) POST /delivery"
  echo "15) DELETE /delivery/:id/zone/:zoneId (id = 1, zoneId = 1)"
  echo "16) DELETE /delivery/:id (id = 1)"
  echo "17) PUT /delivery/:id/location (id = 2)"
  echo "18) PUT /delivery/:id/status (id = 1)"
  echo "19) GET /delivery/findByZone (zoneId = 1, con paginación pag = 1, cant = 5)"
  echo "20) GET /delivery/findByProximity (Con paginación pag = 1, cant = 5)"
  echo "21) POST /delivery/:id/assignZone"
  echo "0) Salir"
  echo "------------------------------"
  read -p "Elegí una opción: " choice

  case $choice in
    1) register ;;
    2) login_as_admin ;;
    3) login_as_user ;;
    4) get_permissions ;;
    5) get_roles ;;
    6) get_zone ;;
    7) get_zone_pag ;;
    8) get_zone_by_id ;;
    9) post_zone ;;
    10) delete_zone ;;
    11) put_zone ;;
    12) patch_zone ;;
    13) get_delivery_zone ;;
    14) post_delivery ;;
    15) delete_delivery_zone ;;
    16) delete_delivery ;;
    17) put_delivery_location ;;
    18) put_delivery_status ;;
    19) get_delivery_find_by_zone ;;
    20) get_delivery_find_by_proximity ;;
    21) post_delivery_zone ;;
    0) echo "Chau 👋"; exit 0 ;;
    *) echo "Opción inválida" ;;
  esac
}

while true; do
  menu
  echo
  read -p "Presioná Enter para continuar..."
done

