import { LoanInput, PredictionResponse } from "@/types/loan";

// Uses Next.js rewrite proxy (/api → http://localhost:8000) to avoid CORS
// Override with NEXT_PUBLIC_API_URL if the backend is on a different host
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

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
