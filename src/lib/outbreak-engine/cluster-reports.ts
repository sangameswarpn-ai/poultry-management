import { calculateHaversineDistance, SPATIAL_CONFIG } from './spatial-rules';
import { areWithinTimeWindow, TEMPORAL_CONFIG } from './temporal-rules';
import { calculateClusterRisk, ClusterRiskAssessment } from './cluster-risk';

export interface OutbreakClusterInputReport {
  id: string;
  lat: number;
  lng: number;
  date: string | Date;
  village: string;
  district: string;
  sickCount: number;
  mortalityCount: number;
  symptoms: string[];
}

export interface ComputedOutbreakCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  reports: OutbreakClusterInputReport[];
  status: 'SUSPECTED' | 'FIELD_INVESTIGATION' | 'CONTAINED' | 'RESOLVED';
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  firstReportDate: string;
  lastReportDate: string;
  reportsCount: number;
  sickCount: number;
  mortalityCount: number;
  villages: string[];
  explainabilityFactors: string[];
}

export function detectOutbreakClusters(
  reports: OutbreakClusterInputReport[]
): ComputedOutbreakCluster[] {
  const clusters: ComputedOutbreakCluster[] = [];
  const visited = new Set<string>();

  // Sort reports chronologically
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let clusterIndex = 1;

  for (let i = 0; i < sortedReports.length; i++) {
    const r1 = sortedReports[i];
    if (visited.has(r1.id)) continue;

    const clusterGroup: OutbreakClusterInputReport[] = [r1];
    visited.add(r1.id);

    // Scan for all other reports within the radius and time window
    for (let j = 0; j < sortedReports.length; j++) {
      const r2 = sortedReports[j];
      if (visited.has(r2.id)) continue;

      const dist = calculateHaversineDistance(r1.lat, r1.lng, r2.lat, r2.lng);
      const timeMatch = areWithinTimeWindow(
        r1.date,
        r2.date,
        TEMPORAL_CONFIG.CLUSTER_TIME_WINDOW_HOURS
      );

      if (dist <= SPATIAL_CONFIG.CLUSTER_RADIUS_KM && timeMatch) {
        clusterGroup.push(r2);
        visited.add(r2.id);
      }
    }

    // Only create a cluster if there are 2 or more reports matching in proximity,
    // OR if it's a single report but has high mortality (> 5 deaths) to trigger early detection.
    const totalDeaths = clusterGroup.reduce((sum, r) => sum + r.mortalityCount, 0);
    if (clusterGroup.length >= 2 || totalDeaths >= 5) {
      // Calculate cluster center
      const avgLat = clusterGroup.reduce((sum, r) => sum + r.lat, 0) / clusterGroup.length;
      const avgLng = clusterGroup.reduce((sum, r) => sum + r.lng, 0) / clusterGroup.length;

      // Extract details
      const firstDate = new Date(
        Math.min(...clusterGroup.map(r => new Date(r.date).getTime()))
      ).toISOString();
      
      const lastDate = new Date(
        Math.max(...clusterGroup.map(r => new Date(r.date).getTime()))
      ).toISOString();

      const uniqueVillages = Array.from(new Set(clusterGroup.map(r => r.village)));
      const totalSick = clusterGroup.reduce((sum, r) => sum + r.sickCount, 0);

      const risk = calculateClusterRisk(
        clusterGroup.length,
        totalDeaths,
        totalSick,
        uniqueVillages.length
      );

      clusters.push({
        id: `CL-00${clusterIndex++}`,
        name: `Cluster Area ${r1.district} #${clusterIndex - 1}`,
        lat: avgLat,
        lng: avgLng,
        reports: clusterGroup,
        status: 'SUSPECTED',
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        firstReportDate: firstDate,
        lastReportDate: lastDate,
        reportsCount: clusterGroup.length,
        sickCount: totalSick,
        mortalityCount: totalDeaths,
        villages: uniqueVillages,
        explainabilityFactors: risk.explainabilityFactors
      });
    }
  }

  return clusters;
}
