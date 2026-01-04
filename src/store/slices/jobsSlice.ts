import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobFilter } from '../../types';

interface JobsUIState {
  filter: JobFilter;
}

const initialState: JobsUIState = {
  filter: 'all',
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<JobFilter>) => {
      state.filter = action.payload;
    },
  },
});

export const { setFilter } = jobsSlice.actions;

export default jobsSlice.reducer;