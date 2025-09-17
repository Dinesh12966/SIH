import React, { useState } from 'react';
import { IssueReport, Priority } from '../../types';

interface CategorizeIssueStepProps {
  data: IssueReport;
  onUpdate: (data: Partial<IssueReport>) => void;
  onNext: () => void;
  onBack: () => void;
  isFromImage?: boolean;
}

const priorityStyles: { [key in Priority]: { bg: string; text: string; ring: string, icon: JSX.Element} } = {
  [Priority.HIGH]: {
    bg: 'bg-red-500/20', text: 'text-red-300', ring: 'ring-red-500/30',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
  },
  [Priority.MEDIUM]: {
    bg: 'bg-amber-500/20', text: 'text-amber-300', ring: 'ring-amber-500/30',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 4.4a1 1 0 01-.8 1.6H6a3 3 0 01-3-3V6z" clipRule="evenodd" /></svg>
  },
  [Priority.LOW]: {
    bg: 'bg-gray-500/20', text: 'text-gray-300', ring: 'ring-gray-500/30',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
  },
};

const CategorizeIssueStep: React.FC<CategorizeIssueStepProps> = ({ data, onUpdate, onNext, onBack, isFromImage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(data.description || '');

  const { category, priority, summary } = data;
  const styles = priority ? priorityStyles[priority] : priorityStyles[Priority.MEDIUM];

  const title = isFromImage ? "AI Analysis from Photo" : "AI Analysis Complete";
  const subTitle = isFromImage 
    ? "Our AI has analyzed your photo. Please review and edit the description if needed."
    : "Our AI has analyzed your report. Please review the details below.";
    
  const handleSaveDescription = () => {
    onUpdate({ description: editedDescription });
    setIsEditing(false);
  };

  const descriptionContent = () => {
      const label = isFromImage ? "AI Generated Description" : "Your Description";
      if (isEditing) {
          return (
            <div>
                 <h3 className="text-sm font-semibold text-gray-500 mb-1">{label}</h3>
                 <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full h-24 p-2 bg-secondary-800 border border-secondary-600 rounded-md text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary"
                 />
                 <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handleSaveDescription} className="text-xs font-semibold text-primary hover:text-primary/80">Save</button>
                 </div>
            </div>
          );
      }
      return (
        <div>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">{label}</h3>
                <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-primary hover:text-primary/80">Edit</button>
            </div>
            <p className="text-gray-300 italic">"{data.description || 'N/A'}"</p>
        </div>
      );
  };


  return (
    <div className="animate-fade-in-up text-center">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6">{subTitle}</p>
      
      <div className="space-y-4 text-left p-6 bg-secondary-950/40 rounded-lg border border-secondary-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">AI Suggested Category</h3>
              <p className="text-lg font-bold text-white">{category || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">AI Suggested Priority</h3>
              {priority && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles.bg} ${styles.text} ring-1 ring-inset ${styles.ring}`}>
                  {styles.icon}
                  <span className="ml-1.5">{priority}</span>
                </span>
              )}
            </div>
        </div>
        <div className="pt-4 border-t border-secondary-800">
           {isFromImage ? descriptionContent() : (
               <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Summary</h3>
                    <p className="text-gray-300 italic">"{summary || 'N/A'}"</p>
               </div>
           )}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors" disabled={isFromImage}>
            {isFromImage ? '' : 'Back'}
        </button>
        <button
          onClick={onNext}
          disabled={isEditing}
          className="bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:animate-gradient-shift transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default CategorizeIssueStep;