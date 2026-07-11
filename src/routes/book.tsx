import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy consultation page — membership join is the primary path */
export const Route = createFileRoute("/book")({
  beforeLoad: () => {
    throw redirect({ to: "/join", search: { plan: "standard", email: "", name: "" } });
  },
  component: () => null,
});
