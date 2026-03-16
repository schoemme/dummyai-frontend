import React from 'react';
import { Model } from 'dummyai-shared-types';

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="model-card">
      <h3>{model.name}</h3>
      <p>Version: {model.version}</p>
      <p>Created: {model.createdAt}</p>
      {/* TODO: Add ModelStatusBadge component here */}
    </div>
  );
}
