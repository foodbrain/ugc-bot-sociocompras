# Sistema de Gestión de Múltiples Marcas - Estado de Implementación

## ✅ COMPLETADO (Commits: 81123b8, 0f46beb)

### 1. Firebase Service (firebaseService.js)
- ✅ Nueva colección `brands` con CRUD completo
  - `createBrand(brandData)` - Crear marca
  - `getAllBrands()` - Listar todas las marcas
  - `getBrand(brandId)` - Obtener marca específica
  - `updateBrand(brandId, updates)` - Actualizar marca
  - `deleteBrand(brandId)` - Eliminar marca

- ✅ Actualización de `brandAnalysis`
  - Ahora requiere `brandId` como parámetro
  - `saveBrandAnalysis(brandId, analysisData)`
  - `getBrandAnalysis(brandId)`
  - `deleteBrandAnalysis(brandId)`

- ✅ Filtrado por marca en colecciones existentes
  - `getIdeas(brandId)` - Filtra ideas por marca
  - `getScripts(brandId)` - Filtra scripts por marca

### 2. Storage Service (storageService.js)
- ✅ Métodos para gestión de marcas:
  - `createBrand(brandData)`
  - `getAllBrands()`
  - `getBrand(brandId)`
  - `updateBrand(brandId, updates)`
  - `deleteBrand(brandId)`

- ✅ Métodos actualizados:
  - `saveBrandAnalysis(brandId, analysisData)`
  - `getBrandAnalysis(brandId)`
  - `getIdeas(brandId)` - Acepta brandId opcional
  - `getScripts(brandId)` - Acepta brandId opcional

### 3. Componentes Nuevos
- ✅ **BrandSelector.jsx** (src/components/BrandSelector.jsx)
  - Lista todas las marcas
  - Selección de marca activa
  - Edición inline de marcas
  - Eliminación con confirmación
  - Botón "Nueva Marca"

- ✅ **BrandResearch.jsx** (ACTUALIZADO)
  - Integra BrandSelector
  - Muestra análisis AI de marca activa
  - Formulario condicional para nueva marca
  - Estado vacío cuando no hay marca seleccionada

---

## ⏳ PENDIENTE DE IMPLEMENTACIÓN

### 4. IdeaGenerator.jsx
**Archivo**: `src/components/IdeaGenerator.jsx`

**Cambios necesarios**:

1. Recibir `activeBrand` como prop:
```javascript
const IdeaGenerator = ({ activeBrand, onOpenWorkspace }) => {
```

2. Incluir `brandId` al guardar ideas (línea ~28):
```javascript
const generateIdeas = async () => {
    setLoading(true);
    try {
        // Verificar que hay marca activa
        if (!activeBrand) {
            alert('⚠️ Por favor selecciona una marca primero');
            return;
        }

        const ideas = await geminiService.generateIdeas(activeBrand, 5, useViralResearch, ideaType);

        // Agregar brandId a cada idea antes de guardar
        const ideasWithBrand = ideas.map(idea => ({
            ...idea,
            brandId: activeBrand.id
        }));

        await storageService.saveIdeas(ideasWithBrand);

        // Cargar ideas filtradas por marca
        const allIdeas = await storageService.getIdeas(activeBrand.id);
        setSavedIdeas(allIdeas.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));

        // ...resto del código
    }
};
```

3. Filtrar ideas por marca al cargar (línea ~13-19):
```javascript
useEffect(() => {
    const loadIdeas = async () => {
        if (activeBrand) {
            const ideas = await storageService.getIdeas(activeBrand.id);
            setSavedIdeas(ideas.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));
        } else {
            setSavedIdeas([]);
        }
    };
    loadIdeas();
}, [activeBrand]);  // Re-cargar cuando cambie la marca activa
```

4. Incluir `brandId` al generar script (línea ~59-66):
```javascript
const generateScriptForIdea = async (idea) => {
    setGeneratingScriptFor(idea.id);
    try {
        const script = await geminiService.generateScript(concept, activeBrand, idea);

        await storageService.saveScript({
            brandId: activeBrand.id,  // <-- AGREGAR ESTO
            ideaId: idea.id,
            ideaTitle: idea.title,
            content: script,
            concept: concept,
            generatedWithAI: true,
            ranking: 0
        });

        alert(`✅ Script generado y guardado para: "${idea.title}"`);
    } catch (error) {
        // ...
    }
};
```

---

### 5. ScriptCreator.jsx
**Archivo**: `src/components/ScriptCreator.jsx`

**Cambios necesarios** (similares a IdeaGenerator):

1. Recibir `activeBrand` como prop

2. Filtrar scripts por marca al cargar:
```javascript
useEffect(() => {
    const loadScripts = async () => {
        if (activeBrand) {
            const scripts = await storageService.getScripts(activeBrand.id);
            setSavedScripts(scripts);
        } else {
            setSavedScripts([]);
        }
    };
    loadScripts();
}, [activeBrand]);
```

3. Incluir `brandId` al guardar scripts manualmente

---

### 6. App.jsx
**Archivo**: `src/App.jsx`

**Cambios necesarios**:

1. Agregar estado para marca activa:
```javascript
const [activeBrand, setActiveBrand] = useState(null);
```

