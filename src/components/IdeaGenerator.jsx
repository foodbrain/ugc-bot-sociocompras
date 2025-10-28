import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

const IdeaGenerator = ({ setIdeas, onOpenWorkspace }) => {
    const [loading, setLoading] = useState(false);
    const [savedIdeas, setSavedIdeas] = useState([]);
    const [generatingScriptFor, setGeneratingScriptFor] = useState(null);
    const [useViralResearch, setUseViralResearch] = useState(true);
    const [ideaType, setIdeaType] = useState(null); // null = general, 'UGC' = UGC con AI influencer

    useEffect(() => {
        // Cargar ideas guardadas al montar el componente
        const loadIdeas = async () => {
            const ideas = await storageService.getIdeas();
            setSavedIdeas(ideas.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));
        };
        loadIdeas();
    }, []);

    const generateIdeas = async () => {
        setLoading(true);
        try {
            const brandData = storageService.getBrandData();
            const ideas = await geminiService.generateIdeas(brandData, 5, useViralResearch, ideaType);

            // Guardar ideas automáticamente
            const savedNewIdeas = await storageService.addMultipleIdeas(ideas);

            // Actualizar la lista
            const allIdeas = await storageService.getIdeas();
            setSavedIdeas(allIdeas.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));

            if (setIdeas) {
                setIdeas(allIdeas);
            }

            const researchType = useViralResearch ? ' basadas en tendencias virales de los últimos 30 días' : '';
            const typeText = ideaType === 'UGC' ? ' tipo UGC con AI Influencer' : '';
            alert(`✅ 5 nuevas ideas${typeText}${researchType} generadas y guardadas con AI!`);
        } catch (error) {
            console.error('Error generating ideas:', error);
            alert('❌ Error al generar ideas. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const generateScriptForIdea = async (idea) => {
        setGeneratingScriptFor(idea.id);
        try {
            const brandData = storageService.getBrandData();
            const concept = `${idea.title}\n\n${idea.description}\n\nHook: ${idea.hook}`;

            // Pasar el objeto idea completo para que generateScript pueda detectar tipo UGC
            const script = await geminiService.generateScript(concept, brandData, idea);

            // Guardar el script
            const savedScript = storageService.addScript({
                ideaId: idea.id,
                ideaTitle: idea.title,
                content: script,
                concept: concept
            });

            alert(`✅ Script generado y guardado para: "${idea.title}"`);
        } catch (error) {
            console.error('Error generating script:', error);
            alert('❌ Error al generar script. Intenta de nuevo.');
        } finally {
            setGeneratingScriptFor(null);
        }
    };

    const updateRanking = async (ideaId, newRanking) => {
        await storageService.updateIdeaRanking(ideaId, newRanking);
        const updatedIdeas = await storageService.getIdeas();
        setSavedIdeas(updatedIdeas.sort((a, b) => (b.ranking || 0) - (a.ranking || 0)));
    };

    const deleteIdea = async (ideaId) => {
        if (confirm('¿Estás seguro de eliminar esta idea?')) {
            await storageService.deleteIdea(ideaId);
            const updatedIdeas = await storageService.getIdeas();
            setSavedIdeas(updatedIdeas);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">💡 Generador de Ideas</h2>
            <div className="bg-white p-6 shadow rounded">
                <p className="text-gray-600 mb-4">
                    Genera ideas de contenido UGC personalizadas basadas en tu investigación de marca usando Gemini AI.
                </p>

                {/* Selector de tipo de idea */}
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        🎬 Tipo de Idea
                    </label>
                    <select
                        value={ideaType || ''}
                        onChange={(e) => setIdeaType(e.target.value || null)}
                        className="w-full p-2 border border-blue-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">General (Ideas variadas de UGC)</option>
                        <option value="UGC">UGC con AI Influencer (3 frames + influencer)</option>
                    </select>
                    {ideaType === 'UGC' && (
                        <p className="text-xs text-blue-700 mt-2">
                            🎭 Generará ideas con: descripción de AI influencer + estructura de video de 3 frames (face cam, demo, producto)
                        </p>
                    )}
                </div>

                {/* Checkbox para investigación viral */}
                <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <label className="flex items-start cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useViralResearch}
                            onChange={(e) => setUseViralResearch(e.target.checked)}
                            className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">
                                🔥 Usar investigación de videos virales (Últimos 30 días)
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                                Genera ideas basadas en tendencias virales actuales de TikTok e Instagram Reels como GRWM, Before/After, POV, etc.
                            </p>
                        </div>
                    </label>
                </div>

                <button
                    onClick={generateIdeas}
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? '⏳ Generando con AI...' :
                        ideaType === 'UGC' ? '🎭 Generar 5 Ideas UGC con AI Influencer' :
                        useViralResearch ? '🔥 Generar 5 Ideas Virales con AI' :
                        '✨ Generar 5 Ideas con AI'}
                </button>
            </div>

            {savedIdeas.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Ideas Guardadas ({savedIdeas.length})</h3>
                    <div className="space-y-4">
                        {savedIdeas.map((idea) => (
                            <div key={idea.id} className="bg-white p-4 shadow rounded border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
                                            {idea.type === 'UGC' && (
                                                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-semibold">
                                                    🎭 UGC + AI Influencer
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                idea.viralPotential === 'alto' ? 'bg-green-100 text-green-800' :
                                                idea.viralPotential === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                Potencial: {idea.viralPotential}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{idea.description}</p>
                                        <div className="mt-2 p-2 bg-gray-50 rounded">
                                            <span className="text-sm font-medium text-gray-700">Hook: </span>
                                            <span className="text-sm text-gray-600">{idea.hook}</span>
                                        </div>
                                        {idea.viralTrend && (
                                            <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                                                <span className="text-xs font-medium text-purple-700">🔥 Tendencia Viral: </span>
                                                <span className="text-xs text-purple-600">{idea.viralTrend}</span>
                                            </div>
                                        )}
                                        {idea.type === 'UGC' && idea.aiInfluencer && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                                <div className="text-xs font-semibold text-blue-800 mb-2">🎭 AI INFLUENCER</div>
                                                <p className="text-xs text-blue-700 mb-3">{idea.aiInfluencer}</p>

                                                <div className="text-xs font-semibold text-blue-800 mb-2">🎬 VIDEO STRUCTURE (3 FRAMES)</div>
                                                <div className="space-y-2">
                                                    <div className="p-2 bg-white rounded border border-blue-100">
                                                        <span className="font-medium text-blue-700">📱 Frame 1:</span>
                                                        <p className="text-xs text-gray-600 mt-1">{idea.frame1}</p>
                                                    </div>
                                                    <div className="p-2 bg-white rounded border border-blue-100">
                                                        <span className="font-medium text-blue-700">📦 Frame 2:</span>
                                                        <p className="text-xs text-gray-600 mt-1">{idea.frame2}</p>
                                                    </div>
                                                    <div className="p-2 bg-white rounded border border-blue-100">
                                                        <span className="font-medium text-blue-700">✨ Frame 3:</span>
                                                        <p className="text-xs text-gray-600 mt-1">{idea.frame3}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4 flex flex-col gap-2 items-end">
                                        {/* Ranking */}
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Ranking:</label>
                                            <select
                                                value={idea.ranking || 0}
                                                onChange={(e) => updateRanking(idea.id, parseInt(e.target.value))}
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

                                {/* Botones de acción */}
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    {idea.type === 'UGC' && onOpenWorkspace && (
                                        <button
                                            onClick={() => onOpenWorkspace(idea.id)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 font-semibold"
                                        >
                                            🎬 Open Workspace
                                        </button>
                                    )}
                                    <button
                                        onClick={() => generateScriptForIdea(idea)}
                                        disabled={generatingScriptFor === idea.id}
                                        className={`px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 ${
                                            generatingScriptFor === idea.id ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {generatingScriptFor === idea.id ? '⏳ Generando...' : '📝 Generar Script'}
                                    </button>
                                    <button
                                        onClick={() => deleteIdea(idea.id)}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>

                                {idea.timestamp && (
                                    <div className="mt-2 text-xs text-gray-400">
                                        Creada: {new Date(idea.timestamp).toLocaleString('es-ES')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {savedIdeas.length === 0 && (
                <div className="mt-6 text-center text-gray-400 p-8 border-2 border-dashed rounded">
                    No hay ideas guardadas. ¡Genera tu primera idea con AI!
                </div>
            )}
        </div>
    );
};

export default IdeaGenerator;
