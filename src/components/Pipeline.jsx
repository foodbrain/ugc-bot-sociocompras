import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

const Pipeline = ({ brandData: activeBrand }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [generatedIdeas, setGeneratedIdeas] = useState([]);
    const [generatedScripts, setGeneratedScripts] = useState([]);
    const [progress, setProgress] = useState({});
    const [generatingScriptFor, setGeneratingScriptFor] = useState(null);

    const steps = [
        { id: 1, name: 'Brand Research', icon: '🔍', status: activeBrand ? 'completed' : 'pending' },
        { id: 2, name: 'AI Analysis', icon: '🤖', status: 'pending' },
        { id: 3, name: 'Generate Ideas', icon: '💡', status: 'pending' },
        { id: 4, name: 'Create Scripts', icon: '📝', status: 'pending' },
    ];

    const runPipeline = async () => {
        if (!activeBrand) {
            alert('⚠️ Primero selecciona una marca en Brand Research');
            return;
        }

        setIsRunning(true);
        setProgress({});
        setGeneratedIdeas([]);
        setGeneratedScripts([]);

        try {
            // Step 1: Brand Research (ya completado)
            setCurrentStep(1);
            setProgress({ 1: 'completed' });
            await sleep(500);

            // Step 2: AI Analysis (verificar si existe, si no, generar)
            setCurrentStep(2);
            setProgress(prev => ({ ...prev, 2: 'running' }));
            console.log('🤖 Verificando análisis AI...');

            let analysis = await storageService.getBrandAnalysis(activeBrand.id);
            if (!analysis) {
                console.log('🤖 Generando nuevo análisis AI...');
                const enhanced = await geminiService.enhanceBrandResearch(activeBrand);
                await storageService.saveBrandAnalysis(activeBrand.id, enhanced);
            }

            setProgress(prev => ({ ...prev, 2: 'completed' }));
            await sleep(1000);

            // Step 3: Generate Ideas
            setCurrentStep(3);
            setProgress(prev => ({ ...prev, 3: 'running' }));
            console.log('💡 Generando ideas...');
            const ideas = await geminiService.generateIdeas(activeBrand, 5);
            const ideasWithIds = ideas.map((idea, index) => ({
                ...idea,
                id: Date.now().toString() + index,
                brandId: activeBrand.id,
                enabled: true,
                timestamp: new Date().toISOString()
            }));
            setGeneratedIdeas(ideasWithIds);
            setProgress(prev => ({ ...prev, 3: 'completed' }));
            await sleep(1000);

            // Step 4: Create Scripts (solo para las primeras 3 ideas)
            setCurrentStep(4);
            setProgress(prev => ({ ...prev, 4: 'running' }));
            console.log('📝 Creando scripts para las primeras 3 ideas...');
            const scriptsPromises = ideasWithIds
                .slice(0, 3)
                .map(idea =>
                    geminiService.generateScript(`${idea.title}\n\n${idea.description}\n\nHook: ${idea.hook}`, activeBrand, idea)
                        .then(script => ({
                            ideaId: idea.id,
                            ideaTitle: idea.title,
                            brandId: activeBrand.id,
                            concept: `${idea.title}\n\n${idea.description}`,
                            content: script,
                            enabled: true
                        }))
                );

            const scripts = await Promise.all(scriptsPromises);
            setGeneratedScripts(scripts);
            setProgress(prev => ({ ...prev, 4: 'completed' }));

            alert('✅ ¡Pipeline completado exitosamente!');
        } catch (error) {
            console.error('Error en pipeline:', error);
            alert('❌ Error en el pipeline: ' + error.message);
        } finally {
            setIsRunning(false);
            setCurrentStep(0);
        }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const toggleIdea = (ideaId) => {
        setGeneratedIdeas(prev =>
            prev.map(idea =>
                idea.id === ideaId ? { ...idea, enabled: !idea.enabled } : idea
            )
        );
    };

    const generateScriptForIdea = async (idea) => {
        setGeneratingScriptFor(idea.id);
        try {
            const concept = `${idea.title}\n\n${idea.description}\n\nHook: ${idea.hook}`;
            const script = await geminiService.generateScript(concept, activeBrand, idea);

            const newScript = {
                ideaId: idea.id,
                ideaTitle: idea.title,
                brandId: activeBrand.id,
                concept: concept,
                content: script,
                enabled: true
            };

            setGeneratedScripts(prev => [...prev, newScript]);
            alert(`✅ Script generado para: "${idea.title}"`);
        } catch (error) {
            console.error('Error generating script:', error);
            alert('❌ Error al generar script. Intenta de nuevo.');
        } finally {
            setGeneratingScriptFor(null);
        }
    };

    const saveSelectedIdeas = async () => {
        const selectedIdeas = generatedIdeas.filter(idea => idea.enabled);

        if (selectedIdeas.length === 0) {
            alert('⚠️ Debes seleccionar al menos una idea para guardar');
            return;
        }

        try {
            // Guardar ideas seleccionadas
            await storageService.saveIdeas(selectedIdeas);

            // Guardar sus scripts correspondientes
            const scriptsToSave = generatedScripts.filter(script =>
                selectedIdeas.some(idea => idea.id === script.ideaId)
            );

            for (const script of scriptsToSave) {
                await storageService.saveScript(script);
            }

            alert(`✅ ${selectedIdeas.length} ideas y ${scriptsToSave.length} scripts guardados!\n\nPuedes verlos en las secciones "Ideas" y "Scripts".`);
        } catch (error) {
            console.error('Error saving ideas/scripts:', error);
            alert('❌ Error al guardar. Intenta de nuevo.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Pipeline Header */}
            <div className="bg-white p-6 shadow rounded">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">🚀 Pipeline de Generación</h2>
                    <button
                        onClick={runPipeline}
                        disabled={isRunning || !activeBrand}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                            isRunning || !activeBrand
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        {isRunning ? (
                            <>
                                <span className="animate-spin">⚙️</span>
                                Ejecutando...
                            </>
                        ) : (
                            <>
                                ▶️ Ejecutar Pipeline
                            </>
                        )}
                    </button>
                </div>

                {/* Pipeline Steps */}
                <div className="relative">
                    <div className="flex justify-between items-center">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex-1 relative">
                                <div className="flex flex-col items-center">
                                    {/* Circle */}
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 ${
                                            progress[step.id] === 'completed'
                                                ? 'bg-green-500 border-green-600 text-white'
                                                : progress[step.id] === 'running' || currentStep === step.id
                                                ? 'bg-blue-500 border-blue-600 text-white animate-pulse'
                                                : activeBrand && step.id === 1
                                                ? 'bg-green-500 border-green-600 text-white'
                                                : 'bg-gray-200 border-gray-300'
                                        }`}
                                    >
                                        {progress[step.id] === 'completed' || (activeBrand && step.id === 1) ? '✓' : step.icon}
                                    </div>

                                    {/* Label */}
                                    <div className="mt-2 text-center">
                                        <div className="text-sm font-medium text-gray-700">{step.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {progress[step.id] === 'running' ? 'En proceso...' :
                                             progress[step.id] === 'completed' ? 'Completado' :
                                             activeBrand && step.id === 1 ? 'Completado' :
                                             'Pendiente'}
                                        </div>
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`absolute top-8 left-1/2 w-full h-1 ${
                                            progress[step.id] === 'completed' || (activeBrand && step.id === 1)
                                                ? 'bg-green-500'
                                                : 'bg-gray-300'
                                        }`}
                                        style={{ transform: 'translateY(-50%)' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Generated Ideas with Toggle */}
            {generatedIdeas.length > 0 && (
                <div className="bg-white p-6 shadow rounded">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">💡 Ideas Generadas (Selecciona las que quieres guardar)</h3>
                        <button
                            onClick={saveSelectedIdeas}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
                        >
                            💾 Guardar Ideas Seleccionadas
                        </button>
                    </div>
                    <div className="space-y-3">
                        {generatedIdeas.map((idea) => (
                            <div
                                key={idea.id}
                                className={`flex items-start gap-4 p-4 border-2 rounded-lg transition-all ${
                                    idea.enabled
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-gray-50 opacity-60'
                                }`}
                            >
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={idea.enabled}
                                        onChange={() => toggleIdea(idea.id)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                </label>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="text-xs text-gray-500">Hook: {idea.hook}</span>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            idea.viralPotential === 'alto'
                                                ? 'bg-green-100 text-green-800'
                                                : idea.viralPotential === 'medio'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            Potencial: {idea.viralPotential}
                                        </span>
                                    </div>
                                    {/* Botón para generar script */}
                                    <div className="mt-3">
                                        <button
                                            onClick={() => generateScriptForIdea(idea)}
                                            disabled={generatingScriptFor === idea.id || !idea.enabled}
                                            className={`px-3 py-1 text-sm rounded ${
                                                generatingScriptFor === idea.id
                                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                                    : idea.enabled
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {generatingScriptFor === idea.id ? '⏳ Generando Script...' : '📝 Generar Script'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Generated Scripts */}
            {generatedScripts.length > 0 && (
                <div className="bg-white p-6 shadow rounded">
                    <h3 className="text-xl font-bold mb-4">📝 Scripts Generados ({generatedScripts.length})</h3>
                    <div className="space-y-4">
                        {generatedScripts.map((script, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{script.ideaTitle}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{script.concept?.substring(0, 100)}...</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(script.content);
                                            alert('✅ Script copiado al portapapeles!');
                                        }}
                                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded ml-4"
                                    >
                                        📋 Copiar
                                    </button>
                                </div>
                                <textarea
                                    readOnly
                                    value={script.content}
                                    className="w-full h-32 p-2 text-sm border border-gray-300 rounded bg-gray-50 font-mono"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pipeline;
