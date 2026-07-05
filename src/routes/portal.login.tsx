import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

function safeRedirect(value: unknown) {
  if (typeof value === "string" && value.startsWith("/portal")) return value;
  return "/portal/dashboard";
}

/** Legacy URL — redirect to standalone login page (SSR + client-safe) */
export const Route = createFileRoute("/portal/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: safeRedirect(search.redirect),
    email: typeof search.email === "string" ? search.email : "",
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/login", search, replace: true });
  },
  component: LegacyLoginRedirect,
});

function LegacyLoginRedirect() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  useEffect(() => {
    void navigate({ to: "/login", search, replace: true });
  }, [navigate, search]);

  return <div className="min-h-screen bg-white" aria-hidden />;
}
