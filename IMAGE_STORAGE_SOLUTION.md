# Image Storage Solution - Firebase Integration

## Problema Resuelto

**Issue**: Las imágenes generadas no se mostraban en la UI y no se persistían entre sesiones.

**Root Causes**:
1. Estado de React se estaba actualizando correctamente, pero no había persistencia
2. Sin sistema de guardado en Firebase
3. Sin sistema de carga al abrir el componente

## Solución Implementada

### 1. Firebase Storage Integration

Ahora todas las imágenes generadas se guardan automáticamente en Firebase:

```javascript
// Al generar un personaje
await firebaseService.saveGeneratedMedia(scriptId, `character-${charIndex}`, {
    type: 'character',
    characterIndex: charIndex,
    description: character.description,
    imageUrl: result.imageUrl,
    imagePrompt: result.prompt,
    provider: result.service,
    timestamp: result.timestamp
});

// Al generar una escena
await firebaseService.saveGeneratedMedia(scriptId, `shot-${shotIndex}`, {
    type: 'scene',
    shotIndex: shotIndex,
    content: shot.content,
    imageUrl: result.imageUrl,
    imagePrompt: result.prompt,
    provider: result.service,
    timestamp: result.timestamp
});
```

### 2. Automatic Loading on Mount

Nuevo `useEffect` que carga imágenes guardadas al abrir el componente:

```javascript
useEffect(() => {
    const loadSavedMedia = async () => {
        if (!scriptId || shots.length === 0) return;

        const savedMedia = await firebaseService.getGeneratedMediaForScript(scriptId);

        // Restaurar imágenes de personajes
        const characterMedia = savedMedia.filter(m => m.type === 'character');
        setCharacters(prev => {
            const updated = [...prev];
            characterMedia.forEach(media => {
                if (updated[media.characterIndex]) {
                    updated[media.characterIndex] = {
                        ...updated[media.characterIndex],
                        image: media.imageUrl,
                        imagePrompt: media.imagePrompt
                    };
                }
            });
            return updated;
        });

        // Restaurar imágenes de escenas
        const sceneMedia = savedMedia.filter(m => m.type === 'scene');
        setShots(prev => {
            const updated = [...prev];
            sceneMedia.forEach(media => {
                if (updated[media.shotIndex]) {
                    updated[media.shotIndex] = {
                        ...updated[media.shotIndex],
                        image: media.imageUrl,
                        imagePrompt: media.imagePrompt
                    };
                }
            });
            return updated;
        });
    };

    loadSavedMedia();
}, [scriptId, shots.length, characters.length]);
```

### 3. Enhanced Logging for Debugging

```javascript
// Al recibir resultado de generación
console.log('🖼️ Image URL received:', result.imageUrl);
console.log('📦 Updated character object:', updatedCharacters[charIndex]);

// Al actualizar estado
console.log('✅ Characters state updated, length:', updatedCharacters.length);

// Al guardar en Firebase
console.log('💾 Character saved to Firebase');

// Al cargar desde Firebase
console.log('📥 Loading saved media from Firebase:', savedMedia.length, 'items');
console.log('✅ Loaded', characterMedia.length, 'character images');
console.log('✅ Loaded', sceneMedia.length, 'scene images');
```

## API Provider Configuration

El sistema requiere un provider de imágenes configurado (no hay modo demo):

```env
# .env
VITE_IMAGE_API_PROVIDER=openai  # Default
VITE_OPENAI_API_KEY=sk-...
```

**Providers disponibles:**
- `openai` - DALL-E 3 (default, ~$0.08/imagen HD)
- `vertex-ai` - Google Imagen 4 (100 gratis/mes)
- `stability` - Stability AI Stable Diffusion

## Data Flow

```
Usuario genera personaje/escena
          ↓
mediaGenerationService.generateInfluencerVisual()
          ↓
Gemini optimiza prompt con Brand Research
          ↓
Provider genera imagen (openai/vertex-ai/stability)
          ↓
Retorna: { imageUrl, prompt, service, timestamp }
          ↓
ShotBreakdown actualiza estado de React
          ↓
Guardar en Firebase (async, non-blocking)
          ↓
Usuario ve imagen en UI inmediatamente
```

```
Usuario abre Generador de Escenas
          ↓
Script parseado → shots y characters creados
          ↓
useEffect detecta scriptId y shots.length > 0
          ↓
firebaseService.getGeneratedMediaForScript(scriptId)
          ↓
Filtrar por type: 'character' y 'scene'
          ↓
Aplicar imageUrl a characters[index] y shots[index]
          ↓
UI muestra imágenes guardadas
```

## Firebase Collections Structure

### Collection: `generatedMedia`

