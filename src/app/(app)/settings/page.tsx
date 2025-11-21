"use client";

import { useState } from "react";
import { Building2, ShieldCheck, User } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@gomaintenance.io",
    role: "Admin",
  });
  const [company, setCompany] = useState({
    name: "GoMaintenance",
    fleet: 128,
    timezone: "UTC",
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SiteHeader
        title="Settings"
        description="Manage your profile and company defaults."
      />

      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <User className="h-4 w-4 text-gm-primary" />
              <p className="text-sm font-semibold">Profile</p>
            </div>
            <p className="text-xs text-gm-muted">
              Keep your contact information up to date.
            </p>
            <div className="mt-4 grid gap-3">
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
              <Input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
              <Input
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="bg-gm-primary text-black hover:bg-gm-primary/90">
                Save profile
              </Button>
            </div>
          </Card>

          <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <Building2 className="h-4 w-4 text-gm-primary" />
              <p className="text-sm font-semibold">Company</p>
            </div>
            <p className="text-xs text-gm-muted">
              Branding, fleet size, and compliance defaults.
            </p>
            <div className="mt-4 grid gap-3">
              <Input
                value={company.name}
                onChange={(e) =>
                  setCompany({ ...company, name: e.target.value })
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
              <Input
                type="number"
                value={company.fleet}
                onChange={(e) =>
                  setCompany({ ...company, fleet: Number(e.target.value) })
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
              <Input
                value={company.timezone}
                onChange={(e) =>
                  setCompany({ ...company, timezone: e.target.value })
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">
                Enterprise
              </Badge>
              <Button
                variant="outline"
                className="border-gm-border text-foreground"
              >
                Update company
              </Button>
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-4 w-4 text-gm-primary" />
            <p className="text-sm font-semibold">Security</p>
          </div>
          <p className="text-xs text-gm-muted">
            MFA, SSO and audit log preferences.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["MFA required", "SSO via SAML", "Audit log retention"].map(
              (item) => (
                <Card
                  key={item}
                  className="rounded-xl border-gm-border/60 bg-gm-panel p-3 text-sm text-foreground"
                >
                  <p className="font-semibold">{item}</p>
                  <p className="text-xs text-gm-muted">Enabled</p>
                </Card>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
