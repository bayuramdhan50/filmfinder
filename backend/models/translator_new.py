"""
Output translator untuk menghasilkan rekomendasi film berdasarkan hasil prediksi genre
Menggunakan TMDB API untuk data film real-time
"""
import os
import json
import random
from difflib import get_close_matches
from backend.services.tmdb_service import TMDBService

class FilmTranslator:
    """
    Kelas untuk menghasilkan rekomendasi film berdasarkan hasil prediksi genre.
    Menggunakan TMDB API untuk mendapatkan data film terkini.
    """
    
    def __init__(self):
        """
        Inisialisasi translator dengan TMDB service dan fallback data lokal
        """
        # Inisialisasi TMDB service
        self.tmdb_service = TMDBService()
        
        # Path untuk fallback data lokal
        self.films_data_path = os.path.join('data', 'films.json')
        
        # Muat data film lokal sebagai fallback
        self.fallback_films_data = self._load_fallback_films_data()
        
        # Cache untuk rekomendasi
        self.recommendation_cache = {}
    
    def _load_fallback_films_data(self):
        """
        Memuat data film lokal sebagai fallback jika TMDB API tidak tersedia.
        
        Returns
        -------
        dict
            Dictionary berisi informasi film fallback
        """
        try:
            with open(self.films_data_path, 'r', encoding='utf-8') as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            # Buat contoh data default jika file tidak ditemukan
            return {
                "Dune": {
                    "title": "Dune",
                    "release_year": 2021,
                    "director": "Denis Villeneuve",
                    "genre": ["Sci-Fi", "Action", "Adventure", "Drama"],
                    "description": "Film yang mengadaptasi novel fiksi ilmiah terkenal karya Frank Herbert.",
                    "rating": 8.0,
                    "recommendations": ["Blade Runner 2049", "Arrival", "Interstellar"]
                }
            }
    
    def get_recommendations(self, genres, limit=6):
        """
        Mendapatkan rekomendasi film berdasarkan genre menggunakan TMDB API
        
        Parameters
        ----------
        genres : list
            List genre film yang dicari
        limit : int
            Jumlah maksimal rekomendasi yang dikembalikan
            
        Returns
        -------
        list
            List film yang direkomendasikan
        """
        try:
            # Cek cache terlebih dahulu
            cache_key = '_'.join(sorted(genres))
            if cache_key in self.recommendation_cache:
                return self.recommendation_cache[cache_key][:limit]
            
            # Gunakan TMDB API untuk mendapatkan rekomendasi
            recommendations = self.tmdb_service.get_movie_recommendations_by_genre(genres, limit)
            
            # Jika TMDB API gagal atau tidak ada hasil, gunakan fallback
            if not recommendations:
                recommendations = self._get_fallback_recommendations(genres, limit)
            
            # Simpan ke cache
            self.recommendation_cache[cache_key] = recommendations
            
            return recommendations
            
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            # Fallback ke data lokal
            return self._get_fallback_recommendations(genres, limit)
    
    def _get_fallback_recommendations(self, genres, limit=6):
        """
        Mendapatkan rekomendasi film dari data lokal sebagai fallback
        
        Parameters
        ----------
        genres : list
            List genre film yang dicari
        limit : int
            Jumlah maksimal rekomendasi
            
        Returns
        -------
        list
            List film yang direkomendasikan dari data lokal
        """
        recommendations = []
        
        for film_name, film_data in self.fallback_films_data.items():
            film_genres = [g.lower() for g in film_data.get("genre", [])]
            
            # Cek apakah ada genre yang cocok
            for genre in genres:
                if any(genre.lower() in fg for fg in film_genres):
                    # Format data untuk konsistensi dengan TMDB
                    formatted_film = {
                        'id': film_name.replace(' ', '_').lower(),
                        'title': film_data.get('title', film_name),
                        'original_title': film_data.get('title', film_name),
                        'release_year': film_data.get('release_year', 'Unknown'),
                        'release_date': str(film_data.get('release_year', 'Unknown')),
                        'director': film_data.get('director', 'Unknown'),
                        'genre': film_data.get('genre', []),
                        'description': film_data.get('description', 'Deskripsi tidak tersedia'),
                        'actors': film_data.get('actors', []),
                        'rating': film_data.get('rating', 0),
                        'vote_count': 1000,  # Default value
                        'duration': film_data.get('duration', 120),
                        'poster_url': None,
                        'backdrop_url': None,
                        'popularity': film_data.get('rating', 0) * 100,
                        'recommendations': film_data.get('recommendations', []),
                        'tmdb_id': None,
                        'language': 'en'
                    }
                    recommendations.append(formatted_film)
                    break
        
        # Shuffle dan limit hasil
        random.shuffle(recommendations)
        return recommendations[:limit]
    
    def search_films(self, query):
        """
        Mencari film berdasarkan query menggunakan TMDB API
        
        Parameters
        ----------
        query : str
            Query pencarian film
            
        Returns
        -------
        list
            List film yang ditemukan
        """
        try:
            # Gunakan TMDB search
            search_results = self.tmdb_service.search_movies(query)
            
            formatted_results = []
            for movie in search_results.get('results', [])[:10]:
                # Get detailed info for each movie
                detailed_movie = self.tmdb_service.get_movie_details(movie['id'])
                if detailed_movie:
                    formatted_movie = self.tmdb_service.format_movie_data(detailed_movie)
                    if formatted_movie:
                        formatted_results.append(formatted_movie)
            
            return formatted_results
            
        except Exception as e:
            print(f"Error searching films: {e}")
            return self._search_fallback_films(query)
    
    def _search_fallback_films(self, query):
        """
        Mencari film di data lokal sebagai fallback
        
        Parameters
        ----------
        query : str
            Query pencarian
            
        Returns
        -------
        list
            List film yang ditemukan di data lokal
        """
        results = []
        query_lower = query.lower()
        
        for film_name, film_data in self.fallback_films_data.items():
            # Cek di title, genre, atau description
            if (query_lower in film_name.lower() or 
                query_lower in film_data.get('description', '').lower() or
                any(query_lower in genre.lower() for genre in film_data.get('genre', []))):
                
                formatted_film = {
                    'id': film_name.replace(' ', '_').lower(),
                    'title': film_data.get('title', film_name),
                    'original_title': film_data.get('title', film_name),
                    'release_year': film_data.get('release_year', 'Unknown'),
                    'release_date': str(film_data.get('release_year', 'Unknown')),
                    'director': film_data.get('director', 'Unknown'),
                    'genre': film_data.get('genre', []),
                    'description': film_data.get('description', 'Deskripsi tidak tersedia'),
                    'actors': film_data.get('actors', []),
                    'rating': film_data.get('rating', 0),
                    'vote_count': 1000,
                    'duration': film_data.get('duration', 120),
                    'poster_url': None,
                    'backdrop_url': None,
                    'popularity': film_data.get('rating', 0) * 100,
                    'recommendations': film_data.get('recommendations', []),
                    'tmdb_id': None,
                    'language': 'en'
                }
                results.append(formatted_film)
        
        return results
    
    def format_response(self, recommendations, input_text):
        """
        Format respons rekomendasi untuk frontend
        
        Parameters
        ----------
        recommendations : list
            List film yang direkomendasikan
        input_text : str
            Teks input dari pengguna
            
        Returns
        -------
        dict
            Respons yang diformat untuk frontend
        """
        if not recommendations:
            return {
                "message": "Maaf, saya tidak dapat menemukan rekomendasi film yang sesuai dengan preferensi Anda. Coba dengan kata kunci yang berbeda.",
                "recommendations": [],
                "total_results": 0,
                "query": input_text
            }
        
        # Buat pesan yang personal berdasarkan input
        response_messages = [
            f"Berdasarkan preferensi Anda '{input_text}', berikut adalah {len(recommendations)} rekomendasi film yang mungkin Anda sukai:",
            f"Saya menemukan {len(recommendations)} film yang cocok dengan selera Anda:",
            f"Dari analisis preferensi Anda, berikut {len(recommendations)} film yang direkomendasikan:",
            f"Berdasarkan kata kunci '{input_text}', ini adalah {len(recommendations)} film pilihan terbaik untuk Anda:"
        ]
        
        message = random.choice(response_messages)
        
        # Format recommendations untuk frontend
        formatted_recommendations = []
        for film in recommendations:
            # Buat confidence score berdasarkan rating dan popularity
            rating = film.get('rating', 0)
            popularity = film.get('popularity', 0)
            confidence = min(95, (rating * 10 + popularity / 100) / 2)
            
            formatted_film = {
                "id": film.get('id'),
                "title": film.get('title', 'Unknown'),
                "original_title": film.get('original_title'),
                "description": film.get('description', 'Deskripsi tidak tersedia'),
                "genre": film.get('genre', []),
                "director": film.get('director', 'Unknown'),
                "actors": film.get('actors', []),
                "release_year": film.get('release_year', 'Unknown'),
                "release_date": film.get('release_date', 'Unknown'),
                "rating": film.get('rating', 0),
                "vote_count": film.get('vote_count', 0),
                "duration": film.get('duration', 0),
                "confidence": round(confidence, 1),
                "poster_url": film.get('poster_url'),
                "backdrop_url": film.get('backdrop_url'),
                "popularity": film.get('popularity', 0),
                "recommendations": film.get('recommendations', []),
                "tmdb_id": film.get('tmdb_id'),
                "language": film.get('language', 'en')
            }
            formatted_recommendations.append(formatted_film)
        
        return {
            "message": message,
            "recommendations": formatted_recommendations,
            "total_results": len(formatted_recommendations),
            "query": input_text,
            "data_source": "TMDB" if recommendations and recommendations[0].get('tmdb_id') else "Local"
        }
    
    def get_film_details(self, film_id_or_title):
        """
        Mendapatkan detail lengkap sebuah film
        
        Parameters
        ----------
        film_id_or_title : str or int
            ID TMDB atau judul film
            
        Returns
        -------
        dict
            Detail lengkap film
        """
        try:
            # Jika input adalah angka, anggap sebagai TMDB ID
            if str(film_id_or_title).isdigit():
                movie_data = self.tmdb_service.get_movie_details(int(film_id_or_title))
                if movie_data:
                    return self.tmdb_service.format_movie_data(movie_data)
            else:
                # Jika input adalah string, lakukan pencarian
                search_results = self.search_films(film_id_or_title)
                if search_results:
                    return search_results[0]  # Return film pertama
            
            return None
            
        except Exception as e:
            print(f"Error getting film details: {e}")
            return None
    
    def get_popular_films(self, limit=20):
        """
        Mendapatkan film-film populer
        
        Parameters
        ----------
        limit : int
            Jumlah maksimal film populer
            
        Returns
        -------
        list
            List film populer
        """
        try:
            popular_movies = self.tmdb_service.get_popular_movies()
            
            formatted_movies = []
            for movie in popular_movies.get('results', [])[:limit]:
                detailed_movie = self.tmdb_service.get_movie_details(movie['id'])
                if detailed_movie:
                    formatted_movie = self.tmdb_service.format_movie_data(detailed_movie)
                    if formatted_movie:
                        formatted_movies.append(formatted_movie)
            
            return formatted_movies
            
        except Exception as e:
            print(f"Error getting popular films: {e}")
            # Return fallback popular films
            return list(self.fallback_films_data.values())[:limit]
