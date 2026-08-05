export const TRAINING_EXPERIENCE_OPTIONS = [
  "Complete beginner",
  "Less than 1 year",
  "1–3 years",
  "3+ years",
] as const;

export const TRAINING_DAYS_OPTIONS = [
  "2 days",
  "3 days",
  "4 days",
  "5 days",
  "6+ days",
] as const;

export type TrainingExperience = (typeof TRAINING_EXPERIENCE_OPTIONS)[number];
export type TrainingDaysPerWeek = (typeof TRAINING_DAYS_OPTIONS)[number];

export const INTAKE_FIELD_LABELS = {
  full_name: "Name",
  age: "Age",
  height: "Height",
  weight: "Weight",
  occupation: "Occupation",
  goal: "Goal",
  biggest_struggle: "Biggest struggle",
  training_experience: "Training experience",
  training_days_per_week: "Days you can train",
  why_now: "Why now?",
  instagram_handle: "Instagram",
  phone: "Phone",
} as const;
