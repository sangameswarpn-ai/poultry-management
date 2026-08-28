/**
 * Checks if two date strings are within a configurable time window.
 */
export function areWithinTimeWindow(
  date1Str: string | Date,
  date2Str: string | Date,
  windowHours: number = 48
): boolean {
  const d1 = new Date(date1Str).getTime();
  const d2 = new Date(date2Str).getTime();
  const diffMs = Math.abs(d1 - d2);
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= windowHours;
}

// Configurable time rules
export const TEMPORAL_CONFIG = {
  CLUSTER_TIME_WINDOW_HOURS: 48, // Reports within 48 hours are candidates for clustering
};
