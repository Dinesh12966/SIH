import React from 'react';
import { ISSUE_CATEGORIES } from '../../constants';

interface SelectCategoryStepProps {
  onNext: (category: string) => void;
  onBack: () => void;
}

const CategoryButton: React.FC<{category: {id: string, name: string, icon: string}, onSelect: () => void}> = ({ category, onSelect }) => (
    <button 
        onClick={onSelect}
        className="text-left p-4 w-full h-full bg-secondary-900 border border-secondary-700 rounded-lg flex flex-col justify-between hover:bg-secondary-800 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
    >
        <span className="text-4xl" role="img" aria-label={category.name}>{category.icon}</span>
        <span className="font-bold text-gray-100 mt-2">{category.name}</span>
    </button>
);


const SelectCategoryStep: React.FC<SelectCategoryStepProps> = ({ onNext, onBack }) => {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white mb-2">Report a New Issue</h2>
      <p className="text-center text-gray-400 mb-6">Let's start by selecting a category for your issue.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {ISSUE_CATEGORIES.map(category => (
            <CategoryButton 
                key={category.id} 
                category={category}
                onSelect={() => onNext(category.id)}
            />
        ))}
      </div>

       <div className="mt-8 flex justify-start">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back to Dashboard
        </button>
      </div>

    </div>
  );
};

export default SelectCategoryStep;