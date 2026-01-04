# Audiobook Background Scorer - Quick Start Guide (TypeScript)

## Installation

1. Extract the archive:
```bash
tar -xzf audiobook-scorer.tar.gz
cd audiobook-scorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (usually http://localhost:5173)

## What You'll See

The app starts on the **Background Scoring** page showing sample jobs:
- Click "New Job" to go to the Book Scoring Wizard
- Use the tabs (All, In progress, Ready) to filter jobs

## Testing the Wizard

1. Click "+ New Job" button
2. Upload an audio file or PDF (or just click the upload area to test)
3. The book details section shows editable fields
4. Add/remove genre tags by clicking them
5. Click "Start scoring" to create a job
6. You'll return to the jobs dashboard with your new job

## TypeScript Features

### Type Safety in Action

Open the project in VS Code or your preferred IDE to see:

```typescript
// Hover over variables to see inferred types
const job: Job = { ... }

// Autocomplete for Redux actions
dispatch(addJob(...))  // ← IDE shows available actions

// Type-safe state access
const { jobs, filter } = useAppSelector(state => state.jobs)
```

### Type Checking

```bash
# Check for type errors without building
npx tsc --noEmit

# Build with type checking
npm run build
```

## Project Structure

```
audiobook-scorer/
├── src/
│   ├── components/          # React components (TypeScript)
│   │   ├── BookScoringWizard.tsx
│   │   ├── BookScoringWizard.css
│   │   ├── BackgroundScoring.tsx
│   │   └── BackgroundScoring.css
│   ├── store/              # Redux store (TypeScript)
│   │   ├── store.ts
│   │   ├── hooks.ts       # Typed useDispatch & useSelector
│   │   └── slices/
│   │       ├── bookSlice.ts
│   │       └── jobsSlice.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── tsconfig.json           # TypeScript configuration
├── package.json
└── vite.config.ts
```

## Working with Types

### Viewing Type Definitions

All types are in `src/types/index.ts`:

```typescript
interface Job {
  id: string;
  fileName: string;
  status: JobStatus;
  progress: number;
  created: string;
}

type JobStatus = 'In progress' | 'Ready';
```

### Adding New Types

1. Open `src/types/index.ts`
2. Add your type/interface
3. Export it
4. Import where needed

### Using Redux with TypeScript

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Typed dispatch
const dispatch = useAppDispatch();

// Typed selector with autocomplete
const bookDetails = useAppSelector(state => state.book.bookDetails);

// Type-safe action creators
dispatch(addGenre('Mystery')); // TypeScript ensures correct payload
```

## Development Tips

### IntelliSense

Your IDE will provide:
- Autocomplete for component props
- Type hints for Redux state
- Error highlighting for type mismatches
- Go-to-definition for types

### Common TypeScript Patterns

**Component Props:**
```typescript
interface MyComponentProps {
  title: string;
  onComplete: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onComplete }) => {
  // ...
}
```

**Event Handlers:**
```typescript
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
}
```

**Redux Actions:**
```typescript
// In slice
reducers: {
  setFilter: (state, action: PayloadAction<JobFilter>) => {
    state.filter = action.payload;
  }
}
```

## Key TypeScript Files

- `tsconfig.json` - TypeScript compiler configuration
- `src/types/index.ts` - All type definitions
- `src/store/hooks.ts` - Typed Redux hooks
- `*.tsx` - React components with TypeScript

## Next Steps

To add backend functionality:
1. Define API response types in `src/types/index.ts`
2. Create API client with TypeScript
3. Type your async thunks for Redux
4. Add error types for better error handling

## Customization

### Adding New Features with Types

1. Define types first in `src/types/index.ts`
2. Create Redux slice with typed actions
3. Build components with TypeScript
4. Enjoy type safety throughout

### Type-Safe API Integration

```typescript
// Define API types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Use in async thunks
const fetchJobs = createAsyncThunk<Job[], void>(
  'jobs/fetch',
  async () => {
    const response = await api.get<ApiResponse<Job[]>>('/jobs');
    return response.data.data;
  }
);
```

## Troubleshooting

**TypeScript errors in IDE but builds fine?**
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Type errors during build?**
```bash
# Check specific errors
npx tsc --noEmit

# Common fixes:
# - Add missing type imports
# - Ensure all props are typed
# - Check Redux action payloads
```

**Port already in use?**
```bash
npm run dev -- --port 3000
```

## Production Build

```bash
# Type check + build
npm run build

# Build output in dist/
# All TypeScript compiled to optimized JavaScript
```

## Benefits of TypeScript in This Project

✅ **Catch errors early** - Type errors at compile time, not runtime
✅ **Better refactoring** - Rename variables/types with confidence
✅ **Self-documenting** - Types explain what data looks like
✅ **IDE support** - Amazing autocomplete and navigation
✅ **Redux type safety** - Actions and state fully typed
✅ **Component props** - Never pass wrong props again

## Support

This is a TypeScript frontend prototype. For questions:
- Check type definitions in `src/types/index.ts`
- Review typed Redux hooks in `src/store/hooks.ts`
- Examine component prop interfaces
- Use IDE's "Go to Definition" feature
