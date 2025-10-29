
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

const BrandResearch = ({ setBrandData }) => {
    const [loading, setLoading] = useState(false);
    const [enhancedResearch, setEnhancedResearch] = useState(null);
    const [savedBrandData, setSavedBrandData] = useState(null);

    // Load data on mount
    React.useEffect(() => {
        const loadData = async () => {
            try {
                const brandData = await storageService.getBrandData();
                const researchData = await storageService.getEnhancedResearch();
                setSavedBrandData(brandData);
                setEnhancedResearch(researchData);
            } catch (error) {
                console.error('Error loading brand data:', error);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        setLoading(true);
        try {
            // Save brand data to Firebase
            await storageService.saveBrandData(data);
            setBrandData(data);
            setSavedBrandData(data);

            console.log('Iniciando análisis con Gemini AI...');
            const enhanced = await geminiService.enhanceBrandResearch(data);
            console.log('Análisis recibido:', enhanced);

            // Save enhanced research to Firebase
            await storageService.saveEnhancedResearch(enhanced);
            setEnhancedResearch(enhanced);

            alert('✅ Datos guardados y análisis AI completado!');
        } catch (error) {
            console.error('Error enhancing research:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Brand Research</h2>

            {/* Tabla de datos guardados */}
            {savedBrandData && (
                <div className="mb-6 bg-white p-6 shadow rounded">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Datos Guardados</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre de la Marca
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Objetivos de Marketing
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                {savedBrandData.brand_name || 'No especificado'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-900">
                                            {savedBrandData.marketing_goals || 'No especificado'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            enhancedResearch
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {enhancedResearch ? '✓ Analizado' : '⏳ Pendiente análisis'}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Website:</span>
                            <p className="font-medium">{savedBrandData.brand_domain || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Categoría:</span>
                            <p className="font-medium">{savedBrandData.category || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Tono de Voz:</span>
                            <p className="font-medium">{savedBrandData.brand_voice || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Competidores:</span>
                            <p className="font-medium">{savedBrandData.competitors || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
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

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? '🤖 Analizando con Gemini AI...' : '✨ Guardar y Analizar con AI'}
                </button>
            </form>

            {enhancedResearch && (
                <div className="mt-6 bg-white p-6 shadow rounded">
                    <h3 className="text-xl font-bold mb-4 text-green-600">Análisis AI Completado</h3>

                    {enhancedResearch.valueAnalysis && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Análisis de Propuesta de Valor</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{enhancedResearch.valueAnalysis}</p>
                        </div>
                    )}

                    {enhancedResearch.audienceInsights && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Insights de Audiencia</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{enhancedResearch.audienceInsights}</p>
                        </div>
                    )}

                    {enhancedResearch.painPointRecommendations && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Recomendaciones para Puntos de Dolor</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{enhancedResearch.painPointRecommendations}</p>
                        </div>
                    )}

                    {enhancedResearch.brandPositioning && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Posicionamiento de Marca</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{enhancedResearch.brandPositioning}</p>
                        </div>
                    )}

                    {enhancedResearch.ugcOpportunities && enhancedResearch.ugcOpportunities.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Oportunidades de Contenido UGC</h4>
                            <ul className="list-disc list-inside text-gray-600">
                                {enhancedResearch.ugcOpportunities.map((opportunity, index) => (
                                    <li key={index} className="mb-1">{opportunity}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrandResearch;
