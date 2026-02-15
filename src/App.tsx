import { useState } from 'react';
import { useCats } from './hooks/useCats';
import { CatCard } from './components/features/CatCard';
import { Navbar } from './components/layout/NavBar';
import { UploadModal } from './components/features/UploadModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const { data: cats, isLoading, error, refetch } = useCats();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onUploadClick={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* --- ERROR STATE --- */}
        {error && (
          <div className="mb-10 bg-red-50 border border-red-100 p-6 rounded-4xl flex flex-col items-center text-center gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Hiss-tory repeating itself...</h2>
              <p className="text-sm text-slate-500">
                We couldn't find any cats. It might be our litter box, not yours.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-white border border-red-200 px-4 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* --- LOADING STATE --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 bg-white p-2 rounded-4xl shadow-sm border border-slate-100"
              >
                <div className="w-full h-full bg-slate-100 animate-pulse rounded-[1.75rem]" />
              </div>
            ))}
          </div>
        ) : (
          /* --- SUCCESS STATE --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {cats?.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}

        {/* --- EMPTY STATE --- */}
        {!isLoading && !error && cats?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No cats found. Time to upload one!</p>
          </div>
        )}
      </main>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
