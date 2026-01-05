import type { ApplicationStatus, StatusTransition } from "@/types/status-tracking";
import { CheckCircle2, Clock, XCircle, CheckCircle, DollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Status Utilities
 * Helper functions untuk status comparison, change detection, dan UI mapping
 */

/**
 * Get status color untuk UI
 */
export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    SUBMITTED: '#3B82F6', // Blue
    VERIFIED: '#3B82F6', // Blue
    APPROVED: '#16A34A', // Green
    REJECTED: '#DC2626', // Red
    DISBURSED: '#16A34A', // Green
  };
  return colors[status];
}

/**
 * Get status background color untuk UI
 */
export function getStatusBgColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    SUBMITTED: 'bg-blue-50',
    VERIFIED: 'bg-blue-50',
    APPROVED: 'bg-green-50',
    REJECTED: 'bg-red-50',
    DISBURSED: 'bg-green-50',
  };
  return colors[status];
}

/**
 * Get status text color untuk UI
 */
export function getStatusTextColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    SUBMITTED: 'text-blue-700',
    VERIFIED: 'text-blue-700',
    APPROVED: 'text-green-700',
    REJECTED: 'text-red-700',
    DISBURSED: 'text-green-700',
  };
  return colors[status];
}

/**
 * Get status icon
 */
export function getStatusIcon(status: ApplicationStatus): LucideIcon {
  const icons: Record<ApplicationStatus, LucideIcon> = {
    SUBMITTED: Clock,
    VERIFIED: CheckCircle2,
    APPROVED: CheckCircle,
    REJECTED: XCircle,
    DISBURSED: DollarSign,
  };
  return icons[status];
}

/**
 * Check apakah status transition valid
 */
export function isValidTransition(from: ApplicationStatus | null, to: ApplicationStatus): boolean {
  // Initial status harus SUBMITTED
  if (from === null) {
    return to === 'SUBMITTED';
  }

  // Valid transitions
  const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    SUBMITTED: ['VERIFIED', 'REJECTED'], // Bisa langsung rejected tanpa verified
    VERIFIED: ['APPROVED', 'REJECTED'],
    APPROVED: ['DISBURSED'],
    REJECTED: [], // Final status, tidak bisa transition
    DISBURSED: [], // Final status, tidak bisa transition
  };

  return validTransitions[from].includes(to);
}

/**
 * Detect status change
 */
export function hasStatusChanged(
  previousStatus: ApplicationStatus | null,
  currentStatus: ApplicationStatus
): boolean {
  return previousStatus !== currentStatus;
}

/**
 * Get next possible statuses
 */
export function getNextPossibleStatuses(currentStatus: ApplicationStatus): ApplicationStatus[] {
  const nextStatuses: Record<ApplicationStatus, ApplicationStatus[]> = {
    SUBMITTED: ['VERIFIED', 'REJECTED'],
    VERIFIED: ['APPROVED', 'REJECTED'],
    APPROVED: ['DISBURSED'],
    REJECTED: [],
    DISBURSED: [],
  };
  return nextStatuses[currentStatus];
}

/**
 * Format timestamp untuk display
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Baru saja';
  } else if (diffMins < 60) {
    return `${diffMins} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

