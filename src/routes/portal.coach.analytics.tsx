import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/coach/analytics")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/coach" });
  },
});
