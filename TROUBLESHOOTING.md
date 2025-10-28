# Troubleshooting Guide - UGC Bot

## 🔧 Problemas Comunes y Soluciones

### Error 404: Model Not Found

#### Síntoma
```
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent:
[404] models/gemini-pro is not found for API version v1beta
```

#### Causa
Los modelos `gemini-pro`, `gemini-1.5-flash`, y `gemini-1.5-flash-latest` NO están disponibles en la API v1beta con la API key actual.

**ÚNICO MODELO DISPONIBLE:**
- `gemini-2.0-flash-exp` (experimental, ultra rápido)

#### Solución ✅
**Ya está arreglado en el código actual.**

El archivo `src/services/geminiService.js` ahora usa `gemini-2.0-flash-exp` en todas las funciones:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
```

Este modelo fue verificado usando el script `test-gemini.js` y es el **ÚNICO** que funciona con la API key actual.

**NO intentes cambiar a otros modelos** - todos resultarán en errores 404:
- ❌ `gemini-pro`
- ❌ `gemini-1.5-flash`
- ❌ `gemini-1.5-flash-latest`
- ❌ `gemini-1.5-pro`
- ❌ `gemini-1.5-pro-latest`

---

### Error: API Key Inválida

#### Síntoma
```
Error: [403] API key not valid
```

#### Causa
- La API key de Gemini es inválida o ha expirado
- La API key no tiene permisos para Gemini API

#### Solución
1. Verifica tu API key en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Abre `src/services/geminiService.js`
3. Reemplaza la línea:
   ```javascript
   const API_KEY = 'TU_NUEVA_API_KEY';
   ```
4. Ejecuta `npm run build`

---

### Error: Rate Limit Exceeded

#### Síntoma
```
Error: [429] Resource exhausted
```

#### Causa
Has excedido el límite de solicitudes por minuto de Gemini API.

#### Solución
1. **Espera 1-2 minutos** antes de volver a ejecutar el pipeline
2. Si el problema persiste:
   - Espaciar las ejecuciones del pipeline
   - El modelo `gemini-2.0-flash-exp` ya tiene la cuota más alta (15 RPM)

**Límites gratuitos de Gemini**:
- `gemini-2.0-flash-exp`: 15 RPM (requests per minute)

---

### Error: Failed to Load Resource

#### Síntoma
```
Failed to load resource: net::ERR_INTERNET_DISCONNECTED
```

#### Causa
Sin conexión a internet.

#### Solución
1. Verifica tu conexión a internet
2. Intenta recargar la página
3. Si usas VPN, verifica que esté conectada

---

### Datos No Se Guardan

#### Síntoma
Al recargar la página, los datos desaparecen.

#### Causa
- localStorage está deshabilitado
- Navegador en modo incógnito
- Cookies/localStorage bloqueados

#### Solución
1. **No uses modo incógnito**
2. Verifica configuración del navegador:
   - Chrome: Settings → Privacy → Cookies → Allow all cookies
   - Firefox: Settings → Privacy → Standard
3. Abre DevTools (F12) → Application → Local Storage
4. Verifica que puedes ver:
   - `ugc_bot_brand_data`
   - `ugc_bot_ideas`
   - `ugc_bot_scripts`

---

### Pipeline No Se Ejecuta

#### Síntoma
Al hacer click en "Ejecutar Pipeline", no pasa nada.

#### Causa
No has completado el Brand Research.

#### Solución
1. Ve a **🔍 Brand Research**
2. Completa todos los campos obligatorios (marcados con *)
3. Haz click en **"Guardar y Analizar con AI"**
4. Espera confirmación de guardado
5. Ve a **🚀 Pipeline Auto**
6. El primer nodo debe estar en verde ✓
7. Ahora puedes ejecutar el pipeline

---

### Ideas No Se Activan/Desactivan

#### Síntoma
Los checkboxes de ideas no responden.

#### Causa
El pipeline aún está ejecutándose.

#### Solución
1. **Espera** a que el pipeline complete TODOS los pasos
2. Una vez completado, los checkboxes funcionarán
3. Marca/desmarca las ideas que quieras
4. **Nota**: En la versión actual, el toggle funciona después de la ejecución completa

**Mejora futura**: Permitir activar/desactivar ideas antes de crear scripts.

---

### Scripts Generados Están Vacíos o Incompletos

#### Síntoma
Los scripts se generan pero están vacíos o muy cortos.

#### Causa
- Gemini devolvió una respuesta incompleta
- Timeout en la conexión
- Límite de tokens excedido

#### Solución
1. **Re-ejecuta el pipeline**
2. Si persiste, verifica la consola (F12) para errores
3. El modelo `gemini-2.0-flash-exp` es el más avanzado disponible (no hay alternativa)

---

### Build Falla

#### Síntoma
```
npm run build
Error: ...
```

#### Causa
Dependencias corruptas o incompletas.

#### Solución
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install --include=dev

# Intentar build de nuevo
npm run build
```

