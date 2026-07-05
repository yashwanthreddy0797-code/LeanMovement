import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Membership, MembershipPlan } from "@/lib/supabase/types";
import {
  coachAddRecording,
  coachDeleteRecording,
  coachUpdateLiveSession,
  coachUpdateMemberStatus,
  coachUpdateOnboarding,
  coachUpdateSiteConfig,
} from "@/lib/api/coach.functions";

function coachIdOrThrow(coachId: string | undefined) {
  if (!coachId) throw new Error("Not signed in as coach");
  return coachId;
}

export async function updateMemberStatus(
  coachId: string | undefined,
  userId: string,
  status: Membership["status"],
  plan?: MembershipPlan,
) {
  if (!isSupabaseConfigured()) return { error: null };

  const result = await coachUpdateMemberStatus({
    data: {
      coachId: coachIdOrThrow(coachId),
      memberId: userId,
      status,
      plan,
    },
  });

  return { error: result.ok ? null : result.message };
}

export async function updateOnboarding(
  coachId: string | undefined,
  memberId: string,
  patch: {
    foundationsBooked?: boolean;
    foundationsCompleted?: boolean;
    whatsappJoined?: boolean;
  },
) {
  if (!isSupabaseConfigured()) return { error: null };

  const result = await coachUpdateOnboarding({
    data: { coachId: coachIdOrThrow(coachId), memberId, ...patch },
  });

  return { error: result.ok ? null : result.message };
}

export async function updateSiteConfig(
  coachId: string | undefined,
  key: string,
  value: string,
) {
  if (!isSupabaseConfigured()) return { error: "Demo mode" };

  const result = await coachUpdateSiteConfig({
    data: { coachId: coachIdOrThrow(coachId), key, value },
  });

  return { error: result.ok ? null : result.message };
}

export async function updateLiveSessionUrl(
  coachId: string | undefined,
  id: string,
  joinUrl: string,
) {
  if (!isSupabaseConfigured()) return { error: "Demo mode" };

  try {
    new URL(joinUrl);
  } catch {
    return { error: "Enter a valid URL (https://...)" };
  }

  const result = await coachUpdateLiveSession({
    data: { coachId: coachIdOrThrow(coachId), sessionId: id, joinUrl },
  });

  return { error: result.ok ? null : result.message };
}

export async function addRecording(
  coachId: string | undefined,
  input: { title: string; session_type: string; video_url: string; duration?: string },
) {
  if (!isSupabaseConfigured()) return { error: "Demo mode" };

  try {
    new URL(input.video_url);
  } catch {
    return { error: "Enter a valid video URL" };
  }

  const result = await coachAddRecording({
    data: {
      coachId: coachIdOrThrow(coachId),
      title: input.title,
      sessionType: input.session_type,
      videoUrl: input.video_url,
      duration: input.duration,
    },
  });

  return { error: result.ok ? null : result.message };
}

export async function deleteRecording(coachId: string | undefined, recordingId: string) {
  if (!isSupabaseConfigured()) return { error: "Demo mode" };

  const result = await coachDeleteRecording({
    data: { coachId: coachIdOrThrow(coachId), recordingId },
  });

  return { error: result.ok ? null : result.message };
}
