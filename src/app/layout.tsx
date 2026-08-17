import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoPilot Social",
  description: "AI-powered social media automation workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
