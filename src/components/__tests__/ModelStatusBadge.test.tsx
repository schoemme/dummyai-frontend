import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import { ModelStatusBadge } from '../ModelStatusBadge';
import { getModelStatus } from '../../api/client';

jest.mock('../../api/client', () => ({
  getModelStatus: jest.fn(),
}));

const mockGetModelStatus = getModelStatus as jest.MockedFunction<typeof getModelStatus>;

const mockStatus = {
  modelId: 'model-001',
  status: 'training' as const,
  progress: 65,
  lastUpdated: '2026-01-15T10:00:00.000Z',
};

describe('ModelStatusBadge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetModelStatus.mockReset();
    mockGetModelStatus.mockResolvedValue(mockStatus);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render a loading state initially', () => {
    mockGetModelStatus.mockReturnValue(new Promise(() => {}));
    render(<ModelStatusBadge modelId="model-001" />);
    expect(screen.getByText('Loading status...')).toBeTruthy();
  });

  it('should display status, progress, and lastUpdated after fetch resolves', async () => {
    await act(async () => {
      render(<ModelStatusBadge modelId="model-001" />);
    });

    expect(screen.getByText(/training/)).toBeTruthy();
    expect(screen.getByText(/65%/)).toBeTruthy();
    expect(screen.getByText(/2026-01-15T10:00:00.000Z/)).toBeTruthy();
  });

  it('should poll getModelStatus every 5 seconds', async () => {
    await act(async () => {
      render(<ModelStatusBadge modelId="model-001" />);
    });

    expect(mockGetModelStatus).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockGetModelStatus).toHaveBeenCalledTimes(2);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockGetModelStatus).toHaveBeenCalledTimes(3);
  });

  it('should clean up interval on unmount', async () => {
    let unmount: () => void;
    await act(async () => {
      const result = render(<ModelStatusBadge modelId="model-001" />);
      unmount = result.unmount;
    });

    expect(mockGetModelStatus).toHaveBeenCalledTimes(1);

    unmount!();

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockGetModelStatus).toHaveBeenCalledTimes(1);
  });

  it('should pass the correct modelId to getModelStatus', async () => {
    await act(async () => {
      render(<ModelStatusBadge modelId="model-xyz" />);
    });

    expect(mockGetModelStatus).toHaveBeenCalledWith('model-xyz');
  });
});
