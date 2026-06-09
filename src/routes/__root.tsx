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
      { title: "LEANMOVEMENT — Train On Your Own Terms" },
      { name: "description", content: "Science-backed online fitness coaching for the modern Indian professional. No fluff, no fads — just results that last." },
      { name: "author", content: "LEANMOVEMENT" },
      { property: "og:title", content: "LEANMOVEMENT — Train On Your Own Terms" },
      { property: "og:description", content: "Science-backed online fitness coaching for the modern Indian professional. No fluff, no fads — just results that last." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LEANMOVEMENT — Train On Your Own Terms" },
      { name: "twitter:description", content: "Science-backed online fitness coaching for the modern Indian professional. No fluff, no fads — just results that last." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/1173a295-6ce5-4f9a-8916-558a16d500d5" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/1173a295-6ce5-4f9a-8916-558a16d500d5" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Archivo+Black&family=DM+Sans:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700;800&family=Instrument+Serif&display=swap" },
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

  return (
    <QueryClientProvider client={queryClient}>
      {!isPortal && <Navbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isPortal && <Footer />}
      {!isPortal && <WhatsAppButton />}
      <Toaster />
    </QueryClientProvider>
  );
}
