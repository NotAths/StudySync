import type { LucideIcon } from "lucide-react";

/**
 * StudySync Foundation & Dashboard Types
 */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  active?: boolean;
}

export interface AppMetadata {
  name: string;
  tagline: string;
  description: string;
}

export interface StatMetric {
  id: string;
  title: string;
  value: string;
  changeLabel: string;
  icon: LucideIcon;
}

export interface StudyKitItem {
  id: string;
  title: string;
  subject: string;
  cardCount: number;
  lastStudied: string;
}

export interface RevisionItem {
  id: string;
  topic: string;
  dueTime: string;
  urgency: "low" | "medium" | "high";
}
