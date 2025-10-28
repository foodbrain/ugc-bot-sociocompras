# Integración con Gemini AI

Este documento explica cómo funciona la integración de Gemini AI en el proyecto UGC Bot.

## 🔑 API Key

La API key de Gemini está configurada en:
```
src/services/geminiService.js
```

**API Key actual**: `AIzaSyCvsjkJLGBRrOctx0B8rKxQk4eRw3Jr_io`

## 📦 Servicio de Gemini

El archivo `geminiService.js` exporta un objeto con tres métodos principales:

### 1. `enhanceBrandResearch(brandData)`

**Propósito**: Analiza la investigación de marca y proporciona insights profundos.

**Entrada**:
```javascript
{
  uvp: "Propuesta de valor única",
  audience: "Audiencia objetivo",
  pain_points: "Puntos de dolor y soluciones"
}
```

**Salida**:
```javascript
{
  valueAnalysis: "Análisis de la propuesta de valor...",
  audienceInsights: "Insights sobre la audiencia...",
  painPointRecommendations: "Recomendaciones...",
  brandPositioning: "Posicionamiento sugerido...",
  ugcOpportunities: ["Oportunidad 1", "Oportunidad 2", ...]
}
```

**Uso en componente**:
```javascript
import { geminiService } from '../services/geminiService';

const enhanced = await geminiService.enhanceBrandResearch(brandData);
```

### 2. `generateIdeas(brandData, count = 5)`

**Propósito**: Genera ideas de contenido UGC personalizadas.

**Entrada**:
- `brandData`: Objeto con información de marca (puede ser null)
- `count`: Número de ideas a generar (default: 5)

**Salida**:
```javascript
[
  {
    title: "Título de la idea",
    description: "Descripción detallada",
    hook: "Hook para primeros 3 segundos",
    viralPotential: "alto|medio|bajo"
  },
  // ... más ideas
]
```

**Uso en componente**:
```javascript
const ideas = await geminiService.generateIdeas(brandData, 5);
```

### 3. `generateScript(concept, brandData)`

**Propósito**: Genera scripts optimizados para Sora 2.

**Entrada**:
- `concept`: String con el concepto del video
- `brandData`: Objeto con información de marca (opcional)

**Salida**:
String con el script completo optimizado para Sora 2.

**Uso en componente**:
```javascript
const script = await geminiService.generateScript(concept, brandData);
```

## 🔄 Flujo de Datos

### Brand Research Flow

```
Usuario completa formulario
    ↓
handleSubmit() en BrandResearch.jsx
    ↓
setBrandData(data) → Guarda en estado de App
    ↓
storageService.saveBrandData(data) → Persiste en localStorage
    ↓
geminiService.enhanceBrandResearch(data)
    ↓
Gemini API procesa y retorna análisis
    ↓
setEnhancedResearch() → Muestra en UI
    ↓
storageService.saveEnhancedResearch() → Persiste
```

### Idea Generation Flow

```
Usuario hace clic en "Generar Ideas"
    ↓
generateIdeas() en IdeaGenerator.jsx
    ↓
storageService.getBrandData() → Recupera brand data
    ↓
geminiService.generateIdeas(brandData, 5)
    ↓
Gemini API genera 5 ideas personalizadas
    ↓
setGeneratedIdeas() → Muestra en UI
    ↓
setIdeas() → Actualiza estado global
    ↓
storageService.saveIdeas() → Persiste automáticamente (useEffect en App.jsx)
```

### Script Generation Flow

```
Usuario ingresa concepto y hace clic en "Generar"
    ↓
handleGenerate() en ScriptCreator.jsx
    ↓
storageService.getBrandData() → Recupera brand data
    ↓
if (useAI) {
  geminiService.generateScript(concept, brandData)
} else {
  generateScript(concept) // Local generator
}
    ↓
Gemini API genera script optimizado para Sora 2
    ↓
setGeneratedScript() → Muestra en UI
    ↓
setScripts() → Actualiza estado global
    ↓
storageService.saveScripts() → Persiste automáticamente
```

## 🛡️ Manejo de Errores

Todos los métodos del servicio incluyen manejo de errores:

