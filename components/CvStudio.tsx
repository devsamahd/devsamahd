"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Copy,
  Download,
  FileText,
  FolderHeart,
  Plus,
  Printer,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
  Undo2,
} from "lucide-react";
import { CvDocument } from "./CvDocument";
import {
  cvText,
  emptyEntry,
  validateCv,
  validateWorkspace,
  type Cv,
  type CvEntry,
  type CvState,
  type CvWorkspace,
} from "../lib/cv";
import type { CvSuggestion } from "../lib/cv-tailor";

type Group = "experience" | "projects" | "education";
function Field({
  label,
  value,
  update,
  large = false,
  hint,
}: {
  label: string;
  value: string;
  update: (value: string) => void;
  large?: boolean;
  hint?: string;
}) {
  return (
    <label className={`field ${large ? "field-wide" : ""}`}>
      <span>{label}</span>
      {large ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => update(e.target.value)}
        />
      ) : (
        <input value={value} onChange={(e) => update(e.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function CvStudio({
  initial,
  aiAvailable,
}: {
  initial: CvState;
  aiAvailable: boolean;
}) {
  const [saved, setSaved] = useState(initial);
  const [workspace, setWorkspace] = useState<CvWorkspace>({
    cv: initial.cv,
    job: initial.job,
    presets: initial.presets,
  });
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [selected, setSelected] = useState("");
  const [presetName, setPresetName] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState<
    (CvSuggestion & { source: string }) | null
  >(null);
  const [undo, setUndo] = useState<{
    group: Group;
    index: number;
    entry: CvEntry;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { cv, job, presets } = workspace;
  const dirty =
    JSON.stringify(workspace) !==
    JSON.stringify({ cv: saved.cv, job: saved.job, presets: saved.presets });
  const source = JSON.stringify({ cv, job });
  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty]);
  const setCv = (next: Cv) => setWorkspace((w) => ({ ...w, cv: next }));
  function update(key: keyof Cv, value: unknown) {
    setCv({ ...cv, [key]: value });
  }
  function editEntry(group: Group, id: string, patch: Partial<CvEntry>) {
    update(
      group,
      cv[group].map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  }
  function move(group: Group, index: number, step: number) {
    const list = [...cv[group]];
    [list[index], list[index + step]] = [list[index + step], list[index]];
    update(group, list);
  }
  async function persist(
    next: CvWorkspace = workspace,
    success = "CV saved. Your portfolio hasn’t changed.",
  ) {
    setBusy("save");
    setError("");
    setMessage("");
    try {
      const validated = validateWorkspace(next);
      const response = await fetch("/api/studio/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: validated,
          revision: saved.revision,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setSaved(body);
      setWorkspace({ cv: body.cv, job: body.job, presets: body.presets });
      setUndo(null);
      setMessage(success);
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save. Your edits are still here.",
      );
      return false;
    } finally {
      setBusy("");
    }
  }
  async function savePreset(replace = false) {
    const name = presetName.trim();
    if (!name) {
      setError("Give this preset a name, such as Backend job.");
      return;
    }
    const id = replace ? selected : crypto.randomUUID();
    if (replace && !presets.some((p) => p.id === id)) return;
    const preset = { id, name, cv, job };
    const next = {
      ...workspace,
      presets: replace
        ? presets.map((p) => (p.id === id ? preset : p))
        : [...presets, preset],
    };
    if (await persist(next, `“${name}” preset saved.`)) {
      setSelected(id);
      setPresetName(name);
    }
  }
  function loadPreset(id: string) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    if (
      dirty &&
      !window.confirm("Load this preset and replace your unsaved CV edits?")
    )
      return;
    setWorkspace((w) => ({
      ...w,
      cv: structuredClone(preset.cv),
      job: preset.job,
    }));
    setSelected(id);
    setPresetName(preset.name);
    setSuggestion(null);
    setUndo(null);
    setError("");
    setMessage(
      `Loaded “${preset.name}”. Edit it freely, then save or create a new preset.`,
    );
  }
  async function removePreset() {
    const preset = presets.find((p) => p.id === selected);
    if (
      !preset ||
      !window.confirm(
        `Delete the “${preset.name}” preset? Your current CV will remain.`,
      )
    )
      return;
    if (
      await persist(
        { ...workspace, presets: presets.filter((p) => p.id !== selected) },
        "Preset deleted. Your current CV is unchanged.",
      )
    ) {
      setSelected("");
      setPresetName("");
    }
  }
  async function tailor() {
    setBusy("tailor");
    setError("");
    setMessage("");
    setSuggestion(null);
    try {
      const valid = validateCv(cv);
      const response = await fetch("/api/studio/cv/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: valid, job }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setSuggestion({ ...body, source });
      setMessage("Suggestion ready. Review the changes before applying them.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "AI couldn’t connect. Keep editing manually; your CV is unchanged.",
      );
    } finally {
      setBusy("");
    }
  }
  function download(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function exportCv(format: "docx" | "txt") {
    setBusy("export");
    setError("");
    try {
      const valid = validateCv(cv);
      const response = await fetch("/api/studio/cv/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: valid, format }),
      });
      if (!response.ok) throw new Error((await response.json()).error);
      download(
        await response.blob(),
        `${cv.name}-${cv.title}`.replace(/[^a-zA-Z0-9-]/g, "-") + `.${format}`,
      );
      setMessage(
        `${format === "docx" ? "Word CV" : "Plain text CV"} downloaded.`,
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Export failed. Your CV is still here.",
      );
    } finally {
      setBusy("");
    }
  }
  async function importBackup(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 3000000)
        throw new Error("Choose a backup smaller than 3 MB.");
      const imported = validateWorkspace(JSON.parse(await file.text()));
      if (
        !window.confirm(
          "Restore this backup into your draft? Save afterward to keep it on the server.",
        )
      )
        return;
      setWorkspace(imported);
      setSelected("");
      setPresetName("");
      setSuggestion(null);
      setUndo(null);
      setMessage("Backup restored into the editor. Save when ready.");
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid backup.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }
  return (
    <div className="cv-workspace">
      <aside className="cv-sidebar">
        <a href="/studio" className="cv-back">
          <ArrowLeft size={15} /> Portfolio Studio
        </a>
        <div className="cv-brand">
          <FileText size={24} />
          <div>
            CV workspace<small>A VERSION FOR EVERY OPPORTUNITY</small>
          </div>
        </div>
        <div className="cv-preset-heading">
          <FolderHeart size={15} /> Your presets <span>{presets.length}</span>
        </div>
        <nav aria-label="Saved CV presets">
          {presets.map((p) => (
            <button
              key={p.id}
              className={selected === p.id ? "selected" : ""}
              disabled={!!busy}
              onClick={() => loadPreset(p.id)}
            >
              <FileText size={15} />
              <span>{p.name}</span>
              {selected === p.id && <Check size={14} />}
            </button>
          ))}
        </nav>
        <fieldset disabled={!!busy} className="cv-preset-form">
          <Field
            label="Preset name"
            value={presetName}
            update={setPresetName}
            hint="For example: Backend job or Full stack job."
          />
          <button className="button" onClick={() => savePreset()}>
            <Plus size={15} /> Save as new preset
          </button>
          {selected && (
            <div className="cv-preset-actions">
              <button onClick={() => savePreset(true)}>Update selected</button>
              <button
                aria-label="Delete selected preset"
                onClick={removePreset}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </fieldset>
        <div className="cv-local-note">
          <span className="status-dot" />
          <p>
            Yours to shape.
            <small>Manual editing, presets, and exports work without AI.</small>
          </p>
        </div>
        <div className="cv-backup-actions">
          <button
            disabled={!!busy}
            onClick={() =>
              download(
                new Blob([JSON.stringify(workspace, null, 2)], {
                  type: "application/json",
                }),
                "cv-workspace-backup.json",
              )
            }
          >
            <Download size={14} /> Backup
          </button>
          <button disabled={!!busy} onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Restore
          </button>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="application/json,.json"
            onChange={(e) => importBackup(e.target.files?.[0])}
          />
        </div>
      </aside>
      <div className="cv-main">
        <header className="cv-toolbar">
          <div className="cv-view-tabs" aria-label="CV views">
            <button
              aria-pressed={view === "edit"}
              onClick={() => setView("edit")}
            >
              Editor
            </button>
            <button
              aria-pressed={view === "preview"}
              onClick={() => setView("preview")}
            >
              CV preview
            </button>
          </div>
          <div className="cv-toolbar-actions">
            <span className="save-status">
              {dirty ? "Unsaved edits" : "All changes saved"}
            </span>
            <button
              className="button"
              disabled={!!busy || !dirty}
              onClick={() => persist()}
            >
              <Save size={15} />
              Save CV
            </button>
            <button
              className="button primary"
              disabled={!!busy}
              onClick={() => exportCv("docx")}
            >
              <Download size={15} />
              Word CV
            </button>
          </div>
        </header>
        <main className="cv-content">
          <div className="studio-page-heading">
            <span className="section-index">
              YOUR EXPERIENCE / THEIR OPPORTUNITY
            </span>
            <h1>A CV with a little more focus.</h1>
            <p>Start with a preset. Bring in the job. Make every line count.</p>
          </div>
          {error && (
            <div className="editor-message form-error" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="editor-message" role="status">
              {message}
              {undo && (
                <button
                  disabled={!!busy}
                  onClick={() => {
                    const entries = [...cv[undo.group]];
                    entries.splice(undo.index, 0, undo.entry);
                    update(undo.group, entries);
                    setUndo(null);
                    setMessage("Entry restored.");
                  }}
                >
                  <Undo2 size={14} /> Undo removal
                </button>
              )}
            </div>
          )}
          {view === "edit" ? (
            <>
              <section className="cv-job-card">
                <header>
                  <span className="cv-card-icon">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <h2>The role you have in mind</h2>
                    <p>Paste the full job description to tailor your CV.</p>
                  </div>
                  <span
                    className={`cv-ai-status ${aiAvailable ? "connected" : ""}`}
                  >
                    {aiAvailable ? "AI configured" : "Manual mode"}
                  </span>
                </header>
                <label className="field">
                  <span className="sr-only">Job description</span>
                  <textarea
                    rows={6}
                    maxLength={20000}
                    value={job}
                    disabled={!!busy}
                    onChange={(e) =>
                      setWorkspace((w) => ({ ...w, job: e.target.value }))
                    }
                    placeholder="Paste the job description here: responsibilities, requirements, and what the team is building…"
                  />
                </label>
                <div className="cv-job-actions">
                  <p>
                    {aiAvailable
                      ? "Sends your career content and the job text to OpenAI. Contact fields stay local. Review every suggestion before applying it."
                      : "AI is not configured. Use the job description as a reference while editing below; everything else is ready to use."}
                  </p>
                  <button
                    className="button"
                    disabled={!!busy || !aiAvailable || job.trim().length < 40}
                    onClick={tailor}
                  >
                    <Sparkles size={15} />
                    {busy === "tailor"
                      ? "Preparing suggestion…"
                      : "Tailor with AI"}
                  </button>
                </div>
              </section>
              {suggestion && (
                <section className="cv-suggestion">
                  <div className="cv-suggestion-heading">
                    <div>
                      <span className="section-index">
                        REVIEW BEFORE APPLYING
                      </span>
                      <h2>A more focused version.</h2>
                    </div>
                    <button
                      aria-label="Dismiss AI suggestion"
                      className="icon-button"
                      onClick={() => setSuggestion(null)}
                    >
                      <X size={17} />
                    </button>
                  </div>
                  <p>
                    Check the wording and every claim. Your current CV is
                    unchanged.
                  </p>
                  <div className="cv-summary-compare">
                    <div>
                      <h3>Current summary</h3>
                      <p>{cv.summary}</p>
                    </div>
                    <div>
                      <h3>Suggested summary</h3>
                      <p>{suggestion.cv.summary}</p>
                    </div>
                  </div>
                  {suggestion.notes.length > 0 && (
                    <ul>
                      {suggestion.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  )}
                  <details>
                    <summary>Review the complete suggested CV</summary>
                    <CvDocument cv={suggestion.cv} />
                  </details>
                  <div className="cv-suggestion-actions">
                    <button
                      className="button primary"
                      disabled={!!busy || source !== suggestion.source}
                      onClick={() => {
                        setCv(suggestion.cv);
                        setSuggestion(null);
                        setMessage(
                          "Suggestion applied to your draft. Edit further or save when ready.",
                        );
                      }}
                    >
                      Use this version <Check size={15} />
                    </button>
                    <button
                      className="button"
                      onClick={() => setSuggestion(null)}
                    >
                      Keep current CV
                    </button>
                    {source !== suggestion.source && (
                      <small>
                        Your CV or job text changed. Request a fresh suggestion.
                      </small>
                    )}
                  </div>
                </section>
              )}
              <fieldset className="editor-fieldset" disabled={!!busy}>
                <section className="editor-card">
                  <div className="editor-card-heading">
                    <h2>Your professional introduction</h2>
                    <p>
                      Keep the title specific. Lead with the work you want to
                      do.
                    </p>
                  </div>
                  <div className="field-grid">
                    <Field
                      label="Name"
                      value={cv.name}
                      update={(v) => update("name", v)}
                    />
                    <Field
                      label="Professional title"
                      value={cv.title}
                      update={(v) => update("title", v)}
                    />
                    <Field
                      label="Email"
                      value={cv.email}
                      update={(v) => update("email", v)}
                    />
                    <Field
                      label="Phone (optional)"
                      value={cv.phone}
                      update={(v) => update("phone", v)}
                    />
                    <Field
                      label="Location"
                      value={cv.location}
                      update={(v) => update("location", v)}
                    />
                    <Field
                      label="Links (one per line)"
                      value={cv.links.join("\n")}
                      large
                      update={(v) => update("links", v.split("\n"))}
                    />
                    <Field
                      label="Professional summary"
                      value={cv.summary}
                      large
                      update={(v) => update("summary", v)}
                    />
                    <Field
                      label="Technical skills (comma separated)"
                      value={cv.skills.join(",")}
                      large
                      update={(v) => update("skills", v.split(","))}
                    />
                  </div>
                </section>
                {(["experience", "projects", "education"] as Group[]).map(
                  (group) => (
                    <section key={group} className="cv-entry-section">
                      <div className="collection-heading">
                        <h2>
                          {group === "experience"
                            ? "Professional experience"
                            : group === "projects"
                              ? "Selected projects"
                              : "Education"}
                        </h2>
                        <button
                          className="button"
                          onClick={() =>
                            update(group, [
                              ...cv[group],
                              {
                                ...emptyEntry(crypto.randomUUID()),
                                title:
                                  group === "experience"
                                    ? "New role"
                                    : group === "projects"
                                      ? "New project"
                                      : "New qualification",
                              },
                            ])
                          }
                        >
                          <Plus size={15} />
                          Add{" "}
                          {group === "experience"
                            ? "role"
                            : group === "projects"
                              ? "project"
                              : "education"}
                        </button>
                      </div>
                      {cv[group].length === 0 && (
                        <p className="cv-empty">
                          No entries yet. This section won’t appear in your
                          exported CV.
                        </p>
                      )}
                      {cv[group].map((entry, i) => (
                        <section key={entry.id} className="record-card">
                          <header>
                            <div className="record-title">
                              <span className="mono muted">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <strong>{entry.title || "Untitled entry"}</strong>
                            </div>
                            <div className="record-actions">
                              <button
                                className="icon-button"
                                aria-label={`Move ${entry.title} up`}
                                disabled={i === 0}
                                onClick={() => move(group, i, -1)}
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                className="icon-button"
                                aria-label={`Move ${entry.title} down`}
                                disabled={i === cv[group].length - 1}
                                onClick={() => move(group, i, 1)}
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                className="icon-button delete-button"
                                aria-label={`Remove ${entry.title}`}
                                onClick={() => {
                                  setUndo({ group, index: i, entry });
                                  update(
                                    group,
                                    cv[group].filter((e) => e.id !== entry.id),
                                  );
                                  setMessage(
                                    "Entry removed from this CV. You can undo this change.",
                                  );
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </header>
                          <details open={i === 0}>
                            <summary>
                              Edit details <ArrowDown size={14} />
                            </summary>
                            <div className="field-grid">
                              <Field
                                label={
                                  group === "experience"
                                    ? "Role"
                                    : group === "projects"
                                      ? "Project name"
                                      : "Qualification"
                                }
                                value={entry.title}
                                update={(v) =>
                                  editEntry(group, entry.id, { title: v })
                                }
                              />
                              <Field
                                label={
                                  group === "experience"
                                    ? "Company"
                                    : group === "projects"
                                      ? "Technologies"
                                      : "Institution"
                                }
                                value={entry.organization}
                                update={(v) =>
                                  editEntry(group, entry.id, {
                                    organization: v,
                                  })
                                }
                              />
                              <Field
                                label="Dates (optional)"
                                value={entry.dates}
                                update={(v) =>
                                  editEntry(group, entry.id, { dates: v })
                                }
                              />
                              <Field
                                label="Link (optional)"
                                value={entry.link}
                                update={(v) =>
                                  editEntry(group, entry.id, { link: v })
                                }
                              />
                              <Field
                                label="Highlights (one bullet per line)"
                                large
                                hint="Use specific, truthful outcomes. Include numbers only when you can support them."
                                value={entry.bullets.join("\n")}
                                update={(v) =>
                                  editEntry(group, entry.id, {
                                    bullets: v.split("\n"),
                                  })
                                }
                              />
                            </div>
                          </details>
                        </section>
                      ))}
                    </section>
                  ),
                )}
              </fieldset>
            </>
          ) : (
            <section className="cv-preview-surface">
              <div className="cv-preview-note">
                <FileText size={17} />
                <p>
                  Single column. Standard headings. Selectable text.
                  <small>
                    Page breaks depend on your content and export format. Follow
                    the employer’s requested file type.
                  </small>
                </p>
              </div>
              <CvDocument cv={cv} />
            </section>
          )}
          <footer className="cv-export-bar">
            <div>
              <strong>Ready for the next step?</strong>
              <p>Export your current draft. Your portfolio stays separate.</p>
            </div>
            <div>
              <button
                className="button"
                disabled={!!busy}
                onClick={() => exportCv("txt")}
              >
                <FileText size={15} />
                Plain text
              </button>
              <button
                className="button"
                disabled={!!busy}
                onClick={() => {
                  try {
                    validateCv(cv);
                    window.print();
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                <Printer size={15} />
                Print / PDF
              </button>
              <button
                className="button"
                disabled={!!busy}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(cvText(validateCv(cv)));
                    setMessage("CV copied as plain text.");
                  } catch {
                    setError(
                      "Could not copy. Try the plain text download instead.",
                    );
                  }
                }}
              >
                <Copy size={15} />
                Copy
              </button>
            </div>
          </footer>
        </main>
      </div>
      <div className="cv-print">
        <CvDocument cv={cv} />
      </div>
    </div>
  );
}