2. Cargar marca activa y datos filtrados al inicio:
```javascript
useEffect(() => {
    const loadData = async () => {
        try {
            // Cargar todas las marcas
            const brands = await storageService.getAllBrands();

            // Si hay marcas, seleccionar la primera como activa
            if (brands.length > 0) {
                const firstBrand = brands[0];
                setActiveBrand(firstBrand);

                // Cargar datos de esa marca
                const savedIdeas = await storageService.getIdeas(firstBrand.id);
                const savedScripts = await storageService.getScripts(firstBrand.id);

                setIdeas(savedIdeas);
                setScripts(savedScripts);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    loadData();
}, []);
```

3. Re-cargar datos cuando cambie la marca activa:
```javascript
useEffect(() => {
    const loadBrandData = async () => {
        if (activeBrand) {
            const savedIdeas = await storageService.getIdeas(activeBrand.id);
            const savedScripts = await storageService.getScripts(activeBrand.id);
            setIdeas(savedIdeas);
            setScripts(savedScripts);
        } else {
            setIdeas([]);
            setScripts([]);
        }
    };

    loadBrandData();
}, [activeBrand]);
```

4. Pasar `activeBrand` y `onBrandChange` a componentes:
```javascript
<BrandResearch
    activeBrand={activeBrand}
    onBrandChange={setActiveBrand}
/>

<IdeaGenerator
    activeBrand={activeBrand}
    setIdeas={setIdeas}
    onOpenWorkspace={handleOpenWorkspace}
/>

<ScriptCreator
    activeBrand={activeBrand}
    setScripts={setScripts}
/>

// Dashboard también puede recibir activeBrand para mostrar info
<Dashboard
    activeBrand={activeBrand}
    ideas={ideas}
    scripts={scripts}
/>
```

5. Eliminar useEffects antiguos que guardaban automáticamente:
```javascript
// ELIMINAR ESTOS useEffects:
// useEffect(() => { storageService.saveBrandData(brandData); }, [brandData]);
// useEffect(() => { storageService.saveIdeas(ideas); }, [ideas]);
// useEffect(() => { storageService.saveScripts(scripts); }, [scripts]);
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [x] Firebase: Crear colección `brands`
- [x] Firebase: Actualizar `brandAnalysis` con brandId
- [x] Firebase: Filtrar `ideas` y `scripts` por brandId
- [x] StorageService: Métodos CRUD para brands
- [x] StorageService: Actualizar métodos para brandId
- [x] Componente: BrandSelector
- [x] Componente: BrandResearch (actualizado)
- [ ] Componente: IdeaGenerator (agregar brandId)
- [ ] Componente: ScriptCreator (agregar brandId)
- [ ] Componente: App.jsx (gestionar activeBrand)
- [ ] Pruebas: Crear múltiples marcas
- [ ] Pruebas: Generar ideas para cada marca
- [ ] Pruebas: Verificar filtrado correcto
- [ ] Pruebas: Eliminar marca y verificar cascade

---

## 🎯 FLUJO DE USUARIO FINAL

1. Usuario abre app → Se cargan todas las marcas
2. Si hay marcas → Primera marca se selecciona automáticamente
3. Usuario ve BrandSelector con todas las marcas
4. Usuario selecciona marca → Se cargan ideas/scripts de esa marca
5. Usuario crea idea → Se guarda con `brandId` de marca activa
6. Usuario genera script → Se guarda con `brandId` de marca activa
7. Usuario cambia de marca → UI se actualiza con datos de nueva marca
8. Usuario crea nueva marca → Se crea, se analiza con AI, se convierte en marca activa
9. Usuario edita marca → Se actualiza en Firebase
10. Usuario elimina marca → Se eliminan datos relacionados (cascade)

---

## 🔥 ESTRUCTURA DE DATOS

### Colección: `brands`
```javascript
{
  id: "auto-generated",
  brand_name: string,
  brand_domain: string,
  category: string,
  uvp: string,
  audience: string,
  pain_points: string,
  competitors: string,
  brand_voice: string,
  marketing_goals: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: `brandAnalysis`
```javascript
{
  id: "auto-generated",
  brandId: string,  // <-- LINK A BRAND
  valueAnalysis: string,
  audienceInsights: string,
  painPointRecommendations: string,
  brandPositioning: string,
  ugcOpportunities: array,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: `ideas`
```javascript
{
  id: "auto-generated",
  brandId: string,  // <-- LINK A BRAND (AGREGAR EN IDEAS NUEVAS)
  title: string,
  description: string,
  hook: string,
  type: string,
  viralPotential: string,
  ranking: number,
  // ... otros campos
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: `scripts`
```javascript
{
  id: "auto-generated",
  brandId: string,  // <-- LINK A BRAND (AGREGAR EN SCRIPTS NUEVOS)
  ideaId: string,
  ideaTitle: string,
  content: string,
  concept: string,
  generatedWithAI: boolean,
  ranking: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🚀 PRÓXIMOS PASOS

1. Actualizar `IdeaGenerator.jsx` según instrucciones arriba
2. Actualizar `ScriptCreator.jsx` según instrucciones arriba
3. Actualizar `App.jsx` según instrucciones arriba
4. Probar flujo completo
5. Commit final

---

**Estado actual**: Commits 81123b8 y 0f46beb pushed to GitHub
**Próximo commit**: Actualizar IdeaGenerator, ScriptCreator y App.jsx
