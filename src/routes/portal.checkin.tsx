import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/checkin")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/dashboard" });
  },
});
