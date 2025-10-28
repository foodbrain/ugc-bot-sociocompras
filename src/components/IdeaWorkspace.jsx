import React, { useState, useRef, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { mediaGenerationService } from '../services/mediaGenerationService';

const IdeaWorkspace = ({ ideaId, onBack }) => {
    const [idea, setIdea] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [draggingNode, setDraggingNode] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    useEffect(() => {
        // Cargar la idea
        const ideas = storageService.getIdeas();
        const foundIdea = ideas.find(i => i.id === ideaId);
        setIdea(foundIdea);

        if (foundIdea) {
            // Inicializar nodos basados en la idea
            initializeNodes(foundIdea);
        }
    }, [ideaId]);

    const initializeNodes = (ideaData) => {
        const initialNodes = [
            {
                id: 'brief',
                type: 'brief',
                title: 'Creative Brief',
                x: 100,
                y: 100,
                data: {
                    title: ideaData.title,
                    description: ideaData.description,
                    hook: ideaData.hook,
                    viralPotential: ideaData.viralPotential
                }
            }
        ];

        // Si es tipo UGC, agregar nodos específicos
        if (ideaData.type === 'UGC' && ideaData.aiInfluencer) {
            initialNodes.push({
                id: 'influencer',
                type: 'influencer',
                title: 'AI Influencer: "Aura"',
                x: 500,
                y: 100,
                data: {
                    description: ideaData.aiInfluencer,
                    visualGenerated: false
                }
            });

            // Nodo para generar visual del influencer
            initialNodes.push({
                id: 'influencer-visual',
                type: 'image-gen',
                title: 'Generate Influencer Visual',
                x: 900,
                y: 100,
                data: {
                    prompt: '',
                    service: 'nano-banana',
                    status: 'pending'
                }
            });

            // Nodos para los 3 frames
            ['frame1', 'frame2', 'frame3'].forEach((frameId, index) => {
                initialNodes.push({
                    id: frameId,
                    type: 'frame',
                    title: `Frame ${index + 1}`,
                    x: 300,
                    y: 350 + (index * 200),
                    data: {
                        description: ideaData[frameId],
                        duration: '5-10s'
                    }
                });

                // Nodo para generar video de cada frame
                initialNodes.push({
                    id: `${frameId}-video`,
                    type: 'video-gen',
                    title: `Generate Frame ${index + 1} Video`,
                    x: 700,
                    y: 350 + (index * 200),
                    data: {
                        prompt: '',
                        service: 'veo-3.1',
                        status: 'pending'
                    }
                });
            });
        }

        setNodes(initialNodes);

        // Crear conexiones iniciales
        const initialConnections = [];
        if (ideaData.type === 'UGC') {
            initialConnections.push(
                { from: 'brief', to: 'influencer' },
                { from: 'influencer', to: 'influencer-visual' },
                { from: 'brief', to: 'frame1' },
                { from: 'brief', to: 'frame2' },
                { from: 'brief', to: 'frame3' },
                { from: 'frame1', to: 'frame1-video' },
                { from: 'frame2', to: 'frame2-video' },
                { from: 'frame3', to: 'frame3-video' }
            );
        }
        setConnections(initialConnections);
    };

    const handleMouseDown = (e, node) => {
        e.stopPropagation();
        const rect = canvasRef.current.getBoundingClientRect();
        setDraggingNode(node.id);
        setDragOffset({
            x: e.clientX - rect.left - node.x,
            y: e.clientY - rect.top - node.y
        });
    };

    const handleMouseMove = (e) => {
        if (draggingNode) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffset.x;
            const newY = e.clientY - rect.top - dragOffset.y;

            setNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === draggingNode
                        ? { ...node, x: newX, y: newY }
                        : node
                )
            );
        }
    };

    const handleMouseUp = () => {
        setDraggingNode(null);
    };

    const renderNode = (node) => {
        const nodeStyles = {
            brief: 'bg-orange-100 border-orange-400',
            influencer: 'bg-blue-100 border-blue-400',
            'image-gen': 'bg-purple-100 border-purple-400',
            frame: 'bg-green-100 border-green-400',
            'video-gen': 'bg-pink-100 border-pink-400'
        };

        const nodeIcons = {
            brief: '📋',
            influencer: '🎭',
            'image-gen': '🖼️',
            frame: '🎬',
            'video-gen': '🎥'
        };

        return (
            <div
                key={node.id}
                className={`absolute p-4 rounded-lg border-2 shadow-lg cursor-move ${nodeStyles[node.type] || 'bg-gray-100 border-gray-400'}`}
                style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: '280px',
                    zIndex: selectedNode === node.id ? 100 : 10
                }}
                onMouseDown={(e) => handleMouseDown(e, node)}
                onClick={() => setSelectedNode(node.id)}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{nodeIcons[node.type]}</span>
                    <h3 className="font-semibold text-sm">{node.title}</h3>
                </div>

                {node.type === 'brief' && (
                    <div className="text-xs space-y-1">
                        <p className="font-medium">{node.data.title}</p>
                        <p className="text-gray-600 line-clamp-2">{node.data.description}</p>
                        <span className="inline-block px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                            Potential: {node.data.viralPotential}
                        </span>
                    </div>
                )}

                {node.type === 'influencer' && (
                    <div className="text-xs">
                        <p className="text-gray-700 line-clamp-4">{node.data.description}</p>
                    </div>
                )}

                {node.type === 'image-gen' && (
                    <div className="text-xs space-y-2">
                        <p className="text-gray-600">Service: Nano Banana</p>
                        <button
                            className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateImage(node.id);
                            }}
                        >
                            🖼️ Generate Visual
                        </button>
                    </div>
                )}

                {node.type === 'frame' && (
                    <div className="text-xs">
                        <p className="text-gray-700 line-clamp-3">{node.data.description}</p>
                        <p className="text-gray-500 mt-1">Duration: {node.data.duration}</p>
                    </div>
                )}

                {node.type === 'video-gen' && (
                    <div className="text-xs space-y-2">
                        <p className="text-gray-600">Service: Veo 3.1</p>
                        <button
                            className="w-full px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateVideo(node.id);
                            }}
                        >
                            🎥 Generate Video
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderConnections = () => {
        return connections.map((conn, index) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);

            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + 280; // width of node
            const fromY = fromNode.y + 50; // approximate center
            const toX = toNode.x;
            const toY = toNode.y + 50;

            return (
                <line
                    key={`${conn.from}-${conn.to}-${index}`}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />
            );
        });
    };

    const handleGenerateImage = async (nodeId) => {
        console.log('Generate image for node:', nodeId);

        // Actualizar estado del nodo a "generando"
        setNodes(prevNodes =>
            prevNodes.map(node =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, status: 'generating' } }
                    : node
            )
        );

        try {
            // Encontrar el nodo del influencer
            const influencerNode = nodes.find(n => n.id === 'influencer');
            if (!influencerNode) {
                alert('No influencer data found');
                return;
            }

            // Generar imagen con Nano Banana
            const result = await mediaGenerationService.generateInfluencerVisual(
                influencerNode.data.description
            );

            // Actualizar nodo con resultado
            setNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === nodeId
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                status: 'completed',
                                imageUrl: result.imageUrl,
                                prompt: result.prompt
                            }
                        }
                        : node.id === 'influencer'
                        ? { ...node, data: { ...node.data, visualGenerated: true, imageUrl: result.imageUrl } }
                        : node
                )
            );

            alert('✅ AI Influencer visual generated!\n\n(Demo mode - Real API integration pending)');
        } catch (error) {
            console.error('Error generating image:', error);
            alert('❌ Error generating image. Check console for details.');

            // Resetear estado
            setNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, status: 'error' } }
                        : node
                )
            );
        }
    };

    const handleGenerateVideo = async (nodeId) => {
        console.log('Generate video for node:', nodeId);

        // Actualizar estado del nodo a "generando"
        setNodes(prevNodes =>
            prevNodes.map(node =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, status: 'generating' } }
                    : node
            )
        );

        try {
            // Encontrar el frame correspondiente
            const frameId = nodeId.replace('-video', '');
            const frameNode = nodes.find(n => n.id === frameId);

            if (!frameNode) {
                alert('No frame data found');
                return;
            }

            // Opciones adicionales
            const influencerNode = nodes.find(n => n.id === 'influencer');
            const options = {
                duration: 10,
                influencerImage: influencerNode?.data?.imageUrl
            };

            // Generar video con Veo 3.1
            const result = await mediaGenerationService.generateVideoFrame(
                frameNode.data.description,
                options
            );

            // Actualizar nodo con resultado
            setNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === nodeId
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                status: 'completed',
                                videoUrl: result.videoUrl,
                                thumbnailUrl: result.thumbnailUrl,
                                prompt: result.prompt
                            }
                        }
                        : node
                )
            );

            alert('✅ Video frame generated!\n\n(Demo mode - Real API integration pending)');
        } catch (error) {
            console.error('Error generating video:', error);
            alert('❌ Error generating video. Check console for details.');

            // Resetear estado
            setNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, status: 'error' } }
                        : node
                )
            );
        }
    };

    if (!idea) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading idea...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                    >
                        ← Back to Ideas
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{idea.title}</h2>
                        <p className="text-xs text-gray-500">UGC Workspace - Node Editor</p>
                    </div>
                </div>
                {idea.type === 'UGC' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        🎭 UGC + AI Influencer
                    </span>
                )}
            </div>

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="flex-1 relative overflow-auto bg-gray-100"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: draggingNode ? 'grabbing' : 'default' }}
            >
                {/* SVG for connections */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                >
                    {renderConnections()}
                </svg>

                {/* Nodes */}
                <div className="relative" style={{ minWidth: '2000px', minHeight: '1500px' }}>
                    {nodes.map(renderNode)}
                </div>
            </div>

            {/* Info Panel */}
            {selectedNode && (
                <div className="bg-white border-t border-gray-200 p-4">
                    <h3 className="font-semibold text-sm mb-2">Node Details</h3>
                    <p className="text-xs text-gray-600">
                        Selected: {nodes.find(n => n.id === selectedNode)?.title}
                    </p>
                </div>
            )}
        </div>
    );
};

export default IdeaWorkspace;
