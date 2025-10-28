# 🚀 Guía del Pipeline Automático

## Descripción

El **Pipeline Automático** es un sistema de nodos conectados que ejecuta todo el flujo de generación de contenido en cascada, desde el Brand Research hasta la creación de Scripts, en un solo clic.

## 🎯 Características Principales

### 1. **Ejecución en Cascada**
El pipeline ejecuta automáticamente todos los pasos en secuencia:
```
Brand Research → AI Analysis → Generate Ideas → Create Scripts
```

### 2. **Visualización en Tiempo Real**
- Indicadores visuales del progreso
- Estados de cada nodo (Pendiente, En proceso, Completado)
- Animaciones durante la ejecución

### 3. **Selección de Ideas (Toggle)**
- Activa/desactiva ideas individuales
- Solo las ideas habilitadas pasan a la creación de scripts
- Control total sobre qué contenido generar

### 4. **Integración Completa con Gemini AI**
- Análisis profundo de marca
- Generación de 5 ideas personalizadas
- Creación de 3 scripts (basados en las primeras 3 ideas)

## 📋 Cómo Usar el Pipeline

### Paso 1: Completar Brand Research

Antes de ejecutar el pipeline, debes completar el Brand Research:

1. Ve a **🔍 Brand Research**
2. Completa todos los campos obligatorios:
   - Nombre de la Marca
   - Dominio/Website
   - UVP
   - Audiencia
   - Pain Points
3. (Opcional) Completa campos adicionales para mejor análisis
4. Haz clic en **"✨ Guardar y Analizar con AI"**
5. Espera a que se complete el guardado

### Paso 2: Ir al Pipeline

1. Ve a **🚀 Pipeline Auto** en la navegación
2. Verás la interfaz del pipeline con 4 nodos:
   - 🔍 Brand Research (debe estar en verde ✓)
   - 🤖 AI Analysis
   - 💡 Generate Ideas
   - 📝 Create Scripts

### Paso 3: Ejecutar el Pipeline

1. Haz clic en el botón **▶️ Ejecutar Pipeline**
2. El sistema comenzará a ejecutar cada paso automáticamente
3. Observa el progreso en tiempo real:
   - Los nodos cambiarán a azul durante la ejecución
   - Se mostrarán como verdes al completarse
   - Las líneas conectoras también cambiarán de color

### Paso 4: Revisar y Seleccionar Ideas

Una vez que el paso "Generate Ideas" se complete:

1. Verás una lista de 5 ideas generadas
2. Cada idea tiene un checkbox para activar/desactivar
3. Por defecto, todas están habilitadas (✓)
4. **Desmarca** las ideas que NO quieres usar
5. Solo las ideas marcadas se usarán para crear scripts

Información de cada idea:
- **Título**: Nombre de la idea
- **Descripción**: Detalles del concepto
- **Hook**: Gancho para los primeros 3 segundos
- **Potencial Viral**: alto/medio/bajo

### Paso 5: Ver Scripts Generados

Cuando el pipeline complete:

1. Verás los scripts generados debajo de las ideas
2. Cada script incluye:
   - Concepto (título de la idea)
   - Script completo para Sora 2
   - Botón "Copiar" para copiar al portapapeles

## 🔄 Flujo de Datos (Nodos Conectados)

```
┌─────────────────┐
│ Brand Research  │
│   (Input)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Analysis    │
│  (Gemini AI)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Ideas  │
│  (5 ideas)      │
└────────┬────────┘
         │
         ▼ (Solo ideas habilitadas ✓)
┌─────────────────┐
│ Create Scripts  │
│  (3 scripts)    │
└─────────────────┘
```

### Conexión entre Nodos

1. **Brand Research → AI Analysis**
   - **Input**: Datos de marca completos
   - **Output**: Análisis AI con insights

2. **AI Analysis → Generate Ideas**
   - **Input**: Análisis AI + Brand Data
   - **Output**: 5 ideas personalizadas

3. **Generate Ideas → Create Scripts**
   - **Input**: Ideas habilitadas (✓) + Brand Data
   - **Output**: Scripts para Sora 2

## 🎛️ Control de Ideas (Toggle)

### Activar/Desactivar Ideas

**Antes de que se generen los scripts**, puedes:

1. **Revisar cada idea generada**
2. **Hacer clic en el checkbox** para desactivar ideas que no te gusten
3. Ideas desactivadas:
   - Aparecen con fondo gris
   - Tienen menor opacidad
   - NO se usarán para crear scripts

**Ejemplo de Uso:**

```
✓ Idea 1: "Unboxing sorpresa" → SE CREARÁ SCRIPT
✓ Idea 2: "Testimonial auténtico" → SE CREARÁ SCRIPT
✗ Idea 3: "Comparación con competencia" → NO SE CREARÁ
✓ Idea 4: "Day in the life" → SE CREARÁ SCRIPT
✗ Idea 5: "Behind the scenes" → NO SE CREARÁ
```

Resultado: Solo se crearán scripts para las ideas 1, 2 y 4.

## ⚙️ Estados del Pipeline

### Estados de los Nodos

