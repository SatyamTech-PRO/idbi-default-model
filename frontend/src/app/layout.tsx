import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDBI Loan Default Prediction Dashboard",
  description:
    "ML-powered loan default risk assessment tool for IDBI Bank — predict probability of default, risk band, and SHAP-based explanations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
