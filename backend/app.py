from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import joblib
import json
import nltk
import time
import traceback
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup NLTK - Download resource yang dibutuhkan
def setup_nltk():
    """Download semua resource NLTK yang dibutuhkan aplikasi"""
    print("Menyiapkan resource NLTK...")
    # Pastikan resource punkt dan stopwords tersedia
    try:
        nltk.download('punkt_tab')
        nltk.download('stopwords')
        print("Resource NLTK berhasil disiapkan")
    except Exception as e:
        print(f"Gagal menyiapkan NLTK: {e}")

# Jalankan setup NLTK pertama kali
setup_nltk()

# Menambahkan path untuk import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import modul-modul aplikasi
from backend.utils.preprocessor import preprocess_text, extract_film_patterns
from backend.models.classifier import FilmRecommender
from backend.models.translator import FilmTranslator
from backend.models.chatbot import FilmChatbot

# Inisialisasi Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS untuk semua domain

# Inisialisasi model-model
film_recommender = FilmRecommender()
film_translator = FilmTranslator()
film_chatbot = FilmChatbot()

# Load model jika sudah ada
def load_models():
    """Load semua model yang dibutuhkan aplikasi"""
    try:
        # Cek apakah model film_recommender sudah ada
        model_path = os.path.join('models', 'film_recommender.joblib')
        if os.path.exists(model_path):
            print("Model recommender ditemukan, memuat...")
        else:
            print("Model recommender tidak ditemukan. Training model...")
            # Training model dengan data yang tersedia
            training_data_path = os.path.join('data', 'training_films.csv')
            if os.path.exists(training_data_path):
                film_recommender.train_from_csv(training_data_path)
                print("Model recommender berhasil dilatih dan disimpan")
            else:
                print("File training data tidak ditemukan")
    except Exception as e:
        print(f"Gagal memuat model: {e}")

