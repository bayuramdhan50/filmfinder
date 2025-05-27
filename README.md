# FilmFinder - Sistem Rekomendasi Film Berbasis NLP

<div align="center">
  <h3>Rekomendasi film berdasarkan preferensi pengguna dalam Bahasa Indonesia</h3>
</div>

## 📋 Deskripsi

FilmFinder adalah aplikasi web untuk mencari rekomendasi dan informasi seputar film berdasarkan preferensi yang diinputkan pengguna dalam bahasa Indonesia. Sistem ini menggunakan Natural Language Processing (NLP) untuk memahami input pengguna dan memberikan rekomendasi film berdasarkan model klasifikasi yang telah dilatih.

## ✨ Fitur

- 🔍 **Rekomendasi Film**: Analisis preferensi dalam bahasa natural untuk merekomendasikan film yang sesuai
- 🎤 **Input Suara**: Dukungan untuk input suara (speech-to-text) dalam Bahasa Indonesia
- 🤖 **Chatbot Film**: Tanya jawab interaktif tentang informasi film dan rekomendasi tontonan
- 📊 **Visualisasi Hasil**: Tampilan hasil dengan detail film dan tingkat kesesuaian dengan preferensi
- 🌙 **Mode Gelap**: Antarmuka yang nyaman untuk penggunaan di berbagai kondisi pencahayaan
- 🎬 **Database Film**: Koleksi film dengan berbagai genre dan informasi lengkap

## 🚀 Teknologi

### Backend
- Python 3.x
- Flask (Web framework)
- NLTK & Sastrawi (NLP untuk Bahasa Indonesia)
- Scikit-learn (Machine Learning - TF-IDF + Naive Bayes)
- Joblib (Model persistence)

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Web Speech API

## 🛠️ Instalasi dan Penggunaan

### Prasyarat
- Python 3.8+
- Node.js 18+
- npm atau yarn

### Langkah Instalasi

#### Backend
1. Clone repositori ini
   ```bash
   git clone https://github.com/bayuramdhan50/filmfinder.git
   cd filmfinder
   ```

2. Siapkan lingkungan virtual Python (opsional tapi disarankan)
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Install dependensi backend
   ```bash
   pip install -r requirements.txt
   ```

4. Jalankan server backend
   ```bash
   cd backend
   python app.py
   ```
   Server akan berjalan di http://localhost:5000

#### Frontend
1. Masuk ke direktori frontend
   ```bash
   cd frontend
   ```

2. Install dependensi frontend
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Jalankan server development frontend
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
   Frontend akan tersedia di http://localhost:3000

## 📚 Cara Menggunakan

1. Buka aplikasi di browser
2. Pilih tab "Rekomendasi Film"
3. Deskripsikan preferensi film yang diinginkan dalam bahasa Indonesia (bisa melalui ketikan atau input suara)
   - Contoh: "Saya ingin film action dengan superhero yang seru dan menegangkan"
   - Contoh: "Film komedi romantis yang lucu untuk ditonton bersama pacar"
4. Klik "Cari Film" untuk mendapatkan rekomendasi
5. Lihat hasil rekomendasi film beserta detail dan rating kesesuaian
6. Untuk pertanyaan lebih lanjut tentang film, gunakan tab "Chatbot Film"

## 📊 Struktur Proyek

```
filmfinder/
├── backend/                   # Kode backend Flask
│   ├── app.py                 # Aplikasi utama Flask
│   ├── data/                  # Data untuk model dan film
│   │   ├── films.json         # Database film
│   │   ├── faq.json           # FAQ untuk chatbot
│   │   ├── training_data.csv  # Data training model
│   │   └── training_films.csv # Data training film
│   ├── docs/                  # Dokumentasi backend
│   ├── models/                # Model-model
│   │   ├── classifier.py      # Model klasifikasi preferensi film
│   │   ├── chatbot.py         # Model chatbot film
│   │   └── translator.py      # Translator hasil prediksi
│   └── utils/                 # Utilitas
│       └── preprocessor.py    # Preprocessing teks Bahasa Indonesia
├── frontend/                  # Kode frontend Next.js
│   ├── app/                   # Aplikasi Next.js
│   │   ├── components/        # Komponen React
│   │   │   ├── FilmChatbot.tsx        # Komponen chatbot film
│   │   │   ├── FilmInputForm.tsx      # Form input preferensi film
│   │   │   ├── FilmResultCard.tsx     # Kartu hasil rekomendasi
│   │   │   └── FilmTabs.tsx           # Tab navigasi film
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript type definitions
│   │   ├── page.tsx           # Halaman utama
│   │   └── layout.tsx         # Layout aplikasi
│   ├── public/                # Aset statis
│   └── package.json           # Dependensi frontend
├── models/                    # Model yang sudah dilatih
│   └── film_recommender.joblib # Model rekomendasi film
├── data/                      # Data global
│   ├── films.json             # Database film utama
│   ├── faq_films.json         # FAQ khusus film
│   ├── training_data.csv      # Data training
│   └── training_films.csv     # Data training film
├── DOKUMENTASI.md             # Dokumentasi pengembangan
└── requirements.txt           # Dependensi backend
```

