import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Calendar, Check, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CalendlyInlineWidget } from "@/components/portal/CalendlyInlineWidget";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { isIntakeComplete, useMemberIntake } from "@/hooks/useMemberIntake";
import { useMarkFoundationsBooked, useMemberOnboarding } from "@/hooks/useMemberOnboarding";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { usePortalSession } from "@/lib/portal/session";
import { calendlyUrlWithPrefill, resolveOnboardingCalendlyUrl } from "@/lib/calendly";
import { COACH, CONTACT } from "@/lib/lean-kettlebell";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const Route = createFileRoute("/portal/book-onboarding")({
  head: () => ({ meta: [{ title: "Book onboarding call - LEANMOVEMENT Portal" }] }),
  component: BookOnboardingPage,
});

function BookOnboardingPage() {
  const session = usePortalSession();
  const navigate = useNavigate();
  const userId = session.user?.id;
  const { siteConfig } = usePortalPageContent();
  const { data: intakeResult, isLoading: intakeLoading } = useMemberIntake(userId);
  const { data: onboarding, isLoading: onboardingLoading } = useMemberOnboarding(userId);
  const markBooked = useMarkFoundationsBooked(userId);

  const intakeComplete = isIntakeComplete(intakeResult?.intake);
  const foundationsDone = Boolean(onboarding?.foundations_completed_at);
  const foundationsBooked = Boolean(onboarding?.foundations_booked_at);

  const calendlyBase = resolveOnboardingCalendlyUrl(siteConfig.foundationsCalendlyUrl);
  const calendlyUrl = useMemo(() => {
    if (!calendlyBase) return "";
    return calendlyUrlWithPrefill(calendlyBase, {
      name: session.profile?.full_name ?? session.user?.name ?? undefined,
      email: session.user?.email,
      phone: intakeResult?.intake?.phone ?? undefined,
    });
  }, [
    calendlyBase,
    session.profile?.full_name,
    session.user?.name,
    session.user?.email,
    intakeResult?.intake?.phone,
  ]);

  useEffect(() => {
    if (session.loading) return;
    if (!session.user) {
      void navigate({ to: "/login", search: { redirect: "/portal/book-onboarding" } });
    }
  }, [session.loading, session.user, navigate]);

  useEffect(() => {
    if (intakeLoading || onboardingLoading) return;
    if (!isSupabaseConfigured()) return;
    if (!intakeComplete) {
      void navigate({ to: "/portal/intake" });
      return;
    }
    if (foundationsDone || foundationsBooked) {
      void navigate({ to: "/portal/dashboard" });
    }
  }, [
    intakeLoading,
    onboardingLoading,
    intakeComplete,
    foundationsDone,
    foundationsBooked,
    navigate,
  ]);

  const onScheduled = async () => {
    try {
      await markBooked.mutateAsync();
      toast.success("Onboarding call booked — see you on Zoom");
      void navigate({ to: "/portal/dashboard" });
    } catch {
      toast.error(
        "Booking saved on Calendly. If the portal did not update, refresh the dashboard.",
      );
    }
  };

  const confirmBooked = async () => {
    try {
      await markBooked.mutateAsync();
      toast.success("Marked as booked — your coach will confirm on Zoom");
      void navigate({ to: "/portal/dashboard" });
    } catch {
      toast.error("Could not save. Try again or message your coach.");
    }
  };

  if (session.loading || intakeLoading || onboardingLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={24} />
      </div>
    );
  }

  if (foundationsBooked && !foundationsDone) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-accent/10 text-accent">
          <Check size={24} />
        </div>
        <h1 className="font-display text-2xl uppercase tracking-[0.06em]">Call booked</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Check your email for the Zoom link. {COACH.name.split(" ")[0]} will confirm once
          you&apos;ve had the session.
        </p>
        <Link to="/portal/dashboard" className="portal-btn portal-btn-accent mt-8 inline-flex">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-24 sm:space-y-6">
      <PortalPageHeader
        eyebrow="Step 2 of 3"
        title="Book your onboarding call"
        description="30 minutes on Zoom with your coach — before your first live class."
      />

      <SoftCard className="!p-4 sm:!p-5">
        <div className="flex items-start gap-3">
          <Calendar size={18} className="mt-0.5 shrink-0 text-accent" />
          <div className="text-sm leading-relaxed text-muted-foreground">
            <p>
              Profile saved. Pick a time that works for you — {COACH.name.split(" ")[0]} will walk
              through your goals, technique basics, and how live sessions work.
            </p>
            <p className="mt-2">
              Duration: <span className="text-foreground">30 min</span> · Location: Zoom
            </p>
          </div>
        </div>
      </SoftCard>

      {calendlyUrl ? (
        <>
          <CalendlyInlineWidget url={calendlyUrl} onScheduled={() => void onScheduled()} />
          <div className="flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-foreground"
            >
              Open in new tab <ExternalLink size={14} />
            </a>
            <button
              type="button"
              disabled={markBooked.isPending}
              onClick={() => void confirmBooked()}
              className="portal-btn portal-btn-ghost text-sm"
            >
              {markBooked.isPending ? "Saving…" : "I already booked — continue"}
            </button>
          </div>
        </>
      ) : (
        <SoftCard className="!p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Online booking is being set up. Message {COACH.name.split(" ")[0]} to schedule your
            onboarding call.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a
              href={CONTACT.whatsapp}
              className="portal-btn portal-btn-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp coach
            </a>
            <Link to="/portal/dashboard" className="portal-btn portal-btn-ghost">
              Dashboard
            </Link>
          </div>
        </SoftCard>
      )}
    </div>
  );
}
