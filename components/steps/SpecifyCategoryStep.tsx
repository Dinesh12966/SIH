import React, { useState } from 'react';

interface SpecifyCategoryStepProps {
  onNext: (customCategory: string) => void;
  onBack: () => void;
  initialValue?: string;
}

const SpecifyCategoryStep: React.FC<SpecifyCategoryStepProps> = ({ onNext, onBack, initialValue }) => {
  const [customCategory, setCustomCategory] = useState(initialValue || '');

  const handleNext = () => {
    if (customCategory.trim()) {
      onNext(customCategory.trim());
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white mb-2">Specify Category</h2>
      <p className="text-center text-gray-400 mb-6">Since you selected "Other," please provide a brief category for your issue.</p>
      
      <div className="max-w-md mx-auto">
        <label htmlFor="custom-category" className="sr-only">Custom Category</label>
        <input
            id="custom-category"
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="appearance-none block w-full px-4 py-3 bg-secondary-900 border border-secondary-700 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
            placeholder="e.g., 'Abandoned Vehicle' or 'Illegal Dumping'"
        />
      </div>

      <div className="mt-6 flex justify-between items-center max-w-md mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back
        </button>
        <button
            onClick={handleNext}
            disabled={!customCategory.trim()}
            className="bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:animate-gradient-shift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
            Next
        </button>
      </div>
    </div>
  );
};

export default SpecifyCategoryStep;