/**
 * Komponen InputForm untuk menerima input preferensi film dari pengguna
 * Mengirim input ke API backend untuk diproses
 */
'use client'

import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { debounce } from 'lodash'; // Install dengan: npm install lodash

interface InputFormProps {
  onResult: (data: any) => void;
  onLoading: (loading: boolean) => void;
}

export default function InputForm({ onResult, onLoading }: InputFormProps) {
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api/analyze');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const [examples, setExamples] = useState<string[]>([
    'Saya suka film action dengan efek visual yang keren',
    'Film drama yang mengharukan dan memiliki pesan moral',
    'Rekomendasi film horor yang benar-benar menegangkan',
    'Saya ingin menonton film sci-fi dengan plot twist menarik',
    'Film komedi romantis yang ringan dan menghibur'
  ]);
  // Menggunakan speech recognition hook
  const {
    isListening,
    startListening,
    stopListening,
    hasSupport
  } = useSpeechRecognition({ onResult: (text) => setPreferences(prev => prev + ' ' + text) });

  // Cek status koneksi ke backend API
  const checkConnection = useCallback(debounce(async () => {
    try {
      setConnectionStatus('connecting');
      const response = await axios.get(apiUrl.replace('/analyze', '/health'), 
      { timeout: 3000 });
      if (response.status === 200) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('failed');
        setApiUrl('https://filmfinder-api-fallback.herokuapp.com/api/analyze'); // Ganti dengan URL fallback jika ada
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('failed');
      // Fallback ke API publik jika local tidak tersedia
      setApiUrl('https://filmfinder-api-fallback.herokuapp.com/api/analyze'); // Ganti dengan URL fallback jika ada
    }
  }, 500), [apiUrl]);

  // Cek koneksi API pada load pertama
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preferences.trim()) {
      setError('Silakan masukkan preferensi film Anda');
      return;
    }

    if (isSubmitting) return;

    try {
      setError('');
      setIsSubmitting(true);
      onLoading(true);
      
      // Kirim data ke backend
      const response = await axios.post(apiUrl, { text: preferences }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 detik timeout
      });
      
      if (response.data) {
        onResult(response.data);
        setRetryCount(0);
      } else {
        throw new Error('Tidak ada data yang diterima dari server');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      
      // Coba hingga maxRetries
      if (retryCount < maxRetries) {
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(() => handleSubmit(e), 1000); // Coba lagi setelah 1 detik
      } else {
        setError(err.response?.data?.message || 
                err.message || 
                'Terjadi kesalahan saat memproses permintaan Anda');
        onResult(null);
      }
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setPreferences('');
    setError('');
    onResult(null);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(e.target.value);
    setError('');
  };

  // Isi contoh ke form
  const fillExample = (example: string) => {
    setPreferences(example);
    setError('');
  };  return (
    <div className="film-card rounded-xl p-8 w-full max-w-4xl mx-auto shadow-2xl backdrop-blur-lg">
      {/* Header dengan ikon film */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 film-sparkle shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gradient mb-3">Temukan Film Impian Anda</h2>
        <p className="text-gray-300 text-lg">Deskripsikan preferensi film dalam bahasa Indonesia dan dapatkan rekomendasi yang tepat</p>
        
        {/* Status koneksi */}
        <div className="mt-4 flex items-center justify-center">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === 'connected' ? 'bg-green-900 bg-opacity-50 text-green-300 border border-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-900 bg-opacity-50 text-yellow-300 border border-yellow-500' :
            connectionStatus === 'failed' ? 'bg-red-900 bg-opacity-50 text-red-300 border border-red-500' :
            'bg-gray-900 bg-opacity-50 text-gray-300 border border-gray-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-spin' :
              connectionStatus === 'failed' ? 'bg-red-400' : 'bg-gray-400'
            }`}></div>
            <span>
              {connectionStatus === 'connected' ? 'Terhubung ke server' :
               connectionStatus === 'connecting' ? 'Menghubungkan...' :
               connectionStatus === 'failed' ? 'Koneksi terputus' : 'Status tidak diketahui'}
            </span>
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Input Area */}
        <div className="relative">          <label htmlFor="preferences" className="block text-sm font-medium text-yellow-300 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Preferensi Film Anda
          </label>
          <div className="relative">
            <textarea
              id="preferences"
              name="preferences"
              rows={5}
              value={preferences}
              onChange={handleInputChange}
              placeholder="Contoh: Saya ingin film action superhero yang seru dengan efek visual yang memukau dan cerita yang menegangkan..."
              className="film-input w-full p-4 rounded-lg resize-none placeholder-gray-400 text-white"
              disabled={isSubmitting}
            />
            
            {/* Voice Input Button */}
            {hasSupport && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isSubmitting}
                className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Berhenti merekam' : 'Mulai input suara'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isListening 
                      ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                      : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    } 
                  />
                </svg>
              </button>
            )}
          </div>
          
          {isListening && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-900/50 text-red-300 border border-red-500/30">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-ping"></span>
                Sedang mendengarkan...
              </span>
            </div>
          )}
        </div>

        {/* Quick Examples */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-yellow-300">
            Atau pilih contoh preferensi:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillExample(example)}
                disabled={isSubmitting}
                className="text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-sm transition-all duration-200 border border-gray-600/30 hover:border-yellow-400/30 disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-900/50 border border-red-500/30 text-red-300">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || !preferences.trim()}
            className={`flex-1 film-button px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
              isSubmitting || !preferences.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mencari Film...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Cari Film</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-all duration-200 border border-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400">Status API:</span>
            {connectionStatus === 'connecting' && (
              <span className="flex items-center text-yellow-400">
                <span className="h-2 w-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></span>
                Menyambung...
              </span>
            )}
            {connectionStatus === 'connected' && (
              <span className="flex items-center text-green-400">
                <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span>
                Terhubung
              </span>
            )}
            {connectionStatus === 'failed' && (
              <span className="flex items-center text-red-400">
                <span className="h-2 w-2 bg-red-400 rounded-full mr-1"></span>
                Offline
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
