import { Model, InferenceResponse, ModelStatus } from 'dummyai-shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function listModels(): Promise<Model[]> {
  const res = await fetch(`${API_BASE}/models`);
  return res.json();
}

export async function runInference(modelId: string, input: Record<string, unknown>): Promise<InferenceResponse> {
  const res = await fetch(`${API_BASE}/models/${modelId}/infer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId, input }),
  });
  return res.json();
}

export async function getModelStatus(modelId: string): Promise<ModelStatus> {
  const res = await fetch(`${API_BASE}/models/${modelId}/status`);
  return res.json();
}
