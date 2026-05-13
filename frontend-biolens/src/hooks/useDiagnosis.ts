"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { routes } from "@/lib/routes";
import type { Crop, Diagnosis, DiagnosisStats } from "@/types";

interface UseDiagnosisReturn {
  diagnoses: Diagnosis[];
  recentDiagnoses: Diagnosis[];
  crops: Crop[];
  stats: DiagnosisStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDiagnosis(): UseDiagnosisReturn {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cropsRes, diagnosesRes] = await Promise.all([
        axios.get<Crop[]>(routes.crops.all),
        axios.get<Diagnosis[]>(routes.crops.diagnoses),
      ]);
      setCrops(cropsRes.data);
      setDiagnoses(diagnosesRes.data);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const issuesFound = diagnoses.filter((d) => d.isHealthy === false).length;
  const activeCrops = crops.filter((c) => c.harvestedAt === null);

  const stats: DiagnosisStats = {
    activeFields: activeCrops.length || crops.length,
    totalScans: diagnoses.length,
    issuesFound,
    treated: diagnoses.filter((d) => d.treatment !== null).length,
  };

  return {
    diagnoses,
    recentDiagnoses: [...diagnoses]
      .sort(
        (a, b) =>
          new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime(),
      )
      .slice(0, 4),
    crops,
    stats,
    isLoading,
    error,
    refetch: fetchData,
  };
}
