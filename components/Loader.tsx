import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute h-full w-full rounded-full border-4 border-t-primary border-r-primary border-b-primary/20 border-l-primary/20 animate-spin"></div>
        <div className="absolute h-full w-full rounded-full border-4 border-t-amber-300 border-r-amber-300 border-b-amber-300/20 border-l-amber-300/20 opacity-75 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-lg font-semibold text-primary">AI is analyzing your report...</p>
      <p className="text-gray-400 text-sm">This may take a few seconds.</p>
    </div>
  );
};

export default Loader;