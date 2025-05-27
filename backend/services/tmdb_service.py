"""
TMDB API Service untuk mengambil data film dari The Movie Database
"""
import requests
import os
import json
from typing import Dict, List, Optional, Any
import time

class TMDBService:
    """
    Service untuk berinteraksi dengan TMDB API
    """
    def __init__(self):
        """
        Inisialisasi TMDB service dengan API key dan base URL
        """
        self.api_key = os.getenv('TMDB_API_KEY', 'your_tmdb_api_key_here')
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base_url = "https://image.tmdb.org/t/p/w500"
        self.session = requests.Session()
        
        # Cache untuk menyimpan data film sementara
        self.cache = {}
        
        # Flag untuk menandai apakah API key valid
        self.api_key_valid = self._validate_api_key()
        
    def _validate_api_key(self) -> bool:
        """
        Memvalidasi apakah API key TMDB valid
        
        Returns
        -------
        bool
            True jika API key valid, False jika tidak
        """        # Jika API key adalah demo atau placeholder, return False
        if not self.api_key or self.api_key in ['your_tmdb_api_key_here', 'demo', 'demo_key_for_testing']:
            print("TMDB API key tidak valid atau dalam mode demo. Menggunakan fallback data lokal.")
            return False
            
        try:
            # Test API key dengan request sederhana
            url = f"{self.base_url}/configuration"
            params = {'api_key': self.api_key}
            
            response = self.session.get(url, params=params, timeout=5)
            
            if response.status_code == 200:
                print("✅ TMDB API key valid dan aktif")
                return True
            elif response.status_code == 401:
                print("❌ TMDB API key tidak valid atau kedaluwarsa")
                return False
            else:
                print(f"⚠️ TMDB API response tidak terduga: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error validating TMDB API key: {e}")
            return False
    
    def search_movies(self, query: str, language: str = 'id-ID', page: int = 1) -> Dict[str, Any]:
        """
        Mencari film berdasarkan query
        
        Parameters
        ----------
        query : str
            Kata kunci pencarian
        language : str
            Bahasa untuk response (default: id-ID untuk Indonesia)
        page : int
            Halaman hasil (default: 1)
            
        Returns
        -------
        Dict[str, Any]
            Data hasil pencarian film
        """
        # Jika API key tidak valid, return empty results
        if not self.api_key_valid:
            print("TMDB API key tidak valid, menggunakan fallback data lokal")
            return {'results': []}
            
        try:
            url = f"{self.base_url}/search/movie"
            params = {
                'api_key': self.api_key,
                'query': query,
                'language': language,
                'page': page,
                'include_adult': False
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error searching movies: {e}")
            return {'results': []}
    
    def get_movie_details(self, movie_id: int, language: str = 'id-ID') -> Optional[Dict[str, Any]]:
        """
        Mendapatkan detail film berdasarkan ID
        
        Parameters
        ----------
        movie_id : int
            ID film dari TMDB
        language : str
            Bahasa untuk response
            
        Returns
        -------
        Optional[Dict[str, Any]]
            Detail film atau None jika gagal
        """
        try:
            # Cek cache terlebih dahulu
            cache_key = f"movie_{movie_id}_{language}"
            if cache_key in self.cache:
                return self.cache[cache_key]
            
            url = f"{self.base_url}/movie/{movie_id}"
            params = {
                'api_key': self.api_key,
                'language': language,
                'append_to_response': 'credits,videos,recommendations'
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            movie_data = response.json()
            
            # Simpan ke cache
            self.cache[cache_key] = movie_data
            
            return movie_data
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting movie details: {e}")
            return None
    
    def discover_movies(self, genre_ids: List[int] = None, sort_by: str = 'popularity.desc', 
                       language: str = 'id-ID', page: int = 1) -> Dict[str, Any]:
        """
        Discover film berdasarkan kriteria tertentu
        
        Parameters
        ----------
        genre_ids : List[int]
            List ID genre
        sort_by : str
            Urutan sorting (default: popularity.desc)
        language : str
            Bahasa response
        page : int
            Halaman hasil
            
        Returns
        -------
        Dict[str, Any]
            Data film yang ditemukan
        """
        try:
            url = f"{self.base_url}/discover/movie"
            params = {
                'api_key': self.api_key,
                'language': language,
                'sort_by': sort_by,
                'page': page,
                'include_adult': False,
                'vote_count.gte': 100  # Minimal 100 vote untuk kualitas
            }
            
            if genre_ids:
                params['with_genres'] = ','.join(map(str, genre_ids))
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error discovering movies: {e}")
            return {'results': []}
    
    def get_genres(self, language: str = 'id-ID') -> Dict[str, Any]:
        """
        Mendapatkan daftar genre film
        
        Parameters
        ----------
        language : str
            Bahasa response
            
        Returns
        -------
        Dict[str, Any]
            Daftar genre
        """
        try:
            url = f"{self.base_url}/genre/movie/list"
            params = {
                'api_key': self.api_key,
                'language': language
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting genres: {e}")
            return {'genres': []}
    
    def get_popular_movies(self, language: str = 'id-ID', page: int = 1) -> Dict[str, Any]:
        """
        Mendapatkan film populer
        
        Parameters
        ----------
        language : str
            Bahasa response
        page : int
            Halaman hasil
            
        Returns
        -------
        Dict[str, Any]
            Data film populer
        """
        try:
            url = f"{self.base_url}/movie/popular"
            params = {
                'api_key': self.api_key,
                'language': language,
                'page': page
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting popular movies: {e}")
            return {'results': []}
    
    def format_movie_data(self, tmdb_movie: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format data film dari TMDB ke format aplikasi
        
        Parameters
        ----------
        tmdb_movie : Dict[str, Any]
            Data film dari TMDB API
            
        Returns
        -------
        Dict[str, Any]
            Data film dalam format aplikasi
        """
        try:
            # Ambil genre names jika ada
            genres = []
            if 'genres' in tmdb_movie:
                genres = [genre['name'] for genre in tmdb_movie['genres']]
            elif 'genre_ids' in tmdb_movie:
                # Mapping genre IDs ke nama (simplified)
                genre_mapping = {
                    28: "Aksi", 35: "Komedi", 18: "Drama", 27: "Horror",
                    10749: "Romance", 878: "Sci-Fi", 53: "Thriller",
                    12: "Petualangan", 16: "Animasi", 80: "Kriminal",
                    99: "Dokumenter", 10751: "Keluarga", 14: "Fantasi",
                    36: "Sejarah", 10402: "Musik", 9648: "Misteri",
                    10770: "TV Movie", 37: "Western", 10752: "Perang"
                }
                genres = [genre_mapping.get(gid, "Unknown") for gid in tmdb_movie.get('genre_ids', [])]
            
            # Ambil sutradara jika ada dalam credits
            director = "Unknown"
            if 'credits' in tmdb_movie and 'crew' in tmdb_movie['credits']:
                directors = [person['name'] for person in tmdb_movie['credits']['crew'] 
                           if person['job'] == 'Director']
                if directors:
                    director = directors[0]
            
            # Ambil aktor utama jika ada dalam credits
            actors = []
            if 'credits' in tmdb_movie and 'cast' in tmdb_movie['credits']:
                actors = [person['name'] for person in tmdb_movie['credits']['cast'][:5]]
            
            # Format durasi
            runtime = tmdb_movie.get('runtime', 0)
            
            # URL poster
            poster_path = tmdb_movie.get('poster_path')
            poster_url = f"{self.image_base_url}{poster_path}" if poster_path else None
            
            # URL backdrop
            backdrop_path = tmdb_movie.get('backdrop_path')
            backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None
            
            # Rekomendasi film
            recommendations = []
            if 'recommendations' in tmdb_movie and 'results' in tmdb_movie['recommendations']:
                recommendations = [rec['title'] for rec in tmdb_movie['recommendations']['results'][:5]]
            
            return {
                'id': tmdb_movie.get('id'),
                'title': tmdb_movie.get('title', 'Unknown'),
                'original_title': tmdb_movie.get('original_title'),
                'release_year': tmdb_movie.get('release_date', '')[:4] if tmdb_movie.get('release_date') else 'Unknown',
                'release_date': tmdb_movie.get('release_date', 'Unknown'),
                'director': director,
                'genre': genres,
                'description': tmdb_movie.get('overview', 'Deskripsi tidak tersedia'),
                'actors': actors,
                'rating': round(tmdb_movie.get('vote_average', 0), 1),
                'vote_count': tmdb_movie.get('vote_count', 0),
                'duration': runtime,
                'poster_url': poster_url,
                'backdrop_url': backdrop_url,
                'popularity': tmdb_movie.get('popularity', 0),
                'recommendations': recommendations,
                'tmdb_id': tmdb_movie.get('id'),
                'language': tmdb_movie.get('original_language', 'en')
            }
            
        except Exception as e:
            print(f"Error formatting movie data: {e}")
            return {}
    
    def get_movie_recommendations_by_genre(self, genre_names: List[str], limit: int = 10) -> List[Dict[str, Any]]:
        """
        Mendapatkan rekomendasi film berdasarkan nama genre
        
        Parameters
        ----------
        genre_names : List[str]
            List nama genre
        limit : int
            Jumlah maksimal film yang dikembalikan
            
        Returns
        -------
        List[Dict[str, Any]]
            List film yang direkomendasikan
        """
        try:
            # Dapatkan daftar genre untuk mapping nama ke ID
            genres_response = self.get_genres()
            genre_map = {genre['name'].lower(): genre['id'] for genre in genres_response.get('genres', [])}
            
            # Mapping genre Indonesia ke Inggris
            indonesia_to_english = {
                'aksi': 'action',
                'petualangan': 'adventure',
                'animasi': 'animation',
                'komedi': 'comedy',
                'kriminal': 'crime',
                'dokumenter': 'documentary',
                'drama': 'drama',
                'keluarga': 'family',
                'fantasi': 'fantasy',
                'sejarah': 'history',
                'horror': 'horror',
                'horor': 'horror',
                'musik': 'music',
                'misteri': 'mystery',
                'romance': 'romance',
                'romantis': 'romance',
                'sci-fi': 'science fiction',
                'fiksi ilmiah': 'science fiction',
                'thriller': 'thriller',
                'perang': 'war',
                'western': 'western'
            }
            
            # Convert genre names ke IDs
            genre_ids = []
            for genre_name in genre_names:
                genre_lower = genre_name.lower()
                
                # Cek mapping Indonesia ke Inggris
                if genre_lower in indonesia_to_english:
                    english_genre = indonesia_to_english[genre_lower]
                    if english_genre in genre_map:
                        genre_ids.append(genre_map[english_genre])
                
                # Cek langsung
                elif genre_lower in genre_map:
                    genre_ids.append(genre_map[genre_lower])
            
            if not genre_ids:
                # Jika tidak ada genre yang cocok, ambil film populer
                movies_response = self.get_popular_movies()
            else:
                # Discover movies berdasarkan genre
                movies_response = self.discover_movies(genre_ids=genre_ids)
            
            movies = []
            for movie in movies_response.get('results', [])[:limit]:
                # Dapatkan detail lengkap untuk setiap film
                detailed_movie = self.get_movie_details(movie['id'])
                if detailed_movie:
                    formatted_movie = self.format_movie_data(detailed_movie)
                    if formatted_movie:
                        movies.append(formatted_movie)
                
                # Rate limiting
                time.sleep(0.1)
            
            return movies
            
        except Exception as e:
            print(f"Error getting movie recommendations: {e}")
            return []
