import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "GoMaintenance",
  description: "Vehicle maintenance GMAO powered by Go",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <div className="min-h-screen bg-gradient-to-br from-white/80 via-[#f0f4fa]/90 to-white/60"> 
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
