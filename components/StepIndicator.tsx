import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: { id: string; title: string }[];
}

const Step: React.FC<{ title: string; isActive: boolean; isCompleted: boolean; isFirst: boolean; isLast: boolean;}> = ({ title, isActive, isCompleted, isFirst, isLast }) => {
  const baseClasses = "relative flex items-center justify-center h-10 transition-all duration-500 ease-in-out";
  const activeClasses = "bg-primary text-secondary-950 font-bold";
  const completedClasses = "bg-primary/30 text-primary-300";
  const upcomingClasses = "bg-secondary-800 text-gray-400";

  let stateClasses = upcomingClasses;
  if (isActive) {
    stateClasses = activeClasses;
  } else if (isCompleted) {
    stateClasses = completedClasses;
  }
  
  const clipPathFirst = 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)';
  const clipPathMiddle = 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)';
  const clipPathLast = 'polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%)';

  let clipPath = clipPathMiddle;
  if (isFirst) {
    clipPath = clipPathFirst;
  } else if (isLast) {
    clipPath = clipPathLast;
  }

  return (
    <div className={`${baseClasses} ${stateClasses}`} style={{ clipPath }}>
      <span className="hidden sm:inline-block px-4 text-sm whitespace-nowrap">{title}</span>
    </div>
  );
};


const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Progress">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((step, stepIdx) => (
          <div key={step.id} className="relative" style={{ zIndex: steps.length - stepIdx}}>
            <Step
                title={step.title}
                isActive={stepIdx === currentStep}
                isCompleted={stepIdx < currentStep}
                isFirst={stepIdx === 0}
                isLast={stepIdx === steps.length - 1}
            />
          </div>
        ))}
      </div>
    </nav>
  );
};

export default StepIndicator;