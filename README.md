# Contact Book API

API REST de agenda de contactos con Node.js y Express, con autenticación (JWT) y roles (RBAC). Los datos viven en memoria (arreglos): al reiniciar el servidor se pierden los contactos y usuarios creados (el admin se vuelve a sembrar solo).

## Cómo correrlo

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

Servidor en `http://localhost:3000`.

### Variables de entorno (`.env`)

El `.env` real **no se sube al repositorio** (está en `.gitignore`); el `.env.example` sí. Edita tu `.env` y cambia `JWT_SECRET` por un valor largo y aleatorio.

| Variable | Para qué sirve |
|---|---|
| `PORT` | Puerto del servidor (3000 por defecto) |
| `JWT_SECRET` | Secreto con el que se firman los tokens |
| `JWT_EXPIRES_IN` | Duración del token (por ejemplo `1h`) |
| `ADMIN_EMAIL` | Correo del admin inicial, que se siembra al arrancar |
| `ADMIN_PASSWORD` | Contraseña del admin inicial |

## Roles

| Rol | Qué puede hacer |
|---|---|
| `member` | Consultar, crear y editar contactos (se asigna al registrarse) |
| `manager` | Lo del member, y además eliminar contactos |
| `admin` | Lo del manager, y además administrar usuarios (`/admin`) |

`/auth/register` siempre crea `member` (si el body trae `role`, se ignora). El primer admin se siembra desde el `.env`, y después un admin puede cambiar el rol de otros usuarios.

## Endpoints

| Verbo | Ruta | Acceso | Éxito | Errores |
|---|---|---|---|---|
| POST | `/auth/register` | Público | 201 `{ user, token }` | 400, 409 |
| POST | `/auth/login` | Público | 200 `{ user, token }` | 400, 401, 429 |
| GET | `/auth/me` | Cualquier rol (token) | 200 | 401 |
| GET | `/admin/users` | Solo **admin** | 200 | 401, 403 |
| PATCH | `/admin/users/:id/role` | Solo **admin** | 200 | 400, 401, 403, 404 |
| GET | `/contacts` | member, manager, admin | 200 | 401 |
| GET | `/contacts/:id` | member, manager, admin | 200 | 401, 404 |
| POST | `/contacts` | member, manager, admin | 201 | 400, 401, 409 |
| PUT | `/contacts/:id` | member, manager, admin | 200 | 400, 401, 404, 409 |
| PATCH | `/contacts/:id/favorite` | member, manager, admin | 200 | 401, 404 |
| DELETE | `/contacts/:id` | **manager, admin** | 204 | 401, 403, 404 |
| GET | `/contacts/stats/summary` (header `x-client-id`) | member, manager, admin | 200 | 400, 401 |

Los tokens se envían en el header `Authorization: Bearer <token>`. Ninguna respuesta incluye `passwordHash`.

## Orden de middlewares en `app.js`

helmet → cors → morgan → express.json → requestTimer → rate limiters (`/contacts` y `/auth/login`) → rutas (`/contacts`, `/auth`, `/admin`) → notFound → errorHandler

En cada ruta protegida, `verifyToken` va antes que `checkRole`, porque `checkRole` necesita el `req.user` que crea `verifyToken`.

## Pruebas con Postman

1. Reinicia el servidor (`Ctrl + C` y `npm run dev`) para partir de datos limpios.
2. Importa `ContactBook.postman_collection.json`.
3. Ejecuta la carpeta **1. Setup (tokens)** primero: guarda `{{tokenMember}}`, `{{tokenManager}}` y `{{tokenAdmin}}` como variables de la colección. Para el admin usa los datos de tu `.env`.
4. Ejecuta el resto de las carpetas con **Run collection**.

El login tiene un límite de 5 intentos fallidos cada 15 minutos por IP. Si te bloquea (429), reinicia el servidor.

## ¿Qué diferencia hay entre un 401 y un 403 en tu API?

- **401 (no autenticado):** el servidor no sabe quién eres. Falta el token, está alterado o venció, o las credenciales del login son inválidas. Lo responde `verifyToken`, y se arregla haciendo login otra vez.
- **403 (no autorizado):** el servidor sí sabe quién eres, pero tu rol no alcanza para esa acción (por ejemplo, un `member` que intenta `DELETE /contacts/:id`). Lo responde `checkRole`, y volver a hacer login no sirve: hace falta otro rol, no otro token.

## Nota sobre los roles y el token

El rol viaja dentro del JWT. Si un admin cambia el rol de un usuario, ese usuario debe hacer login otra vez para que el cambio aplique en su token.
