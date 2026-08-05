import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy 1:1 apply page - membership join is the primary path */
export const Route = createFileRoute("/apply")({
  beforeLoad: () => {
    throw redirect({ to: "/join", search: { plan: "standard", email: "", name: "" } });
  },
  component: () => null,
});