| Estado | Color | Icono | Descripción |
|--------|-------|-------|-------------|
| **Pendiente** | Gris | 🔍/🤖/💡/📝 | Aún no ejecutado |
| **En Proceso** | Azul (pulsando) | Icono | Ejecutándose actualmente |
| **Completado** | Verde | ✓ | Ejecutado exitosamente |

### Indicadores Visuales

- **Círculos de nodos**: Cambian de color según el estado
- **Líneas conectoras**: Verde cuando el nodo anterior está completado
- **Botón "Ejecutar"**: Se deshabilita durante la ejecución
- **Animación de "cargando"**: ⚙️ girando en el botón

## 🛠️ Configuración Técnica

### Tiempos de Ejecución

El pipeline incluye pausas entre pasos para mejor UX:

```javascript
Brand Research: Instant (ya completado)
↓ (500ms delay)
AI Analysis: ~5-10 segundos (Gemini API)
↓ (1000ms delay)
Generate Ideas: ~10-15 segundos (Gemini API)
↓ (1000ms delay)
Create Scripts: ~30-45 segundos (Gemini API, 3 scripts en paralelo)
```

**Tiempo total estimado**: 1-2 minutos

### Límites

- **Ideas generadas**: 5 (fijo)
- **Scripts generados**: 3 (primeras 3 ideas habilitadas)
- **Ejecución simultánea**: No permitida (botón deshabilitado)

## 🔍 Debugging

### Verificar Ejecución

1. **Abre DevTools** (F12)
2. Ve a la pestaña **Console**
3. Verás logs durante la ejecución:
   ```
   🤖 Ejecutando análisis AI...
   💡 Generando ideas...
   📝 Creando scripts...
   ```

### Errores Comunes

#### "⚠️ Primero completa el Brand Research"
**Solución**: Ve a Brand Research y guarda los datos primero.

#### "❌ Error en el pipeline: ..."
**Posibles causas**:
- API key de Gemini inválida
- Sin conexión a internet
- Rate limit de Gemini API excedido

**Solución**:
1. Verifica conexión a internet
2. Espera 1 minuto y vuelve a intentar
3. Revisa la console para más detalles

## 💾 Persistencia de Datos

### Datos Guardados Automáticamente

Durante la ejecución del pipeline, se guardan:

1. **Brand Data**: En Brand Research
2. **Enhanced Research**: Análisis AI
3. **Ideas**: Lista completa de ideas
4. **Scripts**: Scripts generados

### Ubicación

Todos los datos se guardan en `localStorage`:

```javascript
localStorage.getItem('ugc_bot_brand_data')
localStorage.getItem('ugc_bot_enhanced_research')
localStorage.getItem('ugc_bot_ideas')
localStorage.getItem('ugc_bot_scripts')
```

### Recuperación

Al recargar la página:
- Los datos guardados persisten
- El pipeline puede re-ejecutarse
- Las ideas y scripts anteriores se mantienen

## 🚦 Flujo Recomendado

### Primera Vez

1. **Brand Research** → Completar todos los campos
2. **Pipeline Auto** → Ejecutar pipeline completo
3. **Revisar ideas** → Desmarcar las que no gusten
4. **Re-ejecutar** solo desde "Create Scripts" (próxima versión)
5. **Copiar scripts** → Usar en Sora 2

### Iteraciones

1. **Modificar Brand Research** → Actualizar datos
2. **Pipeline Auto** → Re-ejecutar para nuevas ideas
3. **Comparar resultados** → Ver diferentes enfoques
4. **Seleccionar mejores** → Activar solo las mejores ideas

## 📊 Ejemplo Completo

### Input (Brand Research)

```javascript
{
  brand_name: "EcoShop",
  brand_domain: "https://www.ecoshop.com",
  category: "E-commerce sostenible",
  uvp: "Productos eco-friendly a precios accesibles",
  audience: "Millennials conscientes del ambiente, 25-35 años",
  pain_points: "Productos sostenibles muy caros",
  competitors: "Amazon Green, The Sustainable Market",
  brand_voice: "Amigable, educativo, inspirador",
  marketing_goals: "Aumentar awareness 40%, 500 leads/mes"
}
```

### Output (Pipeline)

**AI Analysis:**
- Análisis de competencia
- Insights de audiencia
- Recomendaciones estratégicas

**Generated Ideas:**
1. ✓ "Unboxing eco-friendly: La sorpresa sostenible"
2. ✓ "De plástico a papel: Mi cambio en 30 días"
3. ✗ "Comparativa: EcoShop vs Amazon Green" (desactivada)
4. ✓ "Ahorro real: Cuánto gasté en un mes"
5. ✗ "Tour de mi hogar sostenible" (desactivada)

**Generated Scripts:**
- Script para Idea 1
- Script para Idea 2
- Script para Idea 4

## 🔜 Próximas Mejoras

- [ ] Re-ejecutar solo ciertos nodos
- [ ] Guardar múltiples versiones de pipeline
- [ ] Exportar resultados a PDF
- [ ] Programar ejecuciones automáticas
- [ ] Webhooks para notificaciones
- [ ] Integración directa con Sora API

---

**¿Necesitas ayuda?** Consulta [README.md](./README.md) o [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md)
