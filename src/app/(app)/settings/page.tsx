"use client";

import { useState } from "react";
import { Building2, ShieldCheck, User } from "lucide-react";

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
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center gap-2 text-foreground">
            <User className="h-4 w-4 text-gm-primary" />
            <p className="text-sm font-semibold">Profile</p>
          </div>
          <p className="text-xs text-gm-muted">Keep your contact information up to date.</p>
          <div className="mt-4 grid gap-3">
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="border-gm-border bg-gm-panel text-foreground"
            />
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="border-gm-border bg-gm-panel text-foreground"
            />
            <Input
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
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
          <p className="text-xs text-gm-muted">Branding, fleet size, and compliance defaults.</p>
          <div className="mt-4 grid gap-3">
            <Input
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="border-gm-border bg-gm-panel text-foreground"
            />
            <Input
              value={company.fleet}
              onChange={(e) =>
                setCompany({ ...company, fleet: Number(e.target.value) || 0 })
              }
              className="border-gm-border bg-gm-panel text-foreground"
            />
            <Input
              value={company.timezone}
              onChange={(e) => setCompany({ ...company, timezone: e.target.value })}
              className="border-gm-border bg-gm-panel text-foreground"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-gm-primary text-black hover:bg-gm-primary/90">
              Save company
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-4 w-4 text-gm-primary" />
            <p className="text-sm font-semibold">Security</p>
          </div>
          <p className="text-xs text-gm-muted">MFA, SSO and audit log preferences.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["MFA required", "SSO via SAML", "Audit log retention"].map((item) => (
              <Card
                key={item}
                className="rounded-xl border-gm-border/60 bg-gm-panel p-3 text-sm text-foreground"
              >
                <p className="font-semibold">{item}</p>
                <p className="text-xs text-gm-muted">Enabled</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center gap-2 text-foreground">
            <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">Pro</Badge>
            <p className="text-sm font-semibold">Workspace</p>
          </div>
          <p className="text-xs text-gm-muted">Plan usage and billing.</p>
          <div className="mt-4 grid gap-3 text-sm text-gm-muted">
            <div className="flex items-center justify-between rounded-xl border border-gm-border/60 bg-gm-panel px-3 py-2">
              <span>Seats</span>
              <span className="font-semibold text-foreground">25/50</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gm-border/60 bg-gm-panel px-3 py-2">
              <span>Storage</span>
              <span className="font-semibold text-foreground">120 GB</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gm-border/60 bg-gm-panel px-3 py-2">
              <span>Support</span>
              <span className="font-semibold text-foreground">24/7</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" className="border-gm-border text-foreground">
              Upgrade
            </Button>
            <Button className="bg-gm-primary text-black hover:bg-gm-primary/90" size="sm">
              Manage billing
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
