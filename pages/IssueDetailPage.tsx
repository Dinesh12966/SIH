import React from 'react';
import { Issue, Priority, Status } from '../types';

interface IssueDetailPageProps {
  issue: Issue;
  onBack: () => void;
}

const statusStyles: { [key in Status]: { bg: string, text: string, ring: string } } = {
  [Status.SUBMITTED]: { bg: 'bg-blue-500/20', text: 'text-blue-300', ring: 'ring-blue-500/30' },
  [Status.IN_PROGRESS]: { bg: 'bg-amber-500/20', text: 'text-amber-300', ring: 'ring-amber-500/30' },
  [Status.RESOLVED]: { bg: 'bg-green-500/20', text: 'text-green-300', ring: 'ring-green-500/30' },
  [Status.REJECTED]: { bg: 'bg-red-500/20', text: 'text-red-300', ring: 'ring-red-500/30' },
};

const priorityStyles: { [key in Priority]: string } = {
    [Priority.HIGH]: 'text-red-400',
    [Priority.MEDIUM]: 'text-amber-400',
    [Priority.LOW]: 'text-gray-400',
};

const TimelineIcon: React.FC<{status: Status | 'Created', isLast: boolean}> = ({ status, isLast }) => {
    const iconWrapperClass = "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-secondary-900";
    
    // Resolved is always a completed state
    if (status === Status.RESOLVED) {
        return (
            <div className={`${iconWrapperClass} bg-green-500`}>
                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        );
    }
    // The last event in the timeline is the current status (unless it's resolved)
    if (isLast) {
        return (
             <div className={`${iconWrapperClass} bg-primary relative`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <div className="h-3 w-3 bg-secondary-950 rounded-full"></div>
            </div>
        );
    }
    // Any other event is a past, completed step
    return (
        <div className={`${iconWrapperClass} bg-secondary-600`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </div>
    );
};

const DetailCard: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({ title, children, className }) => (
    <div className={`bg-secondary-900/50 p-4 rounded-lg border border-secondary-700 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-500 mb-1">{title}</h3>
        {children}
    </div>
);


const IssueDetailPage: React.FC<IssueDetailPageProps> = ({ issue, onBack }) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in-blur">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Back to Dashboard
        </button>
      </div>

      <div className="bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-6 sm:p-8">
        <header className="pb-4 border-b border-secondary-800">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-primary">{issue.id}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">{issue.title}</h1>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[issue.status].bg} ${statusStyles[issue.status].text} ring-1 ring-inset ${statusStyles[issue.status].ring}`}>
                    {issue.status}
                </span>
            </div>
        </header>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Timeline */}
            <div className="lg:col-span-1">
                 <h2 className="text-xl font-semibold text-white mb-4">Status Timeline</h2>
                 <ul className="-mb-8">
                    {issue.timeline.map((event, eventIdx) => (
                        <li key={event.date + event.status} className="relative pb-8">
                        {eventIdx !== issue.timeline.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-secondary-700" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3 items-start">
                            <TimelineIcon status={event.status} isLast={eventIdx === issue.timeline.length - 1} />
                            <div className="min-w-0 flex-1 pt-1.5">
                                <p className="text-sm text-gray-400">{event.date}</p>
                                <p className="font-medium text-white">{event.status}</p>
                                <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                            </div>
                        </div>
                        </li>
                    ))}
                 </ul>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                <DetailCard title="Description">
                    <p className="text-gray-300 italic">"{issue.description}"</p>
                </DetailCard>

                <div className="grid grid-cols-2 gap-4">
                    <DetailCard title="Category">
                        <p className="font-semibold text-white">{issue.category}</p>
                    </DetailCard>
                     <DetailCard title="Priority">
                        <p className={`font-semibold ${priorityStyles[issue.priority]}`}>{issue.priority}</p>
                    </DetailCard>
                </div>

                {issue.imageUrls.length > 0 && (
                     <DetailCard title="Submitted Photos">
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {issue.imageUrls.map((url, index) => (
                                <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Submitted media ${index + 1}`} className="aspect-square w-full object-cover rounded-md border-2 border-secondary-700 hover:border-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    </DetailCard>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;
