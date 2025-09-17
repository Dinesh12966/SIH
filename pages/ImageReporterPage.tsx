import React, { useState, useRef, ChangeEvent } from 'react';
import { analyzeIssueFromImage } from '../services/geminiService';
import { ImageAnalysisResult } from '../types';

interface ImageReporterPageProps {
  onAnalysisComplete: (result: ImageAnalysisResult) => void;
  onBack: () => void;
}

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute h-full w-full rounded-full border-4 border-t-primary border-r-primary border-b-primary/20 border-l-primary/20 animate-spin"></div>
        <div className="absolute h-full w-full rounded-full border-4 border-t-amber-300 border-r-amber-300 border-b-amber-300/20 border-l-amber-300/20 opacity-75 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-lg font-semibold text-primary">AI is analyzing your photo...</p>
      <p className="text-gray-400 text-sm">Identifying the issue, please wait a moment.</p>
    </div>
);

const ImageReporterPage: React.FC<ImageReporterPageProps> = ({ onAnalysisComplete, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
        setError("Please select an image file first.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const result = await analyzeIssueFromImage(imageFile);
        onAnalysisComplete(result);
    } catch(e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred during analysis.");
        setIsLoading(false);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  if (isLoading) {
    return (
        <div className="w-full max-w-2xl bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-8 animate-fade-in-blur text-center">
            <Loader />
        </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-8 animate-fade-in-blur">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Report with a Photo</h1>
            <p className="text-gray-400 mb-6">Upload a photo of the issue. Our AI will automatically analyze it to start your report.</p>
        </div>
        
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
            id="file-upload"
        />

        <div className="w-full h-64 border-2 border-secondary-700 border-dashed rounded-lg bg-secondary-900/50 flex items-center justify-center relative overflow-hidden">
            {preview ? (
                <img src={preview} alt="Issue preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l4-4h8a4 4 0 014 4v8l-4 4m0 0l-8 8h-8a4 4 0 01-4-4v-8m0 0l4-4m-4 0h8m16 12a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m16-4l-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm">No image selected</p>
                </div>
            )}
        </div>
        
        {error && <p className="mt-4 text-center text-red-400 font-medium animate-fade-in">Error: {error}</p>}

        <div className="mt-8 space-y-4">
             <button
              onClick={triggerFileSelect}
              className="w-full flex justify-center items-center py-3 px-4 border border-primary text-primary font-bold rounded-lg shadow-sm hover:bg-primary/10 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {imageFile ? 'Change Photo' : 'Select Photo'}
            </button>
            <button
                onClick={handleAnalyze}
                disabled={!imageFile}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-secondary-950 bg-gradient-to-r from-primary-400 to-primary-500 bg-[length:200%_auto] hover:animate-gradient-shift disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Analyze with AI
            </button>
        </div>

        <div className="mt-6 text-center">
            <button onClick={onBack} className="text-gray-400 hover:text-white font-medium transition-colors">
                Cancel
            </button>
        </div>
    </div>
  );
};

export default ImageReporterPage;
