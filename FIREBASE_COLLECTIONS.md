# Firebase Collections Structure

Este documento describe la estructura de todas las colecciones de Firestore utilizadas en el proyecto UGC Bot Sociocompras.

## Base de Datos

- **Nombre**: `basededatos-contenidos`
- **URL**: https://console.firebase.google.com/u/1/project/creador-de-contenido-f413/firestore/databases/basededatos-contenidos/data

---

## Colecciones

### 1. `ideas` 💡

Almacena las ideas de contenido generadas por IA o creadas manualmente.

**Estructura del Documento:**

```javascript
{
  id: string,                      // Auto-generado por Firestore
  title: string,                   // Título de la idea
  description: string,             // Descripción detallada
  hook: string,                    // Hook para captar atención (primeros 3s)
  type: string | null,             // "UGC" para ideas con AI influencer, null para general
  viralPotential: string,          // "alto", "medio", "bajo"
  viralTrend: string?,             // Tendencia viral utilizada (opcional)
  ranking: number,                 // 0-5 estrellas (valoración del usuario)
  enabled: boolean?,               // Estado habilitado/deshabilitado (opcional)

  // Campos específicos para tipo UGC con AI Influencer:
  aiInfluencer: string?,           // Descripción detallada del AI influencer
  frame1: string?,                 // Frame 1: Face cam introduction
  frame2: string?,                 // Frame 2: Using the product
  frame3: string?,                 // Frame 3: Product in appealing setting

  // Timestamps automáticos:
  createdAt: Timestamp,            // Fecha de creación
  updatedAt: Timestamp             // Fecha de última actualización
}
```

**Operaciones Disponibles:**
- `addIdea(ideaData)` - Agregar idea
- `addMultipleIdeas(ideas)` - Agregar múltiples ideas
- `getIdeas()` - Obtener todas (ordenadas por createdAt desc)
- `updateIdea(ideaId, updates)` - Actualizar idea
- `updateIdeaRanking(ideaId, ranking)` - Actualizar ranking
- `deleteIdea(ideaId)` - Eliminar idea

**Usado en:**
- `src/services/firebaseService.js`
- `src/services/storageService.js`
- `src/components/IdeaGenerator.jsx`
- `src/App.jsx`

---

### 2. `scripts` 📝

Almacena los scripts de video generados a partir de ideas.

**Estructura del Documento:**

```javascript
{
  id: string,                      // Auto-generado por Firestore
  ideaId: string?,                 // ID de la idea relacionada (opcional)
  ideaTitle: string?,              // Título de la idea relacionada (opcional)
  concept: string,                 // Concepto/descripción del video
  content: string,                 // Contenido del script completo (prompt para Sora 2)
  generatedWithAI: boolean,        // true si fue generado con Gemini AI
  ranking: number,                 // 0-5 estrellas (valoración del usuario)

  // Timestamps automáticos:
  createdAt: Timestamp,            // Fecha de creación
  updatedAt: Timestamp             // Fecha de última actualización
}
```

**Operaciones Disponibles:**
- `addScript(scriptData)` - Agregar script
- `getScripts()` - Obtener todos (ordenados por createdAt desc)
- `getScript(scriptId)` - Obtener script específico
- `updateScript(scriptId, updates)` - Actualizar script
- `deleteScript(scriptId)` - Eliminar script

**Usado en:**
- `src/services/firebaseService.js`
- `src/services/storageService.js`
- `src/components/ScriptCreator.jsx`
- `src/components/IdeaGenerator.jsx`
- `src/App.jsx`

---

### 3. `generatedMedia` 🎬

Almacena referencias a imágenes y videos generados para shot breakdown.

**Estructura del Documento:**

```javascript
{
  id: string,                      // Auto-generado por Firestore
  scriptId: string,                // ID del script relacionado
  shotIndex: number,               // Índice del shot/frame (0, 1, 2, ...)

  // Contenido del media:
  mediaUrl: string?,               // URL de la imagen/video generado (opcional)
  prompt: string?,                 // Prompt usado para generar (opcional)
  generatedWith: string,           // "Sora 2", "DALL-E", "Midjourney", etc.
  description: string,             // Descripción del media
  mediaType: string?,              // "image", "video" (opcional)

  // Timestamp automático:
  createdAt: Timestamp             // Fecha de creación
}
```

**Operaciones Disponibles:**
- `saveGeneratedMedia(scriptId, shotIndex, mediaData)` - Guardar media
- `getGeneratedMediaForScript(scriptId)` - Obtener todos los media de un script

**Usado en:**
- `src/services/firebaseService.js`
- `src/components/ShotBreakdown.jsx` (parcialmente implementado)

**Estado:** ⚠️ Implementado pero poco utilizado. Pendiente de integración completa.

---

### 4. `brandData` 🏢

Almacena la investigación y configuración de la marca. Solo debe haber **un documento** por proyecto.

**Estructura del Documento:**

```javascript
{
  id: string,                      // Auto-generado por Firestore

  // Información básica:
  brand_name: string,              // Nombre de la marca
  brand_domain: string,            // Sitio web/dominio
  category: string,                // Categoría del producto/servicio

  // Propuesta de valor y audiencia:
  uvp: string,                     // Unique Value Proposition
  audience: string,                // Audiencia objetivo
  pain_points: string,             // Puntos de dolor que resuelve

  // Contexto competitivo:
  competitors: string,             // Competidores principales
  brand_voice: string,             // Tono de voz (ej: "Auténtico y cercano")
  marketing_goals: string,         // Objetivos de marketing

  // Otros campos posibles:
  brand_values: string?,           // Valores de marca
  target_audience: string?,        // Descripción extendida de audiencia
  unique_selling_point: string?,   // USP extendido

  // Timestamps automáticos:
  createdAt: Timestamp,            // Fecha de creación
  updatedAt: Timestamp             // Fecha de última actualización
}
```

