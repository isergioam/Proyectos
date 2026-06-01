# FitQuest - Plataforma de Retos Personales

## Descripción General

FitQuest es una aplicación web fullstack que permite a los usuarios participar en retos personales relacionados con hábitos saludables, actividad física y desarrollo personal.

La aplicación no tiene finalidad médica ni clínica. Su objetivo es motivar a los usuarios mediante retos, seguimiento del progreso y rankings de participación.

Ejemplos de retos:

* 7 días caminando
* 30 días de flexiones
* Reto beber agua
* Reto meditación
* Reto sin azúcar

---

# Objetivos del Proyecto

El proyecto tiene como finalidad demostrar la capacidad de desarrollar una aplicación fullstack completa utilizando tecnologías modernas.

El alumno deberá implementar:

* Frontend React conectado a una API real.
* Backend Node.js con Express.
* Base de datos MySQL.
* Autenticación mediante JWT.
* Gestión de usuarios y roles.
* CRUD completo de retos.
* Relaciones entre entidades.
* Arquitectura escalable y organizada.
* Validación de datos.
* Gestión centralizada de errores.

---

# Tecnologías

## Frontend

* React
* React Router
* Axios
* Context API o Redux Toolkit
* CSS Modules o TailwindCSS

## Backend

* Node.js
* Express
* JWT
* bcrypt
* dotenv
* express-validator

## Base de Datos

* MySQL

## Herramientas

* Postman o Thunder Client
* Git
* GitHub

---

# Roles del Sistema

## Usuario

Puede:

* Ver retos disponibles.
* Consultar detalles de un reto.
* Apuntarse a un reto.
* Registrar progreso diario.
* Consultar su evolución.
* Abandonar un reto.
* Consultar rankings.

## Administrador

Puede:

* Crear retos.
* Editar retos.
* Eliminar retos.
* Revisar participantes.
* Gestionar el catálogo de retos.

---

# Arquitectura General

```text
React
  ↓
API REST Node.js + Express
  ↓
MySQL
  ↓
API REST Node.js + Express
  ↓
React
```

---

# Entidades Principales

## users

Representa a los usuarios registrados.

### Campos

```text
id
username
email
password
role
created_at
```

---

## challenges

Representa los retos disponibles.

### Campos

```text
id
title
description
duration_days
difficulty
image
created_at
```

---

## challenge_participants

Relaciona usuarios y retos.

### Campos

```text
id
user_id
challenge_id
joined_at
status
```

### Estado

```text
active
completed
abandoned
```

---

## progress_logs

Registra el progreso diario de cada usuario.

### Campos

```text
id
user_id
challenge_id
log_date
value
note
created_at
```

---

# Relaciones

```text
users
  │
  ├── challenge_participants
  │
  └── progress_logs

challenges
  │
  ├── challenge_participants
  │
  └── progress_logs
```

---

# Funcionalidades Principales

## Gestión de Usuarios

* Registro.
* Inicio de sesión.
* Autenticación JWT.
* Perfil básico.

## Gestión de Retos

* Listado de retos.
* Consulta de detalle.
* Creación de retos.
* Edición de retos.
* Eliminación de retos.

## Participación

* Unirse a un reto.
* Abandonar un reto.
* Consultar retos activos.

## Seguimiento

* Registrar progreso diario.
* Consultar histórico.
* Visualizar avance.

## Rankings

* Clasificación por reto.
* Ordenación por progreso acumulado.

---

# Endpoints de la API

## Autenticación

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

## Retos

```http
GET    /api/challenges
GET    /api/challenges/:id
POST   /api/challenges
PUT    /api/challenges/:id
DELETE /api/challenges/:id
```

---

## Participación

```http
POST   /api/challenges/:id/join
DELETE /api/challenges/:id/leave
GET    /api/challenges/my-challenges
```

---

## Progreso

```http
POST   /api/progress
GET    /api/progress/my-progress/:challengeId
```

---

## Ranking

```http
GET /api/challenges/:id/ranking
```

---

# Arquitectura Backend

## Estructura de Carpetas

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── validations/
│   ├── database/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── schema.sql
```

---

## Responsabilidades

### Routes

Definen las rutas disponibles.

### Controllers

Gestionan la petición HTTP.

### Services

Contienen la lógica de negocio.

### Database

Gestiona la conexión con MySQL.

### Middlewares

* JWT
* Roles
* Gestión de errores

### Validations

Validación de datos de entrada.

---

# Arquitectura Frontend

## Estructura de Carpetas

```text
frontend/
│
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── context/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── App.jsx
│
├── public/
└── package.json
```

---

# Pantallas Mínimas

## Públicas

* Login
* Registro

## Privadas

* Catálogo de retos
* Detalle de reto
* Mis retos
* Registrar progreso
* Ranking del reto
* Panel de administración

---

# Seguridad

## JWT

El sistema utilizará JWT para autenticar usuarios.

### Flujo

```text
Login
  ↓
Generación JWT
  ↓
Almacenamiento en frontend
  ↓
Envío mediante Authorization Bearer Token
  ↓
Validación en backend
```

---

## Roles

```text
user
admin
```

Los endpoints protegidos comprobarán permisos antes de ejecutar acciones sensibles.

---

# Gestión Global de Errores

El backend dispondrá de un middleware global para:

* Errores de validación.
* Errores de autenticación.
* Errores de autorización.
* Errores internos del servidor.

---

# Validaciones

Se validarán:

## Usuarios

* Username obligatorio.
* Email válido.
* Contraseña obligatoria.

## Retos

* Título obligatorio.
* Duración válida.
* Dificultad válida.

## Progreso

* Valor numérico.
* Fecha válida.

---

# Extras Opcionales

## Barra de progreso

Porcentaje completado por reto.

## Ranking visual

Tabla ordenada por puntuación.

## Sistema de badges

Ejemplos:

* Primer reto completado.
* 7 días consecutivos.
* Top 3 del ranking.

## Contador de días

Seguimiento visual de días completados.

## Tarjetas de dificultad

```text
Fácil
Intermedio
Difícil
```

---

# Requisitos Técnicos Obligatorios

## Backend

* Node.js + Express
* MySQL
* Arquitectura routes/controllers/services
* Variables de entorno
* Validación de datos
* Gestión global de errores
* JWT
* Roles y permisos
* CRUD completo
* Documentación básica

## Frontend

* React
* Login conectado al backend
* Gestión de JWT
* Listado desde MySQL
* Formularios conectados a API
* Gestión de errores
* Estados de carga
* Servicios API desacoplados

---

# Entregables

El proyecto deberá incluir:

```text
README.md
schema.sql
.env.example
Colección Postman o Thunder Client
Código fuente backend
Código fuente frontend
```

---

# Resultado Esperado

El usuario podrá registrarse, iniciar sesión, apuntarse a retos, registrar progreso y competir en rankings.

El administrador podrá gestionar completamente el catálogo de retos.

La aplicación demostrará el dominio de React, Node.js, Express, MySQL, JWT, arquitectura por capas y desarrollo fullstack moderno.
