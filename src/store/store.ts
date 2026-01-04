import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './slices/bookSlice';
import jobsReducer from './slices/jobsSlice';
import { jobsApi } from './api/jobsApi';

export const store = configureStore({
  reducer: {
    book: bookReducer,
    jobs: jobsReducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;