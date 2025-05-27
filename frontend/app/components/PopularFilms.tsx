/**
 * Komponen PopularFilms untuk menampilkan film-film populer dari TMDB
 */
'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const PopularFilms = () => {
  const [popularFilms, setPopularFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularFilms();
  }, []);
  const fetchPopularFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/popular?limit=12`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil film populer');
      }
      
      const data = await response.json();
      setPopularFilms(data.results || []);
    } catch (error) {
      console.error('Error fetching popular films:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memuat film populer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button
            onClick={fetchPopularFilms}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const mockResult = {
    message: "Film-film populer saat ini yang sedang trending di seluruh dunia:",
    recommendations: popularFilms.map(film => ({
      ...film,
      confidence: Math.min(95, film.popularity ? film.popularity / 10 : 75)
    })),
    total_results: popularFilms.length,
    data_source: "TMDB"
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Film Populer</h2>
          <p className="text-gray-600">Discover film-film terpopuler saat ini dari seluruh dunia</p>
        </div>
        
        <FilmResultCard result={mockResult} />
      </motion.div>
    </div>
  );
};

export default PopularFilms;
