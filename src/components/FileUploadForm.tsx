"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadIcon } from "@/components/icons";
import { UNITS } from "@/lib/syllabus";
import { RESOURCE_TYPES } from "@/lib/types";

type Status =
  | { state: "idle" }
  | { state: "uploading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export function FileUploadForm() {
  const router = useRouter();
  const [unitSlug, setUnitSlug] = useState(UNITS[0].slug);
  const [topicSlug, setTopicSlug] = useState("");
  const [title, setTitle] = useState("");
  const [resourceType, setResourceType] = useState(RESOURCE_TYPES[0]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const unit = UNITS.find((u) => u.slug === unitSlug)!;
  const topics = unit.topics;

  function resetForm() {
    setTitle("");
    setDescription("");
    setFile(null);
    setResourceType(RESOURCE_TYPES[0]);
    if (topics.length > 0) setTopicSlug(topics[0].slug);
    else setTopicSlug("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setStatus({ state: "error", message: "Please choose a file to upload." });
      return;
    }

    setStatus({ state: "uploading" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("unit_slug", unitSlug);
    if (topicSlug) formData.append("topic_slug", topicSlug);
    formData.append("resource_type", resourceType);
    if (description.trim()) formData.append("description", description.trim());

    try {
      const response = await fetch("/api/resources", { method: "POST", body: formData });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus({
          state: "error",
          message: data?.error ?? "The upload failed. Please try again.",
        });
        return;
      }

      setStatus({ state: "success", message: `“${title}” uploaded successfully.` });
      resetForm();
      router.refresh();
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
        <UploadIcon width={18} height={18} className="text-accent" />
        Upload a resource
      </h2>

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="unit" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Unit
            </label>
            <select
              id="unit"
              value={unitSlug}
              onChange={(event) => {
                setUnitSlug(event.target.value);
                setTopicSlug("");
              }}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-accent focus:outline-none"
            >
              {UNITS.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {topics.length > 0 && (
            <div>
              <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Topic
              </label>
              <select
                id="topic"
                value={topicSlug}
                onChange={(event) => setTopicSlug(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-accent focus:outline-none"
              >
                {topics.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Primary Key Notes"
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="resource-type" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Resource type
          </label>
          <select
            id="resource-type"
            value={resourceType}
            onChange={(event) => setResourceType(event.target.value as typeof resourceType)}
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-accent focus:outline-none"
          >
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-zinc-700">
            File
          </label>
          <input
            id="file"
            type="file"
            required
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-accent hover:file:bg-indigo-100"
          />
          {file && <p className="mt-1 text-xs text-zinc-500">{file.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Description <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={2}
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short note for students, e.g. covers keys, joins and normalisation."
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {status.state === "error" && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {status.message}
        </p>
      )}
      {status.state === "success" && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.state === "uploading"}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-indigo-700 disabled:opacity-60 sm:w-auto sm:px-6"
      >
        {status.state === "uploading" ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}