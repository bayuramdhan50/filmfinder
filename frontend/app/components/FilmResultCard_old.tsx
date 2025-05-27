/**
 * Komponen FilmResultCard untuk menampilkan hasil rekomendasi film
 * Menampilkan film yang direkomendasikan beserta detail dan confidence score
 */
'use client'

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Film {
  title: string;
  description: string;
  genre: string;
  director: string;
  release_year: number;
  rating: number;
  confidence: number;
}

interface FilmResultCardProps {
  result: {
    message: string;
    recommendations: Film[];
  };
}

// Komponen untuk rating bintang
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor"/>
            <stop offset="50%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  return <div className="flex">{stars}</div>;
};

// Fungsi untuk menentukan warna berdasarkan confidence
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200';
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

// Fungsi untuk warna progress bar
const getProgressBarColor = (confidence: number) => {
  if (confidence >= 80) return 'bg-gradient-to-r from-green-400 to-green-600';
  if (confidence >= 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  return 'bg-gradient-to-r from-red-400 to-red-600';
};

// Fungsi untuk teks match
const getMatchText = (confidence: number) => {
  if (confidence >= 80) return 'sangat cocok';
  if (confidence >= 60) return 'cukup cocok';
  return 'kurang cocok';
};

const FilmResultCard = memo(({ result }: FilmResultCardProps) => {
  const [activeFilmIndex, setActiveFilmIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  if (!result?.recommendations?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="film-card p-8 text-center"
      >
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Tidak ada rekomendasi film
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Coba ubah preferensi Anda untuk mendapatkan rekomendasi yang lebih baik
        </p>
      </motion.div>
    );
  }

  const activeFilm = result.recommendations[activeFilmIndex];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="film-card p-6"
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-10 0h12m-1 0v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4m2 0h6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Rekomendasi Film untuk Anda
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {result.message}
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilmIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="film-card overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8 text-white">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gradient mb-2"
                  >
                    {activeFilm.title}
                  </motion.h3>
                  <p className="text-blue-200 text-lg">
                    {activeFilm.release_year} • {activeFilm.genre}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={activeFilm.rating} />
                    <span className="ml-1 text-lg font-bold">{activeFilm.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getConfidenceColor(activeFilm.confidence)}`}>
                      {activeFilm.confidence.toFixed(1)}% match
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-blue-300 border-opacity-30 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'overview'
                        ? 'border-yellow-400 text-yellow-400'
                        : 'border-transparent text-blue-200 hover:text-white hover:border-blue-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'details'
                        ? 'border-yellow-400 text-yellow-400'
                        : 'border-transparent text-blue-200 hover:text-white hover:border-blue-200'
                    }`}
                  >
                    Details
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Sinopsis</h4>
                      <p className="text-blue-100 leading-relaxed">
                        {activeFilm.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Genre</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeFilm.genre.split(',').map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-800 bg-opacity-50 rounded-full text-sm text-blue-100 border border-blue-400 border-opacity-30"
                          >
                            {genre.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Sutradara</h4>
                        <p className="text-blue-100">{activeFilm.director}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Tahun Rilis</h4>
                        <p className="text-blue-100">{activeFilm.release_year}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Rating</h4>
                        <div className="flex items-center">
                          <StarRating rating={activeFilm.rating} />
                          <span className="ml-2 text-blue-100">{activeFilm.rating.toFixed(1)}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Genre</h4>
                        <p className="text-blue-100">{activeFilm.genre}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Tingkat Kesesuaian</h4>
                        <div className="space-y-2">
                          <div className="w-full bg-blue-800 bg-opacity-30 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${activeFilm.confidence}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full ${getProgressBarColor(activeFilm.confidence)} rounded-full`}
                            />
                          </div>
                          <p className="text-sm text-blue-200">
                            Film ini {getMatchText(activeFilm.confidence)} dengan preferensi Anda
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {result.recommendations.length > 1 && (
                <div className="flex justify-between items-center pt-6 border-t border-blue-300 border-opacity-30 mt-6">
                  <button
                    onClick={() => setActiveFilmIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeFilmIndex === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeFilmIndex === 0
                        ? 'text-blue-400 cursor-not-allowed opacity-50'
                        : 'text-white bg-blue-700 bg-opacity-50 hover:bg-opacity-70 border border-blue-400 border-opacity-30'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Film Sebelumnya</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-200 text-sm">
                      {activeFilmIndex + 1} dari {result.recommendations.length}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setActiveFilmIndex(prev => Math.min(result.recommendations.length - 1, prev + 1))}
                    disabled={activeFilmIndex === result.recommendations.length - 1}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeFilmIndex === result.recommendations.length - 1
                        ? 'text-blue-400 cursor-not-allowed opacity-50'
                        : 'text-white bg-blue-700 bg-opacity-50 hover:bg-opacity-70 border border-blue-400 border-opacity-30'
                    }`}
                  >
                    <span>Film Selanjutnya</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

FilmResultCard.displayName = 'FilmResultCard';

export default FilmResultCard;
