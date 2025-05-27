/**
 * Komponen Tabs untuk beralih antara fitur Rekomendasi, Chatbot, Pencarian, dan Film Populer
 */
'use client'

import { useState, ReactNode } from 'react';
import FilmInputForm from './FilmInputForm';
import FilmResultCard from './FilmResultCard';
import FilmChatbot from './FilmChatbot';
import SearchFilms from './SearchFilms';
import PopularFilms from './PopularFilms';
import Loading from './Loading';

interface Tab {
  id: string;
  label: string;
  default?: boolean;
}

interface TabsProps {
  tabs: Tab[];
}

export default function FilmTabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    tabs.find(tab => tab.default)?.id || tabs[0]?.id
  );
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const handleResult = (data: any) => {
    setResult(data);
    setShowInfo(false); // Sembunyikan info setelah hasil diterima
  };

  const handleLoading = (loading: boolean) => {
    setLoading(loading);
  };

  const InfoCard = () => (
    <div className="film-card rounded-lg p-8 w-full max-w-3xl mx-auto mt-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gradient mb-2">Selamat Datang di FilmFinder</h2>
        <p className="text-gray-300">Sistem Rekomendasi Film Berbasis NLP</p>
      </div>
      
      <div className="space-y-6 text-gray-300">
        <p className="text-center leading-relaxed">
          FilmFinder adalah sistem rekomendasi film cerdas yang menggunakan Natural Language Processing (NLP)
          untuk memahami preferensi Anda dalam bahasa Indonesia dan memberikan rekomendasi film yang tepat.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cara Menggunakan:
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Ketik preferensi film Anda dalam bahasa Indonesia</li>
              <li>Sistem akan menganalisis teks menggunakan NLP</li>
              <li>Dapatkan rekomendasi film yang sesuai dengan selera Anda</li>
              <li>Jelajahi detail lengkap setiap film yang direkomendasikan</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fitur Unggulan:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Analisis teks bahasa Indonesia menggunakan NLP</li>
              <li>Rekomendasi film dari database TMDB</li>
              <li>Chatbot untuk informasi film</li>
              <li>Pencarian film dengan filter genre</li>
              <li>Film populer terkini</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button
            onClick={() => setShowInfo(false)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Mulai Mencari Film
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      {/* Tab Navigation */}
      <div className="film-card p-1 mb-6 overflow-hidden">
        <nav className="flex bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-300 relative overflow-hidden
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >              <span className="relative z-10 flex items-center justify-center space-x-2">
                {tab.id === 'recommender' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
                {tab.id === 'chatbot' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )}
                {tab.id === 'search' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {tab.id === 'popular' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-md" />
              )}
            </button>
          ))}
        </nav>
      </div>      {/* Tab Content */}
      <div className="py-4">        {activeTab === 'recommender' && (
          <div className="space-y-6">
            <FilmInputForm 
              onResult={handleResult}
              onLoading={handleLoading}
            />
            {loading ? (
              <Loading />
            ) : result ? (
              <FilmResultCard result={result} />
            ) : showInfo ? (
              <InfoCard />
            ) : null}
          </div>
        )}

        {activeTab === 'chatbot' && (
          <FilmChatbot />
        )}

        {activeTab === 'search' && (
          <SearchFilms />
        )}

        {activeTab === 'popular' && (
          <PopularFilms />
        )}
      </div>
    </div>
  );
}
