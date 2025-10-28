# 🔥 Firebase Setup Guide

## Pasos para configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto" o "Create a project"
3. Nombre del proyecto: `ugc-bot-sociocompras` (o el que prefieras)
4. Sigue los pasos del asistente

### 2. Crear Web App

1. En el proyecto, click en el ícono `</>` (Web)
2. Registra tu app con un nombre (ej: "UGC Bot Web")
3. **NO** marques "Firebase Hosting" por ahora
4. Click en "Registrar app"

### 3. Copiar Configuración

Firebase te mostrará un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**Copia estos valores**

### 4. Configurar Firestore Database

1. En el menú lateral, ve a **Build** → **Firestore Database**
2. Click en "Crear base de datos" o "Create database"
3. Modo: Selecciona **"Empezar en modo de prueba"** (Start in test mode)
   - ⚠️ Esto permite lectura/escritura sin autenticación por 30 días
   - Más adelante puedes configurar reglas de seguridad
4. Ubicación: Selecciona la más cercana (ej: `us-central`, `southamerica-east1`)
5. Click en "Habilitar" o "Enable"

### 5. Actualizar Código

Abre el archivo `src/services/firebaseService.js` y reemplaza la configuración:

```javascript
// ANTES (líneas 9-16):
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// DESPUÉS (usa TUS valores reales de Firebase):
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← Tu API Key
  authDomain: "tu-proyecto.firebaseapp.com",   // ← Tu Auth Domain
  projectId: "tu-proyecto",                     // ← Tu Project ID
  storageBucket: "tu-proyecto.appspot.com",    // ← Tu Storage Bucket
  messagingSenderId: "123456789012",           // ← Tu Messaging Sender ID
  appId: "1:123456789012:web:abc..."           // ← Tu App ID
};
```

### 6. Probar la Conexión

1. Guarda el archivo
2. Ejecuta `npm run dev`
3. Abre la consola del navegador (F12)
4. Deberías ver: `✅ Firebase initialized successfully`

Si ves `⚠️ Fallback to localStorage mode`, revisa que:
- La configuración esté correcta
- Firestore Database esté habilitado

### 7. Habilitar Firebase en la App

Una vez configurado, Firebase estará **deshabilitado por defecto** (usa localStorage).

Para **habilitar Firebase**:

**Opción A - Desde la Consola del Navegador:**
```javascript
localStorage.setItem('ugc_bot_use_firebase', 'true');
location.reload();
```

**Opción B - Agregar un Toggle en la UI** (recomendado):
Puedes agregar un botón en Settings para alternar entre localStorage y Firebase.

### 8. Migrar Datos Existentes (Opcional)

Si ya tienes ideas y scripts en localStorage y quieres migrarlos a Firebase:

```javascript
// En la consola del navegador:
const { storageService } = await import('./src/services/storageService.js');
const result = await storageService.migrateToFirebase();
console.log(result); // { success: true, migratedIdeas: X, migratedScripts: Y }
```

## 📊 Estructura de Datos en Firestore

Firebase creará automáticamente estas colecciones:

### Collection: `ideas`
```javascript
{
  title: string,
  description: string,
  hook: string,
  viralPotential: 'alto' | 'medio' | 'bajo',
  viralTrend: string | null,
  type: 'UGC' | null,
  aiInfluencer: string | null,  // Solo para tipo UGC
  frame1: string | null,         // Solo para tipo UGC
  frame2: string | null,         // Solo para tipo UGC
  frame3: string | null,         // Solo para tipo UGC
  ranking: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `scripts`
```javascript
{
  ideaId: string,
  ideaTitle: string,
  content: string,      // El script de Sora 2
  concept: string,      // El concepto original
  ranking: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `generatedMedia`
```javascript
{
  scriptId: string,
  shotIndex: number,
  image: string | null,         // URL de imagen generada
  imagePrompt: string | null,
  video: string | null,         // URL de video generado
  videoPrompt: string | null,
  thumbnail: string | null,
  createdAt: timestamp
}
```

## 🔒 Reglas de Seguridad (Opcional)

Por ahora las reglas están en modo de prueba (permiten todo por 30 días).

Para producción, actualiza las reglas en Firestore → Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ideas
    match /ideas/{ideaId} {
      allow read, write: if true; // Cambiar según necesites autenticación
    }

    // Scripts
    match /scripts/{scriptId} {
      allow read, write: if true;
    }

    // Generated Media
    match /generatedMedia/{mediaId} {
      allow read, write: if true;
    }
  }
}
```

## ✅ Ventajas de Firebase

1. **Persistencia Real**: Los datos no se pierden al recargar
2. **Sincronización**: Accede desde cualquier dispositivo
3. **Backup Automático**: Firebase mantiene backups
4. **Escalabilidad**: Soporta crecimiento sin cambios de código
5. **Real-time**: Potencial para colaboración en tiempo real

## 🔄 Fallback Automático

El sistema tiene **fallback automático** a localStorage si:
- Firebase no está configurado
- Hay un error de red
- Las credenciales son inválidas

Esto asegura que la app siempre funcione, incluso sin Firebase.

## 📝 Notas

- Brand Research y Enhanced Research siempre usan localStorage (son configuraciones locales)
- Ideas y Scripts pueden usar Firebase o localStorage
- Por defecto usa localStorage hasta que habilites Firebase
