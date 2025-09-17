import React from 'react';
import { Issue } from '../types';

interface AcknowledgementPageProps {
  issue: Issue;
  onBack: () => void;
}

const AcknowledgementPage: React.FC<AcknowledgementPageProps> = ({ issue, onBack }) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in-blur">
      <div id="acknowledgement-slip" className="bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-8 print:bg-white print:text-black print:shadow-none print:border-black">
        <div className="text-center border-b border-secondary-600 pb-4 print:border-b-2 print:border-black">
          <svg className="mx-auto h-12 w-auto text-primary print:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h1 className="text-2xl font-bold text-white mt-4 print:text-black">Report Submitted Successfully</h1>
          <p className="text-gray-400 print:text-gray-600">Thank you for helping improve your community.</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-primary print:text-black">Complaint Acknowledgement</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-400 print:text-gray-700">Complaint ID:</span>
              <span className="font-mono text-white font-bold print:text-black">{issue.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-400 print:text-gray-700">Date Submitted:</span>
              <span className="text-white print:text-black">{issue.submittedDate}</span>
            </div>
             <div className="flex justify-between">
              <span className="font-medium text-gray-400 print:text-gray-700">Issue Summary:</span>
              <span className="text-white text-right print:text-black">{issue.title}</span>
            </div>
             <div className="flex justify-between">
              <span className="font-medium text-gray-400 print:text-gray-700">Category:</span>
              <span className="text-white print:text-black">{issue.category}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-secondary-600 text-center print:border-t-2 print:border-black">
          <p className="text-sm text-gray-500 print:text-gray-600">
            You can track the status of this complaint on your dashboard using the Complaint ID.
            Please keep this slip for your records.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-secondary-700 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-secondary-600 hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-6 rounded-lg shadow-lg hover:animate-gradient-shift transition-all"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
          Print Slip
        </button>
      </div>

    </div>
  );
};

export default AcknowledgementPage;
