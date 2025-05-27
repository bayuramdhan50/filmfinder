/**
 * Komponen Tabs untuk beralih antara fitur Rekomendasi dan Chatbot
 */
'use client'

import { useState, ReactNode } from 'react';
import FilmInputForm from './FilmInputForm';
import FilmResultCard from './FilmResultCard';
import FilmChatbot from './FilmChatbot';
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
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
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
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-md" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'recommender' && (
          <div className="space-y-6">
            <FilmInputForm 
              onResult={setResult}
              onLoading={setLoading}
            />            {loading ? (
              <Loading />
            ) : (
              result && <FilmResultCard result={result} />
            )}
          </div>
        )}

        {activeTab === 'chatbot' && (
          <FilmChatbot />
        )}
      </div>
    </div>
  );
}
