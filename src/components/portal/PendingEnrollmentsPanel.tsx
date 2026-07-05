import { useEffect, useState } from "react";
import { coachListPendingEnrollments, type EnrollmentIntentRow } from "@/lib/api/enrollment.functions";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatInr, formatPlanLabel } from "@/lib/portal/member-format";
import { formatDate } from "@/lib/portal/coach-queries";
import { SoftCard } from "@/components/portal/ui";
import { Mail, UserPlus } from "lucide-react";

export function PendingEnrollmentsPanel({ coachId }: { coachId?: string }) {
  const [rows, setRows] = useState<EnrollmentIntentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coachId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    void coachListPendingEnrollments({ data: { coachId } }).then((result) => {
      if (result.ok) setRows(result.enrollments as EnrollmentIntentRow[]);
      setLoading(false);
    });
  }, [coachId]);

  if (!isSupabaseConfigured() || loading || rows.length === 0) return null;

  return (
    <SoftCard className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">
            Pre-signup enrollments
          </div>
          <h2 className="mt-2 text-2xl font-serif">
            Waiting for account · {rows.length}
          </h2>
          <p className="mt-2 text-sm text-[#737373] max-w-xl">
            These people submitted the join form but haven't created a portal account yet. They
            should sign up with the same email — then activate from the list below.
          </p>
        </div>
        <UserPlus size={20} className="text-[#A3A3A3] shrink-0" />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-[#737373] border-b border-[var(--border)]">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 pr-4 font-medium">Plan</th>
              <th className="pb-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                <td className="py-3 pr-4 font-medium">{row.full_name ?? "—"}</td>
                <td className="py-3 pr-4">
                  <span className="inline-flex items-center gap-1.5 text-[#737373]">
                    <Mail size={12} />
                    {row.email}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  {formatPlanLabel(row.plan)} · {formatInr(row.amount_inr)}
                </td>
                <td className="py-3 text-[#737373]">{formatDate(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SoftCard>
  );
}
