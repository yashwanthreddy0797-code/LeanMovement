import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { KPICard, PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import {
  formatDate,
  membershipStatusLabel,
  statusChipClass,
  updateOnboarding,
  type CoachMember,
} from "@/lib/portal/coach-queries";
import { formatSelectedSessions } from "@/lib/sessions";
import { MemberIntakeSummary } from "@/components/portal/MemberIntakeSummary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  MessageCircle,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding - Lean Kettlebell Coach" }] }),
  component: () => (
    <CoachShell>
      <OnboardingPage />
    </CoachShell>
  ),
});

type FilterKey = "all" | "attention" | "intake" | "foundations" | "whatsapp" | "done";

function isIntakeDone(m: CoachMember) {
  return Boolean(m.intake?.completed_at);
}

function isFoundationsBooked(m: CoachMember) {
  return Boolean(m.onboarding?.foundations_booked_at);
}

function isFoundationsDone(m: CoachMember) {
  return Boolean(m.onboarding?.foundations_completed_at);
}

function isWhatsappDone(m: CoachMember) {
  return Boolean(m.onboarding?.whatsapp_joined);
}

function isFullyOnboarded(m: CoachMember) {
  return isIntakeDone(m) && isFoundationsDone(m) && isWhatsappDone(m);
}

function needsAttention(m: CoachMember) {
  return m.membership?.status === "active" && !isFullyOnboarded(m);
}

