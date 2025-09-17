import React, { useState } from 'react';
import { IssueReport } from '../../types';

interface AddDetailsStepProps {
  onNext: (data: { isRecurring: boolean; additionalNotes: string }) => void;
  onBack: () => void;
  initialData: Partial<IssueReport>;
}

const AddDetailsStep: React.FC<AddDetailsStepProps> = ({ onNext, onBack, initialData }) => {
  const [isRecurring, setIsRecurring] = useState(initialData.isRecurring || false);
  const [additionalNotes, setAdditionalNotes] = useState(initialData.additionalNotes || '');

  const handleNext = () => {
    onNext({ isRecurring, additionalNotes: additionalNotes.trim() });
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white mb-2">Additional Details (Optional)</h2>
      <p className="text-center text-gray-400 mb-6">Providing more context can help authorities resolve the issue faster.</p>
      
      <div className="space-y-6">
        {/* Recurring Issue Toggle */}
        <fieldset>
          <legend className="text-base font-medium text-gray-200">Is this a recurring issue?</legend>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                isRecurring ? 'bg-primary text-secondary-950 border-primary shadow-lg' : 'bg-secondary-800 border-secondary-700 text-gray-200 hover:bg-secondary-700'
              }`}
            >
              Yes, it has happened before
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                !isRecurring ? 'bg-primary text-secondary-950 border-primary shadow-lg' : 'bg-secondary-800 border-secondary-700 text-gray-200 hover:bg-secondary-700'
              }`}
            >
              No, this is the first time
            </button>
          </div>
        </fieldset>

        {/* Additional Notes */}
        <div>
          <label htmlFor="additional-notes" className="block text-base font-medium text-gray-200">
            Any other notes for the authorities?
          </label>
          <div className="mt-2">
            <textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              className="w-full p-4 bg-secondary-900 border border-secondary-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300"
              placeholder="e.g., 'This happens every week after trash collection day' or 'The issue is worse during heavy rain.'"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:animate-gradient-shift transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddDetailsStep;