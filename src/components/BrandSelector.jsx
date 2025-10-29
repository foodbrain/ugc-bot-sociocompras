import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';

const BrandSelector = ({ activeBrand, onBrandChange, onCreateNew }) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editingBrand, setEditingBrand] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            setLoading(true);
            const allBrands = await firebaseService.getAllBrands();
            setBrands(allBrands);

            // If there's no active brand and we have brands, select the first one
            if (!activeBrand && allBrands.length > 0) {
                onBrandChange(allBrands[0]);
            }
        } catch (error) {
            console.error('Error loading brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (brandId) => {
        try {
            await firebaseService.deleteBrand(brandId);
            await firebaseService.deleteBrandAnalysis(brandId);

            // Reload brands
            await loadBrands();

            // If deleted brand was active, clear selection
            if (activeBrand && activeBrand.id === brandId) {
                onBrandChange(null);
            }

            setShowDeleteConfirm(null);
            alert('✅ Marca eliminada correctamente');
        } catch (error) {
            console.error('Error deleting brand:', error);
            alert('❌ Error al eliminar la marca');
        }
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand.id);
        setEditForm({
            brand_name: brand.brand_name,
            brand_domain: brand.brand_domain,
            category: brand.category,
            uvp: brand.uvp,
            audience: brand.audience,
            pain_points: brand.pain_points,
            competitors: brand.competitors,
            brand_voice: brand.brand_voice,
            marketing_goals: brand.marketing_goals
        });
    };

    const handleSaveEdit = async (brandId) => {
        try {
            await firebaseService.updateBrand(brandId, editForm);
            await loadBrands();

            // Update active brand if it was being edited
            if (activeBrand && activeBrand.id === brandId) {
                const updatedBrand = await firebaseService.getBrand(brandId);
                onBrandChange(updatedBrand);
            }

            setEditingBrand(null);
            alert('✅ Marca actualizada correctamente');
        } catch (error) {
            console.error('Error updating brand:', error);
            alert('❌ Error al actualizar la marca');
        }
    };

    const handleCancelEdit = () => {
        setEditingBrand(null);
        setEditForm({});
    };

    if (loading) {
        return (
            <div className="bg-white p-6 shadow rounded">
                <div className="text-center text-gray-500">Cargando marcas...</div>
            </div>
        );
    }

    if (brands.length === 0) {
        return (
            <div className="bg-white p-6 shadow rounded">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No hay marcas creadas aún</p>
                    <button
                        onClick={onCreateNew}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        ➕ Crear Primera Marca
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 shadow rounded">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">🏢 Gestión de Marcas</h3>
                <button
                    onClick={onCreateNew}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                    ➕ Nueva Marca
                </button>
            </div>

            <div className="space-y-4">
                {brands.map((brand) => (
                    <div
                        key={brand.id}
                        className={`border rounded-lg p-4 ${
                            activeBrand && activeBrand.id === brand.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {editingBrand === brand.id ? (
                            // EDIT MODE
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Nombre de la Marca
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.brand_name || ''}
                                            onChange={(e) => setEditForm({...editForm, brand_name: e.target.value})}
                                            className="w-full px-2 py-1 text-sm border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Website
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.brand_domain || ''}
                                            onChange={(e) => setEditForm({...editForm, brand_domain: e.target.value})}
                                            className="w-full px-2 py-1 text-sm border rounded"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.category || ''}
                                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                        className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => handleSaveEdit(brand.id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                    >
                                        ✓ Guardar
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                    >
                                        ✕ Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // VIEW MODE
                            <>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 cursor-pointer" onClick={() => onBrandChange(brand)}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {brand.brand_name}
                                            </h4>
                                            {activeBrand && activeBrand.id === brand.id && (
                                                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                                                    Activa
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Website:</span> {brand.brand_domain || 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Categoría:</span> {brand.category || 'N/A'}
                                            </div>
                                        </div>
                                        {brand.uvp && (
                                            <p className="mt-2 text-sm text-gray-700">
                                                <span className="font-medium">Propuesta de Valor:</span> {brand.uvp}
                                            </p>
                                        )}
                                        <div className="mt-2 text-xs text-gray-400">
                                            Creada: {new Date(brand.createdAt).toLocaleDateString('es-ES')}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                                            title="Editar marca"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(brand.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                            title="Eliminar marca"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Confirmation */}
                                {showDeleteConfirm === brand.id && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                        <p className="text-sm text-red-800 mb-2">
                                            ⚠️ ¿Estás seguro de eliminar esta marca? Esta acción también eliminará todos los datos asociados (análisis, ideas, scripts).
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(brand.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                            >
                                                Sí, eliminar
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(null)}
                                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandSelector;
