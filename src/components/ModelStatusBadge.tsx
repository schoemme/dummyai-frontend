import React, { useState, useEffect } from 'react';
import { ModelStatus } from 'dummyai-shared-types';
import { getModelStatus } from '../api/client';

interface ModelStatusBadgeProps {
  modelId: string;
}

const statusColors: Record<ModelStatus['status'], string> = {
  training: 'orange',
  ready: 'green',
  failed: 'red',
  deploying: 'blue',
};

export function ModelStatusBadge({ modelId }: ModelStatusBadgeProps) {
  const [status, setStatus] = useState<ModelStatus | null>(null);

  useEffect(() => {
    let active = true;

    const fetchStatus = async () => {
      const result = await getModelStatus(modelId);
      if (active) {
        setStatus(result);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [modelId]);

  if (!status) {
    return <span className="model-status-badge loading">Loading status...</span>;
  }

  return (
    <span className="model-status-badge" style={{ color: statusColors[status.status] }}>
      {status.status} - {status.progress}% - {status.lastUpdated}
    </span>
  );
}
