# UGC Bot - Sociocompras.com

Bot de generación de contenido UGC (User Generated Content) optimizado para Sora 2 text-to-video AI, **potenciado por Gemini AI**.

## 🚀 Características Principales

### ✨ Integración con Gemini AI (v3.0.0 - NUEVAS FUNCIONALIDADES)

#### 🔥 **NUEVO**: Investigación de Videos Virales
- **Tendencias actuales**: Analiza videos virales de los últimos 30 días
- **Formatos probados**: GRWM, Before/After, POV, Day in the life, etc.
- **Hooks virales**: "Nobody is talking about...", "Wait for it...", etc.
- **Elementos técnicos**: Duración óptima, ratio 9:16, música trending

#### 💾 **NUEVO**: Sistema de Persistencia y Ranking
- **Ideas guardadas**: Todas las ideas se guardan automáticamente con ranking ⭐ 0-5
- **Scripts guardados**: Scripts persistentes con metadata completa
- **Ordenamiento**: Automático por ranking (mejor a peor)
- **Gestión completa**: Ver, copiar, eliminar, rankear

#### 📝 **NUEVO**: Generación Individual de Scripts
- **Pipeline**: Botón "Generar Script" bajo cada idea
- **Sección Ideas**: Genera scripts bajo demanda para ideas específicas
- **Guardado automático**: Scripts se guardan con vinculación a la idea original

#### 💾 **NUEVO**: Guardar Ideas Seleccionadas del Pipeline
- **Selección flexible**: Checkbox para activar/desactivar ideas
- **Guardado masivo**: Un botón guarda todas las ideas seleccionadas + sus scripts
- **Flujo optimizado**: Pipeline → Revisar → Seleccionar → Guardar → Usar

#### 🤖 Análisis de Marca con IA
- **Insights profundos**: Gemini analiza tu marca y proporciona recomendaciones
- **Contexto completo**: Propuesta de valor, audiencia, pain points
- **Análisis competitivo**: Posicionamiento vs competencia

#### ⚡ Pipeline Automatizado
- **4 pasos**: Research → AI Analysis → Ideas → Scripts
- **Ejecución automática**: Un click ejecuta todo el flujo
- **Visual feedback**: Progreso en tiempo real con círculos animados

## 🛠️ Tech Stack

- **Frontend**: React 18.2
- **Styling**: Tailwind CSS 3.3
- **Build Tool**: Vite 4.4
- **AI Integration**: Google Gemini AI
- **Testing**: Vitest + React Testing Library
- **State Management**: React Hooks + localStorage

## 📦 Instalación

```bash
# Navegar al directorio del proyecto
cd ugc-bot-sociocompras

# Instalar todas las dependencias (incluyendo dev)
npm install --include=dev

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

El servidor de desarrollo se iniciará en `http://localhost:5173`

## 🔑 Configuración de Gemini AI

La API key de Gemini ya está configurada. Si necesitas usar tu propia key:

1. Abre [src/services/geminiService.js](src/services/geminiService.js)
2. Modifica la constante `API_KEY`:

```javascript
const API_KEY = 'TU_API_KEY_AQUI';
```

## 📖 Guía de Uso

### 1️⃣ Brand Research (Investigación de Marca)

1. Navega a **Brand Research**
2. Completa el formulario organizado en secciones:

   **📋 Información Básica** (Obligatorio):
   - **Brand Name**: Nombre de tu marca
   - **Brand Domain**: URL de tu website
   - **Category**: Categoría de producto/servicio (opcional)

   **💎 Propuesta de Valor y Audiencia** (Obligatorio):
   - **Unique Value Proposition (UVP)**: Tu propuesta de valor única
   - **Target Audience**: Descripción detallada de tu audiencia objetivo

   **⚡ Pain Points & Solutions** (Obligatorio):
   - **Puntos de Dolor y Soluciones**: Problemas que resuelves y cómo

   **📊 Información Adicional** (Opcional):
   - **Competitors**: Principales competidores
   - **Brand Voice**: Tono de comunicación de tu marca
   - **Marketing Goals**: Objetivos específicos de marketing

