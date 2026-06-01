# API del proyecto

## Cómo probar la API

1. Instala la extensión REST Client en VSCode.
2. Abre el archivo `docs/api.http`.
3. Pulsa en `Send Request` encima de cada petición.
4. Observa la respuesta devuelta por el servidor.

## URL base

`http://localhost:3000/api`

## Endpoints

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/health` | Comprueba que la API funciona | No |
| GET | `/products` | Lista productos | No |
| GET | `/products/:id` | Obtiene un producto por ID | No |
| POST | `/products` | Crea un producto | Sí |
| PUT | `/products/:id` | Actualiza un producto | Sí |
| DELETE | `/products/:id` | Elimina un producto | Sí |
| POST | `/auth/login` | Inicia sesión | No |
| GET | `/auth/profile` | Devuelve el perfil autenticado | Sí |

## Ejemplo de creación de producto
{

"name": "Teclado mecánico",

"description": "Teclado RGB para desarrollo web",

"price": 79.99,

"stock": 10

}