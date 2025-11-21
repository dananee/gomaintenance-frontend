import {
  ClipboardList,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

export const mainNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Truck,
  },
  {
    title: "Work Orders",
    href: "/maintenance/work-orders",
    icon: Wrench,
  },
  {
    title: "Maintenance Plans",
    href: "/maintenance/plans",
    icon: ClipboardList,
  },
  {
    title: "Inspections",
    href: "/inspections",
    icon: ShieldCheck,
  },
];

export const secondaryNavigation = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];

export const routeMeta = [
  {
    match: "/dashboard",
    title: "Dashboard",
    description: "Monitor fleet health and maintenance activity.",
  },
  {
    match: "/vehicles",
    title: "Vehicles",
    description: "All vehicles synced from your GoMaintenance backend.",
  },
  {
    match: "/maintenance/work-orders",
    title: "Work Orders",
    description: "Prioritize, assign, and track maintenance tasks across the fleet.",
  },
  {
    match: "/maintenance/plans",
    title: "Maintenance Plans",
    description: "Standardize recurring maintenance with reusable templates.",
  },
  {
    match: "/inspections",
    title: "Inspections",
    description: "Track upcoming and expired inspections across the fleet.",
  },
  {
    match: "/settings",
    title: "Settings",
    description: "Manage your profile and company defaults.",
  },
];