En Windows:
```bash
rmdir /s /q node_modules
del package-lock.json
npm install --include=dev
npm run build
```

---

### Dev Server No Inicia

#### Síntoma
```
npm run dev
Error: EADDRINUSE
```

#### Causa
El puerto 5173 ya está en uso.

#### Solución
1. **Opción 1**: Cerrar el proceso existente
   - Windows: Abrir Task Manager → Buscar "Node" → End Task
   - Mac/Linux: `killall node`

2. **Opción 2**: Usar otro puerto
   ```bash
   npm run dev -- --port 3000
   ```

---

### Performance Lento

#### Síntoma
El pipeline tarda más de 3 minutos.

#### Causa
- Modelo `gemini-1.5-pro` es más lento
- Conexión lenta a internet
- Rate limiting

#### Solución
1. **Ya estás usando el modelo más rápido**: `gemini-2.0-flash-exp` (2-4 segundos por request)

2. **Verifica tu conexión** a internet

3. **Espaciar ejecuciones** para evitar rate limiting (15 requests/minuto)

---

## 🐛 Debug Avanzado

### Ver Logs en Consola

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Ejecuta el pipeline
4. Verás logs como:
   ```
   🤖 Ejecutando análisis AI...
   💡 Generando ideas...
   📝 Creando scripts...
   ```

### Ver Network Requests

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por "googleapis"
4. Ejecuta el pipeline
5. Verás las llamadas a Gemini API
6. Click en cada una para ver:
   - Request payload (lo que enviaste)
   - Response (lo que Gemini devolvió)
   - Status code

### Ver LocalStorage

1. Abre DevTools (F12)
2. Ve a **Application** → **Local Storage**
3. Click en tu dominio
4. Verás todas las keys guardadas:
   - `ugc_bot_brand_data`
   - `ugc_bot_enhanced_research`
   - `ugc_bot_ideas`
   - `ugc_bot_scripts`

### Limpiar Todo y Empezar de Nuevo

Si nada funciona:

1. **Limpiar localStorage**:
   ```javascript
   localStorage.clear()
   ```

2. **Recargar la página**: F5

3. **Empezar desde cero** con Brand Research

---

## 📞 Soporte Adicional

### Recursos Útiles

- [Gemini API Docs](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [GitHub Issues](https://github.com/google/generative-ai-js/issues)

### Información de Debug

Si necesitas reportar un bug, incluye:
1. Mensaje de error completo
2. Screenshot de la consola
3. Datos de Brand Research (sin info sensible)
4. Versión del navegador
5. Sistema operativo

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Conexión a internet activa
- [ ] API key de Gemini válida
- [ ] Brand Research completado
- [ ] No en modo incógnito
- [ ] DevTools abierto para ver errores
- [ ] npm install --include=dev ejecutado
- [ ] Navegador actualizado (Chrome/Edge/Firefox)
- [ ] No hay otros pipelines ejecutándose
- [ ] LocalStorage no está lleno
- [ ] No hay ad-blockers interfiriendo

---

**Última actualización**: 2025-10-27
**Versión**: 2.2.0 (gemini-2.0-flash-exp)
