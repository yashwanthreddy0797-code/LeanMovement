import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/messages")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/community" });
  },
});