**Document Structure**:
```javascript
{
  scriptId: "abc123",
  shotIndex: "character-0" | "shot-3",
  type: "character" | "scene",
  characterIndex: 0,         // solo para characters
  shotIndex: 3,              // solo para scenes
  description: "a man",      // descripción original
  content: "Frame 1...",     // contenido de escena (solo scenes)
  imageUrl: "https://...",
  imagePrompt: "A candid, authentic...",
  provider: "demo" | "openai" | "vertex-ai" | "stability",
  timestamp: "2025-10-29T...",
  createdAt: Timestamp
}
```

**Query Example**:
```javascript
const savedMedia = await firebaseService.getGeneratedMediaForScript(scriptId);
// Returns array of all media for this script
```

## Testing Steps

### 1. Generate Character Image

1. Abre "Generador de Escenas"
2. Click "Generar" en personaje
3. Observa consola:
   ```
   🖼️ Generating influencer visual with demo...
   Brand Context: {location: "Chile", demographics: "...", language: "Spanish"}
   ✨ Optimized prompt: "A candid, authentic, iPhone-style photo of a 30-year-old Latino man..."
   🎨 Demo mode - generating placeholder...
   🖼️ Image URL received: https://placehold.co/...
   📦 Updated character object: {id: "char-0", description: "a man", image: "https://..."}
   ✅ Characters state updated
   💾 Character saved to Firebase
   ```
4. Verifica que la imagen aparece en la UI

### 2. Verify Persistence

1. Recarga la página
2. Abre el mismo script en "Generador de Escenas"
3. Observa consola:
   ```
   📥 Loading saved media from Firebase: 1 items
   ✅ Loaded 1 character images
   ```
4. Verifica que la imagen sigue visible

### 3. Generate Scene Image

1. Click "Generar Imagen" en una escena
2. Observa mismo flujo de logs
3. Verifica imagen en UI
4. Recarga y verifica persistencia

## Benefits

✅ **Persistence**: Imágenes nunca se pierden
✅ **Performance**: Guardado async no bloquea UI
✅ **Reliability**: Errores de guardado no afectan UX
✅ **Debugging**: Logs detallados para troubleshooting
✅ **Scalability**: Firebase maneja storage automáticamente
✅ **Multi-Session**: Imágenes disponibles en todas las sesiones
✅ **Brand Context**: Todas las imágenes con contexto cultural apropiado

## Next Steps

### Para Producción con APIs Reales:

1. **OpenAI DALL-E 3**:
   ```env
   VITE_IMAGE_API_PROVIDER=openai
   VITE_OPENAI_API_KEY=sk-...
   ```
   - Resolver billing limit
   - Verificar API key válida
   - Cost: ~$0.08 per image (HD 1024x1792)

2. **Google Vertex AI Imagen 4** (Recomendado):
   ```env
   VITE_IMAGE_API_PROVIDER=vertex-ai
   VITE_VERTEX_AI_PROJECT_ID=your-project
   ```
   - 100 generaciones/mes GRATIS
   - Mejor calidad que DALL-E 3
   - Requiere Google Cloud setup

3. **Stability AI**:
   ```env
   VITE_IMAGE_API_PROVIDER=stability
   VITE_STABILITY_API_KEY=sk-...
   ```
   - Cost varies by plan
   - Good quality
   - Fast generation

## Troubleshooting

### Imagen no se muestra
1. Revisar consola: `🖼️ Image URL received:`
2. Verificar que URL es válida
3. Verificar que estado se actualiza: `✅ Characters state updated`
4. Verificar Firebase: `💾 Character saved to Firebase`

### Imagen no persiste al recargar
1. Verificar que `scriptId` existe
2. Revisar consola al cargar: `📥 Loading saved media from Firebase`
3. Verificar Firebase collection `generatedMedia`
4. Verificar filtros por type y index

### Error: "Has alcanzado el límite de créditos de OpenAI"
1. Ve a https://platform.openai.com/account/billing
2. Verifica tu balance actual
3. Agrega créditos o método de pago
4. Verifica límites de uso (Usage limits)
5. Considera usar Vertex AI (100 gratis/mes)

### Error: "API Key inválida o expirada"
1. Verifica tu `.env`: `VITE_OPENAI_API_KEY`
2. Regenera la API key si fue expuesta
3. Reinicia el dev server después de cambiar .env

### Error: "Has alcanzado el límite de tasa"
1. Espera unos minutos (rate limit temporal)
2. Reduce frecuencia de generación
3. Verifica que no estés generando en paralelo

## Architecture Notes

- **Non-blocking saves**: Firebase saves happen async after UI update
- **Graceful degradation**: Save errors don't break UX
- **Idempotent loading**: Safe to call multiple times
- **Index-based matching**: Uses characterIndex/shotIndex for mapping
- **Type safety**: Filters by 'character' vs 'scene' type
