import React, { useState, useEffect } from 'react';
import AccidentMap from './components/AccidentMap';
import Sidebar from './components/Sidebar';
import AddIncidentModal from './components/AddIncidentModal';
import { Accident, DraftAccident } from './types';
import { MapPin, Info, ShieldCheck, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { generateGeneralSafetyTips } from './services/geminiService';
import { dataService } from './services/dataService';

const App: React.FC = () => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccidentId, setSelectedAccidentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [safetyTips, setSafetyTips] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load initial data and tips
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await dataService.getAccidents();
      setAccidents(data);
      setIsLoading(false);
    };

    fetchData();
    generateGeneralSafetyTips().then(setSafetyTips);

    // Subscribe to real-time updates (simulated)
    const unsubscribe = dataService.subscribe(() => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  const handleSelectAccident = (accident: Accident) => {
    setSelectedAccidentId(accident.id);
    setIsSidebarOpen(true);
  };

  const handleAddIncident = async (draft: DraftAccident) => {
    const newAccident: Accident = {
      ...draft,
      id: `user-${Date.now()}`,
      source: 'User_Verified'
    };
    
    // Optimistic UI update (optional, but good for UX)
    setAccidents(prev => [...prev, newAccident]);
    
    // Save to "backend"
    await dataService.addAccident(newAccident);
    
    // Select the new accident immediately
    setTimeout(() => {
      setSelectedAccidentId(newAccident.id);
      setIsSidebarOpen(true);
    }, 100);
  };

  const selectedAccident = accidents.find(a => a.id === selectedAccidentId) || null;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100">
      
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg md:text-xl">Vlaamse Verkeersveiligheid</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500 hidden md:flex">
              <span>Monitor Zwakke Weggebruikers</span>
              <span>•</span>
              {isLoading ? (
                <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin"/> Laden...</span>
              ) : (
                <span>{accidents.length} incidenten</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Incident toevoegen</span>
          </button>
          <button 
             onClick={() => setShowWelcomeModal(true)}
             className="text-gray-500 hover:text-gray-700 transition-colors p-2"
          >
            <Info size={24} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Map Area */}
        <div className={`flex-1 relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:w-2/3 lg:w-3/4' : 'w-full'}`}>
          <AccidentMap 
            accidents={accidents} 
            onSelectAccident={handleSelectAccident}
            selectedAccidentId={selectedAccidentId}
          />
        </div>

        {/* Sidebar Container */}
        <div className={`
          absolute inset-y-0 right-0 z-30 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:transform-none md:border-l md:border-gray-200
          ${!isSidebarOpen && 'md:hidden'} 
        `}>
          <Sidebar 
            selectedAccident={selectedAccident} 
            onClose={() => {
              setIsSidebarOpen(false);
              setSelectedAccidentId(null);
            }} 
          />
        </div>
      </div>

      {/* Add Incident Modal */}
      {showAddModal && (
        <AddIncidentModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddIncident}
        />
      )}

      {/* Welcome / Info Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Verkeersveiligheid Vlaanderen</h2>
              <p className="opacity-90">Een interactief overzicht van kritieke punten.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="text-green-600" size={20} />
                  AI Veiligheidstips
                </h3>
                {safetyTips ? (
                  <div className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-100" dangerouslySetInnerHTML={{__html: safetyTips}} />
                ) : (
                  <p className="text-sm text-gray-400 italic">Tips laden...</p>
                )}
              </div>

              <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                <p>
                  Deze applicatie toont locaties van ernstige ongevallen met fietsers en voetgangers. 
                  Klik op een markering op de kaart om details te zien en gebruik de 
                  <strong> Gemini AI-analyse</strong> om de context van het ongeval te begrijpen.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 text-xs uppercase mb-1 flex items-center gap-1">
                    <ExternalLink size={12} /> Live Samenwerking
                  </h4>
                  <p>
                    Incidenten die u toevoegt worden opgeslagen en gesynchroniseerd. In deze demoversie gebruiken we lokale opslag om een database te simuleren.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowWelcomeModal(false)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]"
              >
                Naar de kaart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
