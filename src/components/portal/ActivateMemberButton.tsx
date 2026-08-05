import { useState } from "react";
import type { CoachMember } from "@/lib/portal/coach-queries";
import { updateMemberStatus } from "@/lib/portal/coach-queries";
import { toast } from "sonner";

export function ActivateMemberButton({
  coachId,
  member,
  onDone,
}: {
  coachId: string | undefined;
  member: CoachMember;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const plan = member.membership?.plan ?? "monthly";

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

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void activate()}
      className="portal-btn portal-btn-accent w-full !min-h-10 !px-3 !py-2 text-xs disabled:opacity-50 sm:w-auto sm:!min-h-0 sm:!py-1.5"
    >
      {loading ? "Activating…" : "Activate"}
    </button>
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
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      {status !== "active" && (
        <ActivateMemberButton coachId={coachId} member={member} onDone={onDone} />
      )}
      {status === "active" && (
        <>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => void run("pending", "Member deactivated")}
            className="min-h-10 px-2 text-xs text-muted-foreground hover:underline disabled:opacity-50 md:min-h-0"
          >
            {loading === "pending" ? "…" : "Deactivate"}
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => void run("expired", "Membership expired")}
            className="min-h-10 px-2 text-xs text-muted-foreground hover:underline disabled:opacity-50 md:min-h-0"
          >
            {loading === "expired" ? "…" : "Expire"}
          </button>
        </>
      )}
    </div>
  );
}
