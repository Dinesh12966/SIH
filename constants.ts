import { Issue, Priority, Status } from './types';

export const REPORTING_STEPS = [
  { id: 'select_category', title: 'Category' },
  { id: 'specify_category', title: 'Specify' },
  { id: 'describe', title: 'Describe' },
  { id: 'categorize', title: 'AI Analysis' },
  { id: 'media', title: 'Add Photos' },
  // { id: 'location', title: 'Location' }, // Temporarily disabled as requested
  { id: 'details', title: 'Add Details' },
  { id: 'review', title: 'Review & Submit' },
];

export const ISSUE_CATEGORIES = [
  { id: 'roads_traffic', name: 'Roads & Traffic', icon: '🚗' },
  { id: 'sanitation', name: 'Waste & Sanitation', icon: '🗑️' },
  { id: 'water_sewage', name: 'Water & Sewage', icon: '💧' },
  { id: 'public_spaces', name: 'Parks & Public Spaces', icon: '🌳' },
  { id: 'electricity', name: 'Electricity & Utilities', icon: '💡' },
  { id: 'public_safety', name: 'Public Safety', icon: '🛡️' },
  { id: 'noise', name: 'Noise Complaint', icon: '🔊' },
  { id: 'other', name: 'Other', icon: '❓' },
];

// Mock data for the dashboard
export const MOCK_ISSUES: Issue[] = [
  {
    id: 'IS-2341',
    title: 'Large pothole on Main St.',
    category: 'Roads & Traffic',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    submittedDate: '2024-07-28',
    description: 'There is a massive pothole in the eastbound lane of Main St, right before the intersection with 1st Ave. It is deep and has already caused cars to swerve. It poses a significant danger, especially at night.',
    imageUrls: ['https://picsum.photos/seed/pothole/400/300'],
    location: { lat: 28.6139, lng: 77.2090 },
    timeline: [
      { status: 'Created', date: '2024-07-28', description: 'Issue reported by a citizen.' },
      { status: Status.SUBMITTED, date: '2024-07-28', description: 'Report automatically routed to the Public Works Department.' },
      { status: Status.IN_PROGRESS, date: '2024-07-29', description: 'A maintenance team has been assigned and is scheduled to inspect the location.' },
    ],
  },
  {
    id: 'IS-2340',
    title: 'Broken swing at Central Park',
    category: 'Parks & Public Spaces',
    priority: Priority.MEDIUM,
    status: Status.RESOLVED,
    submittedDate: '2024-07-25',
    description: 'One of the swings in the children\'s playground at Central Park has a broken chain. It is a safety hazard for kids playing in the area.',
    imageUrls: [],
    manualLocation: 'Central Park, near the main fountain.',
    timeline: [
        { status: 'Created', date: '2024-07-25', description: 'Issue reported by a concerned parent.' },
        { status: Status.SUBMITTED, date: '2024-07-25', description: 'Report sent to Parks & Recreation Dept.' },
        { status: Status.IN_PROGRESS, date: '2024-07-26', description: 'Park maintenance staff have cordoned off the area.' },
        { status: Status.RESOLVED, date: '2024-07-27', description: 'The broken swing has been replaced. The issue is now resolved.' },
    ],
  },
    {
    id: 'IS-2339',
    title: 'Overflowing dustbin near City Hall',
    category: 'Waste & Sanitation',
    priority: Priority.LOW,
    status: Status.SUBMITTED,
    submittedDate: '2024-07-29',
    description: 'The public trash can on the corner just outside City Hall has been overflowing for two days. It is becoming unsightly and attracting pests.',
    imageUrls: ['https://picsum.photos/seed/trash/400/300'],
    timeline: [
        { status: 'Created', date: '2024-07-29', description: 'Issue reported by a citizen.' },
        { status: Status.SUBMITTED, date: '2024-07-29', description: 'Report has been forwarded to the Sanitation Department for scheduled pickup.' },
    ],
  },
   {
    id: 'IS-2338',
    title: 'Streetlight not working',
    category: 'Electricity & Utilities',
    priority: Priority.MEDIUM,
    status: Status.RESOLVED,
    submittedDate: '2024-07-22',
    description: 'The streetlight at the corner of Elm Street and Oak Avenue is out. It is very dark at this intersection at night, making it unsafe for pedestrians.',
    imageUrls: [],
    timeline: [
        { status: 'Created', date: '2024-07-22', description: 'Issue reported by a resident.' },
        { status: Status.SUBMITTED, date: '2024-07-22', description: 'Report routed to the Utilities Department.' },
        { status: Status.IN_PROGRESS, date: '2024-07-23', description: 'A ticket has been created and a technician will be dispatched.' },
        { status: Status.RESOLVED, date: '2024-07-24', description: 'The streetlight bulb and sensor were replaced. The light is now operational.' },
    ],
  },
];