🍺 Bars Platform 2 - POS & Inventory SaaS
Sistema de Gestión para Bares y Restaurantes con arquitectura Multitenant, diseñado para gestionar inventario, ventas y métricas financieras en tiempo real.

Esta plataforma permite a múltiples dueños de restaurantes gestionar su negocio de forma aislada, controlando el costo de ingredientes y calculando la ganancia real de cada venta.

🛠️ Stack Tecnológico
Backend: NestJS, TypeScript, Prisma ORM.
Base de Datos: PostgreSQL (Serverless en Neon.tech).
Frontend: React 18, Vite, TypeScript, Axios.
Seguridad: JWT (Passport), Bcrypt, RBAC (Roles).
Infraestructura: Git, API RESTful.
📁 Estructura del Proyecto
bars-platform2/├── apps/│   └── tenant-owner/              # Panel Web del Dueño/Admin│       ├── src/│       │   ├── services/          # Cliente API (Axios)│       │   └── App.tsx            # Dashboard, Inventario, Ventas│       └── package.json│├── services/│   └── api/                       # Backend NestJS│       ├── prisma/│       │   ├── schema.prisma      # Definición de modelos│       │   └── seed.ts            # Datos iniciales (Admin)│       ├── src/│       │   ├── modules/│       │   │   ├── auth/           # Login, JWT, Roles│       │   │   ├── tenants/        # Gestión de Bares (Tenants)│       │   │   ├── users/          # Usuarios (Owner, Staff)│       │   │   ├── business/       # Productos, Categorías, Recetas, Ventas│       │   │   ├── ingredients/    # Inventario de Materias Primas│       │   │   └── orders/         # Historial y Estadísticas│       │   ├── guards/            # RolesGuard, JwtAuthGuard│       │   └── decorators/        # @CurrentUser│       └── .env                   # Variables de entorno (BD URL, Secret)│└── README.md
✨ Características Principales
🔐 Seguridad y Multitenancia
Autenticación JWT con expiración de 24h.
Roles: PLATFORM_ADMIN, OWNER, ADMIN, STAFF.
Aislamiento total de datos por TenantId (Los usuarios solo ven su propio negocio).
Protección contra DDoS (Throttler) y ataques comunes (Helmet).
📦 Gestión de Inventario (Materias Primas)
Creación de ingredientes con Unidad y Costo Unitario.
Control de stock actual.
Alertas visuales de stock bajo.
🍔 Gestión de Productos y Recetas
Categorización de productos (Bebidas, Comidas, etc.).
Definición de Recetas: Vinculación de productos con múltiples ingredientes (ej: 1 Pan + 200g Carne).
Cálculo automático de costo de producción basado en ingredientes.
💰 Punto de Venta (POS) y Finanzas
Ventas rápidas con validación de stock.
Descuento automático de inventario al confirmar venta.
Cálculo en tiempo real: Ingresos vs. Costos vs. Ganancia Neta.
Historial de órdenes con fecha y detalle de ítems.
📊 Reportes y Dashboard
Dashboard Financiero: Resumen de Ingresos Totales, Costos Totales, Ganancia Neta y Número de Órdenes.
Filtros de Fecha: Generación de reportes por rango de fechas (ej: Ventas de hoy, de la semana pasada).
🚀 Configuración Rápida
Prerrequisitos
Node.js v18+
npm o yarn
Cuenta en Neon.tech (Base de datos Postgres).
1. Instalación
Clonar el repositorio e instalar dependencias:
# Instalar dependencias raíz
npm install

# Instalar Backend
cd services/api
npm install

# Instalar Frontend
cd ../../apps/tenant-owner
npm install

2. Configuración de Base de Datos
Copia el archivo .env.example en services/api a .env.
Pega tu DATABASE_URL de Neon en el archivo .env.
Genera el cliente Prisma y aplica las migraciones:
cd services/api
npx prisma generate
npx prisma db push

3. Poblar Datos Iniciales (Seed)
Crea el usuario administrador por defecto:
npx prisma db seed
Email: admin@bars.com
Pass: 123456

🏃 Ejecutar el Proyecto
Backend (NestJS)
cd services/api
npm run start:dev
Corre en http://localhost:3001

Frontend (Vite + React)
cd apps/tenant-owner
npm run dev
Corre en http://localhost:5173 (o 5174)

📝 Notas de Uso
Flujo de Trabajo Típico
Registro: El Admin de Plataforma crea un Tenant (Bar) y un Usuario Owner.
Configuración: El Owner ingresa al sistema y carga sus ingredientes (ej: Pan, Queso) asignando un Costo Unitario.
Menú: Crea productos (Hamburguesa) y define la Receta (vincula ingredientes y cantidades).
Operación: El Staff utiliza el botón "VENDER". El sistema verifica stock, descuenta materia prima y calcula ganancia.
Análisis: El Owner revisa el Dashboard para ver Ganancia Neta filtrada por fecha.

🔒 Variables de Entorno (.env)
DATABASE_URL="postgresql://user:password@ep-neon.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="super-secret-key-min-32-chars"
PORT=3001

🗺️ Rutas de la API (Backend)
POST /auth/login - Autenticación.
POST /tenants - Crear negocio (Admin).
POST /users - Crear usuario (Admin).
GET /products - Listar productos.
POST /products - Crear producto.
POST /products/:id/ingredients - Agregar ingrediente a receta.
POST /products/:id/sell - Registrar venta.
GET /ingredients - Listar inventario.
POST /ingredients - Crear ingrediente.
GET /orders - Historial de ventas.
GET /orders/stats?start=YYYY-MM-DD&end=YYYY-MM-DD - Estadísticas financieras.
🛣️ Roadmap (Próximos Pasos)
 App para Meseros (tenant-operation): PWA para toma de pedidos en tabletas.
 App para Clientes (client-app): React Native para menú QR y pedidos.
 Reportes PDF: Exportación de reportes diarios/semanales.
 Impresión de Tickets: Integración con impresoras térmicas.
📄 Licencia
Propiedad de Bars Platform 2.
