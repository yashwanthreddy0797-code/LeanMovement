import { createFileRoute, redirect } from "@tanstack/react-router";

/** Former Membership page - content moved to About. */
export const Route = createFileRoute("/programs")({
  beforeLoad: () => {
    throw redirect({ to: "/about" });
  },
  component: () => null,
});
