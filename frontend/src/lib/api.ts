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
