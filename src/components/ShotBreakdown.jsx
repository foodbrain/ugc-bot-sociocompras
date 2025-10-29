import React, { useState } from 'react';
import { TRANSITIONS } from '../utils/soraFramework';
import { mediaGenerationService } from '../services/mediaGenerationService';

const ShotBreakdown = ({ script, scriptId }) => {
    const [shots, setShots] = useState([]);
    const [generatingImage, setGeneratingImage] = useState(null);
    const [generatingVideo, setGeneratingVideo] = useState(null);

    React.useEffect(() => {
        if (!script) return;

        // Extraer SOLO la sección "Prompt para Sora 2:"
        const soraPromptMatch = script.match(/\*\*Prompt para Sora 2:\*\*\s*([\s\S]+?)(?=\n\n\*\*|$)/i);

        if (!soraPromptMatch) {
            // Si no se encuentra la sección específica, no mostrar shots
            setShots([]);
            return;
        }

        const soraPromptSection = soraPromptMatch[1].trim();

        // Dividir por [cut] dentro de la sección de Sora
        const shotTexts = soraPromptSection.split(/\[cut\]/gi).filter(part => part && part.trim() !== '');

        // Crear los shots
        const parsedShots = shotTexts.map((shotText, index) => ({
            id: `shot-${index}`,
            content: shotText.trim(),
            image: null,
            video: null,
            generatingImage: false,
            generatingVideo: false
        }));

        setShots(parsedShots);
    }, [script]);

    const handleGenerateImage = async (shotIndex) => {
        setGeneratingImage(shotIndex);

        try {
            const shot = shots[shotIndex];

            // Generar imagen con Nano Banana
            const result = await mediaGenerationService.generateInfluencerVisual(shot.content);

            // Actualizar el shot con la imagen generada
            const updatedShots = [...shots];
            updatedShots[shotIndex] = {
                ...shot,
                image: result.imageUrl,
                imagePrompt: result.prompt
            };
            setShots(updatedShots);

            alert('✅ Imagen generada con Nano Banana!\n\n(Demo mode)');
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

    if (!script || shots.length === 0) return null;

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">🎬 Desglose de Escenas</h3>
                <span className="text-sm text-gray-500">{shots.length} escenas</span>
            </div>

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