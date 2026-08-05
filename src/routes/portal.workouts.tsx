import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/workouts")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/dashboard" });
  },
});
