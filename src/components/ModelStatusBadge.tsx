import React, { useEffect, useState } from 'react';
import { ModelStatus, ModelStatusState } from 'dummyai-shared-types';
import { getModelStatus } from '../api/client';

const STATUS_COLORS: Record<ModelStatusState, string> = {
  training: '#f59e0b',
  deploying: '#3b82f6',
  ready: '#10b981',
  failed: '#ef4444',
};

interface ModelStatusBadgeProps {
  modelId: string;
  pollIntervalMs?: number;
}

// Added by Kiro: polls /models/:id/status every 5 seconds
export function ModelStatusBadge({ modelId, pollIntervalMs = 5000 }: ModelStatusBadgeProps) {
  const [status, setStatus] = useState<ModelStatus | null>(null);

  useEffect(() => {
    const fetch = () => getModelStatus(modelId).then(setStatus).catch(console.error);
    fetch();
    const interval = setInterval(fetch, pollIntervalMs);
    return () => clearInterval(interval);
  }, [modelId, pollIntervalMs]);

  if (!status) return <span className="badge">Loading...</span>;

  return (
    <span className="badge" style={{ backgroundColor: STATUS_COLORS[status.status] }}>
      {status.status}
      {status.status === 'training' && ` (${status.progress}%)`}
    </span>
  );
}
