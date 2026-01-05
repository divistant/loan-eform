"use client";

import { motion } from "framer-motion";
import type { ApplicationTracking } from "@/types/status-tracking";
import { getStatusLabel, getStatusDescription } from "@/types/status-tracking";
import { getStatusIcon, getStatusColor, formatTimestamp } from "@/lib/utils/status-utils";
import { StatusBadge } from "./StatusBadge";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusTimelineProps = {
  tracking: ApplicationTracking;
  className?: string;
};

export function StatusTimeline({ tracking, className }: StatusTimelineProps) {
  const { statusHistory, currentStatus } = tracking;

  // Get all possible statuses in order
  const allStatuses: ApplicationTracking['currentStatus'][] = [
    'SUBMITTED',
    'VERIFIED',
    'APPROVED',
    'REJECTED',
    'DISBURSED',
  ];

  // Filter statuses based on current status
  let relevantStatuses: ApplicationTracking['currentStatus'][] = [];
  
  if (currentStatus === 'SUBMITTED') {
    relevantStatuses = ['SUBMITTED', 'VERIFIED', 'APPROVED', 'REJECTED'];
  } else if (currentStatus === 'VERIFIED') {
    relevantStatuses = ['SUBMITTED', 'VERIFIED', 'APPROVED', 'REJECTED'];
  } else if (currentStatus === 'APPROVED') {
    relevantStatuses = ['SUBMITTED', 'VERIFIED', 'APPROVED', 'DISBURSED'];
  } else if (currentStatus === 'REJECTED') {
    relevantStatuses = ['SUBMITTED', 'VERIFIED', 'REJECTED'];
  } else if (currentStatus === 'DISBURSED') {
    relevantStatuses = ['SUBMITTED', 'VERIFIED', 'APPROVED', 'DISBURSED'];
  }

  // Get status history map
  const historyMap = new Map(
    statusHistory.map((transition) => [transition.to, transition])
  );

  // Find current status index
  const currentIndex = relevantStatuses.indexOf(currentStatus);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-gray-900">Timeline Status</h3>
      </div>

      <div className="relative">
        {/* Timeline line - improved contrast */}
        <div className="absolute left-6 top-0 bottom-0 w-1">
          {/* Completed line segment */}
          <div 
            className="absolute top-0 w-full bg-gradient-to-b from-brand-500 via-brand-500 to-brand-600 transition-all duration-500 shadow-sm"
            style={{
              height: currentIndex >= 0 ? `${((currentIndex + 1) / relevantStatuses.length) * 100}%` : '0%',
            }}
          />
          {/* Pending line segment */}
          <div 
            className="absolute w-full bg-gray-200 transition-all duration-500"
            style={{
              top: currentIndex >= 0 ? `${((currentIndex + 1) / relevantStatuses.length) * 100}%` : '0%',
              height: currentIndex >= 0 ? `${((relevantStatuses.length - currentIndex - 1) / relevantStatuses.length) * 100}%` : '100%',
            }}
          />
        </div>

        {/* Status items */}
        <div className="space-y-6">
          {relevantStatuses.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const transition = historyMap.get(status);
            const Icon = getStatusIcon(status);
            const statusColor = getStatusColor(status);

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative flex gap-5"
              >
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm",
                      isCompleted
                        ? "bg-white border-current shadow-md"
                        : "bg-gray-50 border-gray-300"
                    )}
                    style={{
                      color: isCompleted ? statusColor : undefined,
                      borderColor: isCompleted ? statusColor : undefined,
                    }}
                  >
                    {isCompleted ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  {/* Pulse effect for current status */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: statusColor }}></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4
                          className={cn(
                            "text-base font-bold",
                            isCompleted ? "text-gray-900" : "text-gray-400"
                          )}
                        >
                          {getStatusLabel(status)}
                        </h4>
                        {isCurrent && (
                          <StatusBadge status={status} size="sm" showIcon={false} animated={true} />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm mb-3 leading-relaxed",
                          isCompleted ? "text-gray-700" : "text-gray-400"
                        )}
                      >
                        {getStatusDescription(status)}
                      </p>
                      {transition && (
                        <div className="space-y-1.5 bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-600">
                            {formatTimestamp(transition.timestamp)}
                          </p>
                          {transition.notes && (
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {transition.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

