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

export type ChatThread = {
  id: string;
  member_id: string;
  coach_id: string;
  member_last_read_at: string | null;
  coach_last_read_at: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile>;
      memberships: TableDef<Membership>;
      onboarding: TableDef<Onboarding>;
      member_intake: TableDef<MemberIntake>;
      live_sessions: TableDef<LiveSessionRow>;
      recordings: TableDef<RecordingRow>;
      circuits: TableDef<CircuitRow>;
      site_config: TableDef<
        { key: string; value: string; updated_at: string },
        { key: string; value: string },
        { value?: string; updated_at?: string }
      >;
      chat_threads: TableDef<
        ChatThread,
        Partial<ChatThread> & Pick<ChatThread, "member_id" | "coach_id">
      >;
      chat_messages: TableDef<
        ChatMessage,
        Partial<ChatMessage> & Pick<ChatMessage, "thread_id" | "sender_id" | "body">
      >;
      contact_messages: TableDef<{
        id: string;
        name: string;
        email: string;
        whatsapp: string | null;
        message: string;
        source: string;
        read: boolean;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      get_primary_coach_id: { Args: Record<PropertyKey, never>; Returns: string | null };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
