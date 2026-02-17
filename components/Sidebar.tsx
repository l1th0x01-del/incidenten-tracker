import React, { useEffect, useRef, useState } from 'react';
import { Accident, NewsArticle, RoadUserType } from '../types';
import { analyzeAccident, findRelatedArticles } from '../services/geminiService';
import { AlertTriangle, Bike, Footprints, Info, Sparkles, X, MapPin, Newspaper, ExternalLink, Loader2, Search } from 'lucide-react';

interface SidebarProps {
  selectedAccident: Accident | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedAccident, onClose }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  
  const prevAccidentIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset state when selection changes
    if (selectedAccident?.id !== prevAccidentIdRef.current) {
      setAnalysis(null);
      setIsAnalyzing(false);
      setHasError(false);
      setArticles(null);
      setIsLoadingArticles(false);
      prevAccidentIdRef.current = selectedAccident?.id || null;
    }
  }, [selectedAccident]);

  const handleAnalyze = async () => {
    if (!selectedAccident) return;

    setIsAnalyzing(true);
    setHasError(false);
    
    try {
      const result = await analyzeAccident(selectedAccident);
      setAnalysis(result);
    } catch (e) {
      setHasError(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFindArticles = async () => {
    if (!selectedAccident) return;

    setIsLoadingArticles(true);
    try {
      const results = await findRelatedArticles(selectedAccident);
      setArticles(results);
    } catch (e) {
      console.error(e);
      setArticles([]);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  if (!selectedAccident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-white border-l border-gray-200">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Selecteer een locatie</h2>
        <p className="text-sm max-w-xs">Klik op een pin op de kaart om details te bekijken en een AI-veiligheidsanalyse te genereren.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
        <div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${
            selectedAccident.type === RoadUserType.CYCLIST 
              ? 'bg-red-100 text-red-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {selectedAccident.type === RoadUserType.CYCLIST ? <Bike size={14} /> : <Footprints size={14} />}
            {selectedAccident.type}
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedAccident.locationName}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Basic Info Block */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Incident</p>
              <p className="text-gray-800 text-sm leading-relaxed">{selectedAccident.description}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</p>
              <p className="text-gray-800 text-sm">{selectedAccident.date}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Media / News Section */}
        <div>
           <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">In de media</h3>
          </div>

          {!articles && !isLoadingArticles && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Zoek naar krantenartikels en bronnen over dit incident.
              </p>
              <button 
                onClick={handleFindArticles}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Search size={14} />
                Zoek artikels
              </button>
            </div>
          )}

          {isLoadingArticles && (
            <div className="space-y-3 p-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span>Zoeken in nieuwsbronnen...</span>
              </div>
              <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          )}

          {articles && (
            <div className="space-y-3">
              {articles.length > 0 ? (
                articles.map((article, idx) => (
                  <a 
                    key={idx} 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-700 leading-snug">
                        {article.title}
                      </h4>
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="font-semibold text-gray-600">{article.source}</span>
                      {article.date && (
                        <>
                          <span>•</span>
                          <span>{article.date}</span>
                        </>
                      )}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center">
                  Geen specifieke artikels gevonden voor dit incident.
                </div>
              )}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* AI Analysis Block */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Gemini Veiligheidsanalyse</h3>
          </div>
          
          {!analysis && !isAnalyzing && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-4">
                Laat AI de infrastructuur en risicofactoren van deze locatie analyseren.
              </p>
              <button
                onClick={handleAnalyze}
                className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Genereer Analyse
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-3 py-2 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm prose-slate max-w-none">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {analysis}
              </p>
              <div className="mt-4 text-xs text-gray-400 italic text-right">
                Gegenereerd door Google Gemini
              </div>
            </div>
          )}
          
          {hasError && (
             <div className="text-red-500 text-sm mt-2">
               Er ging iets mis bij het genereren. Probeer het later opnieuw.
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
