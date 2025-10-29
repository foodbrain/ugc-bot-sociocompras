import React, { useState, useEffect } from 'react';
import { generateScript } from '../utils/promptGenerator';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import ShotBreakdown from './ShotBreakdown';

const ScriptCreator = ({ activeBrand, setScripts }) => {
    const [concept, setConcept] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [useAI, setUseAI] = useState(true);
    const [savedScripts, setSavedScripts] = useState([]);
    const [selectedScript, setSelectedScript] = useState(null);

    useEffect(() => {
        // Cargar scripts guardados filtrados por marca activa
        const loadScripts = async () => {
            if (activeBrand) {
                const scripts = await storageService.getScripts(activeBrand.id);
                setSavedScripts(scripts.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));
            } else {
                setSavedScripts([]);
            }
        };
        loadScripts();
    }, [activeBrand]);

    const handleGenerate = async () => {
        if (!concept) {
            alert('Por favor ingresa un concepto de video primero.');
            return;
        }

        if (!activeBrand) {
            alert('⚠️ Por favor selecciona una marca primero');
            return;
        }

        setLoading(true);
        try {
            let script;
            if (useAI) {
                script = await geminiService.generateScript(concept, activeBrand);
            } else {
                script = generateScript(concept);
            }

            setGeneratedScript(script);

            // Guardar script automáticamente con brandId
            await storageService.saveScript({
                brandId: activeBrand.id,
                concept: concept,
                content: script,
                generatedWithAI: useAI,
                ranking: 0
            });

            // Actualizar lista filtrada por marca
            const allScripts = await storageService.getScripts(activeBrand.id);
            setSavedScripts(allScripts.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));

            if (setScripts) {
                setScripts(allScripts);
            }

            alert('✅ Script generado y guardado exitosamente!');
        } catch (error) {
            console.error('Error generating script:', error);
            alert('❌ Error al generar el script. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToClipboard = (scriptContent) => {
        if (scriptContent) {
            navigator.clipboard.writeText(scriptContent).then(() => {
                alert('✅ Script copiado al portapapeles!');
            }, (err) => {
                alert('❌ Error al copiar: ', err);
            });
        }
    };

    const updateRanking = async (scriptId, newRanking) => {
        await storageService.updateScript(scriptId, { ranking: newRanking });
        const updatedScripts = await storageService.getScripts(activeBrand.id);
        setSavedScripts(updatedScripts.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));
    };

    const deleteScript = async (scriptId) => {
        if (confirm('¿Estás seguro de eliminar este script?')) {
            await storageService.deleteScript(scriptId);
            const updatedScripts = await storageService.getScripts(activeBrand.id);
            setSavedScripts(updatedScripts);
            if (selectedScript?.id === scriptId) {
                setSelectedScript(null);
            }
        }
    };

    const viewScript = (script) => {
        setSelectedScript(script);
        setGeneratedScript(script.content);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">📝 Creador de Scripts</h2>
            <div className="bg-white p-6 shadow rounded">
                <div className="mb-4">
                    <label htmlFor="concept" className="block text-sm font-medium text-gray-700 mb-1">Concepto del Video</label>
                    <input
                        type="text"
                        id="concept"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="Ej: Una mujer descubre un producto increíble que soluciona su problema"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="useAI"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useAI" className="ml-2 block text-sm text-gray-700">
                        Usar Gemini AI (recomendado para mejores resultados)
                    </label>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? '⏳ Generando con AI...' : useAI ? '✨ Generar Script con AI' : 'Generar Script'}
                </button>
            </div>

            {/* Scripts Guardados */}
            {savedScripts.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Scripts Guardados ({savedScripts.length})</h3>
                    <div className="space-y-4">
                        {savedScripts.map((script) => (
                            <div key={script.id} className="bg-white p-4 shadow rounded border-l-4 border-purple-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {script.ideaTitle || script.concept?.substring(0, 60) + '...'}
                                            </h4>
                                            {script.generatedWithAI && (
                                                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                                    ✨ AI
                                                </span>
                                            )}
                                        </div>

                                        {script.ideaTitle && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                💡 Basado en idea: {script.ideaTitle}
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-500 mb-3">
                                            {script.concept?.substring(0, 150)}...
                                        </p>

                                        <div className="flex gap-2 mb-2">
                                            <button
                                                onClick={() => viewScript(script)}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            >
                                                👁️ Ver Script
                                            </button>
                                            <button
                                                onClick={() => handleCopyToClipboard(script.content)}
                                                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                                            >
                                                📋 Copiar
                                            </button>
                                            <button
                                                onClick={() => deleteScript(script.id)}
                                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col gap-2 items-end">
                                        {/* Ranking */}
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Ranking:</label>
                                            <select
                                                value={script.ranking || 0}
                                                onChange={(e) => updateRanking(script.id, parseInt(e.target.value))}
                                                className="border rounded px-2 py-1 text-sm"
                                            >
                                                <option value="0">⭐ 0</option>
                                                <option value="1">⭐ 1</option>
                                                <option value="2">⭐⭐ 2</option>
                                                <option value="3">⭐⭐⭐ 3</option>
                                                <option value="4">⭐⭐⭐⭐ 4</option>
                                                <option value="5">⭐⭐⭐⭐⭐ 5</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {script.timestamp && (
                                    <div className="mt-2 text-xs text-gray-400">
                                        Creado: {new Date(script.timestamp).toLocaleString('es-ES')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {savedScripts.length === 0 && (
                <div className="mt-6 text-center text-gray-400 p-8 border-2 border-dashed rounded">
                    No hay scripts guardados. ¡Genera tu primer script con AI!
                </div>
            )}

            {/* Vista del Script Generado */}
            {generatedScript && (
                <div className="mt-6 bg-white p-6 shadow rounded">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">
                            {selectedScript ? 'Script Guardado' : 'Script Generado para Sora 2'}
                        </h3>
                        <button
                            onClick={() => handleCopyToClipboard(generatedScript)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                        >
                            📋 Copiar al Portapapeles
                        </button>
                    </div>
                    {(selectedScript?.generatedWithAI || useAI) && (
                        <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                            <span className="text-sm text-green-700 font-medium">✨ Generado con Gemini AI</span>
                        </div>
                    )}
                    <textarea
                        readOnly
                        value={generatedScript}
                        className="w-full h-64 p-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                    />
                    <ShotBreakdown script={generatedScript} activeBrand={activeBrand} />
                </div>
            )}
        </div>
    );
};

export default ScriptCreator;