3. Haz clic en **"Guardar y Analizar con AI"**
4. Gemini generará un análisis completo considerando TODOS los campos con:
   - Análisis profundo de propuesta de valor vs competencia
   - Insights psicográficos de la audiencia
   - Recomendaciones estratégicas para pain points
   - Posicionamiento de marca sugerido
   - 5-7 oportunidades específicas de contenido UGC

**💡 Nota**: Los datos se guardan automáticamente en localStorage y persisten entre sesiones. Cuantos más campos completes, más preciso será el análisis de AI.

### 2️⃣ Idea Generator (Generador de Ideas) 🆕

1. Navega a **Idea Generator**
2. **NUEVO**: Activa/desactiva "🔥 Usar investigación de videos virales"
   - ✅ Activado (recomendado): Ideas basadas en tendencias virales de los últimos 30 días
   - ❌ Desactivado: Ideas creativas generales
3. Haz clic en **"🔥 Generar 5 Ideas Virales con AI"**
4. Gemini creará 5 ideas personalizadas con:
   - Título llamativo
   - Descripción detallada (incluye tendencia viral si aplica)
   - Hook para los primeros 3 segundos
   - Potencial viral (alto/medio/bajo)
   - **NUEVO**: 🔥 Tendencia Viral utilizada (ej: GRWM, Before/After, POV)

**Gestión de Ideas Guardadas**:
- **Ver todas las ideas**: Sección "Ideas Guardadas" con lista completa
- **Rankear**: Asigna de 0 a 5 estrellas ⭐
- **Generar Script**: Click en "📝 Generar Script" bajo cada idea
- **Eliminar**: Click en "🗑️ Eliminar" para borrar
- **Ordenamiento**: Automático por ranking (mayor a menor)

Las ideas se guardan automáticamente en localStorage.

### 3️⃣ Script Creator (Creador de Scripts) 🆕

**Opción A: Crear Script Manual**
1. Navega a **Script Creator**
2. Ingresa un concepto de video (ej: "Una mujer descubre un producto que cambia su rutina")
3. Marca/desmarca **"Usar Gemini AI"** (recomendado activar)
4. Haz clic en **"✨ Generar Script con AI"**
5. El script se guarda automáticamente

**Opción B: Desde una Idea Guardada** 🆕
1. Ve a **Idea Generator** → "Ideas Guardadas"
2. Encuentra la idea que te gusta
3. Click en **"📝 Generar Script"**
4. El script se genera y guarda automáticamente vinculado a la idea

**Gestión de Scripts Guardados**:
- **Ver todos los scripts**: Sección "Scripts Guardados" con lista completa
- **Rankear**: Asigna de 0 a 5 estrellas ⭐
- **Ver Script**: Click en "👁️ Ver Script" para ver completo
- **Copiar**: Click en "📋 Copiar" para copiar al portapapeles
- **Eliminar**: Click en "🗑️ Eliminar" para borrar
- **Ordenamiento**: Automático por ranking (mayor a menor)

Cada script incluye:
- Estructura de 3 actos (Hook, Action, Reaction)
- Especificaciones técnicas de cada toma
   - Movimientos de cámara y composición
   - Iluminación y ambiente
   - Detalles de estilo UGC auténtico

**✨ Ventaja AI**: Los scripts generados con Gemini incluyen contexto de tu marca y son más personalizados.

### 4️⃣ Pipeline Auto (Workflow Automatizado) 🆕

**Flujo completo automatizado en un click**:

1. Navega a **🚀 Pipeline Auto**
2. Asegúrate de haber completado **Brand Research** primero
3. Click en **"▶️ Ejecutar Pipeline"**
4. Observa la ejecución automática de 4 pasos:
   - ✅ **Brand Research**: Validación de datos
   - 🤖 **AI Analysis**: Gemini analiza tu marca
   - 💡 **Generate Ideas**: Se generan 5 ideas automáticamente
   - 📝 **Create Scripts**: Se crean scripts para las 3 primeras ideas

