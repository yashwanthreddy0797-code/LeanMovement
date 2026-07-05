import { useCallback, useEffect, useState } from "react";
import {
  fetchCoachDashboard,
  type CoachDashboardData,
} from "@/lib/portal/coach-queries";

export function useCoachData() {
  const [data, setData] = useState<CoachDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCoachDashboard();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load coach data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
