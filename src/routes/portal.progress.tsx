import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/progress")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/dashboard" });
  },
});
