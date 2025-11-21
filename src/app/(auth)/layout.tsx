import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white flex items-stretch justify-center p-6 sm:p-10">
      <div className="w-full max-w-6xl">{children}</div>
    </div>
  );
}
