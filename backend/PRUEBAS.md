# Sistema de pruebas — AulaVirtual Pro

## Cómo cambiar la base de datos

Solo modifica **un archivo**:

```
backend/src/config/database.js
```

Busca esta línea y cámbiala:

```js
// MongoDB LOCAL
const MONGO_URI = 'mongodb://localhost:27017/aulavirtual';

// MongoDB Atlas (nube)
const MONGO_URI = 'mongodb+srv://usuario:password@cluster.mongodb.net/aulavirtual';
```

Guarda y reinicia el servidor. Listo.

---

## Arrancar el sistema (pasos completos)

### Paso 1 — Elegir la base de datos

**Opción A: MongoDB local**
```bash
cp .env.local .env
```

**Opción B: MongoDB Atlas**
```bash
cp .env.atlas .env
# Edita .env y pon tu URI de Atlas en MONGO_URI
```

### Paso 2 — Instalar dependencias (solo la primera vez)
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Paso 3 — Sembrar datos de prueba (solo la primera vez)
```bash
cd backend
npm run seed
```
Crea: 1 admin, 1 instructor, 8 alumnos, 3 cursos, 2 quizzes.

### Paso 4 — Levantar todo

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Abre: http://localhost:5173

---

## Cuentas de prueba

| Rol        | Email                      | Contraseña  |
|------------|---------------------------|-------------|
| Admin      | admin@aulavirtual.com     | password123 |
| Instructor | carlos@aulavirtual.com    | password123 |
| Alumno     | maria@aulavirtual.com     | password123 |

---

## Correr las pruebas automáticas

> El backend debe estar corriendo (`npm run dev`) antes de correr las pruebas.

```bash
cd backend
npm run test:api
```

### Qué prueba el sistema

| Sección | Pruebas |
|---|---|
| Servidor | Ruta base responde 200 |
| Auth | Login admin/instructor/alumno, credenciales inválidas, registro nuevo, email duplicado |
| Cursos | Listar, detalle, crear (instructor), permisos (alumno/sin token), actualizar, eliminar |
| Progreso | Ver progreso, marcar lección, verificar actualización, permisos (instructor) |
| Quiz | Submit de respuestas, resultado, calificación numérica |
| Reporte admin | Lista de alumnos, estructura del reporte, permisos |
| Seguridad | Rutas 404, token inválido |

### Ejemplo de salida exitosa

```
🚀 AulaVirtual Pro — Sistema de pruebas
   Base de datos: mongodb://localhost:27017/aulavirtual
   Servidor:      http://localhost:5000

📋 1. Ruta base del servidor
  ✅ GET /  →  servidor responde 200

📋 2. Autenticación
  ✅ POST /auth/login  →  admin OK
  ✅ Token JWT recibido (admin)
  ...

══════════════════════════════════════════════════════
  RESULTADO: 32/32 pruebas pasaron
  🎉 Todo funciona correctamente.
══════════════════════════════════════════════════════
```
