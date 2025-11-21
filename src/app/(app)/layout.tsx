import type { ReactNode } from "react";

import { AppLayoutShell } from "@/components/layout/AppLayoutShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
