# Proyecto Base - Template Multi-Tenant

Plantilla base reutilizable para crear aplicaciones SaaS multi-tenant con Next.js 14, Firebase, y TypeScript.

## 🚀 Características

- ✅ **Multi-Tenant**: Sistema de organizaciones con roles y permisos
- ✅ **Autenticación**: Firebase Auth (Email/Password, Google)
- ✅ **Kanban Roadmap**: Tablero de tareas con drag & drop
- ✅ **Contabilidad**: Plan de cuentas, asientos contables, inventario
- ✅ **TypeScript Estricto**: Tipado completo en todo el proyecto
- ✅ **Testing**: Jest (unit), Playwright (e2e)
- ✅ **CI/CD Ready**: GitHub Actions configurado
- ✅ **Firebase CLI**: Emuladores y deployment

## 📦 Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Backend | Firebase (Firestore, Auth, Storage) |
| Estilos | Tailwind CSS v4, Radix UI |
| Testing | Jest, Playwright, Testing Library |
| Linting | ESLint, Prettier, Husky |

## 🛠️ Instalación

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <repo-url> mi-proyecto
cd mi-proyecto

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password, Google)
3. Crear base de datos Firestore
4. Crear bucket de Storage
5. Generar claves de Service Account

### 3. Configurar variables de entorno

Editar `.env.local`:

```env
# Firebase Client SDK (público)
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (privado)
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
```

### 4. Deploy de reglas y índices

```bash
firebase login
firebase use --add  # Seleccionar tu proyecto
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
proyecto-base/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Páginas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/          # Páginas protegidas
│   │   │   ├── layout.tsx        # Layout con sidebar
│   │   │   ├── dashboard/
│   │   │   ├── roadmap/
│   │   │   └── contabilidad/
│   │   └── api/                  # API Routes
│   ├── components/               # Componentes React
│   │   └── ui/                   # Componentes UI base
│   ├── contexts/                 # React Contexts
│   │   ├── AuthContext.tsx
│   │   └── OrganizationContext.tsx
│   ├── firebase/                 # Configuración Firebase
│   │   ├── config.ts             # Client SDK
│   │   ├── admin.ts              # Admin SDK
│   │   └── auth.ts               # Auth helpers
│   ├── lib/                      # Utilidades
│   ├── services/                 # Lógica de negocio
│   │   ├── auth/
│   │   ├── organization/
│   │   ├── roadmap/
│   │   └── accounting/
│   └── types/                    # Tipos TypeScript
├── firestore.rules               # Reglas de seguridad
├── firestore.indexes.json        # Índices compuestos
├── storage.rules                 # Reglas de storage
└── firebase.json                 # Configuración Firebase
```

## 🔐 Sistema Multi-Tenant

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| `owner` | Control total, eliminar organización |
| `admin` | Gestionar miembros, configuración |
| `operator` | Leer y escribir datos |
| `viewer` | Solo lectura |

### Estructura de Datos

```
/users/{userId}                          # Perfil global
/organizations/{orgId}                   # Organización
  /members/{memberId}                    # Miembros y roles
  /invitations/{invitationId}            # Invitaciones
  /roadmap_cards/{cardId}                # Tareas Kanban
  /accounts/{accountId}                  # Plan de cuentas
  /journal_entries/{entryId}             # Asientos contables
  /products/{productId}                  # Productos
  /stock_movements/{movementId}          # Movimientos de stock
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Servidor de desarrollo
npm run dev:turbo     # Con Turbopack (más rápido)

# Build
npm run build         # Build de producción
npm run start         # Servidor de producción

# Calidad de código
npm run lint          # ESLint
npm run lint:fix      # ESLint con auto-fix
npm run format        # Prettier
npm run type-check    # TypeScript
npm run check-all     # Todo junto

# Testing
npm run test          # Jest
npm run test:watch    # Jest en modo watch
npm run test:e2e      # Playwright

# Firebase
npm run emulators     # Emuladores locales
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
# o con UI
npm run test:e2e:ui
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Conectar repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático en cada push

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 📝 Cómo crear un nuevo proyecto

1. Clonar este template
2. Renombrar en `package.json`
3. Crear nuevo proyecto en Firebase
4. Configurar variables de entorno
5. Personalizar:
   - Logo y branding
   - Colores en `globals.css`
   - Rutas y componentes
   - Reglas de Firestore según necesidades

## 📄 Licencia

Privado - Todos los derechos reservados
