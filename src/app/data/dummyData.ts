// features.ts

import {
  AlertTriangle,
 
  Boxes,
  Clock,
  Cloud,
  Database,
  DatabaseZap,
  FileCode2,
  
  LayoutTemplate,
  
  LucideIcon,
  Server,
  Shield,
  Zap,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export function getFeatures(t: (key: string) => string): Feature[] {
  return [
    {
      icon: Shield,
      title: t("featureTitle_1"),
      description: t("featureDescription_1"),
      color: "text-green-600",
    },
    {
      icon: Database,
      title: t("featureTitle_2"),
      description: t("featureDescription_2"),
      color: "text-orange-600",
    },
    {
      icon: Clock,
      title: t("featureTitle_3"),
      description: t("featureDescription_3"),
      color: "text-teal-600",
    },
    {
      icon: Boxes,
      title: t("featureTitle_4"),
      description: t("featureDescription_4"),
      color: "text-fuchsia-600",
    },
    {
      icon: LayoutTemplate,
      title: t("featureTitle_5"),
      description: t("featureDescription_5"),
      color: "text-cyan-600",
    },
    {
      icon: FileCode2,
      title: t("featureTitle_6"),
      description: t("featureDescription_6"),
      color: "text-orange-500",
    },
    {
      icon: AlertTriangle,
      title: t("featureTitle_7"),
      description: t("featureDescription_7"),
      color: "text-red-700",
    },
    {
      icon: Zap,
      title: t("featureTitle_8"),
      description: t("featureDescription_8"),
      color: "text-yellow-600",
    },
    {
      icon: Server,
      title: t("featureTitle_9"),
      description: t("featureDescription_9"),
      color: "text-indigo-500",
    },
    {
      icon: DatabaseZap,
      title: t("featureTitle_10"),
      description: t("featureDescription_10"),
      color: "text-blue-700",
    },
    {
      icon: Cloud,
      title: t("featureTitle_11"),
      description: t("featureDescription_11"),
      color: "text-cyan-500",
    },
  ];
}