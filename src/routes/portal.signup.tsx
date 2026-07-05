import { createFileRoute, redirect } from "@tanstack/react-router";
import { planSlugFromSearch } from "@/lib/enrollment/plans";

/** Legacy URL — signup is merged into /join checkout */
export const Route = createFileRoute("/portal/signup")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
    name: typeof search.name === "string" ? search.name : "",
    plan: planSlugFromSearch(search.plan as string | undefined),
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/join", search, replace: true });
  },
  component: () => null,
});
