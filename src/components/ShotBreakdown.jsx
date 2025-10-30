import React, { useState, useEffect } from 'react';
import { TRANSITIONS } from '../utils/soraFramework';
import { mediaGenerationService } from '../services/mediaGenerationService';
import { firebaseService } from '../services/firebaseService';

const ShotBreakdown = ({ script, scriptId, activeBrand }) => {
    const [shots, setShots] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [generatingCharacter, setGeneratingCharacter] = useState(null);
    const [generatingImage, setGeneratingImage] = useState(null);
    const [generatingVideo, setGeneratingVideo] = useState(null);
    const [showBreakdown, setShowBreakdown] = useState(false);

    // Detectar personajes en el script
    const detectCharacters = (scriptText) => {
        const characters = [];

        // Buscar patrones comunes de personajes
        const patterns = [
            /(\d+)\s*(office worker|worker|person|people|woman|man|women|men|influencer|customer|client|user)/gi,
            /(a|an|the)\s+(young|middle-aged|old)?\s*(woman|man|person|influencer|customer|client)/gi,
            /AI\s+influencer/gi,
            /UGC\s+creator/gi
        ];

        patterns.forEach(pattern => {
            const matches = scriptText.matchAll(pattern);
            for (const match of matches) {
                const fullMatch = match[0];
                if (!characters.some(c => c.description.toLowerCase().includes(fullMatch.toLowerCase()))) {
                    characters.push({
                        id: `char-${characters.length}`,
                        description: fullMatch.trim(),
                        image: null
                    });
                }
            }
        });

        // Si no se detectan personajes específicos pero es UGC, crear un personaje genérico
        if (characters.length === 0 && /UGC|influencer/i.test(scriptText)) {
            characters.push({
                id: 'char-0',
                description: 'UGC Creator',
                image: null
            });
        }

        return characters.slice(0, 5); // Máximo 5 personajes
    };

    const parseScript = () => {
        if (!script) return;

        // Buscar sección del prompt de Sora - buscar múltiples variaciones del título
        const soraPatterns = [
            /\*\*Prompt para Sora 2:\*\*\s*([\s\S]+?)$/im,
            /\*\*Prompt Completo (?:Optimizado )?para Sora 2[:\s]*(?:\(Texto Continuo\))?\*\*\s*([\s\S]+?)$/im,
            /Prompt para Sora 2:\s*([\s\S]+?)$/im
        ];

        let soraPromptSection = null;
        for (const pattern of soraPatterns) {
            const match = script.match(pattern);
            if (match) {
                soraPromptSection = match[1].trim();
                console.log('✅ Found Sora section with pattern:', pattern.toString());
                break;
            }
        }

        if (!soraPromptSection) {
            console.warn('❌ No se encontró la sección de prompt para Sora 2 en el script');
            console.log('Script preview:', script.substring(0, 500));
            setShots([]);
            setCharacters([]);
            return;
        }

        console.log('📝 Sora Prompt Section Length:', soraPromptSection.length, 'characters');

        // Detectar personajes
        const detectedCharacters = detectCharacters(soraPromptSection);
        console.log('👥 Detected characters:', detectedCharacters.length);
        setCharacters(detectedCharacters);

        // Dividir escenas - soportar [cut] y [Cut] (mayúscula/minúscula)
        const cutPattern = /\[cut\]/gi; // Case insensitive

        if (!soraPromptSection.match(cutPattern)) {
            console.warn('❌ No se encontraron marcadores [cut] en el prompt');
            console.log('Prompt preview:', soraPromptSection.substring(0, 300));
            setShots([]);
            setCharacters([]);
            return;
        }

        const shotTexts = soraPromptSection
            .split(cutPattern)
            .map(shot => shot.trim())
            .filter(shot => shot.length > 20); // Filtrar shots muy cortos

        console.log('🎬 Shots found:', shotTexts.length);

        // Crear los shots
        const parsedShots = shotTexts.map((shotText, index) => ({
            id: `shot-${index}`,
            content: shotText,
            image: null,
            video: null,
            generatingImage: false,
            generatingVideo: false
        }));

        console.log('✅ Final shots parsed:', parsedShots.length);
        setShots(parsedShots);
        setShowBreakdown(true);
    };

    React.useEffect(() => {
        if (!script) return;

        // Auto-parsear solo si encuentra la sección Sora (cualquier variación)
        const hasSoraPrompt =
            script.includes('**Prompt Completo para Sora 2:**') ||
            script.includes('**Prompt Completo Optimizado para Sora 2') ||
            script.includes('**Prompt para Sora 2:**') ||
            script.includes('Prompt para Sora 2:');

        if (hasSoraPrompt) {
            parseScript();
        }
    }, [script]);

    // Cargar imágenes guardadas desde Firebase
    useEffect(() => {
        const loadSavedMedia = async () => {
            if (!scriptId || shots.length === 0) return;

            try {
                const savedMedia = await firebaseService.getGeneratedMediaForScript(scriptId);
                console.log('📥 Loading saved media from Firebase:', savedMedia.length, 'items');

                // Aplicar imágenes guardadas a los personajes
                const characterMedia = savedMedia.filter(m => m.type === 'character');
                if (characterMedia.length > 0) {
                    setCharacters(prev => {
                        const updated = [...prev];
                        characterMedia.forEach(media => {
                            if (updated[media.characterIndex]) {
                                updated[media.characterIndex] = {
                                    ...updated[media.characterIndex],
                                    image: media.imageUrl,
                                    imagePrompt: media.imagePrompt
                                };
                            }
                        });
                        console.log('✅ Loaded', characterMedia.length, 'character images');
                        return updated;
                    });
                }

                // Aplicar imágenes guardadas a las escenas
                const sceneMedia = savedMedia.filter(m => m.type === 'scene');
                if (sceneMedia.length > 0) {
                    setShots(prev => {
                        const updated = [...prev];
                        sceneMedia.forEach(media => {
                            if (updated[media.shotIndex]) {
                                updated[media.shotIndex] = {
                                    ...updated[media.shotIndex],
                                    image: media.imageUrl,
                                    imagePrompt: media.imagePrompt
                                };
                            }
                        });
                        console.log('✅ Loaded', sceneMedia.length, 'scene images');
                        return updated;
                    });
                }
            } catch (error) {
                console.error('Error loading saved media:', error);
            }
        };

        loadSavedMedia();
    }, [scriptId, shots.length, characters.length]);

    const handleGenerateCharacter = async (charIndex) => {
        setGeneratingCharacter(charIndex);

        try {
            const character = characters[charIndex];

            // Pasar solo la descripción del personaje y el Brand Research completo
            // El servicio se encargará de construir el prompt enriquecido con Gemini
            const result = await mediaGenerationService.generateInfluencerVisual(
                character.description,
                activeBrand // Pasar todo el objeto de Brand Research
            );

            // Actualizar el personaje con la imagen generada
            const updatedCharacters = [...characters];
            updatedCharacters[charIndex] = {
                ...character,
                image: result.imageUrl,
                imagePrompt: result.prompt // Usar el prompt optimizado por Gemini
            };

            console.log('🖼️ Image URL received:', result.imageUrl);
            console.log('📦 Updated character object:', updatedCharacters[charIndex]);

            setCharacters(updatedCharacters);

            // Guardar en Firebase
            if (scriptId) {
                try {
                    await firebaseService.saveGeneratedMedia(scriptId, `character-${charIndex}`, {
                        type: 'character',
                        characterIndex: charIndex,
                        description: character.description,
                        imageUrl: result.imageUrl,
                        imagePrompt: result.prompt,
                        provider: result.service,
                        timestamp: result.timestamp
                    });
                    console.log('💾 Character saved to Firebase');
                } catch (saveError) {
                    console.error('Error saving character to Firebase:', saveError);
                    // No bloquear el flujo si falla el guardado
                }
            }

            console.log('✅ Character generated with optimized prompt:', result.prompt);
            console.log('✅ Characters state updated, length:', updatedCharacters.length);
            alert(`✅ Personaje generado: ${character.description}`);
        } catch (error) {
            console.error('Error generating character:', error);
            alert('❌ Error al generar personaje: ' + error.message);
        } finally {
            setGeneratingCharacter(null);
        }
    };

    const handleGenerateImage = async (shotIndex) => {
        setGeneratingImage(shotIndex);

        try {
            const shot = shots[shotIndex];

            // Generar imagen con servicio configurado (demo, openai, etc.)
            const result = await mediaGenerationService.generateInfluencerVisual(
                shot.content,
                activeBrand // Pasar contexto de marca
            );

            // Actualizar el shot con la imagen generada
            const updatedShots = [...shots];
            updatedShots[shotIndex] = {
                ...shot,
                image: result.imageUrl,
                imagePrompt: result.prompt
            };
            setShots(updatedShots);

            // Guardar en Firebase
            if (scriptId) {
                try {
                    await firebaseService.saveGeneratedMedia(scriptId, `shot-${shotIndex}`, {
                        type: 'scene',
                        shotIndex: shotIndex,
                        content: shot.content,
                        imageUrl: result.imageUrl,
                        imagePrompt: result.prompt,
                        provider: result.service,
                        timestamp: result.timestamp
                    });
                    console.log('💾 Scene image saved to Firebase');
                } catch (saveError) {
                    console.error('Error saving scene to Firebase:', saveError);
                }
            }

            console.log('✅ Scene image generated with optimized prompt:', result.prompt);
            alert('✅ Imagen de escena generada!');
        } catch (error) {
            console.error('Error generating image:', error);
            alert('❌ Error al generar imagen');
        } finally {
            setGeneratingImage(null);
        }
    };

    const handleGenerateVideo = async (shotIndex, useImageAsInput = false) => {
        setGeneratingVideo(shotIndex);

        try {
            const shot = shots[shotIndex];

            const options = {
                duration: 10,
                seed: Date.now()
            };

            // Si hay una imagen generada y el usuario quiere usarla
            if (useImageAsInput && shot.image) {
                options.referenceImage = shot.image;
            }

            // Generar video con Veo 3.1
            const result = await mediaGenerationService.generateVideoFrame(shot.content, options);

            // Actualizar el shot con el video generado
            const updatedShots = [...shots];
            updatedShots[shotIndex] = {
                ...shot,
                video: result.videoUrl,
                thumbnail: result.thumbnailUrl,
                videoPrompt: result.prompt
            };
            setShots(updatedShots);

            alert('✅ Video generado con Veo 3.1!\n\n(Demo mode)');
        } catch (error) {
            console.error('Error generating video:', error);
            alert('❌ Error al generar video');
        } finally {
            setGeneratingVideo(null);
        }
    };

    // Si no hay breakdown, mostrar botón para generarlo manualmente
    if (!script) return null;

    if (!showBreakdown || shots.length === 0) {
        const hasSoraPrompt =
            script.includes('**Prompt Completo para Sora 2:**') ||
            script.includes('**Prompt para Sora 2:**') ||
            script.includes('Prompt para Sora 2:');

        if (!hasSoraPrompt) {
            return null; // No hay sección Sora, no mostrar nada
        }

        return (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🎬 Desglose de Escenas</h3>
                    <p className="text-gray-600 mb-4">
                        Este script contiene un prompt para Sora 2. Haz clic para generar el desglose de escenas y personajes.
                    </p>
                    <button
                        onClick={parseScript}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        🎬 Generar Desglose de Escenas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            {/* Header con botón de regenerar */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold">🎬 Desglose de Escenas</h3>
                    <span className="text-sm text-gray-500">
                        {characters.length > 0 && `${characters.length} personajes • `}
                        {shots.length} escenas
                    </span>
                </div>
                <button
                    onClick={parseScript}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                    🔄 Regenerar
                </button>
            </div>

            {/* Sección de Personajes */}
            {characters.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-purple-900 mb-3">👥 Personajes Detectados</h4>
                    <p className="text-sm text-purple-700 mb-4">
                        Genera los personajes primero para usarlos como referencia en las escenas
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {characters.map((character, index) => (
                            <div
                                key={character.id}
                                className="bg-white border-2 border-purple-200 rounded-lg overflow-hidden hover:border-purple-400 transition-colors"
                            >
                                {/* Character Preview */}
                                <div className="relative bg-purple-100 aspect-square flex items-center justify-center">
                                    {character.image ? (
                                        <img
                                            src={character.image}
                                            alt={character.description}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <span className="text-6xl mb-2 block">👤</span>
                                            <p className="text-xs text-purple-600">No generado</p>
                                        </div>
                                    )}
                                </div>

                                {/* Character Info */}
                                <div className="p-3 bg-white">
                                    <p className="text-sm font-semibold text-gray-800 mb-2">
                                        {character.description}
                                    </p>
                                    <button
                                        onClick={() => handleGenerateCharacter(index)}
                                        disabled={generatingCharacter === index}
                                        className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            character.image
                                                ? 'bg-green-100 text-green-700 border border-green-300'
                                                : 'bg-purple-500 text-white hover:bg-purple-600'
                                        } ${generatingCharacter === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {generatingCharacter === index ? (
                                            <>⏳ Generando...</>
                                        ) : character.image ? (
                                            <>✅ Personaje Generado</>
                                        ) : (
                                            <>🎨 Generar Personaje</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shots.map((shot, index) => (
                    <div
                        key={shot.id}
                        className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 flex items-center justify-between">
                            <span className="text-white font-bold text-sm">
                                🎬 Escena {index + 1}
                            </span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">
                                {shot.image && shot.video ? '✅ Complete' :
                                 shot.image ? '🖼️ Image' :
                                 shot.video ? '🎥 Video' : '⏳ Pending'}
                            </span>
                        </div>

                        {/* Visual Preview */}
                        <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                            {shot.video ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={shot.thumbnail || 'https://via.placeholder.com/400x225?text=Video+Generated'}
                                        alt={`Shot ${index + 1} video thumbnail`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                            <span className="text-3xl">▶️</span>
                                        </div>
                                    </div>
                                </div>
                            ) : shot.image ? (
                                <img
                                    src={shot.image}
                                    alt={`Shot ${index + 1} image`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <span className="text-6xl mb-2 block">📷</span>
                                    <p className="text-xs text-gray-500">No media generated yet</p>
                                </div>
                            )}
                        </div>

                        {/* Prompt Text */}
                        <div className="p-3 bg-gray-50 max-h-24 overflow-y-auto">
                            <p className="text-xs text-gray-700 font-mono leading-relaxed">
                                {shot.content}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                            {/* Generate Image Button */}
                            <button
                                onClick={() => handleGenerateImage(index)}
                                disabled={generatingImage === index}
                                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                    shot.image
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-purple-500 text-white hover:bg-purple-600'
                                } ${generatingImage === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {generatingImage === index ? (
                                    <>⏳ Generating...</>
                                ) : shot.image ? (
                                    <>✅ Image Generated</>
                                ) : (
                                    <>🖼️ Generate Image (Nano Banana)</>
                                )}
                            </button>

                            {/* Generate Video Button */}
                            {shot.image && !shot.video && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleGenerateVideo(index, false)}
                                        disabled={generatingVideo === index}
                                        className={`flex-1 px-3 py-2 bg-pink-500 text-white rounded-md text-xs font-medium hover:bg-pink-600 transition-colors ${
                                            generatingVideo === index ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {generatingVideo === index ? '⏳ Gen...' : '🎥 Video (Text)'}
                                    </button>
                                    <button
                                        onClick={() => handleGenerateVideo(index, true)}
                                        disabled={generatingVideo === index}
                                        className={`flex-1 px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors ${
                                            generatingVideo === index ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {generatingVideo === index ? '⏳ Gen...' : '🎥 Video (Image)'}
                                    </button>
                                </div>
                            )}

                            {!shot.image && (
                                <button
                                    onClick={() => handleGenerateVideo(index, false)}
                                    disabled={generatingVideo === index}
                                    className={`w-full px-3 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600 transition-colors ${
                                        generatingVideo === index ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {generatingVideo === index ? '⏳ Generating...' : '🎥 Generate Video (Veo 3.1)'}
                                </button>
                            )}

                            {shot.video && (
                                <button
                                    className="w-full px-3 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm font-medium"
                                >
                                    ✅ Video Generated
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {shots.filter(s => s.image).length}/{shots.length}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">Images Generated</div>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">
                        {shots.filter(s => s.video).length}/{shots.length}
                    </div>
                    <div className="text-xs text-pink-600 mt-1">Videos Generated</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {Math.round((shots.filter(s => s.image && s.video).length / shots.length) * 100)}%
                    </div>
                    <div className="text-xs text-green-600 mt-1">Completion</div>
                </div>
            </div>
        </div>
    );
};

export default ShotBreakdown;