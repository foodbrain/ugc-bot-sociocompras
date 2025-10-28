
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BrandResearch from './components/BrandResearch';
import IdeaGenerator from './components/IdeaGenerator';
import ScriptCreator from './components/ScriptCreator';
import Pipeline from './components/Pipeline';
import IdeaWorkspace from './components/IdeaWorkspace';
import { storageService } from './services/storageService';

const App = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [brandData, setBrandData] = useState(null);
    const [ideas, setIdeas] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [workspaceIdeaId, setWorkspaceIdeaId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const savedBrandData = storageService.getBrandData();
            const savedIdeas = await storageService.getIdeas();
            const savedScripts = await storageService.getScripts();

            if (savedBrandData) setBrandData(savedBrandData);
            if (savedIdeas) setIdeas(savedIdeas);
            if (savedScripts) setScripts(savedScripts);
        };

        loadData();
    }, []);

    useEffect(() => {
        if (brandData) {
            storageService.saveBrandData(brandData);
        }
    }, [brandData]);

    useEffect(() => {
        storageService.saveIdeas(ideas);
    }, [ideas]);

    useEffect(() => {
        storageService.saveScripts(scripts);
    }, [scripts]);

    const handleOpenWorkspace = (ideaId) => {
        setWorkspaceIdeaId(ideaId);
        setActiveView('workspace');
    };

    const handleCloseWorkspace = () => {
        setWorkspaceIdeaId(null);
        setActiveView('idea-generator');
    };

    const renderView = () => {
        switch (activeView) {
            case 'brand-research':
                return <BrandResearch setBrandData={setBrandData} />;
            case 'pipeline':
                return <Pipeline brandData={brandData} />;
            case 'idea-generator':
                return <IdeaGenerator setIdeas={setIdeas} onOpenWorkspace={handleOpenWorkspace} />;
            case 'script-creator':
                return <ScriptCreator brandData={brandData} ideas={ideas} setScripts={setScripts} />;
            case 'workspace':
                return workspaceIdeaId ? (
                    <IdeaWorkspace ideaId={workspaceIdeaId} onBack={handleCloseWorkspace} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No idea selected</p>
                    </div>
                );
            case 'dashboard':
            default:
                return <Dashboard brandData={brandData} ideas={ideas} scripts={scripts} />;
        }
    };

    const navItems = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'brand-research', label: '🔍 Brand Research' },
        { id: 'pipeline', label: '🚀 Pipeline Auto' },
        { id: 'idea-generator', label: '💡 Ideas' },
        { id: 'script-creator', label: '📝 Scripts' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">UGC-Bot | Sociocompras.com</h1>
                    <ul className="flex space-x-4">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveView(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeView === item.id
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
            <main className="container mx-auto p-6">
                {renderView()}
            </main>
            <footer className="text-center py-4 text-gray-500 text-sm">
                <p>Gemini Code Assist | October 2025</p>
            </footer>
        </div>
    );
};

export default App;
