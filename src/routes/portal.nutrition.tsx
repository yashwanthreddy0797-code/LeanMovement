import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/nutrition")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/dashboard" });
  },
});
