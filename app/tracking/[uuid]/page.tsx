"use client";

import { Suspense } from "react";
import { use } from "react";
import { TrackingDetailContent } from "./TrackingDetailContent";
import { Loader2 } from "lucide-react";

type TrackingDetailPageProps = {
  params: Promise<{ uuid: string }>;
};

function TrackingDetailSkeleton() {
  return (
    <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 py-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackingDetailPage({ params }: TrackingDetailPageProps) {
  const { uuid } = use(params);

  return (
    <Suspense fallback={<TrackingDetailSkeleton />}>
      <TrackingDetailContent uuid={uuid} />
    </Suspense>
  );
}

