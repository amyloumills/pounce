import { useState } from 'react';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useUpload } from '../../hooks/useUpload';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal = ({ isOpen, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: upload, isPending, isSuccess, reset } = useUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload a New Cat">
      <div className="space-y-6">
        {!preview ? (
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
            <Upload className="w-12 h-12 text-slate-300 group-hover:text-indigo-500 mb-4 transition-colors" />
            <p className="text-sm font-semibold text-slate-600">Click to select photo</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {preview && (
          <button
            disabled={isPending || isSuccess}
            onClick={() => file && upload(file, { onSuccess: () => setTimeout(handleClose, 2000) })}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex justify-center items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-500'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
            }`}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Success!
              </>
            ) : (
              'Upload Cat'
            )}
          </button>
        )}
      </div>
    </Modal>
  );
};