# Jalankan load_models saat aplikasi pertama kali dijalankan
load_models()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint untuk cek status API"""
    return jsonify({
        "status": "ok",
        "message": "API FilmFinder berjalan dengan baik",
        "timestamp": time.time()
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Endpoint untuk menganalisis teks dan memberikan rekomendasi film
    
    Request JSON:
    {
        "text": "teks input dari pengguna"
    }
    
    Response JSON:
    {
        "message": "pesan rekomendasi",
        "recommendations": [
            {
                "title": "judul film",
                "description": "deskripsi film",
                "genre": "genre film",
                "director": "sutradara film",
                "release_year": "tahun rilis",
                "rating": "rating film",
                "confidence": "tingkat kepercayaan rekomendasi"
            }
        ]
    }
    """
    try:
        # Ambil data dari request
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                "error": "Teks input tidak boleh kosong"
            }), 400
        
        # Simpan teks input asli
        input_text = text
        
        # Preprocessing teks
        processed_text = preprocess_text(text)
        
        # Ekstrak pola film secara eksplisit
        film_patterns = extract_film_patterns(text)
        
        # Prediksi genre berdasarkan teks yang telah diproses
        prediction_result = film_recommender.predict(processed_text)
        
        # Dapatkan rekomendasi film berdasarkan genre yang diprediksi
        top_genres = prediction_result.get('top_genres', [])
        
        # Gunakan Film Translator untuk mendapatkan rekomendasi film
        film_recommendations = film_translator.get_recommendations(top_genres)
        
        # Format respons untuk frontend
        response = film_translator.format_response(film_recommendations, input_text)
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in /api/analyze: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat memproses permintaan",
            "details": str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Endpoint untuk chatbot film
    
    Request JSON:
    {
        "message": "pesan dari pengguna"
    }
    
    Response JSON:
    {
        "type": "text|film_info|recommendations|genre_films",
        "content": "respons chatbot",
        "film": {object} | "recommendations": [object] | "films": [object]
    }
    """
    try:
        # Ambil data dari request
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({
                "error": "Pesan tidak boleh kosong"
            }), 400
        
        # Dapatkan respons dari chatbot
        response = film_chatbot.get_response(message)
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in /api/chat: {e}")
        traceback.print_exc()
        return jsonify({
            "type": "text",
            "content": "Maaf, terjadi kesalahan saat memproses pesan Anda."
        }), 500

@app.route('/api/film', methods=['GET'])
def get_film_info():
    """
    Endpoint untuk mendapatkan informasi film berdasarkan judul
    
    Query parameters:
    - title: judul film
    
    Response JSON:
    {
        "title": "judul film",
        "description": "deskripsi film",
        "genre": ["genre film"],
        "director": "sutradara film",
        "release_year": "tahun rilis",
        "rating": "rating film",
        "actors": ["aktor film"]
    }
    """
    try:
        # Ambil parameter dari query
        title = request.args.get('title', '')
        
        if not title:
            return jsonify({
                "error": "Judul film tidak boleh kosong"
            }), 400
        
        # Dapatkan informasi film
        film_info = film_translator.get_film_details(title)
        
        if not film_info or "message" in film_info and "tidak ditemukan" in film_info["message"]:
            return jsonify({
                "error": f"Film dengan judul '{title}' tidak ditemukan"
            }), 404
        
        return jsonify(film_info)
    
    except Exception as e:
        print(f"Error in /api/film: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat memproses permintaan",
            "details": str(e)
        }), 500

@app.route('/api/genre', methods=['GET'])
def get_films_by_genre():
    """
    Endpoint untuk mendapatkan film berdasarkan genre
    
    Query parameters:
    - name: nama genre
    - limit: jumlah maksimum film yang dikembalikan (opsional, default: 5)
    
    Response JSON:
    {
        "genre": "nama genre",
        "films": [
            {
                "title": "judul film",
                "description": "deskripsi film",
                ...
            }
        ],
        "count": "jumlah film"
    }
    """
    try:
        # Ambil parameter dari query
        genre_name = request.args.get('name', '')
        limit = int(request.args.get('limit', '5'))
        
        if not genre_name:
            return jsonify({
                "error": "Nama genre tidak boleh kosong"
            }), 400
        
        # Dapatkan film berdasarkan genre
        result = film_translator.get_films_by_genre(genre_name, limit)
        
        if not result["films"]:
            return jsonify({
                "error": f"Tidak ada film dengan genre '{genre_name}' yang ditemukan"
            }), 404
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in /api/genre: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat memproses permintaan",
            "details": str(e)
        }), 500

# Route untuk training model
@app.route('/api/train', methods=['POST'])
def train_model():
    """
    Endpoint untuk melatih model secara manual
    
    Request JSON:
    {
        "file_path": "path ke file training data (opsional)"
    }
    
    Response JSON:
    {
        "message": "hasil training",
        "evaluation": {object}
    }
    """
    try:
        # Ambil data dari request
        data = request.get_json()
        file_path = data.get('file_path', os.path.join('data', 'training_films.csv'))
        
        # Cek apakah file ada
        if not os.path.exists(file_path):
            return jsonify({
                "error": f"File training data '{file_path}' tidak ditemukan"
            }), 404
        
        # Latih model
        evaluation = film_recommender.train_from_csv(file_path)
        
        if evaluation:
            return jsonify({
                "message": "Model berhasil dilatih",
                "evaluation": evaluation
            })
        else:
            return jsonify({
                "error": "Gagal melatih model"
            }), 500
    
    except Exception as e:
        print(f"Error in /api/train: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat melatih model",
            "details": str(e)
        }), 500

@app.route('/api/search', methods=['GET'])
def search_films():
    """
    Endpoint untuk mencari film menggunakan TMDB API
    
    Query parameters:
    - q: query pencarian film
    - page: halaman hasil (optional, default: 1)
    
    Response JSON:
    {
        "results": [list film],
        "total_results": int,
        "query": "query pencarian"
    }
    """
    try:
        query = request.args.get('q', '')
        page = int(request.args.get('page', 1))
        
        if not query:
            return jsonify({
                "error": "Parameter query 'q' tidak boleh kosong"
            }), 400
        
        # Pencarian film menggunakan translator
        search_results = film_translator.search_films(query)
        
        return jsonify({
            "results": search_results,
            "total_results": len(search_results),
            "query": query,
            "page": page
        })
    
    except Exception as e:
        print(f"Error in /api/search: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat mencari film",
            "details": str(e)
        }), 500

@app.route('/api/popular', methods=['GET'])
def get_popular_films():
    """
    Endpoint untuk mendapatkan film populer dari TMDB
    
    Query parameters:
    - limit: jumlah maksimal film (optional, default: 20)
    
    Response JSON:
    {
        "results": [list film populer],
        "total_results": int
    }
    """
    try:
        limit = int(request.args.get('limit', 20))
        limit = min(limit, 50)  # Maksimal 50 film
        
        # Dapatkan film populer
        popular_films = film_translator.get_popular_films(limit)
        
        return jsonify({
            "results": popular_films,
            "total_results": len(popular_films)
        })
    
    except Exception as e:
        print(f"Error in /api/popular: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat mengambil film populer",
            "details": str(e)
        }), 500

@app.route('/api/film/<film_id>', methods=['GET'])
def get_film_details(film_id):
    """
    Endpoint untuk mendapatkan detail lengkap film berdasarkan ID atau title
    
    Path parameters:
    - film_id: ID TMDB atau judul film
    
    Response JSON:
    {
        "film": {detail lengkap film}
    }
    """
    try:
        # Dapatkan detail film
        film_details = film_translator.get_film_details(film_id)
        
        if not film_details:
            return jsonify({
                "error": "Film tidak ditemukan"
            }), 404
        
        return jsonify({
            "film": film_details
        })
    
    except Exception as e:
        print(f"Error in /api/film/{film_id}: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat mengambil detail film",
            "details": str(e)
        }), 500

@app.route('/api/recommend', methods=['POST'])
def get_recommendations_by_genre():
    """
    Endpoint untuk mendapatkan rekomendasi film berdasarkan genre spesifik
    
    Request JSON:
    {
        "genres": ["list genre"],
        "limit": int (optional, default: 10)
    }
    
    Response JSON:
    {
        "recommendations": [list film],
        "total_results": int,
        "genres": ["genre yang dicari"]
    }
    """
    try:
        data = request.get_json()
        genres = data.get('genres', [])
        limit = data.get('limit', 10)
        
        if not genres:
            return jsonify({
                "error": "Parameter 'genres' tidak boleh kosong"
            }), 400
        
        # Dapatkan rekomendasi berdasarkan genre
        recommendations = film_translator.get_recommendations(genres, limit)
        
        return jsonify({
            "recommendations": recommendations,
            "total_results": len(recommendations),
            "genres": genres
        })
    
    except Exception as e:
        print(f"Error in /api/recommend: {e}")
        traceback.print_exc()
        return jsonify({
            "error": "Terjadi kesalahan saat mengambil rekomendasi",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    # Jalankan aplikasi Flask
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
