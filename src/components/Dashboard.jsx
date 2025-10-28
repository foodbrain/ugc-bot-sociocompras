
import React from 'react';

const Dashboard = ({ brandData, ideas, scripts }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-bold">Brand Status</h3>
                    <p>{brandData ? 'Completed' : 'Pending'}</p>
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
