import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { heroImageUrl } from "@/lib/lean-kettlebell";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-accent">404</h1>
        <h2 className="mt-4 font-display text-3xl">Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This path doesn't exist. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center px-6 py-3 bg-accent text-background text-xs font-semibold uppercase tracking-[0.2em]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl">Something Broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="px-5 py-2.5 bg-accent text-background text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Try again
          </button>
          <a href="/" className="px-5 py-2.5 border border-border text-xs font-semibold uppercase tracking-[0.2em]">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lean Movement — Live Coaching Membership | LEANMOVEMENT" },
      {
        name: "description",
        content:
          "Train live. Stay lean. Three live kettlebell coaching sessions every week — Tue / Thu / Sat · 6–7 AM IST. ₹6,999/mo.",
      },
      { name: "author", content: "LEANMOVEMENT" },
      { name: "theme-color", content: "#111111" },
      { name: "msapplication-TileColor", content: "#111111" },
      { property: "og:title", content: "Lean Movement — LEANMOVEMENT" },
      {
        property: "og:description",
        content:
          "Train live three mornings a week. Build strength, improve endurance, stay lean.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.leanmovement.in/" },
      { property: "og:site_name", content: "LEANMOVEMENT" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lean Movement — LEANMOVEMENT" },
      {
        name: "twitter:description",
        content: "Live kettlebell coaching — Tue / Thu / Sat mornings. ₹6,999/mo.",
      },
      { property: "og:image", content: heroImageUrl(1200) },
      { name: "twitter:image", content: heroImageUrl(1200) },
    ],
    links: [
      // ICO first — browsers + Google request /favicon.ico by default
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPortal = pathname.startsWith("/portal");
  const isStandaloneAuth =
    pathname === "/signup" || pathname === "/login" || pathname.startsWith("/join");

  const showMarketingChrome = !isPortal && !isStandaloneAuth;

  return (
    <QueryClientProvider client={queryClient}>
      {showMarketingChrome && <Navbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {showMarketingChrome && <Footer />}
      {showMarketingChrome && <WhatsAppButton />}
      <Toaster />
    </QueryClientProvider>
  );
}