## 🔌 API Endpoints

### 1. Rekomendasi Film
- **URL**: `/api/recommend`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "text": "Saya ingin film action superhero yang seru dengan efek visual yang bagus"
  }
  ```
- **Response**:
  ```json
  {
    "recommendations": [
      {
        "title": "Avengers: Endgame",
        "genre": "Action, Adventure, Drama",
        "year": 2019,
        "rating": 8.4,
        "confidence": 0.89,
        "description": "Setelah peristiwa dahsyat Infinity War...",
        "director": "Anthony Russo, Joe Russo",
        "cast": ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"]
      }
    ],
    "confidence": 0.85,
    "genre_prediction": "Action",
    "alternative_recommendations": [
      {"title": "Iron Man", "confidence": 0.76},
      {"title": "Captain America", "confidence": 0.68}
    ]
  }
  ```

### 2. Chatbot Film
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "text": "Apa itu genre action?"
  }
  ```
- **Response**:
  ```json
  {
    "response": "Genre action adalah jenis film yang menampilkan adegan-adegan penuh aksi seperti perkelahian, kejar-kejaran, dan efek khusus yang menegangkan..."
  }
  ```

### 3. Info Film Spesifik
- **URL**: `/api/film/<film_id>`
- **Method**: GET
- **Response**:
  ```json
  {
    "title": "The Dark Knight",
    "genre": "Action, Crime, Drama",
    "year": 2008,
    "rating": 9.0,
    "description": "Batman menghadapi Joker dalam pertarungan psikologis yang intens...",
    "director": "Christopher Nolan",
    "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    "duration": 152
  }
  ```

### 4. Melatih Ulang Model
- **URL**: `/api/train`
- **Method**: POST
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Model rekomendasi film berhasil dilatih ulang"
  }
  ```

## 🛠️ Pengembangan

### Menambahkan Film Baru
Untuk menambahkan film baru ke database, tambahkan entri ke file `data/films.json` dengan format:

```json
{
  "id": "unique_film_id",
  "title": "Judul Film",
  "genre": "Action, Adventure",
  "year": 2023,
  "rating": 8.5,
  "description": "Deskripsi film...",
  "director": "Nama Sutradara",
  "cast": ["Aktor 1", "Aktor 2"],
  "duration": 120,
  "keywords": ["action", "superhero", "adventure"]
}
```

### Melatih Model dengan Data Baru
1. Tambahkan data training baru ke `data/training_films.csv`
2. Jalankan script training ulang:
   ```bash
   cd backend
   python -c "from models.classifier import FilmClassifier; classifier = FilmClassifier(); classifier.train()"
   ```
3. Atau gunakan endpoint `/api/train` untuk melatih melalui API

### Mengembangkan Fitur Chatbot
Tambahkan pertanyaan dan jawaban baru ke file `data/faq_films.json`:

```json
{
  "pertanyaan": "Apa itu genre thriller?",
  "jawaban": "Genre thriller adalah jenis film yang dirancang untuk membuat penonton merasa tegang dan penasaran...",
  "keywords": ["thriller", "genre", "tegang"]
}
```

## 🎯 Model Machine Learning

### Preprocessing Teks
- **Tokenisasi**: Memecah teks menjadi token-token kata
- **Stopword Removal**: Menghilangkan kata-kata umum yang tidak informatif
- **Stemming**: Mengubah kata ke bentuk dasarnya menggunakan Sastrawi
- **Normalisasi**: Mengubah teks ke huruf kecil dan menghilangkan karakter khusus

### Klasifikasi Film
- **Algoritma**: TF-IDF + Naive Bayes
- **Input**: Deskripsi preferensi film dalam Bahasa Indonesia
- **Output**: Prediksi genre dan rekomendasi film yang sesuai
- **Akurasi**: ~85% berdasarkan data testing

### Fitur Model
- Analisis sentimen preferensi pengguna
- Klasifikasi genre berdasarkan deskripsi
- Scoring kesesuaian film dengan preferensi
- Rekomendasi alternatif berdasarkan similarity

## ⚠️ Disclaimer

Aplikasi ini hanya bersifat informatif dan rekreasional. Rekomendasi film yang diberikan berdasarkan analisis algoritma machine learning dan mungkin tidak sepenuhnya sesuai dengan selera personal setiap pengguna. Nikmati pengalaman menonton dan jangan ragu untuk mengeksplorasi berbagai genre film!

## 👥 Kontributor

- Dibuat untuk Mata Kuliah Sistem Pakar - Semester 6
- Tim FilmFinder Development

## 📄 Lisensi

Proyek ini tersedia di bawah lisensi MIT. Lihat file `LICENSE` untuk informasi selengkapnya.

---

<div align="center">
  <p>🎬 Selamat menikmati pengalaman mencari film dengan FilmFinder! 🍿</p>
</div>
