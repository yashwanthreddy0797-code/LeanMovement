import type { MemberIntake } from "@/lib/supabase/types";
import { INTAKE_FIELD_LABELS } from "@/lib/intake";

export function MemberIntakeSummary({
  intake,
  compact,
}: {
  intake: MemberIntake;
  compact?: boolean;
}) {
  const rows: { label: string; value: string | null }[] = [
    { label: INTAKE_FIELD_LABELS.full_name, value: intake.full_name },
    { label: INTAKE_FIELD_LABELS.age, value: intake.age ? String(intake.age) : null },
    { label: INTAKE_FIELD_LABELS.height, value: intake.height },
    { label: INTAKE_FIELD_LABELS.weight, value: intake.weight },
    { label: INTAKE_FIELD_LABELS.occupation, value: intake.occupation },
    { label: INTAKE_FIELD_LABELS.phone, value: intake.phone },
    { label: INTAKE_FIELD_LABELS.instagram_handle, value: intake.instagram_handle ? `@${intake.instagram_handle.replace(/^@/, "")}` : null },
    { label: INTAKE_FIELD_LABELS.goal, value: intake.goal },
    { label: INTAKE_FIELD_LABELS.biggest_struggle, value: intake.biggest_struggle },
    { label: INTAKE_FIELD_LABELS.training_experience, value: intake.training_experience },
    { label: INTAKE_FIELD_LABELS.training_days_per_week, value: intake.training_days_per_week },
    { label: INTAKE_FIELD_LABELS.why_now, value: intake.why_now },
  ].filter((r) => r.value);

  if (compact) {
    return (
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="text-foreground">{intake.goal}</span>
        </p>
        <p>
          {intake.training_experience} · {intake.training_days_per_week}/week
          {intake.height && intake.weight ? ` · ${intake.height}, ${intake.weight}` : ""}
        </p>
      </div>
    );
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className={row.label === INTAKE_FIELD_LABELS.goal || row.label === INTAKE_FIELD_LABELS.why_now || row.label === INTAKE_FIELD_LABELS.biggest_struggle ? "sm:col-span-2" : ""}>
          <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{row.label}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-foreground whitespace-pre-wrap">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
