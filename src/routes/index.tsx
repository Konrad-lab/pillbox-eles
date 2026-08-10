import { createFileRoute, redirect } from "@tanstack/react-router";

/** The selection landing was removed — the Pillbox site is the entry point. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/pillbox" });
  },
});
