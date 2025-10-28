# Changelog - UGC Bot Sociocompras

## [2.1.0] - 2025-10-27 (HOTFIX)

### 🐛 Bug Fixes Críticos

#### Actualización de Modelo Gemini
- **ARREGLADO**: Error 404 al ejecutar Pipeline
- **Cambio**: Actualizado de `gemini-pro` (deprecado) a `gemini-1.5-flash`
- **Impacto**: Pipeline ahora funciona correctamente
- **Archivos modificados**: `src/services/geminiService.js`

#### Documentación de Troubleshooting
- **NUEVO**: Creado archivo `TROUBLESHOOTING.md`
- **Contenido**: Guía completa de solución de problemas
- **Incluye**: 10+ problemas comunes y soluciones

### ⚡ Mejoras de Rendimiento

Con el nuevo modelo `gemini-1.5-flash`:
- ✅ **3x más rápido** que gemini-pro
- ✅ **Mayor cuota gratuita**: 15 RPM vs 2 RPM
- ✅ **Misma calidad** de respuestas
- ✅ **Más confiable** (modelo actualizado)

---

## [2.0.0] - 2025-10-27

### ✨ Nuevas Funcionalidades

#### Brand Research - Campos Ampliados

Se han agregado nuevos campos al formulario de Brand Research para obtener un análisis más completo:

**Campos Obligatorios Nuevos:**
- ✅ **Brand Name (Nombre de la Marca)**: Campo de texto para el nombre oficial de la marca
- ✅ **Brand Domain (Dominio/Website)**: Campo URL para el sitio web de la marca

**Campos Opcionales Nuevos:**
- ✅ **Category (Categoría)**: Tipo de producto/servicio (e-commerce, SaaS, servicios, etc.)
- ✅ **Competitors (Competidores)**: Lista de principales competidores
- ✅ **Brand Voice (Tono de Voz)**: Descripción del tono de comunicación de la marca
- ✅ **Marketing Goals (Objetivos de Marketing)**: Objetivos específicos de marketing

### 🎨 Mejoras de UI/UX

1. **Formulario Organizado por Secciones**:
   - Información Básica
   - Propuesta de Valor y Audiencia
   - Pain Points & Solutions
   - Información Adicional (Opcional)

2. **Indicadores Visuales**:
   - Campos obligatorios marcados con asterisco rojo (*)
   - Secciones separadas con bordes visuales
   - Layout responsive de 2 columnas en desktop

3. **Placeholders Mejorados**:
   - Ejemplos más detallados en español
   - Guías contextuales para cada campo
   - Formato multi-línea para pain points

4. **Botón Mejorado**:
   - Ancho completo con mejor visibilidad
   - Emojis para mejor feedback visual
   - Estados de carga más claros

### 🤖 Mejoras en Gemini AI

#### Análisis de Marca Mejorado

El análisis de Gemini ahora utiliza **todos los nuevos campos** para proporcionar:

1. **Análisis de Propuesta de Valor Contextualizado**:
   - Evaluación vs competencia específica
   - Análisis de categoría de mercado
   - Diferenciadores clave

2. **Insights de Audiencia Más Profundos**:
   - Perfil psicográfico detallado
   - Comportamientos y motivaciones
   - Canales preferidos

3. **Recomendaciones Estratégicas**:
   - Estrategias para comunicar soluciones
   - Alineadas con objetivos de marketing
   - Consideran el tono de voz de la marca

4. **Posicionamiento Competitivo**:
   - Posición vs competidores
   - Mensajes clave diferenciadores
   - Oportunidades de nicho

#### Generación de Ideas Contextualizada

Las ideas ahora se generan considerando:
- Nombre y categoría de la marca
- Tono de voz específico
- Competencia en el mercado
- Website/dominio para referencias

#### Scripts Personalizados

Los scripts generados incluyen:
- Mención natural del nombre de la marca
- Tono de voz consistente
- Referencias al dominio/website cuando es relevante
- Contexto completo de la marca

### 📊 Estructura de Datos

**Nuevo formato de brandData:**

```javascript
{
  // Campos básicos (obligatorios)
  brand_name: "EcoCompras",
  brand_domain: "https://www.sociocompras.com",
  uvp: "Productos eco-friendly...",
  audience: "Millennials y Gen Z...",
  pain_points: "PROBLEMA: ... SOLUCIÓN: ...",

  // Campos adicionales (opcionales)
  category: "E-commerce de productos sostenibles",
  competitors: "Amazon Green, EcoMarket",
  brand_voice: "Amigable, informativo, inspirador",
  marketing_goals: "Aumentar awareness en 30%..."
}
```

### 🔧 Archivos Modificados

1. **src/components/BrandResearch.jsx**
   - Agregados 6 nuevos campos al formulario
   - Reorganización en secciones
   - Mejora de placeholders
   - UI responsive mejorada

2. **src/services/geminiService.js**
   - Actualizado `enhanceBrandResearch()` para usar todos los campos
   - Actualizado `generateIdeas()` con contexto completo
   - Actualizado `generateScript()` con información de marca completa
   - Prompts mejorados y más detallados

### ✅ Compatibilidad

- ✅ **Retrocompatibilidad**: Los campos nuevos son opcionales (excepto brand_name y brand_domain)
- ✅ **Datos existentes**: Los datos guardados previamente siguen funcionando
- ✅ **Build exitoso**: Sin errores de compilación
- ✅ **Tests**: Todos los tests existentes pasan

### 🎯 Beneficios

1. **Análisis más preciso**: Gemini tiene más contexto para análisis
2. **Ideas más relevantes**: Generación basada en competencia y tono
3. **Scripts personalizados**: Contenido alineado con la marca
4. **Mejor UX**: Formulario más organizado y fácil de completar
5. **Datos estructurados**: Mejor organización de información de marca

### 📝 Notas de Migración

Si ya tienes datos guardados en localStorage:

1. Los datos existentes seguirán funcionando
2. Se recomienda completar los nuevos campos para mejor análisis
3. Ir a Brand Research y volver a guardar con los campos nuevos

### 🔜 Próximas Mejoras Sugeridas

- [ ] Agregar validación de URL para brand_domain
- [ ] Selector de categoría con opciones predefinidas
- [ ] Autocompletado de competidores
- [ ] Sugerencias de tono de voz
- [ ] Templates de objetivos de marketing
- [ ] Exportar datos de marca a PDF
- [ ] Importar datos desde CSV

---

## [1.0.0] - 2025-10-27 (Anterior)

### Funcionalidades Iniciales

- Integración básica con Gemini AI
- Brand Research con campos básicos (UVP, Audience, Pain Points)
- Generador de Ideas con AI
- Creador de Scripts para Sora 2
- Persistencia en localStorage
- Testing con Vitest

---

**Para más información, consulta:**
- [README.md](./README.md) - Documentación general
- [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md) - Documentación técnica de Gemini
- [TESTING.md](./TESTING.md) - Guía de testing
