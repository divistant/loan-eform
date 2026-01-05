/**
 * Status Tracking Types
 * 
 * Status workflow: SUBMITTED → VERIFIED → APPROVED/REJECTED → DISBURSED
 * Note: Tidak ada status DRAFT karena tidak ada server-side draft storage
 */

export type ApplicationStatus = 
  | 'SUBMITTED'        // Form sudah submit, data masuk ke sistem backend
  | 'VERIFIED'         // Data sudah diverifikasi oleh tim analis
  | 'APPROVED'         // Kredit disetujui
  | 'REJECTED'         // Kredit ditolak
  | 'DISBURSED';       // Dana sudah dicairkan (hanya jika APPROVED)

export type StatusTransition = {
  from: ApplicationStatus | null; // null untuk initial status
  to: ApplicationStatus;
  timestamp: string; // ISO 8601 format
  updatedBy?: string; // System atau User ID dari backend
  notes?: string; // Catatan dari tim (optional)
};

export type TrackingMetadata = {
  productName: string;
  loanAmount: number;
  applicantName: string;
  email: string;
  phoneNumber: string;
};

export type ApplicationTracking = {
  uuid: string; // prpect_uuid dari API response
  currentStatus: ApplicationStatus;
  statusHistory: StatusTransition[];
  submittedAt: string; // ISO 8601 format
  lastUpdated: string; // ISO 8601 format
  metadata?: TrackingMetadata;
};

/**
 * Helper function untuk check apakah status sudah final
 */
export function isFinalStatus(status: ApplicationStatus): boolean {
  return status === 'APPROVED' || status === 'REJECTED' || status === 'DISBURSED';
}

/**
 * Helper function untuk get status label dalam Bahasa Indonesia
 */
export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    SUBMITTED: 'Telah Dikirim',
    VERIFIED: 'Telah Diverifikasi',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    DISBURSED: 'Dana Dicairkan',
  };
  return labels[status];
}

/**
 * Helper function untuk get status description
 */
export function getStatusDescription(status: ApplicationStatus): string {
  const descriptions: Record<ApplicationStatus, string> = {
    SUBMITTED: 'Pengajuan Anda telah diterima dan sedang dalam proses verifikasi',
    VERIFIED: 'Data Anda telah diverifikasi oleh tim analis kami',
    APPROVED: 'Selamat! Pengajuan kredit Anda telah disetujui',
    REJECTED: 'Maaf, pengajuan kredit Anda tidak dapat disetujui',
    DISBURSED: 'Dana telah dicairkan ke rekening Anda',
  };
  return descriptions[status];
}

