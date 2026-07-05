import { createContext, useContext, type ReactNode } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useLiveSessionsRealtime } from "@/hooks/useLiveSessionsRealtime";
import { fetchPortalContent, type PortalContent } from "@/lib/supabase/queries";

type PortalContentQuery = UseQueryResult<PortalContent, Error>;

const PortalContentContext = createContext<PortalContentQuery | null>(null);

export function PortalContentProvider({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  useLiveSessionsRealtime(enabled);

  const query = useQuery({
    queryKey: ["portal-content", "v3"],
    queryFn: fetchPortalContent,
    enabled,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return (
    <PortalContentContext.Provider value={query}>{children}</PortalContentContext.Provider>
  );
}

export function useSharedPortalContent(): PortalContentQuery {
  const context = useContext(PortalContentContext);
  if (!context) {
    throw new Error("useSharedPortalContent must be used within ClientShell");
  }
  return context;
}

/** Safe helper for page components */
export function usePortalPageContent() {
  const { data, isLoading, isError } = useSharedPortalContent();
  return {
    content: data ?? null,
    isLoading,
    isError,
    liveSessions: data?.liveSessions ?? [],
    nextLiveSession: data?.nextLiveSession ?? null,
    weeklySchedule: data?.weeklySchedule ?? [],
    recordings: data?.recordings ?? [],
    circuits: data?.circuits ?? [],
    siteConfig: data?.siteConfig ?? {
      whatsappInviteUrl: "",
      foundationsCalendlyUrl: "",
      cohortStartDate: "",
    },
  };
}
