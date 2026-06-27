import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momentum OS",
  description:
    "An opinionated decision-and-reflection instrument for converting ambition into daily execution.",
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
