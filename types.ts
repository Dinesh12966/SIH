export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Status {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected',
}

export interface IssueReport {
  manualCategory: string;
  customCategory?: string;
  description: string;
  category?: string;
  priority?: Priority;
  summary?: string;
  images: File[];
  location?: { lat: number; lng: number };
  manualLocation?: string;
  isRecurring?: boolean;
  additionalNotes?: string;
}

export interface CategorizationResult {
  category: string;
  priority: Priority;
  summary: string;
}

export interface ImageAnalysisResult extends CategorizationResult {
    issueDetected: boolean;
    description: string;
}

export interface TimelineEvent {
    status: Status | 'Created';
    date: string;
    description: string;
}

export interface Issue {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: Status;
  submittedDate: string;
  timeline: TimelineEvent[];
  description: string;
  imageUrls: string[];
  location?: { lat: number; lng: number };
  manualLocation?: string;
}