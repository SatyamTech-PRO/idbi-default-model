import { LoanInput, PredictionResponse } from "@/types/loan";

// Direct fetch to deployed backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://idbi-default-model.onrender.com";

export async function predictDefault(
  data: LoanInput
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<PredictionResponse>;
}

export async function loginAuth(employee_id: string, password: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee_id, password }),
  });

  if (!res.ok && res.status !== 401) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<{ success: boolean; message: string }>;
}
