# Vertex AI Imagen 4 Setup Guide

## Por Qué Usar Vertex AI en Lugar de DALL-E 3

### Comparación de Calidad

| Aspecto | DALL-E 3 API | Vertex AI Imagen 4 |
|---------|--------------|-------------------|
| **Calidad Fotorrealista** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Modificación de Prompt** | ❌ Sí (reduce calidad) | ✅ No |
| **Costo** | $0.080 por imagen HD | ✅ GRATIS (100/mes) |
| **Filtros de Seguridad** | Muy agresivos | Balanceados |
| **Control sobre Prompt** | Limitado | Total |

### Problema con DALL-E 3 API

**DALL-E 3 API automáticamente modifica tu prompt:**
```
Tu Prompt: "A photorealistic, candid iPhone 15 Pro portrait of a 29-year-old Chilean woman..."

DALL-E 3 lo Cambia a: "A portrait photograph of a young woman..."
```

**Resultado:** Pérdida de detalle y calidad inferior.

---

## 🚀 Setup Completo - Paso a Paso

### Paso 1: Instalar Google Cloud CLI

#### Windows:

1. **Descarga el instalador:**
   - Ve a: https://cloud.google.com/sdk/docs/install
   - Descarga: `GoogleCloudSDKInstaller.exe`

2. **Ejecuta el instalador:**
   - Acepta las opciones por defecto
   - Marca "Run gcloud init after installation"

3. **Reinicia tu terminal** después de instalar

#### Verificar Instalación:

```bash
gcloud --version
```

Deberías ver algo como:
```
Google Cloud SDK 455.0.0
```

---

### Paso 2: Autenticar con Google Cloud

#### A. Inicializar gcloud

```bash
gcloud init
```

Esto te preguntará:

1. **"Pick configuration to use"**
   - Selecciona: `[1] Re-initialize this configuration [default]`

2. **"Choose the account you would like to use"**
   - Inicia sesión con tu cuenta de Google
   - Se abrirá tu navegador

3. **"Pick cloud project to use"**
   - Selecciona: `creador-de-contenido-f413`

#### B. Configurar Application Default Credentials (ADC)

**Este es el paso más importante:**

```bash
gcloud auth application-default login
```

**¿Qué hace este comando?**
- ✅ Abre tu navegador
- ✅ Te pide iniciar sesión con Google
- ✅ Guarda credenciales localmente en:
  - Windows: `%APPDATA%\gcloud\application_default_credentials.json`
  - Mac/Linux: `~/.config/gcloud/application_default_credentials.json`
- ✅ Tu aplicación las usa automáticamente (¡sin API keys!)

**Resultado esperado:**
```
Credentials saved to file: [C:\Users\...\application_default_credentials.json]

These credentials will be used by any library that requests Application Default Credentials (ADC).
```

---

### Paso 3: Configurar el Proyecto

```bash
gcloud config set project creador-de-contenido-f413
```

**Resultado esperado:**
```
Updated property [core/project].
```

---

### Paso 4: Habilitar la API de Vertex AI

```bash
gcloud services enable aiplatform.googleapis.com
```

**Resultado esperado:**
```
Operation "operations/..." finished successfully.
```

Este comando puede tomar 1-2 minutos.

---

### Paso 5: Verificar Permisos

```bash
gcloud projects get-iam-policy creador-de-contenido-f413 --flatten="bindings[].members" --filter="bindings.members:user:TU_EMAIL@gmail.com"
```

Reemplaza `TU_EMAIL@gmail.com` con tu email.

**Deberías ver roles como:**
- `roles/owner`
- `roles/editor`
- `roles/aiplatform.user`

Si NO tienes permisos, pídele al administrador del proyecto que te agregue el rol:
```bash
gcloud projects add-iam-policy-binding creador-de-contenido-f413 \
  --member="user:TU_EMAIL@gmail.com" \
  --role="roles/aiplatform.user"
```

---

### Paso 6: Verificar Configuración Final

```bash
# Ver proyecto actual
gcloud config get-value project

# Ver cuenta autenticada
gcloud config get-value account

# Verificar ADC
gcloud auth application-default print-access-token
```

Si el último comando imprime un token largo (empieza con `ya29.`), **¡estás listo!**

---

## 🧪 Testing

### Test 1: Verificar que el servidor detecta las credenciales

1. Asegúrate que el servidor esté corriendo:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12)

3. Genera un personaje

4. Busca en consola:
   ```
   📡 Calling Vertex AI Imagen 4...
   Project: creador-de-contenido-f413
   Location: us-central1
   🔄 Generating image with Vertex AI...
   ```

### Test 2: Primera Generación

