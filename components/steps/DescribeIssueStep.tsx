import React, { useState } from 'react';

interface DescribeIssueStepProps {
  onNext: (description: string) => void;
  onBack: () => void;
  initialDescription: string;
}

const DescribeIssueStep: React.FC<DescribeIssueStepProps> = ({ onNext, onBack, initialDescription }) => {
  const [description, setDescription] = useState(initialDescription);

  const handleNext = () => {
    if (description.trim().length > 10) {
      onNext(description);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-white mb-2">Describe the Issue</h2>
      <p className="text-center text-gray-400 mb-6">Provide as much detail as possible. The more information, the faster it can be resolved.</p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-40 p-4 bg-secondary-900 border border-secondary-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300"
        placeholder="For example: 'There is a large pothole in the middle of the road at the intersection of Main St and 1st Ave. It has caused several cars to swerve dangerously.'"
        aria-label="Issue description"
      />
      <div className="mt-6 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
          Back
        </button>
        <div>
            <button
            onClick={handleNext}
            disabled={description.trim().length <= 10}
            className="bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:animate-gradient-shift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
            Analyze Issue with AI
            </button>
             {description.trim().length <= 10 && (
                <p className="text-sm text-gray-500 mt-2 text-right">Please enter at least 10 characters.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default DescribeIssueStep;