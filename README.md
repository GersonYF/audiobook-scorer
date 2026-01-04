# Audiobook Background Scorer

A modern React + Vite + TypeScript application for generating background music for audiobooks and PDFs using AI.

## Tech Stack

- **React 18**: UI library
- **TypeScript**: Static type checking
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management with TypeScript support
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Redux**: Redux bindings for React with typed hooks

## Features

- **Book Scoring Wizard** (`/wizard`): Upload audiobooks or PDFs and configure book details
- **Background Jobs** (`/jobs`): Track the progress of music generation jobs
- **Redux State Management**: Centralized state management with full TypeScript support
- **Client-side Routing**: Clean URLs with React Router
- **Drag & Drop Upload**: Easy file upload with drag and drop support
- **Genre Tagging**: Add and remove genre tags for better mood analysis
- **Job Filtering**: Filter jobs by status (All, In Progress, Ready)
- **Tailwind CSS**: Utility-first styling available throughout
- **Type Safety**: Full TypeScript implementation for better developer experience

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Routes

- `/` - Redirects to `/jobs`
- `/jobs` - Background Scoring dashboard
- `/wizard` - Book Scoring Wizard

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx               # Route layout wrapper
│   ├── BookScoringWizard.tsx    # Upload and configure book
│   ├── BookScoringWizard.css
│   ├── BackgroundScoring.tsx     # Jobs dashboard
│   └── BackgroundScoring.css
├── store/
│   ├── store.ts                  # Redux store configuration
│   ├── hooks.ts                  # Typed Redux hooks
│   └── slices/
│       ├── bookSlice.ts         # Book upload and details state
│       └── jobsSlice.ts         # Background jobs state
├── types/
│   └── index.ts                  # TypeScript type definitions
├── App.tsx                       # Main app with routing
├── App.css
├── main.tsx                      # App entry point
└── index.css                     # Global styles + Tailwind
```

## Configuration Files

- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.ts` - Vite build configuration

## TypeScript Types

All types are defined in `src/types/index.ts`:

```typescript
interface AudioFile {
  name: string;
  size: number;
  type: string;
}

interface BookDetails {
  title: string;
  author: string;
  year: number;
  description: string;
  genres: string[];
}

type JobStatus = 'In progress' | 'Ready';

interface Job {
  id: string;
  fileName: string;
  status: JobStatus;
  progress: number;
  created: string;
}
```

## Redux State

### Book Slice
- `audioFile: AudioFile | null`
- `bookDetails: BookDetails`
- `step: number`

### Jobs Slice
- `jobs: Job[]`
- `filter: JobFilter`

## Using React Router

```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const goToJobs = () => navigate('/jobs');
  const goToWizard = () => navigate('/wizard');
  
  return <button onClick={goToJobs}>View Jobs</button>;
};
```

## Using Tailwind CSS

Tailwind is integrated and ready to use:

```tsx
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900">Title</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

## Using Typed Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from './store/hooks';

const MyComponent = () => {
  const dispatch = useAppDispatch(); // Typed dispatch
  const jobs = useAppSelector(state => state.jobs); // Typed selector
  
  dispatch(addJob(newJob)); // Type-safe actions
};
```

## Development

### Type Checking

```bash
# Run TypeScript compiler check
npx tsc --noEmit

# Build (includes type checking)
npm run build
```

### Tailwind Development

Tailwind watches for changes automatically in dev mode. Add utility classes and see results instantly.

## Usage

1. Navigate to `/jobs` (default page)
2. Click "+ New Job" to go to `/wizard`
3. Upload an audiobook or PDF file
4. Review and edit book details
5. Add genre tags
6. Click "Start scoring" to create a job
7. Returns to `/jobs` to track progress

## Future Enhancements

- Individual job detail pages (`/jobs/:id`)
- User authentication and protected routes
- Dark mode support with Tailwind
- Custom Tailwind theme/design tokens
- Backend API integration
- Real-time progress updates via WebSockets
- Advanced mood analysis configuration
- Audio preview before download
- Export to various audio formats

## Key Benefits

### TypeScript
- Compile-time error checking
- Better IDE support with autocomplete
- Self-documenting code
- Reduced bugs

### React Router
- Clean URLs for bookmarking
- Browser history support
- Easy navigation between pages
- Scalable routing structure

### Tailwind CSS
- Rapid UI development
- Consistent design system
- Responsive utilities
- Small production bundle (purges unused styles)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox

## License

MIT
