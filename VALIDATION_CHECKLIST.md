# ✅ Checklist de Validación - Google Cloud Setup

## Estado Actual

- ✅ Código de Vertex AI implementado
- ✅ Dependencias instaladas (@google-cloud/aiplatform)
- ✅ .env configurado con vertex-ai
- ⏳ **Pendiente: gcloud CLI y ADC**

---

## 📋 Checklist - Ejecuta Estos Pasos

### Paso 1: Instalar gcloud CLI

#### Opción A: Descarga Manual (Recomendado para Windows)

1. **Descargar instalador:**
   - Ve a: https://cloud.google.com/sdk/docs/install
   - Click en "Windows" tab
   - Descarga: `GoogleCloudSDKInstaller.exe`

2. **Ejecutar instalador:**
   - Doble click en el instalador descargado
   - Acepta ubicación por defecto
   - ✅ Marca: "Start Google Cloud SDK Shell"
   - ✅ Marca: "Run gcloud init"
   - Click "Install"

3. **Esperar instalación:**
   - Toma 2-3 minutos
   - Se abrirá una ventana de PowerShell al finalizar

4. **Verificar instalación:**
   - Abre una **NUEVA** terminal/PowerShell
   - Ejecuta:
     ```powershell
     gcloud --version
     ```
   - Deberías ver: `Google Cloud SDK 455.0.0` (o similar)

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 2: Autenticar con Application Default Credentials

**En PowerShell o Command Prompt:**

```powershell
gcloud auth application-default login
```

**¿Qué pasa?**
1. Se abrirá tu navegador
2. Te pedirá iniciar sesión con Google
3. Pedirá permisos para "Google Auth Library"
4. Click "Allow"
5. Verás mensaje: "Credentials saved to file..."

**Verificar:**
```powershell
gcloud auth application-default print-access-token
```

**Resultado esperado:** Token largo que empieza con `ya29.`

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 3: Configurar Proyecto

```powershell
gcloud config set project creador-de-contenido-f413
```

**Resultado esperado:** `Updated property [core/project].`

**Verificar:**
```powershell
gcloud config get-value project
```

**Resultado esperado:** `creador-de-contenido-f413`

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 4: Habilitar API de Vertex AI

```powershell
gcloud services enable aiplatform.googleapis.com
```

**Nota:** Este comando puede tomar 1-2 minutos.

**Resultado esperado:** `Operation "operations/..." finished successfully.`

**Verificar:**
```powershell
gcloud services list --enabled --filter="name:aiplatform.googleapis.com"
```

**Resultado esperado:** Debe listar `aiplatform.googleapis.com`

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 5: Verificar Permisos

```powershell
gcloud projects get-iam-policy creador-de-contenido-f413 --flatten="bindings[].members" --filter="bindings.members:user:TU_EMAIL@gmail.com"
```

Reemplaza `TU_EMAIL@gmail.com` con tu email real.

**Resultado esperado:** Deberías ver roles como:
- `roles/owner` o
- `roles/editor` o
- `roles/aiplatform.user`

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 6: Ejecutar Script de Validación

**En PowerShell:**

```powershell
cd "c:\Users\elobo\Prueba Agentes\ugc-bot-sociocompras"
.\validate-gcloud-setup.ps1
```

**Resultado esperado:** Todos los tests en verde (✅)

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 7: Reiniciar Servidor de Desarrollo

**Nota:** Es importante reiniciar para que tome las nuevas credenciales.

1. **Detener servidor actual:** Ctrl+C en la terminal donde corre

2. **Iniciar de nuevo:**
   ```powershell
   npm run dev
   ```

3. **Abrir app:** http://localhost:5173

**✅ Marca aquí cuando completes:** [ ]

---

### Paso 8: Test de Generación de Imagen

1. **Abrir app:** http://localhost:5173

2. **Navegar a:** Generador de Escenas

3. **Generar un script** (o abrir uno existente)

4. **Click:** "✨ Enriquecer Prompt" en un personaje

5. **Esperar** el prompt enriquecido

6. **Click:** "🎨 Generar Imagen"

7. **Abrir consola del navegador:** F12 → Console

8. **Buscar mensajes:**
   ```
   📡 Calling Vertex AI Imagen 4...
   Project: creador-de-contenido-f413
   Location: us-central1
   🔄 Generating image with Vertex AI...
   ✅ Imagen 4 image generated successfully
   Image size: XXX KB
   ```

9. **Verificar imagen:** Debe aparecer en la UI

**✅ Marca aquí cuando completes:** [ ]

---

## 🔍 Verificación Final

### Si TODOS los pasos tienen ✅:

**¡ÉXITO!** Tu setup está completo.

**Compara calidad:**
- Genera la misma imagen que me mostraste antes
- Debería tener calidad similar a las imágenes 2 y 3
- Mucho mejor que la imagen 1 (DALL-E 3)

### Si algún paso falló:

**Revisa:**
1. [VERTEX_AI_SETUP.md](VERTEX_AI_SETUP.md) - Guía completa
2. Sección "Troubleshooting" en la guía
3. Mensajes de error específicos

**Errores comunes:**

| Error | Solución |
|-------|----------|
| `gcloud: command not found` | Reinicia terminal después de instalar |
| `PERMISSION_DENIED` | Ejecuta: `gcloud auth application-default login` |
| `NOT_FOUND` | Ejecuta: `gcloud services enable aiplatform.googleapis.com` |
| `UNAUTHENTICATED` | Ejecuta: `gcloud auth application-default login` |

---

## 📊 Comparación de Calidad

### ANTES (DALL-E 3 API):
- ⭐⭐⭐ Calidad regular
- ❌ Prompt modificado por filtros
- 💰 $0.08 por imagen
- ⚠️ Filtros agresivos

### AHORA (Vertex AI Imagen 4):
- ⭐⭐⭐⭐⭐ Calidad excelente
- ✅ Prompt respetado 100%
- 🆓 GRATIS (100/mes)
- ✅ Filtros balanceados

---

## 🎯 Siguiente Paso

Una vez que todos los pasos estén ✅:

**Genera 3-5 imágenes de prueba** y compáralas con las que me mostraste.

**Deberías ver:**
- ✅ Mayor fotorrealismo
- ✅ Mejor textura de piel
- ✅ Iluminación más natural
- ✅ Detalles más finos
- ✅ Mejor composición

**Si la calidad es similar a las imágenes 2 y 3 que me mostraste:**
🎉 ¡Objetivo cumplido!

---

## 📞 ¿Necesitas Ayuda?

Si algún paso falla:

1. **Copia el mensaje de error exacto**
2. **Ejecuta el comando de verificación correspondiente**
3. **Revisa la sección Troubleshooting en [VERTEX_AI_SETUP.md](VERTEX_AI_SETUP.md)**

---

## 📝 Notas Finales

- **ADC es permanente:** Solo necesitas configurarlo una vez
- **Credenciales se renuevan:** Automáticamente
- **Sin API keys:** Todo seguro, nada que exponer en Git
- **100 imágenes/mes:** Tier gratuito generoso
- **Mejor calidad:** Que DALL-E 3 API

¡Disfruta de las imágenes de alta calidad! 🎨✨
