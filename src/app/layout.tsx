import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";

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
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
