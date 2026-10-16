# mawi 👗✨ — 3D Smart Virtual Closet & AI Fashion Stylist

[![Expo](https://img.shields.io/badge/Expo-51.0-black?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react)](https://reactnative.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r164-black?logo=threedotjs)](https://threejs.org/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google)](https://deepmind.google/technologies/gemini/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind-38B2AC?logo=tailwindcss)](https://nativewind.dev/)

**mawi** es una aplicación móvil y web multiplataforma que reinventa la gestión del guardarropa personal. Combina **modelado 3D interactivo**, **eliminación automática de fondos por visión artificial** y un **asesor de imagen inteligente impulsado por Google Gemini AI** para evaluar y armar combinaciones de moda en segundos.

---

## ✨ Características Principales

- 📸 **Digitalización Inteligente de Prendas**: Sube fotos de tus prendas y el motor integrado `@imgly/background-removal` elimina automáticamente el fondo en el dispositivo, dejando únicamente la prenda aislada.
- 🧊 **Avatar 3D Interactivo**: Visualizador tridimensional completo creado con `@react-three/fiber` y Three.js que permite previsualizar prendas y siluetas en un maniquí con rotación 360°.
- 🎨 **Layering Engine (Superposición de Capas)**: Motor gráfico optimizado con `@shopify/react-native-skia` y animaciones fluidas con `react-native-reanimated` para mezclar camisetas, abrigos, pantalones y accesorios en capas realistas.
- 🤖 **AI Fashion Advisor & Outfit Evaluator**: Integración con **Google Gemini AI** (`@google/generative-ai`) que evalúa la armonía de tus combinaciones, la ocasión de uso (streetwear, formal, casual, noche) y te ofrece recomendaciones personalizadas de estilo.
- 🛍️ **Gestión de Armario & Wishlist**: Organización por categorías (Top, Bottom, Outerwear, Footwear), colores y temporadas; guardado de looks favoritos y persistencia con AsyncStorage y Supabase.
- 🌗 **Diseño Moderno & Multi-Tema**: Soporte nativo para modo claro y oscuro con NativeWind (Tailwind CSS) e iconos modernos de `lucide-react-native`.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Framework Móvil / Web** | React Native 0.74, Expo 51 (Metro runtime, Web / Android / iOS) |
| **Lenguaje** | TypeScript |
| **Gráficos 3D & 2D** | Three.js, React Three Fiber (`@react-three/fiber`, `@react-three/drei`), Shopify Skia |
| **Inteligencia Artificial** | Google Gemini API (`@google/generative-ai`), `@imgly/background-removal` |
| **Estilos & Animaciones** | NativeWind (Tailwind CSS), React Native Reanimated, Lucide Icons |
| **Persistencia** | Supabase JS Client, AsyncStorage |

---

## 📦 Estructura del Proyecto

```
mawi/
├── App.tsx                     # Punto de entrada y navegación por tabs
├── app.json                    # Configuración de Expo
├── src/
│   ├── components/             # Componentes UI reutilizables (Modales, botones, cards)
│   ├── context/                # ThemeContext (Dark/Light) y AuthContext
│   ├── modules/
│   │   ├── advisor/            # Módulo de asesoría con Gemini AI
│   │   ├── avatar3d/           # Renderizado del Avatar 3D (Three.js/Fiber)
│   │   ├── evaluator/          # Evaluador y puntuación de combinaciones
│   │   ├── layering/           # Motor de capas 2D con Skia
│   │   ├── looks/              # Historial de combinaciones guardadas
│   │   ├── wardrobe/           # Catálogo del armario y filtros
│   │   └── wishlist/           # Lista de deseos
│   ├── services/               # Clientes de API, Mock data y llamadas a IA
│   ├── theme/                  # Tokens de diseño y colores
│   └── types/                  # Definiciones e interfaces de TypeScript
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/PachoncitoUwU/mawi.git
cd mawi
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`):
```env
EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_de_gemini
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Iniciar la aplicación
```bash
# Modo Web (Navegador)
npx expo start --web

# Modo Android
npx expo start --android

# Modo iOS
npx expo start --ios
```

---

## 👤 Autor
Desarrollado por **Miguel Pachón** ([@PachoncitoUwU](https://github.com/PachoncitoUwU)).
