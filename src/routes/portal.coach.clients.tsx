import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/coach/clients")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/coach/members" });
  },
});
