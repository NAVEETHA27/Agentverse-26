import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlumniVerse | AI-Based Alumni Career & Networking Platform",
  description:
    "An agentic AI career network that understands your goals, finds the right people to help you reach them, and continuously guides your next career move.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
