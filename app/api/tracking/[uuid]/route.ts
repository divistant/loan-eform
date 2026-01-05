import { NextResponse } from "next/server";
import type { ApplicationTracking, ApplicationStatus } from "@/types/status-tracking";
import type { TrackingApiResponse } from "@/lib/api/tracking-types";

/**
 * GET /api/tracking/[uuid]
 * Fetch status tracking untuk pengajuan berdasarkan UUID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    // Validate UUID format (basic validation)
    const uuidPattern = /^[a-f0-9-]{36}$/i;
    if (!uuid || !uuidPattern.test(uuid)) {
      const errorResponse: TrackingApiResponse = {
        success: false,
        error: {
          code: 'INVALID_UUID',
          message: 'Invalid UUID format',
          userMessage: 'Format nomor referensi tidak valid. Silakan periksa kembali.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // TODO: Replace dengan real API call ke backend
    // Untuk sekarang, kita akan return mock data
    const mockTracking = generateMockTracking(uuid);

    // Simulasi delay untuk real API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulasi UUID not found (untuk testing)
    if (uuid.startsWith('NOT-FOUND-')) {
      const errorResponse: TrackingApiResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Application not found',
          userMessage: 'Pengajuan dengan nomor referensi tersebut tidak ditemukan. Silakan periksa kembali nomor referensi Anda.',
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const successResponse: TrackingApiResponse = {
      success: true,
      data: mockTracking,
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Error fetching tracking status:', error);
    const errorResponse: TrackingApiResponse = {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: 'Terjadi kesalahan saat mengambil data status. Silakan coba lagi nanti.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Generate mock tracking data untuk development/testing
 */
function generateMockTracking(uuid: string): ApplicationTracking {
  const now = new Date();
  const submittedAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const verifiedAt = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago

  // Random status untuk demo (bisa diubah sesuai kebutuhan)
  const statuses: ApplicationStatus[] = ['SUBMITTED', 'VERIFIED', 'APPROVED', 'REJECTED'];
  const currentStatus = statuses[Math.floor(Math.random() * statuses.length)] as ApplicationStatus;

  const statusHistory: ApplicationTracking['statusHistory'] = [
    {
      from: null,
      to: 'SUBMITTED',
      timestamp: submittedAt.toISOString(),
      updatedBy: 'system',
      notes: 'Pengajuan telah diterima',
    },
  ];

  if (currentStatus !== 'SUBMITTED') {
    statusHistory.push({
      from: 'SUBMITTED',
      to: 'VERIFIED',
      timestamp: verifiedAt.toISOString(),
      updatedBy: 'system',
      notes: 'Data telah diverifikasi oleh tim analis',
    });
  }

  if (currentStatus === 'APPROVED' || currentStatus === 'REJECTED') {
    const decisionAt = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago
    statusHistory.push({
      from: 'VERIFIED',
      to: currentStatus,
      timestamp: decisionAt.toISOString(),
      updatedBy: 'system',
      notes: currentStatus === 'APPROVED' 
        ? 'Pengajuan telah disetujui' 
        : 'Pengajuan tidak dapat disetujui',
    });
  }

  return {
    uuid,
    currentStatus,
    statusHistory,
    submittedAt: submittedAt.toISOString(),
    lastUpdated: statusHistory[statusHistory.length - 1].timestamp,
    metadata: {
      productName: 'KPR - Kredit Pemilikan Rumah',
      loanAmount: 500000000,
      applicantName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+6281234567890',
    },
  };
}