**Gestión de Ideas en el Pipeline** 🆕:
- **Checkboxes**: Marca/desmarca ideas que te gustan
- **Generar Scripts Individuales**: Click en "📝 Generar Script" bajo cada idea
- **Guardar Selección**: Click en "💾 Guardar Ideas Seleccionadas"
  - Guarda solo las ideas marcadas
  - Guarda sus scripts correspondientes
  - Disponibles en secciones "Ideas" y "Scripts"

**Visualización**:
- Círculos animados muestran progreso en tiempo real
- Líneas verdes conectan pasos completados
- Ideas mostradas con checkbox y potencial viral
- Scripts generados con botón copiar

### 5️⃣ Dashboard

Visualiza el progreso general:
- Estado de la investigación de marca
- Cantidad de ideas generadas (total guardadas)
- Cantidad de scripts creados (total guardados)

## 🧪 Testing

El proyecto incluye testing automatizado:

```bash
# Ejecutar todos los tests
npm test

# Modo watch (auto-reejecutar)
npm test -- --watch

# Interfaz UI de tests
npm run test:ui

# Tests con cobertura de código
npm run test:coverage
```

Ver [TESTING.md](./TESTING.md) para más información.

## 📁 Estructura del Proyecto

```
ugc-bot-sociocompras/
├── src/
│   ├── components/              # Componentes React
│   │   ├── Dashboard.jsx        # Vista principal
│   │   ├── BrandResearch.jsx    # Formulario de investigación (6 campos)
│   │   ├── IdeaGenerator.jsx    # Generador de ideas + viral research 🆕
│   │   ├── ScriptCreator.jsx    # Creador de scripts + gestión 🆕
│   │   ├── Pipeline.jsx         # Pipeline automatizado 🆕
│   │   └── ShotBreakdown.jsx    # Desglose de tomas
│   ├── services/                # Servicios
│   │   ├── geminiService.js     # Integración Gemini AI + viral research 🆕
│   │   └── storageService.js    # Persistencia localStorage + CRUD 🆕
│   ├── utils/                   # Utilidades
│   │   ├── soraFramework.js     # Framework de elementos Sora
│   │   └── promptGenerator.js   # Generador local
│   ├── test/                    # Tests y setup
│   ├── App.jsx                  # Componente raíz
│   └── main.jsx                 # Entry point
├── vitest.config.js             # Config de testing
├── tailwind.config.js           # Config de Tailwind
├── package.json
├── README.md
└── TESTING.md                   # Guía de testing
```

## 🎯 Flujos de Trabajo Recomendados

### Flujo 1: Pipeline Automático (Recomendado) 🆕
1. **Brand Research** → Completar formulario con datos de marca
2. **Pipeline Auto** → Click en "▶️ Ejecutar Pipeline"
3. **Revisar Ideas** → Desmarcar ideas que no te gustan
4. **Generar Scripts Adicionales** → Click en "📝 Generar Script" en ideas específicas
5. **Guardar Selección** → Click en "💾 Guardar Ideas Seleccionadas"
6. **Usar en Producción** → Ir a "Scripts" → Copiar → Pegar en Sora 2

### Flujo 2: Generación Manual con Viral Research 🆕
1. **Brand Research** → Completar formulario
2. **Ideas** → Activar "🔥 Usar investigación viral" → Generar
3. **Rankear** → Asignar estrellas (0-5) a las mejores ideas
4. **Scripts** → Click en "📝 Generar Script" desde cada idea
5. **Rankear Scripts** → Asignar estrellas (0-5) a los mejores scripts
6. **Exportar** → Copiar scripts rankeados para usar

