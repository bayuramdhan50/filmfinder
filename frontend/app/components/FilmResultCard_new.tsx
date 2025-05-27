/**
 * Komponen FilmResultCard untuk menampilkan hasil rekomendasi film dengan data TMDB
 * Menampilkan poster, detail lengkap, dan informasi film dari TMDB API
 */
'use client'

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

interface FilmResultCardProps {
  result: {
    message: string;
    recommendations: Film[];
    total_results?: number;
    data_source?: string;
  };
}

// Komponen untuk rating bintang
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating / 2); // Convert 10-point to 5-star
  const hasHalfStar = (rating / 2) % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
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
  
  // Fill remaining with empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}/10</span>
    </div>
  );
};

// Komponen untuk confidence badge
const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  const getColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${getColor(confidence)}`}>
      {confidence.toFixed(0)}% Match
    </div>
  );
};

// Komponen untuk genre tags
const GenreTags = ({ genres }: { genres: string[] }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {genres.slice(0, 3).map((genre, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
        >
          {genre}
        </span>
      ))}
      {genres.length > 3 && (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
          +{genres.length - 3} more
        </span>
      )}
    </div>
  );
};

// Komponen untuk duration dan release year
const FilmMeta = ({ duration, releaseYear, voteCount }: { 
  duration?: number; 
  releaseYear: string | number; 
  voteCount?: number;
}) => {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span>{releaseYear}</span>
      {duration && <span>{formatDuration(duration)}</span>}
      {voteCount && <span>{voteCount.toLocaleString()} votes</span>}
    </div>
  );
};

// Komponen untuk poster image dengan fallback
const FilmPoster = ({ posterUrl, title, backdropUrl }: { 
  posterUrl?: string; 
  title: string;
  backdropUrl?: string;
}) => {
  const [imageError, setImageError] = useState(false);

  if (!posterUrl || imageError) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v10a2 2 0 002 2h6a2 2 0 002-2V8" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      <Image
        src={posterUrl}
        alt={`Poster ${title}`}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

// Komponen utama FilmCard
const FilmCard = memo(({ film, index }: { film: Film; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header dengan poster dan info dasar */}
      <div className="p-6">
        <div className="flex gap-4">
          {/* Poster */}
          <div className="flex-shrink-0 w-24 h-36">
            <FilmPoster 
              posterUrl={film.poster_url} 
              title={film.title}
              backdropUrl={film.backdrop_url}
            />
          </div>

          {/* Info dasar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                  {film.title}
                </h3>
                {film.original_title && film.original_title !== film.title && (
                  <p className="text-sm text-gray-500 italic">
                    ({film.original_title})
                  </p>
                )}
              </div>
              <ConfidenceBadge confidence={film.confidence} />
            </div>

            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={film.rating} />
            </div>

            {/* Genre tags */}
            <div className="mb-3">
              <GenreTags genres={film.genre} />
            </div>

            {/* Meta info */}
            <FilmMeta 
              duration={film.duration}
              releaseYear={film.release_year}
              voteCount={film.vote_count}
            />

            {/* Director */}
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Sutradara:</span> {film.director}
            </p>
          </div>
        </div>

        {/* Description preview */}
        <div className="mt-4">
          <p className="text-gray-700 text-sm line-clamp-3">
            {film.description}
          </p>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail'}
          <svg 
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={expandVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              {/* Full description */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Sinopsis</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {film.description}
                </p>
              </div>

              {/* Cast */}
              {film.actors && film.actors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Pemeran Utama</h4>
                  <div className="flex flex-wrap gap-2">
                    {film.actors.slice(0, 5).map((actor, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {film.recommendations && film.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Film Serupa</h4>
                  <div className="flex flex-wrap gap-2">
                    {film.recommendations.slice(0, 3).map((rec, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Bahasa:</span>
                  <span className="ml-1 text-gray-800">{film.language?.toUpperCase() || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Popularitas:</span>
                  <span className="ml-1 text-gray-800">{film.popularity?.toFixed(0) || 'N/A'}</span>
                </div>
              </div>

              {/* TMDB link */}
              {film.tmdb_id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`https://www.themoviedb.org/movie/${film.tmdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Lihat di TMDB
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FilmCard.displayName = 'FilmCard';

// Komponen utama FilmResultCard
const FilmResultCard = memo(({ result }: FilmResultCardProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (!result.recommendations || result.recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-gray-500 text-lg mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1-1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
          </svg>
          Tidak ada rekomendasi film yang ditemukan
        </div>
        <p className="text-gray-400">Coba dengan kata kunci yang berbeda</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto"
    >
      {/* Message header */}
      <motion.div 
        variants={messageVariants}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1-1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 leading-relaxed">{result.message}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span>{result.recommendations.length} film ditemukan</span>
                {result.data_source && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Data: {result.data_source}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Films grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {result.recommendations.map((film, index) => (
          <FilmCard key={film.id || index} film={film} index={index} />
        ))}
      </div>
    </motion.div>
  );
});

FilmResultCard.displayName = 'FilmResultCard';

export default FilmResultCard;