**Operaciones Disponibles:**
- `saveBrandData(brandData)` - Guardar/actualizar (upsert)
- `getBrandData()` - Obtener datos de marca
- `deleteBrandData()` - Eliminar datos de marca

**Usado en:**
- `src/services/firebaseService.js`
- `src/services/storageService.js`
- `src/components/BrandResearch.jsx`
- `src/App.jsx`

**Nota:** Esta colección reemplaza el uso anterior de `localStorage` con clave `ugc_bot_brand_data`.

---

### 5. `brandAnalysis` 🤖

Almacena el análisis mejorado generado por Gemini AI sobre la marca. Solo debe haber **un documento** por proyecto.

**Estructura del Documento:**

```javascript
{
  id: string,                      // Auto-generado por Firestore

  // Análisis generado por Gemini AI:
  valueAnalysis: string,           // Análisis de propuesta de valor (2-3 párrafos)
  audienceInsights: string,        // Insights profundos de audiencia (2-3 párrafos)
  painPointRecommendations: string,// Recomendaciones para pain points (2-3 párrafos)
  brandPositioning: string,        // Posicionamiento sugerido (2-3 párrafos)
  ugcOpportunities: string[],      // Array de 5-7 ideas específicas de contenido UGC

  // Timestamps automáticos:
  createdAt: Timestamp,            // Fecha de creación
  updatedAt: Timestamp             // Fecha de última actualización
}
```

**Operaciones Disponibles:**
- `saveBrandAnalysis(analysisData)` - Guardar/actualizar (upsert)
- `getBrandAnalysis()` - Obtener análisis de marca
- `deleteBrandAnalysis()` - Eliminar análisis

**Usado en:**
- `src/services/firebaseService.js`
- `src/services/storageService.js`
- `src/components/BrandResearch.jsx`

**Nota:** Esta colección reemplaza el uso anterior de `localStorage` con clave `ugc_bot_enhanced_research`.

---

## Estrategia Híbrida de Almacenamiento

El proyecto utiliza una **estrategia híbrida** que combina Firebase con localStorage:

### Comportamiento

1. **Firebase Habilitado** (`USE_FIREBASE = true`):
   - Intenta guardar/leer desde Firebase primero
   - Si falla, usa localStorage como fallback
   - Mantiene localStorage como caché local

2. **Firebase Deshabilitado** (`USE_FIREBASE = false` o no configurado):
   - Usa únicamente localStorage
   - No intenta conectar con Firebase

### Control de Firebase

```javascript
// En localStorage:
localStorage.setItem('ugc_bot_use_firebase', 'true');  // Habilitar
localStorage.setItem('ugc_bot_use_firebase', 'false'); // Deshabilitar
```

### Función de Migración

El `storageService` incluye una función `migrateToFirebase()` que:
1. Migra ideas locales a Firebase
2. Migra scripts locales a Firebase
3. Habilita Firebase automáticamente
4. Retorna reporte de migración

---

## Inicialización y Verificación

### Script de Verificación

```bash
node init-firebase-collections.js
```

Este script:
- Verifica la conexión a Firebase
- Lista todas las colecciones
- Muestra el estado (vacío/con datos) de cada una
- Proporciona link directo a Firebase Console

### Script de Prueba de Conexión

```bash
node test-firebase-connection.js
```

---

## Índices Recomendados

Para optimizar las queries, considera crear estos índices en Firebase Console:

### Collection: `ideas`
- `createdAt` (DESC) - Ya usado en queries
- Composite: `enabled` (ASC) + `createdAt` (DESC) - Para filtrar ideas habilitadas

### Collection: `scripts`
- `createdAt` (DESC) - Ya usado en queries
- `ideaId` (ASC) - Para buscar scripts por idea

### Collection: `generatedMedia`
- Composite: `scriptId` (ASC) + `shotIndex` (ASC) - Para ordenar media por script

---

## Reglas de Seguridad Sugeridas

**IMPORTANTE:** Actualmente las reglas de seguridad no están configuradas. Se recomienda agregar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/basededatos-contenidos/documents {
    // Permitir lectura/escritura temporal (DESARROLLO)
    match /{document=**} {
      allow read, write: if true;
    }

    // TODO: Implementar autenticación y reglas de seguridad apropiadas
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

---

## Próximos Pasos

1. ✅ Colecciones `ideas` y `scripts` completamente funcionales
2. ✅ Colecciones `brandData` y `brandAnalysis` implementadas
3. ⚠️ Completar integración de `generatedMedia` en componentes
4. ⏳ Implementar autenticación de usuarios (Firebase Auth)
5. ⏳ Configurar reglas de seguridad apropiadas
6. ⏳ Agregar sincronización en tiempo real con `onSnapshot()`
7. ⏳ Crear índices compuestos para queries complejas

---

## Contacto y Soporte

- **Firebase Console**: https://console.firebase.google.com/u/1/project/creador-de-contenido-f413
- **Documentación Firebase**: https://firebase.google.com/docs/firestore
- **Proyecto GitHub**: (agregar URL cuando esté disponible)

---

**Última actualización:** 2025-10-29
