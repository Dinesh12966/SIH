import React from 'react';
import { IssueReport } from '../../types';
import { ISSUE_CATEGORIES } from '../../constants';

interface ReviewStepProps {
  data: IssueReport;
  onSubmit: () => void;
  onBack: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onSubmit, onBack }) => {
  const manualCategoryName = ISSUE_CATEGORIES.find(cat => cat.id === data.manualCategory)?.name || data.manualCategory;
  const finalCategory = data.manualCategory === 'other' ? data.customCategory : manualCategoryName;

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white mb-2">Review Your Report</h2>
      <p className="text-center text-gray-400 mb-6">Please check all the details before final submission.</p>

      <div className="space-y-4 text-left p-6 bg-secondary-950/40 rounded-lg border border-secondary-700">
        <div className="pb-2 border-b border-secondary-700">
            <h3 className="text-sm font-semibold text-gray-500">Description</h3>
            <p className="text-gray-200 italic">"{data.description}"</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Main Category</h3>
                <p className="text-gray-100 font-medium">{finalCategory}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">AI-Suggested Sub-Category</h3>
                <p className="text-gray-100 font-medium">{data.category}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">AI-Suggested Priority</h3>
                <p className="text-gray-100 font-medium">{data.priority}</p>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-gray-500">Recurring Issue</h3>
                <p className="text-gray-100 font-medium">{data.isRecurring ? 'Yes' : 'No'}</p>
            </div>
        </div>
         {data.additionalNotes && (
            <div className="pt-2 border-t border-secondary-700">
                <h3 className="text-sm font-semibold text-gray-500">Additional Notes</h3>
                <p className="text-gray-200 italic">"{data.additionalNotes}"</p>
            </div>
        )}
         {data.images.length > 0 && (
          <div className="pt-2 border-t border-secondary-700">
            <h3 className="text-sm font-semibold text-gray-500">Attached Photos</h3>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {data.images.map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt={`Uploaded media ${index + 1}`} className="aspect-square w-full object-cover rounded-md border-2 border-secondary-700" />
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back
        </button>
        <button
          onClick={onSubmit}
          className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-[length:200%_auto] hover:animate-gradient-shift text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;