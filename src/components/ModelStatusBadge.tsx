import React from 'react';
import { ModelStatus } from 'dummyai-shared-types';
import { getModelStatus } from '../api/client';

interface ModelStatusBadgeProps {
  modelId: string;
}

export function ModelStatusBadge({ modelId }: ModelStatusBadgeProps) {
  const [status, setStatus] = React.useState<ModelStatus | null>(null);

  React.useEffect(() => {
    getModelStatus(modelId).then(setStatus);

    const interval = setInterval(() => {
      getModelStatus(modelId).then(setStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, [modelId]);

  if (!status) {
    return <span className="model-status-badge">Loading...</span>;
  }

  return (
    <span className="model-status-badge">
      {status.status} - {status.progress}%
    </span>
  );
}
