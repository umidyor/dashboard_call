import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock the useAnalyses hook
vi.mock('../hooks/useAnalysis', () => ({
  useAnalyses: () => ({
    data: {
      total: 2,
      analyses: [
        {
          id: 'test-1',
          filename: 'test_call.mp3',
          created_at: '2024-01-15T10:30:00Z',
          status: 'completed',
        },
      ],
    },
    isLoading: false,
    error: null,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    const { container } = renderWithProviders(<Dashboard />);
    expect(container.textContent).toContain('Dashboard');
  });

  it('renders KPI cards', () => {
    const { container } = renderWithProviders(<Dashboard />);
    expect(container.textContent).toContain('Total Analyses');
    expect(container.textContent).toContain('Completed');
  });

  it('renders analyses table', () => {
    const { container } = renderWithProviders(<Dashboard />);
    expect(container.textContent).toContain('Recent Analyses');
  });
});
