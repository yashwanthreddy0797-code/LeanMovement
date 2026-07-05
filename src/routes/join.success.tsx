import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — checkout is now a single page at /join */
export const Route = createFileRoute("/join/success")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/join",
      search: {
        plan: typeof search.plan === "string" ? search.plan : undefined,
      },
    });
  },
  component: () => null,
});
