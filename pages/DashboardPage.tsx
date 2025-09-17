import React, { useState, useMemo } from 'react';
import { User, View } from '../App';
import { Issue, Priority, Status } from '../types';

interface DashboardPageProps {
  user: User;
  issues: Issue[];
  setView: (view: View) => void;
  onLogout: () => void;
  onSelectIssue: (issueId: string) => void;
}

const statusStyles: { [key in Status]: { bg: string, text: string, ring: string } } = {
  [Status.SUBMITTED]: { bg: 'bg-blue-500/20', text: 'text-blue-300', ring: 'ring-blue-500/30' },
  [Status.IN_PROGRESS]: { bg: 'bg-amber-500/20', text: 'text-amber-300', ring: 'ring-amber-500/30' },
  [Status.RESOLVED]: { bg: 'bg-green-500/20', text: 'text-green-300', ring: 'ring-green-500/30' },
  [Status.REJECTED]: { bg: 'bg-red-500/20', text: 'text-red-300', ring: 'ring-red-500/30' },
};

const priorityStyles: { [key in Priority]: { text: string, icon: JSX.Element } } = {
    [Priority.HIGH]: { text: 'text-red-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm2-1a1 1 0 00-1-1H9a1 1 0 100 2h1a1 1 0 001-1z" clipRule="evenodd" /></svg> },
    [Priority.MEDIUM]: { text: 'text-amber-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6a1 1 0 102 0V5zm-1 9a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg> },
    [Priority.LOW]: { text: 'text-gray-400', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> },
};

const IssueCard: React.FC<{ issue: Issue, onSelect: () => void, index: number }> = ({ issue, onSelect, index }) => (
    <div 
        onClick={onSelect}
        className="group bg-secondary-900 border border-secondary-700 rounded-xl p-4 cursor-pointer hover:bg-secondary-800 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
    >
        <div className="flex justify-between items-start">
            <div className="flex-grow">
                <p className="text-sm font-medium text-primary">{issue.id}</p>
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary transition-colors">{issue.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{issue.category}</p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[issue.status].bg} ${statusStyles[issue.status].text} ring-1 ring-inset ${statusStyles[issue.status].ring}`}>
                {issue.status}
            </span>
        </div>
        <div className="mt-4 flex justify-between items-center border-t border-secondary-800 pt-3">
            <span className={`inline-flex items-center text-sm font-medium ${priorityStyles[issue.priority].text}`}>
                {priorityStyles[issue.priority].icon}
                <span className="ml-1.5">{issue.priority} Priority</span>
            </span>
             <span className="text-sm text-gray-400 group-hover:text-primary transition-colors">
                View Details &rarr;
            </span>
        </div>
    </div>
);

const SummaryCard: React.FC<{title: string, value: number, icon: JSX.Element, color: string, index: number}> = ({ title, value, icon, color, index }) => (
    <div className="bg-secondary-900 border border-secondary-700 p-6 rounded-xl shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">{title}</h3>
            <span className={color}>{icon}</span>
        </div>
        <p className={`text-4xl font-bold ${color} mt-2`}>{value}</p>
    </div>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ user, issues, setView, onLogout, onSelectIssue }) => {
  const [searchId, setSearchId] = useState('');

  const inProgressCount = issues.filter(i => i.status === Status.IN_PROGRESS || i.status === Status.SUBMITTED).length;
  const resolvedCount = issues.filter(i => i.status === Status.RESOLVED).length;

  const filteredIssues = useMemo(() => {
    if (!searchId.trim()) return issues;
    return issues.filter(issue => issue.id.toLowerCase().includes(searchId.trim().toLowerCase()));
  }, [searchId, issues]);

  return (
    <div className="w-full max-w-6xl animate-fade-in-blur space-y-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Welcome, {user.name}!</h1>
          <p className="text-gray-500">Citizen ID: {user.id}</p>
        </div>
        <button 
          onClick={onLogout}
          className="mt-4 sm:mt-0 bg-secondary-700 text-gray-300 font-bold py-2 px-4 rounded-lg hover:bg-secondary-600 hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Reports" value={issues.length} color="text-primary" index={0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <SummaryCard title="In Progress" value={inProgressCount} color="text-amber-400" index={1} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <SummaryCard title="Resolved" value={resolvedCount} color="text-green-400" index={2} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      {/* New Issue Section */}
      <div className="bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">Report a New Issue</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">Help improve our community. Use our AI-powered photo analysis for the fastest reporting experience.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
                onClick={() => setView('image_reporting')}
                className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-primary-400 to-primary-600 bg-[length:200%_auto] text-secondary-950 font-bold py-3 px-6 rounded-lg shadow-lg hover:animate-gradient-shift transition-all duration-300 transform hover:scale-105 group flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Report with Photo (Recommended)
            </button>
             <button 
                onClick={() => setView('reporting')}
                className="w-full sm:w-auto text-primary font-medium hover:underline"
            >
                or Describe Manually
            </button>
        </div>
      </div>


      <div className="bg-secondary-900/80 backdrop-blur-xl border border-secondary-700 shadow-2xl rounded-2xl">
        <div className="p-6 border-b border-secondary-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold text-white">Your Reported Issues</h2>
          <div className="relative w-full sm:w-64">
             <input 
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by Complaint ID..."
                className="w-full pl-10 pr-4 py-2 bg-secondary-800 border border-secondary-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-primary focus:border-primary"
             />
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
             </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 gap-4">
            {filteredIssues.map((issue, index) => (
                <IssueCard key={issue.id} issue={issue} onSelect={() => onSelectIssue(issue.id)} index={index} />
            ))}
        </div>
        {filteredIssues.length === 0 && (
            <div className="text-center py-16">
                <p className="text-gray-400 text-lg">{searchId ? 'No issues found for this ID.' : "You haven't reported any issues yet."}</p>
                 {searchId && <button onClick={() => setSearchId('')} className="mt-2 text-sm text-primary hover:underline">Clear search</button>}
            </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;