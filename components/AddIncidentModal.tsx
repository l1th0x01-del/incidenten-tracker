import React, { useState } from 'react';
import { X, Search, Check, AlertCircle, Loader2, Globe } from 'lucide-react';
import { verifyArticleUrl } from '../services/geminiService';
import { DraftAccident } from '../types';

interface AddIncidentModalProps {
  onClose: () => void;
  onAdd: (accident: DraftAccident) => void;
}

const AddIncidentModal: React.FC<AddIncidentModalProps> = ({ onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<DraftAccident | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!url) return;
    
    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      const data = await verifyArticleUrl(url);
      if (data && data.isValid) {
        setResult(data);
      } else {
        // Data came back but isValid was false
        setError("Gemini kon geen specifiek ongeval met een zwakke weggebruiker bevestigen op deze pagina. Controleer of de link openbaar is.");
      }
    } catch (e: any) {
      // Handle technical errors (API key missing, JSON parse error, etc)
      console.error("Verification error:", e);
      if (e.message && e.message.includes("API Key")) {
        setError("Configuratiefout: API Key ontbreekt. Controleer Vercel instellingen.");
      } else {
        setError("Kan de pagina niet analyseren. Mogelijk blokkeert de website AI-toegang of is de link ongeldig.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onAdd(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Globe className="text-blue-600" size={20} />
            Melding toevoegen via AI
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {!result ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Plak een link naar een nieuwsartikel. Gemini zal verifiëren of het om een echt ongeval gaat en de details voor je invullen.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase">Artikel URL</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://www.hln.be/..." 
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button 
                onClick={handleVerify}
                disabled={!url || isVerifying}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifiëren...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Verifieer Artikel
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-in-right">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2 text-green-800 text-sm font-medium">
                <Check size={16} />
                Ongeval succesvol geverifieerd
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">Locatie</span>
                  <p className="text-gray-900 font-medium text-sm">{result.locationName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-bold">Type</span>
                    <p className={`text-sm font-medium ${result.type === 'Fietser' ? 'text-red-600' : 'text-orange-600'}`}>
                      {result.type}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-bold">Ernst</span>
                    <p className="text-gray-900 font-medium text-sm">{result.severity}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">Datum</span>
                  <p className="text-gray-900 font-medium text-sm">{result.date}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold">Omschrijving</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{result.description}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm"
                >
                  Terug
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 text-sm"
                >
                  Toevoegen aan kaart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddIncidentModal;