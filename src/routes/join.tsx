import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout for /join and nested /join/success */
export const Route = createFileRoute("/join")({
  component: JoinLayout,
});

function JoinLayout() {
  return <Outlet />;
}
