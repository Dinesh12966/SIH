import React, { useRef, ChangeEvent } from 'react';
import { IssueReport } from '../../types';

interface AddPhotosStepProps {
  images: File[];
  onUpdate: (data: Partial<IssueReport>) => void;
  onNext: () => void;
  onBack: () => void;
}

const UploadMediaStep: React.FC<AddPhotosStepProps> = ({ images, onUpdate, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      onUpdate({ images: [...images, ...newImages] });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onUpdate({ images: images.filter((_, index) => index !== indexToRemove) });
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white mb-2">Add Supporting Photos (Optional)</h2>
      <p className="text-center text-gray-400 mb-6">If you have more photos of the issue, please upload them here.</p>

      <div className="mt-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          id="file-upload"
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 min-h-[100px]">
            {images.map((file, index) => (
                <div key={index} className="relative aspect-square">
                    <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg border border-secondary-700"
                    />
                     <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ))}
             <button
              onClick={triggerFileSelect}
              className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-secondary-700 border-dashed rounded-lg cursor-pointer bg-secondary-900/50 hover:bg-secondary-900 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span className="mt-2 text-sm text-gray-400">Add Photo</span>
            </button>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:animate-gradient-shift transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UploadMediaStep;