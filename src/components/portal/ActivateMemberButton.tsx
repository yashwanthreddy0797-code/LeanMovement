import { useState } from "react";
import type { CoachMember, MembershipPlan } from "@/lib/portal/coach-queries";
import { PLAN_LABELS, updateMemberStatus } from "@/lib/portal/coach-queries";
import { toast } from "sonner";

export function ActivateMemberButton({
  coachId,
  member,
  onDone,
  compact = false,
}: {
  coachId: string | undefined;
  member: CoachMember;
  onDone: () => void;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MembershipPlan>(member.membership?.plan ?? "monthly");

  const activate = async () => {
    setLoading(true);
    const { error } = await updateMemberStatus(coachId, member.id, "active", plan);
    setLoading(false);
    if (error) toast.error(error);
    else {
      toast.success(`${member.full_name ?? member.email} activated`);
      onDone();
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => void activate()}
        className="portal-btn !px-3 !py-1.5 text-[11px] disabled:opacity-50"
      >
        {loading ? "…" : "Activate"}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value as MembershipPlan)}
        className="text-xs px-2 py-1.5 border border-border bg-white"
      >
        {(Object.keys(PLAN_LABELS) as MembershipPlan[]).map((p) => (
          <option key={p} value={p}>
            {PLAN_LABELS[p]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={loading}
        onClick={() => void activate()}
        className="portal-btn portal-btn-accent !px-3 !py-1.5 text-xs disabled:opacity-50"
      >
        {loading ? "Activating…" : "Activate"}
      </button>
    </div>
  );
}

export function MemberActionButtons({
  coachId,
  member,
  onDone,
}: {
  coachId: string | undefined;
  member: CoachMember;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const status = member.membership?.status;

  const run = async (action: "active" | "pending" | "expired", label: string) => {
    setLoading(action);
    const { error } = await updateMemberStatus(coachId, member.id, action);
    setLoading(null);
    if (error) toast.error(error);
    else {
      toast.success(label);
      onDone();
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {status !== "active" && (
        <ActivateMemberButton coachId={coachId} member={member} onDone={onDone} />
      )}
      {status === "active" && (
        <>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => void run("pending", "Member deactivated")}
            className="text-xs text-[#737373] hover:underline disabled:opacity-50"
          >
            {loading === "pending" ? "…" : "Deactivate"}
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => void run("expired", "Membership expired")}
            className="text-xs text-[#737373] hover:underline disabled:opacity-50"
          >
            {loading === "expired" ? "…" : "Expire"}
          </button>
        </>
      )}
    </div>
  );
}
