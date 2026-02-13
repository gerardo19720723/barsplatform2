#!/bin/bash

echo "🔄 Iniciando restauración de datos para el nuevo esquema..."

API_URL="http://localhost:3001"
ADMIN_EMAIL="admin@bars.com"
ADMIN_PASS="123456"
JUAN_EMAIL="juanperez@lacantina.com"
JUAN_PASS="password123"

# 1. LOGIN COMO ADMIN
echo "🔐 Logueando como PLATFORM_ADMIN..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$ADMIN_TOKEN" == "null" ]; then
  echo "❌ Error logueando como Admin. Asegúrate que el usuario admin existe."
  exit 1
fi
echo "✅ Token Admin obtenido."

# 2. CREAR TENANT "Bar La Cantina"
echo "🏢 Creando Tenant Bar La Cantina..."
TENANT_RESPONSE=$(curl -s -X POST "$API_URL/tenants?token=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bar La Cantina","subdomain":"lacantina"}')

TENANT_ID=$(echo $TENANT_RESPONSE | jq -r '.id')
echo "✅ Tenant creado con ID: $TENANT_ID"

# 3. CREAR USUARIO "JUAN"
echo "👤 Creando Usuario Juan (OWNER)..."
USER_RESPONSE=$(curl -s -X POST "$API_URL/users?token=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$JUAN_EMAIL\",\"password\":\"$JUAN_PASS\",\"role\":\"OWNER\",\"tenantId\":\"$TENANT_ID\"}")

USER_ID=$(echo $USER_RESPONSE | jq -r '.id')
echo "✅ Usuario Juan creado."

# 4. LOGIN COMO JUAN
echo "🔐 Logueando como Juan..."
JUAN_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$JUAN_EMAIL\",\"password\":\"$JUAN_PASS\"}")

JUAN_TOKEN=$(echo $JUAN_LOGIN | jq -r '.access_token')

if [ "$JUAN_TOKEN" == "null" ]; then
  echo "❌ Error logueando como Juan."
  exit 1
fi
echo "✅ Token Juan obtenido."

# 5. CREAR CATEGORIA "Bebidas"
echo "🍻 Creando Categoría Bebidas..."
CAT_RESPONSE=$(curl -s -X POST "$API_URL/categories?token=$JUAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bebidas","icon":"beer"}')

CATEGORY_ID=$(echo $CAT_RESPONSE | jq -r '.id')
echo "✅ Categoría creada con ID: $CATEGORY_ID"

# 6. CREAR PRODUCTO "Cerveza IPA"
echo "🍺 Creando Producto Cerveza IPA..."
PROD_RESPONSE=$(curl -s -X POST "$API_URL/products?token=$JUAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Cerveza IPA\",\"price\":6.00,\"categoryId\":\"$CATEGORY_ID\"}")

echo "-------------------------------------------"
echo "✅ ¡RESTAURACIÓN COMPLETADA!"
echo "-------------------------------------------"
echo "🏢 Bar: Bar La Cantina"
echo "👤 Dueño: Juan ($JUAN_EMAIL)"
echo "🍻 Categoría: Bebidas"
echo "🍺 Producto: Cerveza IPA"
echo ""
echo "👉 Prueba hacer GET a: $API_URL/products?token=$JUAN_TOKEN"