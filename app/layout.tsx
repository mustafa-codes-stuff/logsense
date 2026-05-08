import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogSense",
  description: "AI-powered log analysis tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-50 min-h-screen antialiased selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
