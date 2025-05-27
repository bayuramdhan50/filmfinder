/**
 * Komponen Loading untuk menampilkan indikator loading
 * Ditampilkan saat menunggu respons dari server
 */
'use client'

export default function Loading() {
  return (
    <div className="film-card p-12 text-center w-full max-w-2xl mx-auto my-8">
      <div className="relative flex items-center justify-center mb-6">
        {/* Film reel animation */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-400 rounded-full flex items-center justify-center animate-spin">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
          </div>
          {/* Sparkle effects */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gradient">Mencari Film Terbaik</h3>
        <p className="text-gray-300">Sedang menganalisis preferensi Anda...</p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          <p>🎬 Memproses preferensi dengan NLP</p>
          <p>🤖 Menganalisis dengan TF-IDF & Naive Bayes</p>
          <p>⭐ Menyiapkan rekomendasi terbaik</p>
        </div>
      </div>
    </div>
  );
}
