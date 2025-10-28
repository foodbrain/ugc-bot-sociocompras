# Guía de Testing - UGC Bot Sociocompras

## Configuración Completada

Tu proyecto ahora tiene configurado **Vitest** con **React Testing Library** para realizar pruebas automatizadas.

## Estructura de Tests

```
src/
├── test/
│   └── setup.js                    # Configuración global de tests
├── components/
│   ├── Dashboard.jsx
│   └── Dashboard.test.jsx         # Tests del componente Dashboard
└── utils/
    ├── promptGenerator.js
    └── promptGenerator.test.js    # Tests de la función generateScript
```

## Comandos Disponibles

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
```bash
npm test -- --watch
```

### Ejecutar tests con interfaz UI
```bash
npm run test:ui
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

## Integración con VSCode y Testsprite

### Opción 1: Usar Testsprite (Extensión de VSCode)

1. **Instalar la extensión Testsprite:**
   - Abre VSCode
   - Ve a Extensions (Ctrl+Shift+X)
   - Busca "Testsprite"
   - Instala la extensión

2. **Configurar Testsprite:**
   - Una vez instalada, Testsprite detectará automáticamente Vitest
   - Podrás ver los tests en la barra lateral
   - Ejecutar tests individuales haciendo clic
   - Ver resultados en tiempo real

### Opción 2: Usar Vitest Extension (Alternativa recomendada)

1. **Instalar Vitest Extension:**
   - Busca "Vitest" en Extensions
   - Instala la extensión oficial de Vitest
   - Proporciona integración nativa con VSCode

2. **Características:**
   - Ver tests en el explorador de archivos
   - Ejecutar tests individuales con un clic
   - Ver cobertura de código inline
   - Debug de tests directamente en VSCode

### Opción 3: Usar Testing Panel de VSCode (Built-in)

VSCode tiene un panel de testing integrado que funciona con Vitest:

1. **Abrir Testing Panel:**
   - Haz clic en el icono de "Testing" en la barra lateral (icono de matraz)
   - O presiona Ctrl+Shift+T

2. **Usar el Panel:**
   - Verás todos tus tests listados
   - Puedes ejecutarlos individualmente o en grupo
   - Ver resultados y errores
   - Debug directamente desde el panel

## Tests Incluidos

### Tests de Utilidades (promptGenerator.test.js)

- ✓ Validación de entrada (concepto vacío o nulo)
- ✓ Generación de script con concepto válido
- ✓ Inclusión de los tres beats narrativos
- ✓ Inclusión de detalles de iluminación y ambiente
- ✓ Inclusión de estilos finales
- ✓ Limpieza de espacios en blanco
- ✓ Generación de scripts únicos por concepto
- ✓ Inclusión de movimientos de cámara
- ✓ Inclusión de detalles visuales UGC

### Tests de Componentes (Dashboard.test.jsx)

- ✓ Renderizado del título "Dashboard"
- ✓ Mostrar "Pending" cuando no hay brandData
- ✓ Mostrar "Completed" cuando hay brandData
- ✓ Mostrar cantidad correcta de ideas generadas
- ✓ Mostrar cantidad correcta de scripts generados
- ✓ Mostrar ceros cuando no hay datos
- ✓ Renderizar las tres tarjetas de estadísticas
- ✓ Aplicar clases de estilo correctamente

## Crear Nuevos Tests

### Test de Utilidad/Función

```javascript
import { describe, it, expect } from 'vitest';
import { tuFuncion } from './tuArchivo';

describe('Nombre del módulo', () => {
  it('debe hacer algo específico', () => {
    const resultado = tuFuncion('entrada');
    expect(resultado).toBe('esperado');
  });
});
```

### Test de Componente React

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TuComponente from './TuComponente';

describe('TuComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<TuComponente prop="valor" />);

    const elemento = screen.getByText('Texto esperado');
    expect(elemento).toBeInTheDocument();
  });
});
```

## Recursos Adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [Documentación de React Testing Library](https://testing-library.com/react)
- [Guía de Testing de React](https://react.dev/learn/testing)

## Próximos Pasos

1. Crear tests para los componentes restantes:
   - BrandResearch.test.jsx
   - IdeaGenerator.test.jsx
   - ScriptCreator.test.jsx
   - ShotBreakdown.test.jsx

2. Agregar tests de integración para el flujo completo de la aplicación

3. Configurar CI/CD para ejecutar tests automáticamente

4. Agregar cobertura de código y establecer umbrales mínimos
