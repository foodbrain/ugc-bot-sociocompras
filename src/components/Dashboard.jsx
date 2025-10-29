
import React from 'react';

const Dashboard = ({ activeBrand, ideas, scripts }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {activeBrand && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <h3 className="font-bold text-blue-900">Marca Activa</h3>
                    <p className="text-blue-700">{activeBrand.brand_name}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-bold">Brand Status</h3>
                    <p>{activeBrand ? 'Completed' : 'Pending'}</p>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-bold">Generated Ideas</h3>
                    <p>{ideas.length}</p>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-bold">Generated Scripts</h3>
                    <p>{scripts.length}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