```javascript
try {
  const result = await geminiService.enhanceBrandResearch(data);
  // Procesar resultado exitoso
} catch (error) {
  console.error('Error:', error);
  // Mostrar mensaje de error al usuario
  // Opcionalmente, usar fallback local
}
```

## 🎨 Prompts de Gemini

### Brand Research Prompt

El prompt enviado a Gemini incluye:
- Propuesta de valor única
- Audiencia objetivo
- Puntos de dolor y soluciones
- Solicitud de análisis estructurado en JSON

### Idea Generation Prompt

El prompt incluye:
- Contexto de la marca (si existe)
- Solicitud de 5 ideas creativas
- Criterios: autenticidad, engagement, facilidad de producción, potencial viral
- Formato JSON con título, descripción, hook y potencial viral

### Script Generation Prompt

El prompt incluye:
- Contexto de la marca (si existe)
- Concepto del video
- Requerimientos de estructura (3 actos)
- Especificaciones técnicas para Sora 2
- Estilo UGC auténtico

## 💡 Mejores Prácticas

### 1. Siempre manejar errores

```javascript
try {
  const result = await geminiService.method();
  // Success
} catch (error) {
  // Error handling
  alert('Error al usar AI. Intenta de nuevo.');
}
```

### 2. Mostrar estado de carga

```javascript
const [loading, setLoading] = useState(false);

setLoading(true);
try {
  const result = await geminiService.method();
} finally {
  setLoading(false); // Siempre ejecutar
}
```

### 3. Proporcionar fallbacks

```javascript
if (useAI) {
  script = await geminiService.generateScript(concept, brandData);
} else {
  script = generateScript(concept); // Generador local
}
```

### 4. Validar entrada

```javascript
if (!concept) {
  alert('Por favor ingresa un concepto primero.');
  return;
}
```

## 🔧 Personalización

### Cambiar modelo de Gemini

```javascript
// En geminiService.js
const model = genAI.getGenerativeModel({
  model: 'gemini-pro'  // Cambiar a 'gemini-1.5-pro' u otro
});
```

### Ajustar prompts

Los prompts están definidos directamente en cada método. Para ajustar:

1. Abre `src/services/geminiService.js`
2. Busca el método correspondiente
3. Modifica la variable `prompt`

### Agregar nuevos métodos

```javascript
export const geminiService = {
  // ... métodos existentes

  async nuevoMetodo(params) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Tu prompt aquí con ${params}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to execute nuevo método');
    }
  }
};
```

## 📊 Límites y Consideraciones

### Rate Limits

Gemini API tiene límites de tasa. Si haces muchas solicitudes:
- Implementa debouncing
- Agrega delays entre solicitudes
- Considera caché de resultados

### Tamaño de Respuestas

Las respuestas de Gemini pueden ser grandes:
- Considera limitar el tamaño de los prompts
- Optimiza el parsing de JSON
- Maneja timeouts apropiadamente

### Costo

La API de Gemini puede tener costos asociados:
- Monitorea el uso
- Considera implementar cuotas por usuario
- Usa el generador local como alternativa gratuita

## 🔐 Seguridad

### API Key Expuesta

**⚠️ IMPORTANTE**: La API key está hardcodeada en el frontend.

**Para producción**:

1. **Opción 1: Variables de entorno**
```javascript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

2. **Opción 2: Backend Proxy**
```javascript
// En lugar de llamar directamente a Gemini:
const response = await fetch('/api/gemini/enhance', {
  method: 'POST',
  body: JSON.stringify(brandData)
});
```

3. **Opción 3: Restricciones de API Key**
En Google Cloud Console:
- Restringir por dominio
- Restringir por IP
- Limitar cuotas

## 🧪 Testing de la Integración

Para probar la integración:

```bash
# Iniciar servidor
npm run dev

# Ir a localhost:5173
# 1. Completar Brand Research
# 2. Generar Ideas
# 3. Crear Script

# Verificar en DevTools:
# - Network tab: Ver llamadas a Gemini API
# - Console: Ver logs de respuestas
# - Application > Local Storage: Ver datos guardados
```

## 📚 Recursos

- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Google AI JavaScript SDK](https://github.com/google/generative-ai-js)
- [Guía de Prompts](https://ai.google.dev/docs/prompting_intro)

---

**Última actualización**: 2025-10-27
