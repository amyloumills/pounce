import { Heart, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { EnrichedCat } from '../../types/cat';
import { useCatActions } from '../../hooks/useCatActions';

interface CatCardProps {
  cat: EnrichedCat;
}

export const CatCard = ({ cat }: CatCardProps) => {
  const { vote, favourite, unfavourite } = useCatActions();

  return (
    <div className="group relative bg-white rounded-4xl p-2 pb-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-100 flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-slate-50">
        <img
          src={cat.url}
          alt="Cat"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => (cat.isFavourite ? unfavourite(cat.favouriteId!) : favourite(cat.id))}
            className="p-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-xl hover:bg-white transition-all active:scale-90"
          >
            <Heart
              className={`w-5 h-5 ${cat.isFavourite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
            />
          </button>
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 flex justify-around items-center shadow-lg border border-white/40">
            <button
              onClick={() => vote({ imageId: cat.id, value: 1 })}
              className="p-2 hover:bg-emerald-500/10 rounded-xl text-emerald-600 transition-colors"
            >
              <ArrowBigUp className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-800">{cat.score}</span>
            <button
              onClick={() => vote({ imageId: cat.id, value: -1 })}
              className="p-2 hover:bg-rose-500/10 rounded-xl text-rose-600 transition-colors"
            >
              <ArrowBigDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Feline #{cat.id.slice(0, 4)}</h3>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            The Cat API
          </p>
        </div>
        {cat.isFavourite && (
          <div className="bg-red-50 p-1.5 rounded-lg">
            <Heart className="w-3 h-3 fill-red-400 text-red-400" />
          </div>
        )}
      </div>
    </div>
  );
};
