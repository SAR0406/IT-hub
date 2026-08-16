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
  created_at: string;
};

/** Resource enriched with the human-readable unit/topic names for display. */
export type ResourceWithLabels = Resource & {
  unit_name: string;
  topic_name: string | null;
};

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB