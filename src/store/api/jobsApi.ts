import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface JobsListResponse {
  success: boolean;
  jobs: Array<{
    jobId: string;
    status: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
    input: {
      fileName: string;
      fileUrl: string;
      fileType: string;
      title: string;
      stylePreset: string;
      mixWithAudiobook: boolean;
    };
    metadata: {
      title: string;
      author: string;
      year: string;
      description: string;
      genres: string[];
    };
    fileReference: {
      type: string;
      url: string;
      fileName: string;
      fileType: string;
    };
    outputs?: {
      musicOnlyUrl: string;
      mixedUrl: string;
    };
    error: string | null;
  }>;
  stats: {
    total: number;
    queued: number;
    transcribing: number;
    analyzing: number;
    composing: number;
    mixing: number;
    completed: number;
    failed: number;
    byCategory: {
      audio: number;
      pdf: number;
    };
  };
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface CreateJobPayload {
  fileUrl: string;
  fileName: string;
  fileType: string;
  title?: string;
  stylePreset?: string;
  mixWithAudiobook?: boolean;
}

export interface FileUploadResponse {
  success: boolean;
  file: {
    originalFileName: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    category: string;
    uploadedAt: string;
  };
}

export interface JobStatusResponse {
  success: boolean;
  job: {
    jobId: string;
    status: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
    input: {
      fileName: string;
      fileUrl: string;
      fileType: string;
      title: string;
      stylePreset: string;
      mixWithAudiobook: boolean;
    };
    metadata: {
      title: string;
      author: string;
      year: string;
      description: string;
      genre: string;
    };
    fileReference: {
      type: string;
      url: string;
      fileName: string;
      fileType: string;
    };
    outputs?: {
      musicOnlyUrl: string;
      mixedUrl: string;
    };
    error: string | null;
  };
}

export interface JobSegment {
  jobId: string;
  segmentId: string;
  text: string;
  start: number;
  end: number;
  duration: number;
  mood: string;
  intensity: number;
  musicalSuggestions: {
    tempo?: string;
    instrumentation?: string;
    dynamics?: string;
    genre?: string;
    techniques?: string[];
    [key: string]: any;
  };
}

export interface JobSegmentsResponse {
  success: boolean;
  jobId: string;
  segments: JobSegment[];
  totalSegments: number;
}

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', import.meta.env.VITE_API_SECURITY_TOKEN);
      return headers;
    },
  }),
  tagTypes: ['Jobs', 'JobStatus'],
  endpoints: (builder) => ({
    getJobs: builder.query<JobsListResponse, void>({
      query: () => ({
        url: '/jobs/list',
        method: 'GET',
      }),
      providesTags: ['Jobs'],
      transformResponse: (response: JobsListResponse) => response,
    }),
    
    getJobStatus: builder.query<JobStatusResponse, string>({
      query: (jobId) => ({
        url: `${import.meta.env.VITE_API_JOB_STATUS_UUID_PATH}/jobs/status/${jobId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, jobId) => [{ type: 'JobStatus', id: jobId }],
      transformResponse: (response: JobStatusResponse) => response,
    }),
    
    getJobSegments: builder.query<JobSegmentsResponse, string>({
      query: (jobId) => ({
        url: `${import.meta.env.VITE_API_JOB_SEGMENTS_UUID_PATH}/jobs/segments/${jobId}`,
        method: 'GET',
      }),
      transformResponse: (response: JobSegmentsResponse) => response,
    }),
    
    uploadFile: builder.mutation<FileUploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('data', file);
        
        return {
          url: '/files/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
    
    createJob: builder.mutation<any, CreateJobPayload>({
      query: (payload) => ({
        url: '/jobs/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      invalidatesTags: ['Jobs'],
    }),
  }),
});

export const { 
  useGetJobsQuery, 
  useGetJobStatusQuery,
  useGetJobSegmentsQuery,
  useUploadFileMutation, 
  useCreateJobMutation 
} = jobsApi;