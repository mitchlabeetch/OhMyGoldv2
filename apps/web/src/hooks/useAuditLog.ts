import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import type { AppRole } from "@ohmygold/shared";

export type AuditAction =
  | "login"
  | "logout"
  | "register"
  | "password_reset"
  | "profile_update"
  | "member_create"
  | "member_update"
  | "member_delete"
  | "booking_create"
  | "booking_cancel"
  | "payment_process"
  | "payment_refund"
  | "class_create"
  | "class_update"
  | "class_cancel"
  | "access_grant"
  | "access_deny";

export interface AuditEventPayload {
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Hook to log audit events from the client.
 * Calls the `log_audit_event` Supabase RPC function.
 */
export function useAuditLog() {
  const { user } = useAuthStore();

  const logEvent = useCallback(
    async ({ action, resourceType, resourceId, metadata = {} }: AuditEventPayload) => {
      if (!user) return;

      try {
        await supabase.rpc("log_audit_event", {
          p_user_id: user.id,
          p_action: action,
          p_resource_type: resourceType ?? null,
          p_resource_id: resourceId ?? null,
          p_ip_address: null, // IP comes from server-side in production
          p_user_agent: navigator.userAgent,
          p_metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            url: window.location.pathname,
          },
        });
      } catch (err) {
        // Never throw — audit log failure should not block the user
        console.warn("[AuditLog] Failed to log event:", action, err);
      }
    },
    [user]
  );

  return { logEvent };
}

/**
 * Standalone audit log function (no hook context required).
 * Used in non-component code (e.g., service functions, auth flows).
 */
export async function logAuditEvent(
  userId: string,
  action: AuditAction,
  options: Omit<AuditEventPayload, "action"> = {}
): Promise<void> {
  try {
    await supabase.rpc("log_audit_event", {
      p_user_id: userId,
      p_action: action,
      p_resource_type: options.resourceType ?? null,
      p_resource_id: options.resourceId ?? null,
      p_ip_address: null,
      p_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      p_metadata: {
        ...(options.metadata ?? {}),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn("[AuditLog] Failed to log event:", action, err);
  }
}
