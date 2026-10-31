# Contact Book API

API REST de agenda de contactos con Node.js y Express. Los datos viven en memoria (un arreglo).

## Cómo correrlo
```bash
npm install
npm run dev
```
Servidor en `http://localhost:3000`.

## Endpoints

| Verbo | Ruta | Éxito | Errores |
|---|---|---|---|
| GET | `/contacts` | 200 | — |
| GET | `/contacts/:id` | 200 | 404 |
| POST | `/contacts` | 201 | 400, 409 |
| PUT | `/contacts/:id` | 200 | 400, 404, 409 |
| PATCH | `/contacts/:id/favorite` | 200 | 404 |
| DELETE | `/contacts/:id` (header `x-api-key: talendig-123`) | 204 | 401, 404 |
| GET | `/contacts/stats/summary` (header `x-client-id`) | 200 | 400 |

Rate limit: 50 peticiones cada 10 minutos por IP (429).

## Orden de middlewares en `app.js`
helmet → cors → morgan → express.json → requestTimer → limiter → rutas → notFound → errorHandler

## Pruebas
Importa `ContactBook.postman_collection.json` en Postman.
