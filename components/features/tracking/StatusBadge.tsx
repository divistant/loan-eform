"use client";

import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/status-tracking";
import { getStatusLabel, getStatusDescription } from "@/types/status-tracking";
import { getStatusBgColor, getStatusTextColor, getStatusIcon } from "@/lib/utils/status-utils";
import { motion } from "framer-motion";

type StatusBadgeProps = {
  status: ApplicationStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showDescription?: boolean;
  className?: string;
  animated?: boolean;
};

export function StatusBadge({
  status,
  size = "md",
  showIcon = true,
  showDescription = false,
  className,
  animated = false,
}: StatusBadgeProps) {
  const Icon = getStatusIcon(status);
  const bgColor = getStatusBgColor(status);
  const textColor = getStatusTextColor(status);
  const label = getStatusLabel(status);
  const description = getStatusDescription(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-semibold shadow-sm",
        bgColor,
        textColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizeClasses[size]} />}
      <span>{label}</span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {content}
      {showDescription && (
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
}

