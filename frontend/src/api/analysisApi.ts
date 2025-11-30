import { apiClient, MOCK } from './client';
import { mockAnalyses, mockAnalysisDetail, mockStatus } from './mockData';
import type { AnalysesResponse, AnalysisDetail, StatusResponse, Statistics } from '../types';

export const analysisApi = {
  // Get list of analyses - use /all_analyses for full data or /analyses for basic list
  getAnalyses: async (status?: string): Promise<AnalysesResponse> => {
    if (MOCK) {
      return mockAnalyses;
    }
    
    // Use /all_analyses to get everything including transcript and statistics
    const response = await apiClient.get<AnalysesResponse>('/all_analyses');
    
    // Filter by status if needed
    if (status && response.data.results) {
      const filtered = response.data.results.filter(r => r.status === status);
      return {
        ...response.data,
        results: filtered,
        returned: filtered.length,
      };
    }
    
    return response.data;
  },

  // Get analysis status (for polling) - FIXED: use /analysis/{id}/status
  getAnalysisStatus: async (analysisId: string): Promise<StatusResponse> => {
    if (MOCK) {
      return mockStatus;
    }
    
    const response = await apiClient.get<StatusResponse>(`/analysis/${analysisId}/status`);
    return response.data;
  },

  // Get full analysis detail
  getAnalysisDetail: async (analysisId: string): Promise<AnalysisDetail> => {
    if (MOCK) {
      return mockAnalysisDetail;
    }
    
    const response = await apiClient.get<AnalysisDetail>(`/analysis/${analysisId}`);
    return response.data;
  },

  // Get analysis statistics - this endpoint might not exist, use /analysis/{id} instead
  getAnalysisStatistics: async (analysisId: string): Promise<Statistics> => {
    if (MOCK) {
      return mockAnalysisDetail.statistics!;
    }
    
    // Get from main analysis endpoint
    const response = await apiClient.get<AnalysisDetail>(`/analysis/${analysisId}`);
    return response.data.statistics!;
  },
};
