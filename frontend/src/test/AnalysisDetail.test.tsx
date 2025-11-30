import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnalysisDetail from '../pages/AnalysisDetail';

// Mock hooks
vi.mock('../hooks/useAnalysis', () => ({
  useAnalysisStatus: () => ({
    data: { id: 'test-1', status: 'completed' },
  }),
  useAnalysisDetail: () => ({
    data: {
      id: 'test-1',
      filename: 'test_call.mp3',
      created_at: '2024-01-15T10:30:00Z',
      completed_at: '2024-01-15T10:32:00Z',
      status: 'completed',
      statistics: {
        reyting: { umumiy_ball: 85 },
      },
    },
    isLoading: false,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('AnalysisDetail', () => {
  it('renders analysis filename', () => {
    window.history.pushState({}, '', '/analysis/test-1');
    const { container } = renderWithProviders();
    expect(container.textContent).toContain('test_call.mp3');
  });

  it('renders download button', () => {
    window.history.pushState({}, '', '/analysis/test-1');
    const { container } = renderWithProviders();
    expect(container.textContent).toContain('Download JSON');
  });
});
