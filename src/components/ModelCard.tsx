import React from 'react';
import { Model } from 'dummyai-shared-types';
import { ModelStatusBadge } from './ModelStatusBadge';

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="model-card">
      <h3>{model.name}</h3>
      <p>Version: {model.version}</p>
      <p>Created: {model.createdAt}</p>
      <ModelStatusBadge modelId={model.id} />
    </div>
  );
}
