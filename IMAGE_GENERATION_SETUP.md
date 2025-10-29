# Configuración de Generación de Imágenes 🎨

El sistema soporta múltiples proveedores de generación de imágenes para personajes y escenas.

## Proveedores Disponibles

### 1. **Demo Mode** (Por defecto) ✅
- **NO requiere configuración**
- Genera placeholders con el prompt optimizado visible
- Útil para testing y desarrollo
- **Configuración**: Ya está activo por defecto

### 2. **OpenAI DALL-E 3** (Recomendado) 🎯
- **Más fácil de configurar**
- Calidad fotorealista excelente
- Formato vertical 1024x1792 (similar a 9:16)
- Costo: ~$0.080 por imagen HD

**Pasos para configurar:**

1. Crear cuenta en OpenAI: https://platform.openai.com/signup
2. Agregar créditos: https://platform.openai.com/account/billing
3. Obtener API key: https://platform.openai.com/api-keys
4. Agregar a `.env`:
   ```env
   VITE_IMAGE_API_PROVIDER=openai
   VITE_OPENAI_API_KEY=sk-...tu_api_key_aqui
   ```

### 3. **Stability AI (Stable Diffusion)** 🎭
- Open source y económico
- Muy personalizable
- Buena calidad realista
- Costo: ~$0.004 por imagen

**Pasos para configurar:**

1. Crear cuenta: https://platform.stability.ai/
2. Obtener API key: https://platform.stability.ai/account/keys
3. Agregar a `.env`:
   ```env
   VITE_IMAGE_API_PROVIDER=stability
   VITE_STABILITY_API_KEY=sk-...tu_api_key_aqui
   ```

### 4. **Google Vertex AI Imagen 3** ⚙️
- Requiere Google Cloud Platform
- Configuración más compleja
- Excelente calidad
- Requiere autenticación OAuth2

**Pasos para configurar:**

1. Crear proyecto en GCP: https://console.cloud.google.com/
2. Habilitar Vertex AI API
3. Configurar autenticación (más complejo - ver documentación oficial)
4. Agregar a `.env`:
   ```env
   VITE_IMAGE_API_PROVIDER=vertex-ai
   VITE_VERTEX_AI_PROJECT_ID=tu_project_id
   VITE_VERTEX_AI_LOCATION=us-central1
   ```

**Nota**: La implementación de Vertex AI está en modo placeholder. Requiere SDK adicional y autenticación OAuth2.

## Flujo de Generación

Independientemente del proveedor, el flujo es:

```
1. Usuario hace clic en "🎨 Generar Personaje"
   ↓
2. Gemini optimiza el prompt (mejora detalles visuales)
   ↓
3. Prompt optimizado se envía al proveedor configurado
   ↓
4. Imagen generada se muestra en la UI
```

## Optimización de Prompts con Gemini 🧠

**IMPORTANTE**: Todos los prompts pasan por Gemini primero para optimización:

- Agrega detalles visuales específicos
- Mejora la descripción de iluminación y ángulos
- Añade keywords de estilo fotorealista
- Adapta para formato vertical 9:16
- Incluye contexto de la marca (localización chilena, categoría)

Ejemplo:
```
Input: "woman office worker"

Gemini optimiza a:
"A Chilean professional woman, mid-30s, wearing business casual attire
(white blouse, navy blazer), natural brown wavy hair, warm smile,
sitting at a modern office desk. Medium shot, eye-level angle.
Soft natural lighting from window, bright and airy atmosphere.
Background: contemporary Santiago office with plants.
Ultra-realistic, professional photography, 9:16 vertical format,
smartphone photo aesthetic."
```

## Recomendación para Comenzar

**Si quieres generar imágenes reales AHORA**:

1. Usa **DALL-E 3** (más simple)
2. Crea cuenta en OpenAI
3. Agrega $10 de créditos
4. Configura `.env` con tu API key
5. Cambia `VITE_IMAGE_API_PROVIDER=openai`
6. Reinicia el servidor (`npm run dev`)

**Costo estimado**:
- ~125 imágenes HD con $10
- Cada personaje = 1 imagen
- Cada escena = 1 imagen (opcional)

## Videos con Veo 3.1

**Nota**: La generación de videos está en modo placeholder.

Para implementar videos reales, necesitarías:
- Acceso a Runway Gen-2 API
- O Pika Labs API
- O configurar Veo (requiere acceso especial de Google)

El sistema ya tiene la estructura preparada para cuando quieras agregar generación de videos.

## Troubleshooting

### Error: "VITE_OPENAI_API_KEY not configured"
- Verifica que agregaste la key en `.env`
- Reinicia el servidor de desarrollo
- Asegúrate de que la key empiece con `sk-`

### Error: "DALL-E 3 API error: 401"
- API key inválida o expirada
- Verifica en https://platform.openai.com/api-keys

### Error: "DALL-E 3 API error: 429"
- Límite de rate excedido
- Espera un minuto e intenta de nuevo
- Considera actualizar tu tier en OpenAI

### Las imágenes no se generan
- Revisa la consola del navegador (F12)
- Verifica que `VITE_IMAGE_API_PROVIDER` esté configurado
- Confirma que tienes créditos en tu cuenta del proveedor

## Próximos Pasos

Una vez configurado, podrás:

1. ✅ Generar personajes con contexto local chileno
2. ✅ Usar personajes como referencia visual
3. ✅ Generar imágenes de escenas individuales
4. 🔄 (Futuro) Generar videos con los prompts
5. 🔄 (Futuro) Compilar escenas en video final
