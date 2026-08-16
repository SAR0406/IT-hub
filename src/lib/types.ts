export type ResourceType =
  | "Notes"
  | "PDF"
  | "Practical"
  | "Question Paper"
  | "Worksheet"
  | "Other";

export const RESOURCE_TYPES: ResourceType[] = [
  "Notes",
  "PDF",
  "Practical",
  "Question Paper",
  "Worksheet",
  "Other",
];

export type Resource = {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  unit_slug: string;
  topic_slug: string | null;
  resource_type: string;
  description: string | null;
  is_verified: boolean;
  created_at: string;
};

/** Resource enriched with the human-readable unit/topic names for display. */
export type ResourceWithLabels = Resource & {
  unit_name: string;
  topic_name: string | null;
};

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export type Role = "student" | "admin";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  class_name: string | null;
  student_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type ActivityAction =
  | "page_view"
  | "search"
  | "resource_open"
  | "resource_download"
  | "login_success"
  | "login_failed"
  | "resource_upload"
  | "resource_delete"
  | "resource_replace"
  | "admin_action"
  | "quiz_start"
  | "quiz_submit"
  | "unauthorized_admin_attempt";

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  page_view: "Page view",
  search: "Search",
  resource_open: "Opened file",
  resource_download: "Downloaded file",
  login_success: "Signed in",
  login_failed: "Sign-in failed",
  resource_upload: "Uploaded resource",
  resource_delete: "Deleted resource",
  resource_replace: "Replaced resource",
  admin_action: "Admin action",
  quiz_start: "Started quiz",
  quiz_submit: "Submitted quiz",
  unauthorized_admin_attempt: "Admin-area probe",
};

export type ActivityLog = {
  id: number;
  user_id: string | null;
  action: ActivityAction;
  details: Record<string, unknown>;
  created_at: string;
};

export type FlagType =
  | "banned_search"
  | "rapid_downloads"
  | "failed_login"
  | "unauthorized_admin"
  | "chat_inappropriate";

export type FlagSeverity = "low" | "medium" | "high";

export type FlagStatus = "open" | "reviewed" | "dismissed";

export const FLAG_TYPE_LABELS: Record<FlagType, string> = {
  banned_search: "Inappropriate search",
  rapid_downloads: "Download burst",
  failed_login: "Repeated failed sign-ins",
  unauthorized_admin: "Admin-area probe",
  chat_inappropriate: "Inappropriate chat message",
};

export const FLAG_STATUS_LABELS: Record<FlagStatus, string> = {
  open: "Open",
  reviewed: "Reviewed",
  dismissed: "Dismissed",
};

export type MisbehaviorFlag = {
  id: number;
  user_id: string;
  type: FlagType;
  severity: FlagSeverity;
  details: Record<string, unknown>;
  status: FlagStatus;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

/** Flag enriched with the student's name for display. */
export type FlagWithStudent = MisbehaviorFlag & {
  student_name: string | null;
  student_email: string | null;
};