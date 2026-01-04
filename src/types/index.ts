// Book related types
export interface AudioFile {
  name: string;
  size: number;
  type: string;
}

export interface BookDetails {
  title: string;
  author: string;
  year: number;
  description: string;
  genres: string[];
}

export interface BookState {
  audioFile: AudioFile | null;
  bookDetails: BookDetails;
}

// UI state types
export type JobFilter = 'all' | 'queued' | 'transcribing' | 'analyzing' | 'composing' | 'mixing' | 'completed';

// Redux store type
export interface RootState {
  book: BookState;
  jobs: {
    filter: JobFilter;
  };
}
