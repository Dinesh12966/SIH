import React, { useState } from 'react';
import IssueReporter from './components/IssueReporter';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import IssueDetailPage from './pages/IssueDetailPage';
import ImageReporterPage from './pages/ImageReporterPage';
import AcknowledgementPage from './pages/AcknowledgementPage';
import { MOCK_ISSUES } from './constants';
import { ImageAnalysisResult, Issue, IssueReport, Status, Priority } from './types';


export type User = {
  name: string;
  email: string;
  id: string;
};

export type View = 'login' | 'signup' | 'dashboard' | 'reporting' | 'issueDetail' | 'image_reporting' | 'acknowledgement';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [imageAnalysisData, setImageAnalysisData] = useState<ImageAnalysisResult | null>(null);
  const [newlyCreatedIssue, setNewlyCreatedIssue] = useState<Issue | null>(null);


  const handleLogin = (email: string) => {
    const citizenId = `CID-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const name = email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    setUser({ name, email, id: citizenId });
    setView('dashboard');
  };

  const handleSignup = (name: string, email: string) => {
    const citizenId = `CID-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    setUser({ name, email, id: citizenId });
    setView('dashboard');
  };
  
  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setView('issueDetail');
  };

  const handleBackToDashboard = () => {
    setSelectedIssueId(null);
    setImageAnalysisData(null); 
    setNewlyCreatedIssue(null);
    setView('dashboard');
  };

  const handleImageAnalysisComplete = (result: ImageAnalysisResult) => {
    if (result.issueDetected) {
      setImageAnalysisData(result);
      setView('reporting');
    } else {
      alert("AI analysis complete: No civic issue was detected in the uploaded image. Please try another photo or report the issue manually.");
      setView('dashboard');
    }
  };

  const handleReportSubmit = (reportData: IssueReport) => {
    const newId = `IS-${Date.now().toString().slice(-4)}`;
    const newIssue: Issue = {
        id: newId,
        title: reportData.summary || 'Untitled Issue',
        category: reportData.category || 'Uncategorized',
        priority: reportData.priority || Priority.LOW,
        status: Status.SUBMITTED,
        submittedDate: new Date().toISOString().split('T')[0],
        description: reportData.description,
        imageUrls: reportData.images.map(file => URL.createObjectURL(file)), // Simulate image URLs
        location: reportData.location,
        manualLocation: reportData.manualLocation,
        timeline: [
            { status: 'Created', date: new Date().toISOString().split('T')[0], description: 'Issue reported by a citizen.' },
            { status: Status.SUBMITTED, date: new Date().toISOString().split('T')[0], description: 'Report received and pending assignment.' },
        ],
    };

    setIssues(prevIssues => [newIssue, ...prevIssues]);
    setNewlyCreatedIssue(newIssue);
    setView('acknowledgement');
  };


  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} setView={setView} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} setView={setView} />;
      case 'dashboard':
        return user && <DashboardPage user={user} issues={issues} setView={setView} onLogout={handleLogout} onSelectIssue={handleSelectIssue} />;
      case 'image_reporting':
        return <ImageReporterPage onAnalysisComplete={handleImageAnalysisComplete} onBack={handleBackToDashboard} />;
      case 'reporting':
        return <IssueReporter onExit={handleBackToDashboard} onReportSubmit={handleReportSubmit} initialDataFromImage={imageAnalysisData} />;
      case 'issueDetail':
        const selectedIssue = issues.find(issue => issue.id === selectedIssueId);
        return selectedIssue && <IssueDetailPage issue={selectedIssue} onBack={handleBackToDashboard} />;
      case 'acknowledgement':
        return newlyCreatedIssue && <AcknowledgementPage issue={newlyCreatedIssue} onBack={handleBackToDashboard} />;
      default:
        return <LoginPage onLogin={handleLogin} setView={setView}/>;
    }
  };

  return (
    <div className="min-h-screen w-full font-sans antialiased">
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;