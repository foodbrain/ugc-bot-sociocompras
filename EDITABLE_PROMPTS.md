# Editable Prompts for Hyper-Realistic Image Generation

## Overview

Sistema mejorado de generación de imágenes con prompts enriquecidos y editables para máxima calidad fotorrealista.

## Problema Anterior

**Antes:**
- Prompt simple ("a man") → Imagen directa
- Sin visibilidad del prompt usado
- Sin control sobre el detalle
- Calidad variable, no siempre realista

**Resultado:**
- Imágenes genéricas
- Falta de fotorrealismo
- Sin posibilidad de ajustar

## Solución Implementada

### Nuevo Flujo de 2 Pasos

```
1. Enriquecer Prompt
   ↓
   Gemini genera prompt EXTREMADAMENTE detallado
   ↓
   Usuario ve el prompt (editable)
   ↓
2. Generar Imagen
   ↓
   DALL-E 3 / Imagen 4 usa el prompt enriquecido
   ↓
   Imagen hyper-realista
```

## Mejoras en Prompt Enrichment

### 6 Requisitos Críticos para Fotorrealismo

#### 1. **Physical Appearance** (MUY Específico)
- Edad exacta: "27-year-old" (no "young")
- Etnicidad precisa: "Chilean woman with European and indigenous heritage"
- Cabello: color exacto, textura, largo, estilo
  - Ejemplo: "shoulder-length chestnut brown hair with natural waves"
- Ojos: forma, color, expresión
  - Ejemplo: "warm brown almond-shaped eyes with a genuine smile"
- Piel: tono, textura, imperfecciones naturales
  - Ejemplo: "warm olive skin with natural texture and subtle freckles"
- Rostro: rasgos específicos
  - Ejemplo: "defined cheekbones, natural eyebrows, soft smile lines"

#### 2. **Clothing & Style** (Auténtico, Relatable)
- Prendas específicas: "cream-colored oversized cotton sweater"
- Estilo natural y cotidiano (NO sobreperfeccionado)
- Accesorios mínimos y con buen gusto

#### 3. **Setting & Environment**
- Tipo de ubicación exacta: "bright, airy living room with white walls"
- Detalles de iluminación: "soft natural morning light from a large window"
- Elementos de fondo: "minimalist decor with a potted plant visible"

#### 4. **Photography Style** (CRÍTICO para Realismo)
- ✅ "Shot on iPhone 15 Pro in portrait mode"
- ✅ "Captured in natural lighting"
- ✅ "Slight depth of field with bokeh background"
- ✅ "Authentic smartphone photography aesthetic"
- ✅ "Natural skin texture with pores visible"
- ✅ "No filters, no airbrushing, raw and authentic"

#### 5. **Mood & Expression**
- Expresión natural y genuina (evitar sonrisas "perfectas")
- Lenguaje corporal relajado y auténtico
- Momento candido, sin posar

#### 6. **Technical Quality**
- ✅ "Photorealistic, hyperrealistic"
- ✅ "High resolution, sharp focus on face"
- ✅ "Professional photography quality"
- ✅ "8K quality, extreme detail"

### Ejemplo de Transformación

**Input Simple:**
```
"a man"
```

**Output Enriquecido (200+ palabras):**
```
"A photorealistic, candid iPhone 15 Pro portrait of a 29-year-old Chilean man
with warm olive skin showing natural texture and slight freckles across his nose.
He has shoulder-length, dark brown hair with natural waves, styled in a relaxed,
effortless way. His warm brown almond-shaped eyes have a genuine, friendly
expression with natural smile lines. He's wearing a simple cream-colored linen
button-up shirt, partially unbuttoned at the collar. The photo is taken in a
bright, minimalist living room with soft, diffused natural morning light streaming
through a large window behind her, creating a gentle backlight glow. The background
is slightly blurred (bokeh effect) showing white walls and a green potted plant.
Shot in portrait mode with shallow depth of field, the focus is sharp on her face,
capturing every detail including natural skin texture, individual hair strands,
and the subtle play of light in her eyes. The image has the authentic, unfiltered
aesthetic of a spontaneous smartphone photo - not overly posed, not airbrushed,
just real. Hyperrealistic, 8K quality, professional UGC content style."
```

## UI Flow - Paso a Paso

### Paso 1: Enriquecer Prompt

1. Usuario ve personaje detectado en script: "a man"
2. Click en **"✨ Enriquecer Prompt"**
3. Sistema llama a Gemini con instrucciones detalladas
4. Prompt enriquecido aparece en card del personaje

