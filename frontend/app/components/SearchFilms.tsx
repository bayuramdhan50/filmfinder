/**
 * Komponen SearchFilms untuk pencarian film menggunakan TMDB API
 */
'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilmResultCard from './FilmResultCard';

interface Film {
  id: string | number;
  title: string;
  original_title?: string;
  description: string;
  genre: string[];
  director: string;
  actors?: string[];
  release_year: string | number;
  release_date?: string;
  rating: number;
  vote_count?: number;
  duration?: number;
  confidence: number;
  poster_url?: string;
  backdrop_url?: string;
  popularity?: number;
  recommendations?: string[];
  tmdb_id?: number;
  language?: string;
}

const SearchFilms = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Masukkan kata kunci pencarian');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        throw new Error('Gagal mencari film');
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching films:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat mencari');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cari Film</h2>
          <p className="text-gray-600">Temukan film favorit Anda dari database TMDB</p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan judul film, aktor, atau sutradara..."
                className="w-full px-4 py-3 pl-12 pr-24 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Search button */}
              <div className="absolute inset-y-0 right-0 flex items-center">
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-2 py-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Mencari...
                    </div>
                  ) : (
                    'Cari'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Mencari film...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence>
          {!loading && hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {searchResults.length > 0 ? (
                <FilmResultCard 
                  result={{
                    message: `Ditemukan ${searchResults.length} film untuk pencarian "${query}":`,
                    recommendations: searchResults.map(film => ({
                      ...film,
                      confidence: Math.min(95, film.rating * 10)
                    })),
                    total_results: searchResults.length,
                    data_source: "TMDB"
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Tidak ada film yang ditemukan untuk "{query}"
                  </div>
                  <p className="text-gray-400 mb-4">Coba dengan kata kunci yang berbeda</p>
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Hapus Pencarian
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions */}
        {!hasSearched && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 text-lg mb-6">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Mulai pencarian film
            </div>
            
            <div className="max-w-md mx-auto">
              <p className="text-gray-400 mb-4">Contoh pencarian:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Avengers', 'Dune', 'Spider-Man', 'The Batman', 'Interstellar'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SearchFilms;
