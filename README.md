🍺 Bars-Platform2
Sistema de Gestión para Bares y Restaurantes (POS) arquitectura Multitenant SaaS.

Esta plataforma permite a múltiples dueños de restaurantes gestionar su inventario, categorías y productos de forma aislada y segura.

🛠️ Stack Tecnológico
Backend: NestJS, TypeScript, Prisma ORM, Passport (JWT), Bcrypt.
Base de Datos: PostgreSQL (Serverless en Neon).
Frontend: React 18, Vite, TypeScript, Axios.
Infraestructura: Docker (Opcional), Git.
📁 Estructura del Proyecto
El proyecto sigue una arquitectura Monorepo optimizada para escalabilidad.

bars-platform2/├── apps/                               # Aplicaciones Frontend│   ├── platform-admin/                  # Panel para equipo interno (Futuro)│   ├── tenant-owner/                    # Panel Web del Dueño (Activo: React + Vite)│   │   ├── src/│   │   │   ├── services/                # Cliente Axios (api.ts)│   │   │   ├── App.tsx                  # Vista de Inventario Agrupado│   │   │   └── main.tsx│   │   ├── package.json│   │   └── vite.config.ts│   ├── tenant-admin/                    # Panel Web del Gerente (Futuro)│   ├── tenant-operation/                # PWA para Operarios (Futuro)│   └── client-app/                      # App Móvil Cliente (React Native - Futuro)│├── services/                            # Servicios Backend│   └── api/                             # API NestJS (Backend Único)│       ├── prisma/│       │   ├── schema.prisma            # Definición de modelos (Tenant, User, Product, etc.)│       │   └── seed.ts                  # Script para crear usuario Admin inicial│       ├── src/│       │   ├── main.ts                  # Punto de entrada│       │   ├── app.module.ts            # Módulo raíz│       │   ├── guards/                  # Seguridad (RolesGuard)│       │   ├── decorators/              # Decoradores (@CurrentUser)│       │   ├── modules/│       │   │   ├── auth/                # Autenticación (JWT, Local Strategy)│       │   │   ├── users/               # Gestión de Usuarios│       │   │   ├── tenants/             # Gestión de Tenants (Bares)│       │   │   └── business/            # Lógica de Negocio (Productos, Categorías)│       │   └── prisma/                 # Cliente Prisma│       ├── .env                         # Variables de entorno (DATABASE_URL, JWT_SECRET)│       └── package.json│├── packages/                            # Código compartido (Futuro)│   ├── shared/                          # Tipos y Utilidades comunes│   └── auth/                            # Librería de Auth│├── scripts/│   ├── setup_saaS.sh                    # Script de construcción inicial│   └── restore_data.sh                  # Script para poblar BD de prueba│├── .gitignore├── README.md└── package.json                         # Workspace root
🚀 Configuración Rápida
1. Instalación de Dependencias

# Instalar dependencias raíz (si es necesario)
npm install

# Instalar Backend
cd services/api
npm install

# Instalar Frontend (Tenant Owner)
cd ../../apps/tenant-owner
npm install

2. Configuración de Base de Datos (Neon)
Ve a services/api/.env.
Asegúrate de que DATABASE_URL apunte a tu base de datos Neon.
Ejecuta las migraciones y genera el cliente Prisma:
cd services/api
npx prisma generate
npx prisma db push  # O npx prisma migrate 

3. Poblar Base de Datos (Seed)
Para crear el usuario Admin por defecto (admin@bars.com / 123456):
npx prisma db 

Para restaurar el escenario completo (Bar, Usuario Juan, Categorías, Productos):
./restore_data.

🔐 Seguridad y Arquitectura
Multitenancy: Aislamiento de datos por tenantId a nivel de Servicio.
Autenticación: JWT (JSON Web Tokens) con expiración de 24h.
Autorización: RBAC (Role-Based Access Control) usando Guards (PLATFORM_ADMIN, OWNER, ADMIN, STAFF).
Protección: Helmet (Seguridad de cabeceras), Throttler (Límite de rate).
🏃 Ejecutar el Proyecto
Backend (NestJS)
cd services/api
npm run start:dev
# Corre en http://localhost:3001

Frontend (Tenant Owner)
cd apps/tenant-owner
npm run dev
# Corre en http://localhost:5173 (o 5174)

📝 Notas Importantes
El script restore_data.sh requiere jq instalado.
Los tokens JWT se almacenan en localStorage en el frontend (para desarrollo).
La base de datos está configurada para manejar relaciones: Tenant -> User -> Product -> Category.