**UI Muestra:**
```
┌─────────────────────────────────┐
│  👤                             │
│  No generado                    │
├─────────────────────────────────┤
│  a man                          │
│                                 │
│  ✨ Prompt Enriquecido:         │
│  ┌───────────────────────────┐ │
│  │ A photorealistic, candid  │ │
│  │ iPhone 15 Pro portrait... │ │
│  └───────────────────────────┘ │
│                                 │
│  [✏️ Editar Prompt]             │
│  [🎨 Generar Imagen]            │
└─────────────────────────────────┘
```

### Paso 2: Editar Prompt (Opcional)

1. Click en **"✏️ Editar Prompt"**
2. Textarea se hace editable
3. Usuario puede ajustar cualquier detalle
4. Click en **"💾 Guardar Cambios"**

**UI Durante Edición:**
```
┌─────────────────────────────────┐
│  ✨ Prompt Enriquecido:         │
│  ┌───────────────────────────┐ │
│  │ A photorealistic, candid  │ │
│  │ iPhone 15 Pro portrait of │ │
│  │ [EDITABLE TEXTAREA]       │ │
│  │                           │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  [💾 Guardar Cambios]           │
└─────────────────────────────────┘
```

### Paso 3: Generar Imagen

1. Click en **"🎨 Generar Imagen"**
2. Sistema usa prompt enriquecido (editado o no)
3. DALL-E 3 / Imagen 4 genera imagen
4. Imagen aparece en card
5. Se guarda en Firebase con prompt usado

**UI Con Imagen:**
```
┌─────────────────────────────────┐
│  [IMAGEN GENERADA]              │
│                                 │
├─────────────────────────────────┤
│  a man                          │
│                                 │
│  ✨ Prompt Enriquecido:         │
│  │ A photorealistic, candid... │ │
│                                 │
│  [✏️ Editar Prompt]             │
│  [✅ Regenerar Imagen]          │
└─────────────────────────────────┘
```

## Código Técnico

### Nueva Función en mediaGenerationService.js

```javascript
// Genera imagen directamente con prompt pre-optimizado
async generateInfluencerVisualWithPrompt(optimizedPrompt) {
  console.log(`🖼️ Generating image with ${IMAGE_API_PROVIDER}...`);

  let imageResult;
  switch (IMAGE_API_PROVIDER) {
    case 'openai':
      imageResult = await this.generateWithOpenAI(optimizedPrompt);
      break;
    // ... otros providers
  }

  return {
    success: true,
    imageUrl: imageResult.url,
    prompt: optimizedPrompt,
    service: IMAGE_API_PROVIDER,
    timestamp: new Date().toISOString()
  };
}
```

### Prompt Enrichment Mejorado

```javascript
async optimizeImagePromptWithGemini(description, brandResearch = null) {
  const optimizationPrompt = `You are an expert prompt engineer specializing
  in photorealistic AI image generation for DALL-E 3, Imagen 4, and similar models.

  Your task: Transform this simple description into an EXTREMELY DETAILED,
  PHOTOREALISTIC prompt that will generate a hyper-realistic UGC-style photo.

  CRITICAL REQUIREMENTS FOR MAXIMUM REALISM:
  1. Physical Appearance (be VERY specific)...
  2. Clothing & Style (authentic, relatable)...
  3. Setting & Environment...
  4. Photography Style (CRITICAL for realism)...
  5. Mood & Expression...
  6. Technical Quality...

  EXAMPLE (follow this level of detail):
  "A photorealistic, candid iPhone 15 Pro portrait of a 29-year-old Chilean woman..."

  Only return your best prompt. Nothing else. No explanations, no markdown, just the prompt.`;

  const optimized = await geminiService.generateContent(optimizationPrompt);
  return optimized.trim();
}
```

### Flujo en ShotBreakdown.jsx

```javascript
// Paso 1: Enriquecer
const handleEnrichCharacterPrompt = async (charIndex) => {
  const enrichedPrompt = await mediaGenerationService.optimizeImagePromptWithGemini(
    character.description,
    activeBrand
  );

  // Guardar en estado para mostrar
  updatedCharacters[charIndex] = {
    ...character,
    enrichedPrompt: enrichedPrompt
  };
  setCharacters(updatedCharacters);
};

// Paso 2: Generar con prompt enriquecido
const handleGenerateCharacter = async (charIndex, customPrompt) => {
  const promptToUse = customPrompt || character.enrichedPrompt;

  const result = await mediaGenerationService.generateInfluencerVisualWithPrompt(
    promptToUse
  );

  // Actualizar con imagen
  updatedCharacters[charIndex] = {
    ...character,
    image: result.imageUrl,
    imagePrompt: promptToUse
  };
};
```

