
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import BrandSelector from './BrandSelector';

const BrandResearch = ({ activeBrand, onBrandChange }) => {
    const [loading, setLoading] = useState(false);
    const [enhancedResearch, setEnhancedResearch] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Load analysis for active brand
    useEffect(() => {
        const loadAnalysis = async () => {
            if (activeBrand) {
                try {
                    const analysis = await storageService.getBrandAnalysis(activeBrand.id);
                    setEnhancedResearch(analysis);
                } catch (error) {
                    console.error('Error loading brand analysis:', error);
                }
            } else {
                setEnhancedResearch(null);
            }
        };
        loadAnalysis();
    }, [activeBrand]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        setLoading(true);
        try {
            // Create new brand
            const newBrand = await storageService.createBrand(data);

            console.log('Iniciando análisis con Gemini AI...');
            const enhanced = await geminiService.enhanceBrandResearch(data);
            console.log('Análisis recibido:', enhanced);

            // Save analysis linked to brand
            await storageService.saveBrandAnalysis(newBrand.id, enhanced);
            setEnhancedResearch(enhanced);

            // Set as active brand
            onBrandChange(newBrand);

            // Hide form
            setShowForm(false);

            alert('✅ Marca creada y análisis AI completado!');
        } catch (error) {
            console.error('Error creating brand:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">🏢 Brand Research</h2>

            {/* Brand Selector */}
            <div className="mb-6">
                <BrandSelector
                    activeBrand={activeBrand}
                    onBrandChange={onBrandChange}
                    onCreateNew={() => setShowForm(true)}
                />
            </div>

            {/* Show Analysis if brand is selected */}
            {activeBrand && enhancedResearch && (
                <div className="mb-6 bg-white p-6 shadow rounded">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        🤖 Análisis AI para: {activeBrand.brand_name}
                    </h3>

                    <div className="space-y-4">
                        {enhancedResearch.valueAnalysis && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">📊 Análisis de Propuesta de Valor:</h4>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{enhancedResearch.valueAnalysis}</p>
                            </div>
                        )}

                        {enhancedResearch.audienceInsights && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">👥 Insights de Audiencia:</h4>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{enhancedResearch.audienceInsights}</p>
                            </div>
                        )}

                        {enhancedResearch.painPointRecommendations && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">💡 Recomendaciones para Pain Points:</h4>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{enhancedResearch.painPointRecommendations}</p>
                            </div>
                        )}

                        {enhancedResearch.brandPositioning && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">🎯 Posicionamiento de Marca:</h4>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{enhancedResearch.brandPositioning}</p>
                            </div>
                        )}

                        {enhancedResearch.ugcOpportunities && enhancedResearch.ugcOpportunities.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">🎬 Oportunidades de Contenido UGC:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {enhancedResearch.ugcOpportunities.map((opportunity, index) => (
                                        <li key={index} className="text-gray-600 text-sm">{opportunity}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New Brand Form */}
            {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">➕ Nueva Marca</h3>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕ Cerrar
                    </button>
                </div>
                {/* Información Básica de la Marca */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la Marca <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand_name"
                                required
                                placeholder="Ej: EcoCompras"
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dominio/Website <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                name="brand_domain"
                                required
                                placeholder="Ej: https://www.sociocompras.com"
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría de Producto/Servicio
                        </label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Ej: E-commerce de productos sostenibles, SaaS, Servicios profesionales, etc."
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Propuesta de Valor y Audiencia */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Propuesta de Valor y Audiencia</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unique Value Proposition (UVP) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="uvp"
                            required
                            rows="3"
                            placeholder="Ej: Productos eco-friendly de alta calidad a precios accesibles, entregados en 24 horas con embalaje 100% reciclable"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Audience (Audiencia Objetivo) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="audience"
                            required
                            rows="3"
                            placeholder="Ej: Millennials y Gen Z (25-40 años), conscientes del medio ambiente, ingresos medios-altos, principalmente mujeres, urbanos, activos en redes sociales"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </div>

                {/* Problemas y Soluciones */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pain Points & Solutions</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Puntos de Dolor y Soluciones <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="pain_points"
                            required
                            rows="4"
                            placeholder="Ej:
PROBLEMA: Los productos sostenibles son muy caros y difíciles de encontrar.
SOLUCIÓN: Producción directa sin intermediarios, reduciendo costos en 40%.

PROBLEMA: Entrega lenta de productos eco-friendly.
SOLUCIÓN: Red de distribución local, entrega en 24 horas."
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional (Opcional)</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Principales Competidores
                        </label>
                        <input
                            type="text"
                            name="competitors"
                            placeholder="Ej: Amazon Green, EcoMarket, The Sustainable Shop"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tono de Voz de la Marca
                        </label>
                        <input
                            type="text"
                            name="brand_voice"
                            placeholder="Ej: Amigable, informativo, inspirador, cercano, profesional"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Objetivos de Marketing
                        </label>
                        <textarea
                            name="marketing_goals"
                            rows="2"
                            placeholder="Ej: Aumentar awareness en 30%, generar 1000 leads mensuales, incrementar ventas en 25%"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? '⏳ Analizando con AI...' : '🚀 Crear Marca y Analizar'}
                    </button>
                </div>
            </form>
            )}

            {!activeBrand && !showForm && (
                <div className="bg-white p-8 shadow rounded text-center text-gray-500">
                    <p className="mb-4">Selecciona una marca o crea una nueva para comenzar</p>
                </div>
            )}
        </div>
    );
};

export default BrandResearch;