**Primera vez puede tomar 15-20 segundos** mientras Vertex AI inicializa el modelo.

**Generaciones posteriores:** 8-12 segundos.

---

## 🔧 Troubleshooting

### Error: "gcloud: command not found"

**Solución:**
1. Reinicia tu terminal
2. Si persiste, agrega gcloud al PATH:
   - Windows: `C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin`
   - Mac: `/usr/local/bin`

### Error: "UNAUTHENTICATED"

```
🔑 Not authenticated. Run: gcloud auth application-default login
```

**Solución:**
```bash
gcloud auth application-default login
```

### Error: "PERMISSION_DENIED"

```
🔐 Permission denied. Run: gcloud auth application-default login
```

**Posibles causas:**
1. ADC no configurado → Ejecuta: `gcloud auth application-default login`
2. Sin permisos en el proyecto → Pide rol `aiplatform.user`
3. Proyecto incorrecto → Verifica: `gcloud config get-value project`

### Error: "NOT_FOUND" o "API not enabled"

```
📦 Vertex AI API not enabled. Run: gcloud services enable aiplatform.googleapis.com
```

**Solución:**
```bash
gcloud services enable aiplatform.googleapis.com
```

### Error: "Invalid project"

**Solución:**
```bash
gcloud config set project creador-de-contenido-f413
```

### Imagen no se muestra en UI

**Causa:** Imagen 4 retorna base64, que se convierte a Data URL.

**Verificar:**
1. Abre consola (F12)
2. Busca: `✅ Imagen 4 image generated successfully`
3. Busca: `Image size: XXX KB`
4. Si ves esto, la imagen se generó correctamente

**Si no se ve en UI:**
- Revisa que `character.image` tenga valor
- Verifica que empiece con `data:image/png;base64,`

---

## 📊 Cuota y Límites

### Tier Gratuito

- **100 generaciones/mes** GRATIS
- Después: ~$0.02 por imagen (mucho más barato que DALL-E 3)

### Ver Uso Actual

Ve a: https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/imagen

O ejecuta:
```bash
gcloud logging read "resource.type=aiplatform.googleapis.com/PredictionService" --limit 10 --format json
```

---

## 🔐 Seguridad

### Ventajas de ADC

✅ **Sin API Keys en código**
- No necesitas `VITE_VERTEX_AI_API_KEY`
- No hay riesgo de exponer keys en Git

✅ **Credenciales temporales**
- Se renuevan automáticamente
- Más seguras que keys de larga duración

✅ **Fácil revocación**
- Cerrar sesión revoca acceso inmediatamente
- No necesitas regenerar keys

### Revocar Acceso

```bash
gcloud auth application-default revoke
```

### Re-autenticar

```bash
gcloud auth application-default login
```

---

## 📝 Cómo Funciona ADC

```
1. Tu Aplicación Web inicia
   ↓
2. mediaGenerationService.generateWithVertexAI() se ejecuta
   ↓
3. PredictionServiceClient busca credenciales en este orden:
   a. Variable de entorno GOOGLE_APPLICATION_CREDENTIALS
   b. ADC en: %APPDATA%\gcloud\application_default_credentials.json
   c. Credenciales de cuenta de servicio (en producción)
   ↓
4. Encuentra ADC (guardado por gcloud auth application-default login)
   ↓
5. Usa esas credenciales para autenticar con Vertex AI
   ↓
6. Vertex AI valida que tienes permiso (rol aiplatform.user)
   ↓
7. Procesa tu solicitud y retorna imagen
```

**Ventaja:** Todo automático, sin configuración adicional en tu código.

---

## 🚀 Próximos Pasos

Después de configurar:

1. ✅ **Prueba generar un personaje**
   - Debería usar Vertex AI automáticamente
   - Busca en consola: "Calling Vertex AI Imagen 4"

2. ✅ **Compara calidad**
   - Genera misma imagen con DALL-E 3 y Vertex AI
   - Vertex AI debería tener mejor fotorrealismo

3. ✅ **Revisa prompts**
   - Vertex AI NO modifica tu prompt
   - DALL-E 3 sí lo modifica (ver logs)

4. ✅ **Monitorea uso**
   - Tienes 100 generaciones gratis/mes
   - Ve uso en Google Cloud Console

---

## 🎯 Resultado Esperado

**Con esta configuración:**
- ✅ Imágenes hyper-realistas (mejor que DALL-E 3)
- ✅ Sin modificación de prompts
- ✅ 100 generaciones/mes gratis
- ✅ Autenticación segura sin API keys
- ✅ Setup rápido (15 minutos)

**¡Disfruta de la mejor calidad de imágenes!** 🎉
