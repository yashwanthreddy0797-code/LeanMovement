export type MembershipStatus = "pending" | "active" | "past_due" | "cancelled" | "expired";
export type MembershipPlan = "monthly" | "quarterly" | "founding";
export type ProfileRole = "member" | "coach" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
};

export type Membership = {
  id: string;
  user_id: string;
  product: string;
  plan: MembershipPlan;
  status: MembershipStatus;
  amount_inr: number | null;
  razorpay_subscription_id: string | null;
  razorpay_payment_id: string | null;
  started_at: string | null;
  renews_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

export type Onboarding = {
  user_id: string;
  foundations_booked_at: string | null;
  foundations_completed_at: string | null;
  whatsapp_joined: boolean;
  session_ids: string[];
  sessions_selected_at: string | null;
};

export type MemberIntake = {
  user_id: string;
  full_name: string;
  age: number | null;
  height: string | null;
  weight: string | null;
  occupation: string | null;
  goal: string;
  biggest_struggle: string | null;
  training_experience: string;
  training_days_per_week: string;
  why_now: string | null;
  instagram_handle: string | null;
  phone: string | null;
  completed_at: string;
  updated_at: string;
};

export type LiveSessionRow = {
  id: string;
  day_of_week: string;
  title: string;
  session_type: string;
  focus: string | null;
  start_time: string;
  timezone: string;
  duration_minutes: number;
  join_url: string;
  sort_order: number;
};

export type RecordingRow = {
  id: string;
  title: string;
  session_type: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  recorded_at: string;
  expires_at: string | null;
  source?: string | null;
  external_id?: string | null;
  meeting_id?: string | null;
};

export type CircuitRow = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  rounds: string | null;
  difficulty: string | null;
  exercises: string[];
  video_url: string | null;
  sort_order: number;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      memberships: { Row: Membership; Insert: Partial<Membership>; Update: Partial<Membership> };
      onboarding: { Row: Onboarding; Insert: Partial<Onboarding>; Update: Partial<Onboarding> };
      member_intake: { Row: MemberIntake; Insert: Partial<MemberIntake>; Update: Partial<MemberIntake> };
      live_sessions: { Row: LiveSessionRow; Insert: Partial<LiveSessionRow>; Update: Partial<LiveSessionRow> };
      recordings: { Row: RecordingRow; Insert: Partial<RecordingRow>; Update: Partial<RecordingRow> };
      circuits: { Row: CircuitRow; Insert: Partial<CircuitRow>; Update: Partial<CircuitRow> };
      site_config: { Row: { key: string; value: string; updated_at: string }; Insert: { key: string; value: string }; Update: { value: string } };
    };
  };
};
