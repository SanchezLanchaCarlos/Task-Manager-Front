
---
# Task Manager Frontend

Interfaz de usuario para la aplicación Task Manager. Desarrollada con **React**, **TypeScript**, **Vite** y **TailwindCSS**, conectada a una API REST segura con JWT.

---

## 🚀 Tecnologías utilizadas

- React + Vite
- TypeScript
- TailwindCSS
- React Router Dom v6
- Axios
- localStorage (para tokens)
- Icons: lucide-react (o similar)

---

## 📁 Estructura principal

    src/
    ├── components/ # Reutilizables: botones, inputs, modales...
    ├── pages/ # Vistas principales (Login, Registro, etc.)
    ├── api/ # Axios y lógica de API
    ├── context/ # Contextos globales (auth, user, etc.)
    ├── App.tsx # Componente raíz
    └── main.tsx # Entrada principal

---

## 🧪 Requisitos

- Node.js ≥ 18
- npm 

---

## ⚙️ Instalación

    git clone https://github.com/SanchezLanchaCarlos/Task-Manager-Front.git
    cd Task-Manager-Front
    npm install

---

## 🧬 Configuración
Crea un archivo .env en la raíz del proyecto con:
VITE_API_BASE_URL=http://localhost:8080/api

---

## ▶️ Scripts
npm run dev       # Desarrollo
npm run build     # Producción
npm run preview   # Previsualización local
npm run lint      # Linter

---

## 🔐 Autenticación

* El JWT recibido al hacer login se almacena en localStorage

* Se incluye en cada request con Axios como Authorization: Bearer <token>

* Rutas protegidas mediante PrivateRoute u otro HOC personalizado

---

## 🧭 Páginas principales

* /login – Inicio de sesión

* /register – Registro de nuevos usuarios

* / – Dashboard de bienvenida

* /users – Gestión de usuarios (si eres admin)

* /projects – Lista y gestión de proyectos

* /projects/:id – Detalles del proyecto (miembros, tareas)

* /tasks – Lista y edición de tareas

---

## 🧰 Mejores prácticas implementadas

* Componentes reutilizables

* Separación de lógica y presentación

* Control de rutas privadas

* Hooks personalizados para autenticación

* Estilos responsive con Tailwind

* Axios configurado globalmente

---

## 🧑 Autor

Carlos Sánchez – @SanchezLanchaCarlos
