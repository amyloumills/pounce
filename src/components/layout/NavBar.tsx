import { useRef } from 'react';
import { Cat, Plus } from 'lucide-react';
import { CatRain } from '../../components/features/CatRain';
import logo from '../../assets/Pounce.png';
import { Button } from '../ui/Button';

export const Navbar = ({ onUploadClick }: { onUploadClick: () => void }) => {
  const rainRef = useRef<{ startRain: () => void }>(null);

  return (
    <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
      <CatRain ref={rainRef} />

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          onClick={() => rainRef.current?.startRain()}
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
        >
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-20 transition-transform shadow-lg shadow-indigo-200">
            <Cat className="w-6 h-6 text-white" />
          </div>
          <img src={logo} alt="Pounce" className="h-16 w-auto" />
        </div>

        <Button onClick={onUploadClick} leftIcon={<Plus className="w-4 h-4" />} variant="primary">
          Upload Cat
        </Button>
      </div>
    </nav>
  );
};