function OnboardingPage() {
  const session = usePortalSession();
  const { data, loading, error, refresh } = useCoachData();
  const coachId = session.user?.id;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading && !data) {
    return <PortalPageSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="space-y-4 pb-20 lg:pb-0">
        <PortalPageHeader title="Onboarding" description="Could not load member data." />
        <SoftCard className="!p-5">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="btn-primary mt-4 inline-flex"
          >
            Retry
          </button>
        </SoftCard>
      </div>
    );
  }

  if (!data) {
    return <PortalPageSkeleton />;
  }

  const isPreview = data.source === "mock";
  const members = data.members.filter((m) => m.role === "member");
  const activeMembers = members.filter((m) => m.membership?.status === "active");

  const intakeDone = members.filter(isIntakeDone);
  const intakeDue = activeMembers.filter((m) => !isIntakeDone(m));
  const foundationsDue = activeMembers.filter(
    (m) => isIntakeDone(m) && !isFoundationsDone(m),
  );
  const whatsappDue = activeMembers.filter(
    (m) => isFoundationsDone(m) && !isWhatsappDone(m),
  );
  const foundationsDoneCount = members.filter(isFoundationsDone).length;
  const whatsappDoneCount = members.filter(isWhatsappDone).length;
  const fullyDoneCount = members.filter(isFullyOnboarded).length;
  const attentionCount = activeMembers.filter(needsAttention).length;

  const calendly = data.siteConfig.foundations_calendly_url;
  const whatsapp = data.siteConfig.whatsapp_invite_url;

  const selected = members.find((m) => m.id === selectedId) ?? null;

  const openMember = (id: string) => setSelectedId(id);

  const toggle = async (
    memberId: string,
    patch: Parameters<typeof updateOnboarding>[2],
    label: string,
  ) => {
    if (memberId.startsWith("demo-")) {
      toast.message("Demo member — status toggles apply to real members only.");
      return;
    }
    const { error } = await updateOnboarding(coachId, memberId, patch);
    if (error) toast.error(error);
    else {
      toast.success(label);
      void refresh();
    }
  };

  const query = q.trim().toLowerCase();
  const filtered = members
    .filter((m) => {
      if (filter === "attention") return needsAttention(m);
      if (filter === "intake") return !isIntakeDone(m);
      if (filter === "foundations") return isIntakeDone(m) && !isFoundationsDone(m);
      if (filter === "whatsapp") return isFoundationsDone(m) && !isWhatsappDone(m);
      if (filter === "done") return isFullyOnboarded(m);
      return true;
    })
    .filter((m) => {
      if (!query) return true;
      const haystack = [
        m.full_name,
        m.email,
        m.intake?.phone,
        m.intake?.goal,
        m.intake?.instagram_handle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      const aDone = isFullyOnboarded(a) ? 1 : 0;
      const bDone = isFullyOnboarded(b) ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return (a.full_name ?? a.email).localeCompare(b.full_name ?? b.email);
    });

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: members.length },
    { key: "attention", label: "Needs attention", count: attentionCount },
    { key: "intake", label: "Profile due", count: intakeDue.length },
    { key: "foundations", label: "Foundations due", count: foundationsDue.length },
    { key: "whatsapp", label: "WhatsApp due", count: whatsappDue.length },
    { key: "done", label: "Complete", count: fullyDoneCount },
  ];

  return (
    <div className="space-y-6 pb-20 sm:space-y-8 lg:pb-0">
      <PortalPageHeader
        title="Onboarding"
        description="Click any member to open their questionnaire, Foundations status, WhatsApp, and sessions."
        action={
          <div className="relative w-full sm:w-auto">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full border border-border bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent sm:w-64"
            />
          </div>
        }
      />

      {isPreview && (
        <div className="border border-border bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Preview members — real member profiles appear here automatically after signup and payment.
        </div>
      )}

      {(data.warnings?.length ?? 0) > 0 && !isPreview && (
        <div className="border border-border bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {data.warnings!.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

      {error && (
        <div className="border border-border bg-red-50 px-4 py-3 text-sm text-red-800">
          Refresh issue: {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard label="Members" value={String(members.length)} delta={`${activeMembers.length} active`} />
        <KPICard
          label="Profiles"
          value={`${intakeDone.length}/${members.length || 0}`}
          delta={intakeDue.length ? `${intakeDue.length} waiting` : "All received"}
          tone={intakeDue.length ? "down" : "up"}
        />
        <KPICard
          label="Foundations"
          value={`${foundationsDoneCount}/${members.length || 0}`}
          delta={foundationsDue.length ? `${foundationsDue.length} to complete` : "All caught up"}
          tone={foundationsDue.length ? "down" : "up"}
        />
        <KPICard
          label="WhatsApp"
          value={`${whatsappDoneCount}/${members.length || 0}`}
          delta={whatsappDue.length ? `${whatsappDue.length} to add` : "All in"}
          tone={whatsappDue.length ? "down" : "up"}
        />
        <KPICard
          label="Fully onboarded"
          value={`${fullyDoneCount}/${members.length || 0}`}
          delta={attentionCount ? `${attentionCount} still in progress` : "Everyone ready"}
          tone={attentionCount ? "neutral" : "up"}
        />
      </div>

      <SoftCard className="!p-5 md:!p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl uppercase tracking-[0.06em]">Members</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a row to review the full profile questionnaire and update onboarding.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Showing {filtered.length} of {members.length}
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`inline-flex min-h-9 items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                filter === f.key
                  ? "bg-foreground text-background"
                  : "border border-border bg-white text-muted-foreground hover:bg-surface"
              }`}
            >
              {f.label}
              <span className={filter === f.key ? "text-background/70" : "text-muted-foreground/80"}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="border border-border bg-surface px-4 py-10 text-center text-sm text-muted-foreground">
            {members.length === 0
              ? "No members yet. Once someone joins and pays, they appear here."
              : "No members match this view."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((m) => (
              <MemberRow key={m.id} member={m} onOpen={() => openMember(m.id)} />
            ))}
          </div>
        )}
      </SoftCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <OnboardingQueue
          title="Member profile"
          eyebrow="Step 1"
          count={intakeDue.length}
          icon={ClipboardList}
          hint={<p className="text-xs text-muted-foreground">Waiting on questionnaire.</p>}
          members={intakeDue.length ? intakeDue : intakeDone.slice(0, 8)}
          emptyLabel="No profiles yet."
          showingDone={!intakeDue.length && intakeDone.length > 0}
          onOpenMember={openMember}
        />
        <OnboardingQueue
          title="Foundations session"
          eyebrow="Step 2"
          count={foundationsDue.length}
          icon={Calendar}
          hint={
            calendly ? (
              <a
                href={calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                Open Calendly booking link →
              </a>
            ) : (
              <Link to="/portal/coach/settings" className="text-xs text-accent hover:underline">
                Add Calendly URL in Settings →
              </Link>
            )
          }
          members={foundationsDue}
          emptyLabel="All caught up."
          onOpenMember={openMember}
          steps={[
            {
              key: "booked",
              label: "Booked",
              done: isFoundationsBooked,
              action: (m) =>
                toggle(
                  m.id,
                  { foundationsBooked: !m.onboarding?.foundations_booked_at },
                  "Foundations booking updated",
                ),
            },
            {
              key: "done",
              label: "Completed",
              done: isFoundationsDone,
              action: (m) =>
                toggle(
                  m.id,
                  { foundationsCompleted: !m.onboarding?.foundations_completed_at },
                  "Foundations marked complete",
                ),
            },
          ]}
        />
        <OnboardingQueue
          title="WhatsApp community"
          eyebrow="Step 3"
          count={whatsappDue.length}
          icon={MessageCircle}
          hint={
            whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                Open WhatsApp invite →
              </a>
            ) : (
              <Link to="/portal/coach/settings" className="text-xs text-accent hover:underline">
                Add WhatsApp URL in Settings →
              </Link>
            )
          }
          members={whatsappDue}
          emptyLabel="All caught up."
          onOpenMember={openMember}
          steps={[
            {
              key: "wa",
              label: "Joined group",
              done: isWhatsappDone,
              action: (m) =>
                toggle(
                  m.id,
                  { whatsappJoined: !m.onboarding?.whatsapp_joined },
                  "WhatsApp status updated",
                ),
            },
          ]}
        />
      </div>

      <MemberDetailSheet
        member={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
        onToggle={toggle}
      />
    </div>
  );
}

function MemberRow({ member: m, onOpen }: { member: CoachMember; onOpen: () => void }) {
  const isDemo = m.id.startsWith("demo-");
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 border border-border bg-white p-4 text-left transition-colors hover:border-accent/40 hover:bg-surface/60"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center bg-surface text-xs font-semibold text-accent">
        {(m.full_name ?? m.email)[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{m.full_name ?? m.email}</p>
          {isDemo && (
            <span className="inline-flex bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              Demo
            </span>
          )}
          <span
            className={`inline-flex px-2 py-0.5 text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
          >
            {membershipStatusLabel(m.membership?.status)}
          </span>
          {isFullyOnboarded(m) && (
            <span className="inline-flex bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
              Onboarded
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.email}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <StatusChip label="Profile" done={isIntakeDone(m)} />
          <StatusChip
            label={
              isFoundationsDone(m)
                ? "Foundations done"
                : isFoundationsBooked(m)
                  ? "Foundations booked"
                  : "Foundations"
            }
            done={isFoundationsDone(m)}
            partial={isFoundationsBooked(m) && !isFoundationsDone(m)}
          />
          <StatusChip label="WhatsApp" done={isWhatsappDone(m)} />
        </div>
        {m.intake ? (
          <div className="mt-3">
            <MemberIntakeSummary intake={m.intake} compact />
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">Questionnaire not submitted yet.</p>
        )}
      </div>
      <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-accent">
        View
        <ChevronRight size={14} />
      </span>
    </button>
  );
}

function MemberDetailSheet({
  member: m,
  open,
  onOpenChange,
  onToggle,
}: {
  member: CoachMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (
    memberId: string,
    patch: Parameters<typeof updateOnboarding>[2],
    label: string,
  ) => Promise<void>;
}) {
  if (!m) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Member details</SheetTitle>
            <SheetDescription>Select a member to review their onboarding.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const sessions =
    formatSelectedSessions(m.onboarding?.session_ids ?? []) || "Not selected yet";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-2xl uppercase tracking-[0.06em]">
            {m.full_name ?? m.email}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {m.email}
            {m.intake?.phone ? ` · ${m.intake.phone}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap gap-1.5">
            <StatusChip label="Profile" done={isIntakeDone(m)} />
            <StatusChip
              label={
                isFoundationsDone(m)
                  ? "Foundations done"
                  : isFoundationsBooked(m)
                    ? "Foundations booked"
                    : "Foundations"
              }
              done={isFoundationsDone(m)}
              partial={isFoundationsBooked(m) && !isFoundationsDone(m)}
            />
            <StatusChip label="WhatsApp" done={isWhatsappDone(m)} />
            <span
              className={`inline-flex px-2 py-0.5 text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
            >
              {membershipStatusLabel(m.membership?.status)}
            </span>
          </div>

          <section>
            <h3 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Questionnaire
            </h3>
            {m.intake ? (
              <div className="border border-border bg-surface p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(m.intake.completed_at)}
                  </p>
                  {m.intake.phone && (
                    <a href={`tel:${m.intake.phone}`} className="text-xs text-accent hover:underline">
                      Call {m.intake.phone}
                    </a>
                  )}
                </div>
                <MemberIntakeSummary intake={m.intake} />
              </div>
            ) : (
              <p className="border border-dashed border-border bg-surface px-4 py-6 text-sm text-muted-foreground">
                Profile questionnaire not submitted yet.
              </p>
            )}
          </section>

          <section className="border border-border bg-surface p-4">
            <h3 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Onboarding actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <ToggleChip
                label="Foundations booked"
                done={isFoundationsBooked(m)}
                onClick={() =>
                  void onToggle(
                    m.id,
                    { foundationsBooked: !m.onboarding?.foundations_booked_at },
                    "Foundations booking updated",
                  )
                }
              />
              <ToggleChip
                label="Foundations completed"
                done={isFoundationsDone(m)}
                onClick={() =>
                  void onToggle(
                    m.id,
                    { foundationsCompleted: !m.onboarding?.foundations_completed_at },
                    "Foundations marked complete",
                  )
                }
              />
              <ToggleChip
                label="WhatsApp joined"
                done={isWhatsappDone(m)}
                onClick={() =>
                  void onToggle(
                    m.id,
                    { whatsappJoined: !m.onboarding?.whatsapp_joined },
                    "WhatsApp status updated",
                  )
                }
              />
            </div>
          </section>

          <section className="border border-border bg-surface p-4">
            <h3 className="mb-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Weekly sessions
            </h3>
            <p className="text-sm leading-relaxed text-foreground">{sessions}</p>
            {m.onboarding?.sessions_selected_at && (
              <p className="mt-2 text-xs text-muted-foreground">
                Updated {formatDate(m.onboarding.sessions_selected_at)}
              </p>
            )}
          </section>

          <section className="border border-border bg-surface p-4">
            <h3 className="mb-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Membership
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{membershipStatusLabel(m.membership?.status)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Joined</dt>
                <dd>{formatDate(m.created_at)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Renews</dt>
                <dd>{formatDate(m.membership?.renews_at)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatusChip({
  label,
  done,
  partial,
}: {
  label: string;
  done: boolean;
  partial?: boolean;
}) {
  const className = done
    ? "bg-emerald-50 text-emerald-800"
    : partial
      ? "bg-amber-50 text-amber-800"
      : "bg-surface text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {done ? <CheckCircle2 size={10} /> : <Circle size={10} />}
      {label}
    </span>
  );
}

function ToggleChip({
  label,
  done,
  onClick,
}: {
  label: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
        done
          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          : "border border-border bg-white text-muted-foreground hover:bg-surface"
      }`}
    >
      {done ? <CheckCircle2 size={10} /> : <Circle size={10} />}
      {label}
    </button>
  );
}

function OnboardingQueue({
  title,
  eyebrow,
  count,
  members,
  icon: Icon,
  hint,
  steps = [],
  emptyLabel = "All caught up.",
  showingDone,
  onOpenMember,
}: {
  title: string;
  eyebrow: string;
  count: number;
  members: CoachMember[];
  icon: typeof Calendar;
  hint: React.ReactNode;
  steps?: {
    key: string;
    label: string;
    done: (m: CoachMember) => boolean;
    action: (m: CoachMember) => void;
  }[];
  emptyLabel?: string;
  showingDone?: boolean;
  onOpenMember: (id: string) => void;
}) {
  return (
    <SoftCard className="!p-5 md:!p-6">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-accent" />
          <h2 className="font-display text-xl uppercase tracking-[0.06em]">{title}</h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{count}</span>
      </div>
      <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      <div className="mb-4">{hint}</div>
      {showingDone && (
        <p className="mb-3 text-xs text-muted-foreground">
          All due items clear — showing received profiles. Click to review.
        </p>
      )}
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="border border-border bg-surface p-3">
              <button
                type="button"
                onClick={() => onOpenMember(m.id)}
                className="flex w-full items-start justify-between gap-2 text-left"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium">{m.full_name ?? m.email}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                  {m.intake?.goal && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.intake.goal}</p>
                  )}
                </div>
                <span className="inline-flex shrink-0 items-center gap-0.5 pt-0.5 text-[11px] uppercase tracking-[0.1em] text-accent">
                  View
                  <ChevronRight size={12} />
                </span>
              </button>
              {steps.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {steps.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => void s.action(m)}
                      className={`inline-flex min-h-9 items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                        s.done(m)
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border border-border bg-white text-muted-foreground hover:bg-surface"
                      }`}
                    >
                      {s.done(m) ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SoftCard>
  );
}
