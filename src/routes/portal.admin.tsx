import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/admin")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/coach/members" });
  },
});
