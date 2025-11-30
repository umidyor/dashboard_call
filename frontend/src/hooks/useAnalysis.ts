import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { analysisApi } from '../api/analysisApi';
import type { AnalysesResponse, AnalysisDetail, StatusResponse } from '../types';

export const useAnalyses = (status?: string): UseQueryResult<AnalysesResponse> => {
  return useQuery({
    queryKey: ['analyses', status],
    queryFn: () => analysisApi.getAnalyses(status),
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
};

export const useAnalysisStatus = (
  analysisId: string,
  enabled: boolean = true
): UseQueryResult<StatusResponse> => {
  return useQuery({
    queryKey: ['analysis-status', analysisId],
    queryFn: () => analysisApi.getAnalysisStatus(analysisId),
    enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'pending' || data.status === 'processing')) {
        return 2000;
      }
      return false;
    },
  });
};

export const useAnalysisDetail = (
  analysisId: string,
  enabled: boolean = true
): UseQueryResult<AnalysisDetail> => {
  return useQuery({
    queryKey: ['analysis-detail', analysisId],
    queryFn: () => analysisApi.getAnalysisDetail(analysisId),
    enabled,
    staleTime: 60000,
  });
};
