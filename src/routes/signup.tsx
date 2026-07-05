import { createFileRoute, redirect } from "@tanstack/react-router";

/** Signup is merged into /join checkout */
export const Route = createFileRoute("/signup")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/join",
      search: {
        plan: typeof search.plan === "string" ? search.plan : undefined,
        email: typeof search.email === "string" ? search.email : undefined,
        name: typeof search.name === "string" ? search.name : undefined,
      },
    });
  },
  component: () => null,
});
