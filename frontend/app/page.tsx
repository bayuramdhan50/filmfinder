'use client'

import { useState } from 'react';
import FilmHeader from './components/FilmHeader';
import FilmInputForm from './components/FilmInputForm';
import FilmResultCard from './components/FilmResultCard';
import FilmChatbot from './components/FilmChatbot';
import Loading from './components/Loading';
import FilmTabs from './components/FilmTabs';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const handleResult = (data: any) => {
    setResult(data);
    setShowInfo(false); // Sembunyikan info setelah hasil diterima
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
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
              <li>
                <strong>Deskripsikan preferensi</strong> film Anda dengan bahasa natural dalam kolom input. 
                Contoh: "Saya suka film action dengan superhero dan efek visual yang keren."
              </li>
              <li>
                <strong>Gunakan fitur input suara</strong> dengan mengklik ikon mikrofon untuk kemudahan input.
              </li>
              <li>
                <strong>Klik tombol "Cari Film"</strong> untuk mendapatkan rekomendasi film yang sesuai.
              </li>
              <li>
                <strong>Chat dengan FilmBot</strong> di tab kedua untuk informasi lebih detail tentang film.
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fitur Unggulan:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                Pemahaman bahasa Indonesia yang natural
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                Rekomendasi berdasarkan genre, mood, dan preferensi
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                Skor kesesuaian untuk setiap rekomendasi
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                Chatbot untuk informasi detail film
              </li>
            </ul>
          </div>        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20">
          <p className="text-sm text-center">
            <strong className="text-yellow-400">Catatan:</strong> FilmFinder menggunakan teknologi NLP untuk memahami preferensi Anda
            dan memberikan rekomendasi film yang personal. Semakin detail deskripsi Anda, semakin akurat rekomendasinya.
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => setShowInfo(false)} 
        className="mt-6 w-full film-button py-3 rounded-lg font-medium transition-all duration-200"
      >
        Mulai Mencari Film
      </button>
    </div>
  );  const tabs = [
    {
      id: 'recommender',
      label: 'Rekomendasi Film',
      default: true
    },
    {
      id: 'search',
      label: 'Cari Film'
    },
    {
      id: 'popular',
      label: 'Film Populer'
    },
    {
      id: 'chatbot',
      label: 'Film Assistant'
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/film-bg.svg')] opacity-5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FilmHeader title="FilmFinder" subtitle="Rekomendasi film berdasarkan preferensi Anda" />
          <FilmTabs tabs={tabs} />
        </div>
        
        <footer className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
              <p className="text-yellow-400 font-semibold text-lg mb-2">FilmFinder &copy; {new Date().getFullYear()}</p>
              <p className="text-gray-300 text-sm mb-4">Sistem Rekomendasi Film Berbasis NLP</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-700/50 rounded">TF-IDF</span>
                <span className="px-2 py-1 bg-gray-700/50 rounded">Naive Bayes</span>
                <span className="px-2 py-1 bg-gray-700/50 rounded">Flask</span>
                <span className="px-2 py-1 bg-gray-700/50 rounded">Next.js</span>
                <span className="px-2 py-1 bg-gray-700/50 rounded">Tailwind CSS</span>
              </div>
              
              {/* Tampilkan tombol untuk menampilkan info kembali jika sudah disembunyikan */}
              {!showInfo && !isLoading && result && (
                <button 
                  onClick={() => setShowInfo(true)} 
                  className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm underline focus:outline-none transition-colors"
                >
                  Tampilkan informasi penggunaan
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
