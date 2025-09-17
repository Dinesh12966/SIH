import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { IssueReport, CategorizationResult, ImageAnalysisResult } from '../types';
import { REPORTING_STEPS } from '../constants';
import StepIndicator from './StepIndicator';
import SelectCategoryStep from './steps/SelectCategoryStep';
import SpecifyCategoryStep from './steps/SpecifyCategoryStep';
import DescribeIssueStep from './steps/DescribeIssueStep';
import CategorizeIssueStep from './steps/CategorizeIssueStep';
import UploadMediaStep from './steps/UploadMediaStep';
import LocationStep from './steps/LocationStep';
import AddDetailsStep from './steps/AddDetailsStep';
import ReviewStep from './steps/ReviewStep';
import { categorizeIssue } from '../services/geminiService';
import Loader from './Loader';

const initialIssueState: IssueReport = {
  manualCategory: '',
  customCategory: '',
  description: '',
  category: undefined,
  priority: undefined,
  summary: undefined,
  images: [],
  location: undefined,
  manualLocation: '',
  isRecurring: false,
  additionalNotes: '',
};

interface IssueReporterProps {
    onExit: () => void;
    onReportSubmit: (reportData: IssueReport) => void;
    initialDataFromImage?: ImageAnalysisResult | null;
}

const IssueReporter: React.FC<IssueReporterProps> = ({ onExit, onReportSubmit, initialDataFromImage }) => {
  const [issueData, setIssueData] = useState<IssueReport>(initialIssueState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Dynamic step flow management
  const reportingSteps = useMemo(() => {
    if (initialDataFromImage) {
        return REPORTING_STEPS.filter(step => !['select_category', 'specify_category', 'describe'].includes(step.id));
    }
    return REPORTING_STEPS.filter(step => {
      if (step.id === 'specify_category') {
        return issueData.manualCategory === 'other';
      }
      return true;
    });
  }, [issueData.manualCategory, initialDataFromImage]);

  useEffect(() => {
    if (initialDataFromImage) {
      setIssueData(prev => ({
        ...prev,
        manualCategory: initialDataFromImage.category,
        description: initialDataFromImage.description,
        category: initialDataFromImage.category,
        priority: initialDataFromImage.priority,
        summary: initialDataFromImage.summary,
      }));
      const startIndex = reportingSteps.findIndex(step => step.id === 'categorize');
      setCurrentStepIndex(startIndex >= 0 ? startIndex : 0);
    }
  }, [initialDataFromImage, reportingSteps]);


  const currentStep = reportingSteps[currentStepIndex];

  const updateIssueData = useCallback((data: Partial<IssueReport>) => {
    setIssueData(prev => ({ ...prev, ...data }));
  }, []);

  const nextStep = () => {
    if (currentStepIndex < reportingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setError(null);
    }
  };

  const handleDescriptionSubmit = async (description: string) => {
    setIsLoading(true);
    setError(null);
    updateIssueData({ description });
    try {
      const result: CategorizationResult = await categorizeIssue(description, issueData.manualCategory, issueData.customCategory);
      updateIssueData(result);
      nextStep();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API submission delay
    setTimeout(() => {
      onReportSubmit(issueData);
      setIsLoading(false);
    }, 1500);
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'select_category':
        return <SelectCategoryStep onNext={(cat) => { updateIssueData({ manualCategory: cat }); nextStep(); }} onBack={onExit}/>
      case 'specify_category':
        return <SpecifyCategoryStep onNext={(customCat) => { updateIssueData({ customCategory: customCat }); nextStep(); }} onBack={prevStep} initialValue={issueData.customCategory} />;
      case 'describe':
        return <DescribeIssueStep onNext={handleDescriptionSubmit} onBack={prevStep} initialDescription={issueData.description} />;
      case 'categorize':
        return <CategorizeIssueStep data={issueData} onUpdate={updateIssueData} onNext={nextStep} onBack={prevStep} isFromImage={!!initialDataFromImage} />;
      case 'media':
        return <UploadMediaStep images={issueData.images} onUpdate={updateIssueData} onNext={nextStep} onBack={prevStep} />;
       case 'details':
        return <AddDetailsStep onNext={ (data) => { updateIssueData(data); nextStep(); }} onBack={prevStep} initialData={issueData} />;
      case 'review':
        return <ReviewStep data={issueData} onSubmit={handleSubmit} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-6 sm:p-8 animate-fade-in-blur">
      <StepIndicator currentStep={currentStepIndex} steps={reportingSteps} />
      <div className="mt-8 min-h-[420px] flex flex-col justify-center">
        {isLoading ? <Loader /> : renderStepContent()}
        {error && <p className="mt-4 text-center text-red-400 font-medium">Error: {error}</p>}
      </div>
    </div>
  );
};

export default IssueReporter;