
import React, { useState, useCallback, useEffect } from 'react';
import { RPMForm } from './components/RPMForm';
import { RPMDisplay } from './components/RPMDisplay';
import type { FormData, RPMData } from './types';
import { generateRPM } from './services/geminiService';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [rpmData, setRpmData] = useState<RPMData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedRpmData = localStorage.getItem('lastRpmData');
    if (savedRpmData) {
      try {
        setRpmData(JSON.parse(savedRpmData));
      } catch (e) {
        console.error("Gagal mem-parsing data RPM dari localStorage", e);
        localStorage.removeItem('lastRpmData');
      }
    }
  }, []);

  const handleGenerate = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setRpmData(null);
    try {
      const result = await generateRPM(formData);
      setRpmData(result);
      localStorage.setItem('lastRpmData', JSON.stringify(result));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat RPM. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">
           
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            Generator Rencana Pembelajaran Mendalam (RPM)
          </p>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <RPMForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <SpinnerIcon className="w-16 h-16 text-blue-500" />
                <p className="mt-4 text-lg font-semibold">Sedang membuat RPM...</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Proses ini mungkin memakan waktu beberapa saat. Mohon tunggu.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-lg" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            {rpmData && !isLoading && (
              <RPMDisplay data={rpmData} />
        
            
            
          </div>
        </div>
      </main>
      <footer className="text-center py-4 mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>&copy; {new Date().getFullYear()} Dedyputunesanusi. Dibuat untuk Pendidikan Indonesia.</p>
      </footer>
    </div>
  );
};

export default App;
