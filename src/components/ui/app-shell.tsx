import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  sidebar: ReactNode;
  sidebarMobile?: ReactNode;
  navbar: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AppShell({
  sidebar,
  sidebarMobile,
  navbar,
  children,
  className,
}: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen w-full bg-muted/30", className)}>
      {sidebar}
      {sidebarMobile}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-64 xl:ml-72">
        {navbar}
        <main className="flex-1 p-6 lg:p-10 xl:p-12">{children}</main>
      </div>
    </div>
  );
}