## Beneficios

### 1. **Control Total**
- Usuario ve exactamente qué prompt se usará
- Puede ajustar cualquier detalle antes de generar
- No más "caja negra"

### 2. **Máxima Calidad**
- Prompts 10x más detallados que antes
- Instrucciones específicas para fotorrealismo
- Optimizado para DALL-E 3, Imagen 4, Flux

### 3. **Iteración Rápida**
- No gusta el resultado? Edita prompt y regenera
- No necesitas volver a enriquecer desde cero
- Aprende qué funciona mejor

### 4. **Consistencia**
- Prompt guardado con cada imagen
- Puedes reutilizar prompts exitosos
- Replicar estilos que funcionan

### 5. **Educativo**
- Aprende cómo escribir buenos prompts
- Ve qué detalles importan
- Mejora tu prompt engineering

## Testing

### Caso de Prueba 1: Flujo Completo

1. Abre "Generador de Escenas"
2. Observa personaje detectado: "a man"
3. Click "✨ Enriquecer Prompt"
4. Espera 3-5 segundos (Gemini procesando)
5. Ve prompt enriquecido aparecer
6. Click "✏️ Editar Prompt"
7. Ajusta algún detalle (ej: cambiar edad)
8. Click "💾 Guardar Cambios"
9. Click "🎨 Generar Imagen"
10. Espera generación (10-20 segundos)
11. Ve imagen hyper-realista

### Caso de Prueba 2: Sin Edición

1. Enriquecer prompt
2. Directamente "Generar Imagen"
3. Funciona sin necesidad de editar

### Caso de Prueba 3: Regenerar

1. Ya tienes imagen generada
2. Edita prompt para cambiar algo
3. Click "✅ Regenerar Imagen"
4. Nueva imagen con ajustes

## Troubleshooting

### Prompt no aparece después de enriquecer
- Revisar consola: `✨ Enriched prompt generated:`
- Verificar que Gemini API esté funcionando
- Verificar que `character.enrichedPrompt` se actualiza

### Imagen no se ve realista
- Editar prompt manualmente
- Agregar más detalles específicos
- Asegurar que incluye: "iPhone 15 Pro", "photorealistic", "8K quality"
- Verificar iluminación: "natural morning light", "soft diffused lighting"

### Prompt muy largo (>4000 caracteres para DALL-E 3)
- Sistema automáticamente trunca a 4000 en generateWithOpenAI
- Considerar usar Imagen 4 (no tiene límite)
- Editar prompt para ser más conciso

## Comparación Antes vs Después

### ANTES:

**Input**: "a man"
**Prompt a DALL-E**: "a man"
**Resultado**: Hombre genérico, poco realista

### DESPUÉS:

**Input**: "a man"
**Prompt Enriquecido**:
```
"A photorealistic, candid iPhone 15 Pro portrait of a 29-year-old Chilean man
with warm olive skin showing natural texture and slight freckles across his nose.
He has shoulder-length, dark brown hair with natural waves, styled in a relaxed,
effortless way. His warm brown almond-shaped eyes have a genuine, friendly
expression with natural smile lines. He's wearing a simple cream-colored linen
button-up shirt, partially unbuttoned at the collar. The photo is taken in a
bright, minimalist living room with soft, diffused natural morning light streaming
through a large window behind him, creating a gentle backlight glow. The background
is slightly blurred (bokeh effect) showing white walls and a green potted plant.
Shot in portrait mode with shallow depth of field, the focus is sharp on his face,
capturing every detail including natural skin texture, individual hair strands,
and the subtle play of light in his eyes. The image has the authentic, unfiltered
aesthetic of a spontaneous smartphone photo - not overly posed, not airbrushed,
just real. Hyperrealistic, 8K quality, professional UGC content style."
```
**Resultado**: Hombre chileno hyper-realista, UGC style perfecto

## Next Steps

1. **Test con diferentes personajes**
   - Mujeres, hombres, diferentes edades
   - Diferentes etnias según brand location
   - Diferentes estilos según category

2. **Refinar prompt enrichment**
   - Analizar qué prompts generan mejores imágenes
   - Ajustar instrucciones a Gemini según feedback

3. **Aplicar a escenas también**
   - Mismo flujo para shots/escenas
   - Enriquecer prompts de escenas

4. **Library de buenos prompts**
   - Guardar prompts que funcionan bien
   - Reutilizar estructuras exitosas
