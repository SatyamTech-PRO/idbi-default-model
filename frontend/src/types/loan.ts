export interface LoanInput {
  age: number;
  annual_income: number;
  loan_amount: number;
  credit_score: number;
  months_employed: number;
  num_credit_lines: number;
  interest_rate: number;
  term: number;
  debt_to_income: number;
  income_to_loan_ratio: number;
  has_mortgage_flag: 0 | 1;
  has_dependents_flag: 0 | 1;
  has_cosigner_flag: 0 | 1;
  loan_segment: "MSME" | "Auto" | "Mortgage-linked" | "Personal" | "Other";
  education: "Bachelors" | "Masters" | "High School" | "PhD";
  employment_type: "Full-time" | "Part-time" | "Self-employed" | "Unemployed";
  marital_status: "Single" | "Married" | "Divorced";
}

export interface TopReason {
  feature: string;
  impact: number;
}

export interface PredictionResponse {
  probability_of_default: number;
  risk_band: "Low" | "Medium" | "High";
  top_reasons: TopReason[];
  loan_segment: string;
}
