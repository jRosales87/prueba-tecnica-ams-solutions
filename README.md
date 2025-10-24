# E-Commerce SPA - Prueba Técnica

Aplicación Single Page Application (SPA) de e-commerce desarrollada con React 19, TypeScript, Vite y TailwindCSS.

## Tecnologías Principales

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Estilos utility-first
- **React Router** - Navegación
- **TanStack Query (React Query)** - Gestión de estado del servidor
- **Zustand** - Gestión de estado global
- **Vitest** - Testing framework

## Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x

## Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd prueba-tecnica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno (opcional)**

Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=<baseUrl>
```

> **Nota:** Si no se configura, la aplicación usará la URL de la API por defecto.

## Ejecutar el Proyecto

### Modo Desarrollo
```bash
npm run start
```

La aplicación estará disponible en `http://localhost:5173`

### Build de Producción
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```