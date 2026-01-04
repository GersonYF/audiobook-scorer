import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookState, AudioFile, BookDetails } from '../../types';

const initialState: BookState = {
  audioFile: null,
  bookDetails: {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    genres: [],
  },
  step: 1,
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setAudioFile: (state, action: PayloadAction<AudioFile | null>) => {
      state.audioFile = action.payload;
    },
    updateBookDetails: (state, action: PayloadAction<Partial<BookDetails>>) => {
      state.bookDetails = { ...state.bookDetails, ...action.payload };
    },
    addGenre: (state, action: PayloadAction<string>) => {
      if (!state.bookDetails.genres.includes(action.payload)) {
        state.bookDetails.genres.push(action.payload);
      }
    },
    removeGenre: (state, action: PayloadAction<string>) => {
      state.bookDetails.genres = state.bookDetails.genres.filter(
        (genre) => genre !== action.payload
      );
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    resetBook: () => {
      return initialState;
    },
  },
});

export const {
  setAudioFile,
  updateBookDetails,
  addGenre,
  removeGenre,
  setStep,
  resetBook,
} = bookSlice.actions;

export default bookSlice.reducer;