### Flujo 3: Rápido (Ideas Simples)
1. **Ideas** → Desactivar viral research → Generar
2. **Scripts** → Generar scripts desde las ideas
3. **Copiar y Usar** → Scripts listos para Sora 2

## 💾 Datos Almacenados

Los siguientes datos se guardan en `localStorage`:

| Key | Contenido |
|-----|-----------|
| `ugc_bot_brand_data` | Información de marca |
| `ugc_bot_ideas` | Ideas generadas |
| `ugc_bot_scripts` | Scripts creados |
| `ugc_bot_enhanced_research` | Análisis AI de marca |

**Limpiar todos los datos:**
```javascript
localStorage.clear();
```

## 🤖 Capacidades de Gemini AI

### Brand Research Enhancement
- Análisis profundo de propuesta de valor
- Insights sobre audiencia objetivo
- Recomendaciones estratégicas
- Identificación de oportunidades UGC

### Idea Generation 🆕
- Ideas alineadas con tu propuesta de valor
- Contenido que resuena con tu audiencia
- Evaluación de potencial viral
- Hooks efectivos para primeros 3 segundos
- **NUEVO**: Investigación de videos virales de últimos 30 días
- **NUEVO**: Tendencias de TikTok e Instagram Reels
- **NUEVO**: Formatos probados (GRWM, Before/After, POV, etc.)

### Script Generation
- Scripts técnicamente precisos para Sora 2
- Estilo UGC auténtico y natural
- Optimización para engagement
- Contexto de marca integrado
- **NUEVO**: Vinculación automática con ideas
- **NUEVO**: Persistencia y gestión completa

## 🆘 Solución de Problemas

### Error al generar con AI

Si obtienes errores al usar Gemini:

1. ✅ Verifica tu conexión a internet
2. ✅ Confirma que la API key sea válida
3. ✅ Como alternativa, desmarca "Usar Gemini AI" para usar el generador local

### Datos no se guardan

1. ✅ Verifica que localStorage esté habilitado
2. ✅ No uses modo incógnito
3. ✅ Revisa la consola del navegador para errores

### Build falla

```bash
# Reinstalar dependencias
npm install --include=dev

# Si persiste, limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install --include=dev
npm run build
```

### Dependencias no se instalan

Si `npm install` solo instala 6 paquetes:

```bash
# Usar flag --include=dev explícitamente
npm install --include=dev
```

## 📊 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Ejecutar tests |
| `npm run test:ui` | Ejecutar tests con UI |
| `npm run test:coverage` | Tests con cobertura |

## 🔒 Seguridad

- La API key de Gemini está expuesta en el frontend (solo para desarrollo/demo)
- Para producción, considera usar variables de entorno y un backend proxy
- Los datos se almacenan solo localmente en el navegador

## 📝 Notas Importantes

- ✅ Requiere conexión a internet para usar Gemini AI
- ✅ Los scripts están optimizados específicamente para Sora 2
- ✅ Se recomienda revisar y ajustar scripts según necesidad
- ✅ Los datos persisten solo en el navegador actual
- ✅ Funciona mejor en Chrome/Edge modernos

## 📄 Licencia

Proyecto privado para Sociocompras.com

---

## 🎉 Novedades v3.0.0

Ver [NUEVAS_FUNCIONALIDADES.md](./NUEVAS_FUNCIONALIDADES.md) para documentación completa de todas las nuevas features.

**Highlights**:
- 🔥 Investigación de videos virales (últimos 30 días)
- 💾 Sistema de persistencia y ranking (0-5 estrellas)
- 📝 Generación individual de scripts por idea
- 💾 Botón "Guardar Ideas Seleccionadas" en Pipeline
- 📊 Gestión completa de ideas y scripts guardados
- ⭐ Ordenamiento automático por ranking

**Total**: +482 líneas de código | Build: 214.43 KB | Estado: ✅ Funcionando

---

**Desarrollado con ❤️ y potenciado por Gemini AI (gemini-2.0-flash-exp)**
