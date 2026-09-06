"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Download,
  Eye,
  FileText,
  Folder,
  LayoutDashboard,
  LogOut,
  Plus,
  Save,
  Send,
  Trash2,
  Undo2,
  UserRound,
  X,
} from "lucide-react";
import { Portfolio } from "./Portfolio";
import {
  validateContent,
  type ContentState,
  type PortfolioContent,
} from "../lib/content";

type Section = "profile" | "projects" | "experience" | "skills";
const sections: { id: Section; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "Profile & story", icon: UserRound },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "skills", label: "Toolkit", icon: Code2 },
];
const sectionCopy = {
  profile: [
    "Your story, in your words.",
    "The introduction, details, and little things that make this yours.",
  ],
  projects: [
    "Good work deserves a home.",
    "Add projects, choose your featured work, and put things in order.",
  ],
  experience: [
    "Every chapter counts.",
    "Keep the story of where you’ve built up to date.",
  ],
  skills: [
    "The tools behind the craft.",
    "Group the technologies you use to bring ideas to life.",
  ],
};
function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <label className={`field ${multiline ? "field-wide" : ""}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function EditorCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="editor-card">
      <div className="editor-card-heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="field-grid">{children}</div>
    </section>
  );
}
export function Studio({
  initialState,
  local,
}: {
  initialState: ContentState;
  local: boolean;
}) {
  const [state, setState] = useState(initialState);
  const [content, setContent] = useState(initialState.draft);
  const [section, setSection] = useState<Section>("profile");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [undo, setUndo] = useState<{
    group: Exclude<Section, "profile">;
    index: number;
    item: PortfolioContent[Exclude<Section, "profile">][number];
  } | null>(null);
  const dirty = JSON.stringify(content) !== JSON.stringify(state.draft);
  const unpublished =
    JSON.stringify(content) !== JSON.stringify(state.published);
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
  function updateProfile(
    key: keyof PortfolioContent["profile"],
    value: string,
  ) {
    setContent((c) => ({ ...c, profile: { ...c.profile, [key]: value } }));
  }
  function updateRecord(
    group: Exclude<Section, "profile">,
    index: number,
    patch: Record<string, unknown>,
  ) {
    setContent((c) => ({
      ...c,
      [group]: c[group].map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }
  function move(
    group: Exclude<Section, "profile">,
    index: number,
    step: number,
  ) {
    setContent((c) => {
      const items = [...c[group]];
      [items[index], items[index + step]] = [items[index + step], items[index]];
      return { ...c, [group]: items };
    });
  }
  function remove(group: Exclude<Section, "profile">, index: number) {
    setUndo({ group, index, item: content[group][index] });
    setContent((c) => ({
      ...c,
      [group]: c[group].filter((_, i) => i !== index),
    }));
    setMessage("Item removed from draft. You can undo this change.");
  }
  function add(group: Exclude<Section, "profile">) {
    const id = crypto.randomUUID();
    const record =
      group === "projects"
        ? {
            id,
            title: "Untitled project",
            description: "",
            category: "Systems",
            techStack: [],
            githubUrl: "",
            liveUrl: "",
            featured: false,
          }
        : group === "experience"
          ? { id, role: "New role", company: "", date: "", desc: "" }
          : { id, title: "New skill group", skills: [] };
    setContent((c) => ({ ...c, [group]: [record, ...c[group]] }));
    setMessage("New item added at the top.");
  }
  async function save(action: "save" | "publish") {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const validated = validateContent(content);
      const response = await fetch("/api/studio/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          revision: state.revision,
          content: validated,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setState(result);
      setContent(result.draft);
      setUndo(null);
      setMessage(
        action === "publish"
          ? "Published. Your portfolio is up to date."
          : "Draft saved. Your live portfolio hasn’t changed.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not connect. Your edits are still here; please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  function exportContent() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(content, null, 2)], {
        type: "application/json",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Draft exported.");
  }
  async function signOut() {
    if (
      dirty &&
      !window.confirm("You have unsaved edits. Sign out and discard them?")
    )
      return;
    try {
      const response = await fetch("/api/studio/session", { method: "DELETE" });
      if (!response.ok) throw new Error();
      window.location.reload();
    } catch {
      setError("Could not sign out. Please retry.");
    }
  }
  function tools(group: Exclude<Section, "profile">, index: number) {
    return (
      <div className="record-actions">
        <button
          type="button"
          className="icon-button"
          aria-label="Move up"
          disabled={index === 0}
          onClick={() => move(group, index, -1)}
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Move down"
          disabled={index === content[group].length - 1}
          onClick={() => move(group, index, 1)}
        >
          <ArrowDown size={15} />
        </button>
        <button
          type="button"
          className="icon-button delete-button"
          aria-label="Remove item"
          onClick={() => remove(group, index)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    );
  }
  if (preview)
    return (
      <div className="preview-page">
        <header className="preview-toolbar">
          <span>
            <span className="status-dot" /> Draft preview{" "}
            <small>Only you can see these changes.</small>
          </span>
          <button className="button" onClick={() => setPreview(false)}>
            <X size={16} /> Back to editing
          </button>
        </header>
        <Portfolio content={content} preview />
      </div>
    );
  return (
    <div className="studio-shell">
      <aside className="studio-sidebar">
        <a className="studio-brand" href="/">
          <span className="monogram">
            ds<span>_</span>
          </span>
          <span>
            Studio<span className="mono">YOUR LITTLE CORNER</span>
          </span>
        </a>
        <div className="workspace-label">
          <LayoutDashboard size={14} /> Portfolio workspace
        </div>
        <nav aria-label="Content sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSection(id);
                setError("");
              }}
              aria-current={section === id ? "page" : undefined}
            >
              <Icon size={17} />
              <span>{label}</span>
              {id === "projects" && <small>{content.projects.length}</small>}
            </button>
          ))}
          <a className="studio-cv-link" href="/studio/cv">
            <FileText size={17} /> CV workspace <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            View portfolio <ArrowUpRight size={16} />
          </a>
          <button onClick={exportContent}>
            <Download size={16} /> Export draft
          </button>
          {!local && (
            <button onClick={signOut}>
              <LogOut size={16} /> Sign out
            </button>
          )}
          <div className="studio-user">
            <span className="pixel-avatar">
              <img src="/me.svg" alt="" width="22" height="24" />
            </span>
            <span>
              {content.profile.name.split(" ")[0]}
              <small>{local ? "Local workspace" : "Portfolio owner"}</small>
            </span>
            <span className="status-dot" />
          </div>
        </div>
      </aside>
      <div className="studio-main">
        <header className="studio-toolbar">
          <div>
            <span className="muted">Portfolio</span>
            <span className="toolbar-slash">/</span>
            {sections.find((s) => s.id === section)?.label}
          </div>
          <div className="toolbar-actions">
            <span className={`save-status ${dirty ? "has-changes" : ""}`}>
              {dirty ? (
                <>
                  <span className="status-dot" /> Unsaved edits
                </>
              ) : (
                <>
                  <Check size={13} /> Draft saved
                </>
              )}
            </span>
            <button
              className="button"
              onClick={() => {
                try {
                  validateContent(content);
                  setPreview(true);
                  setError("");
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
              disabled={busy}
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
            <button
              className="button"
              onClick={() => save("save")}
              disabled={busy || !dirty}
            >
              <Save size={15} />
              <span>Save draft</span>
            </button>
            <button
              className="button primary"
              onClick={() => save("publish")}
              disabled={busy || (!dirty && !unpublished)}
            >
              <Send size={15} />
              <span>{busy ? "Saving…" : "Publish"}</span>
            </button>
          </div>
        </header>
        <main className="studio-content">
          <div className="studio-page-heading">
            <span className="section-index">
              {String(sections.findIndex((s) => s.id === section) + 1).padStart(
                2,
                "0",
              )}{" "}
              / {section.toUpperCase()}
            </span>
            <h1>{sectionCopy[section][0]}</h1>
            <p>{sectionCopy[section][1]}</p>
          </div>
          <div className="publish-note">
            <span className="status-dot" />
            <p>
              {unpublished
                ? "Your draft has changes ready to publish."
                : "Your draft matches the live portfolio."}
              <small>
                {state.publishedAt
                  ? `Last published ${new Date(state.publishedAt).toLocaleString()}`
                  : "Start with a small update. Save when you’re ready."}
              </small>
            </p>
            <FileText size={19} />
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
                  onClick={() => {
                    setContent((current) => {
                      const items = [...current[undo.group]];
                      items.splice(undo.index, 0, undo.item);
                      return { ...current, [undo.group]: items };
                    });
                    setUndo(null);
                    setMessage("Removal undone.");
                  }}
                >
                  <Undo2 size={14} /> Undo removal
                </button>
              )}
            </div>
          )}
          <fieldset className="editor-fieldset" disabled={busy}>
            {section === "profile" && (
              <>
                <EditorCard
                  title="The introduction"
                  subtitle="Make a good first impression. Keep it human."
                >
                  <Field
                    label="Full name"
                    value={content.profile.name}
                    onChange={(v) => updateProfile("name", v)}
                  />
                  <Field
                    label="Handle"
                    value={content.profile.handle}
                    onChange={(v) => updateProfile("handle", v)}
                  />
                  <Field
                    label="Role"
                    value={content.profile.role}
                    onChange={(v) => updateProfile("role", v)}
                  />
                  <Field
                    label="Availability"
                    value={content.profile.availability}
                    onChange={(v) => updateProfile("availability", v)}
                  />
                  <Field
                    label="Headline"
                    multiline
                    hint="Use a new line for the quieter second line."
                    value={content.profile.headline}
                    onChange={(v) => updateProfile("headline", v)}
                  />
                  <Field
                    label="Short introduction"
                    multiline
                    value={content.profile.intro}
                    onChange={(v) => updateProfile("intro", v)}
                  />
                </EditorCard>
                <EditorCard title="A little more about you">
                  <Field
                    label="About"
                    multiline
                    value={content.profile.about}
                    onChange={(v) => updateProfile("about", v)}
                  />
                  <Field
                    label="What are you building now?"
                    multiline
                    value={content.profile.now}
                    onChange={(v) => updateProfile("now", v)}
                  />
                  <Field
                    label="Operating principle"
                    multiline
                    value={content.profile.philosophy}
                    onChange={(v) => updateProfile("philosophy", v)}
                  />
                  <Field
                    label="Location"
                    value={content.profile.location}
                    onChange={(v) => updateProfile("location", v)}
                  />
                </EditorCard>
                <EditorCard title="Find you on the internet">
                  <Field
                    label="Email"
                    value={content.profile.email}
                    onChange={(v) => updateProfile("email", v)}
                  />
                  <Field
                    label="GitHub URL"
                    value={content.profile.github}
                    onChange={(v) => updateProfile("github", v)}
                  />
                  <Field
                    label="LinkedIn URL"
                    value={content.profile.linkedin}
                    onChange={(v) => updateProfile("linkedin", v)}
                  />
                  <Field
                    label="Résumé URL"
                    hint="A document link or a file path in /public."
                    value={content.profile.resumeUrl}
                    onChange={(v) => updateProfile("resumeUrl", v)}
                  />
                </EditorCard>
              </>
            )}
            {section !== "profile" && (
              <div className="collection-heading">
                <span>
                  {content[section].length}{" "}
                  {section === "skills" ? "groups" : "items"}
                </span>
                <button className="button" onClick={() => add(section)}>
                  <Plus size={16} />
                  Add{" "}
                  {section === "projects"
                    ? "project"
                    : section === "experience"
                      ? "experience"
                      : "skill group"}
                </button>
              </div>
            )}
            {section !== "profile" && content[section].length === 0 && (
              <div className="empty-state">
                <Folder size={30} />
                <h2>A fresh page.</h2>
                <p>Add your first item to start this section.</p>
              </div>
            )}
            {section === "projects" &&
              content.projects.map((project, i) => (
                <section className="record-card" key={project.id}>
                  <header>
                    <div className="record-title">
                      <span className="record-mark">
                        {project.title.substring(0, 1) || "P"}
                      </span>
                      <span>
                        <strong>{project.title || "Untitled project"}</strong>
                        <small>
                          {project.featured
                            ? "Featured on your portfolio"
                            : "Project index"}
                        </small>
                      </span>
                    </div>
                    {tools("projects", i)}
                  </header>
                  <details open={i === 0}>
                    <summary>
                      Edit project <ArrowDown size={14} />
                    </summary>
                    <div className="field-grid">
                      <Field
                        label="Project name"
                        value={project.title}
                        onChange={(v) =>
                          updateRecord("projects", i, { title: v })
                        }
                      />
                      <Field
                        label="Category"
                        value={project.category}
                        onChange={(v) =>
                          updateRecord("projects", i, { category: v })
                        }
                      />
                      <Field
                        label="Description"
                        multiline
                        value={project.description}
                        onChange={(v) =>
                          updateRecord("projects", i, { description: v })
                        }
                      />
                      <Field
                        label="Technologies (comma separated)"
                        value={project.techStack.join(",")}
                        onChange={(v) =>
                          updateRecord("projects", i, {
                            techStack: v.split(","),
                          })
                        }
                      />
                      <Field
                        label="Live URL"
                        value={project.liveUrl}
                        onChange={(v) =>
                          updateRecord("projects", i, { liveUrl: v })
                        }
                      />
                      <Field
                        label="GitHub URL"
                        value={project.githubUrl}
                        onChange={(v) =>
                          updateRecord("projects", i, { githubUrl: v })
                        }
                      />
                      <label className="checkbox-field">
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={(e) =>
                            updateRecord("projects", i, {
                              featured: e.target.checked,
                            })
                          }
                        />
                        <span>
                          Feature this project
                          <small>Give it a card above the project index.</small>
                        </span>
                      </label>
                    </div>
                  </details>
                </section>
              ))}
            {section === "experience" &&
              content.experience.map((item, i) => (
                <section className="record-card" key={item.id}>
                  <header>
                    <div className="record-title">
                      <span className="record-mark">
                        <BriefcaseBusiness size={19} />
                      </span>
                      <span>
                        <strong>{item.role || "New role"}</strong>
                        <small>{item.company}</small>
                      </span>
                    </div>
                    {tools("experience", i)}
                  </header>
                  <details open={i === 0}>
                    <summary>
                      Edit experience <ArrowDown size={14} />
                    </summary>
                    <div className="field-grid">
                      <Field
                        label="Role"
                        value={item.role}
                        onChange={(v) =>
                          updateRecord("experience", i, { role: v })
                        }
                      />
                      <Field
                        label="Company"
                        value={item.company}
                        onChange={(v) =>
                          updateRecord("experience", i, { company: v })
                        }
                      />
                      <Field
                        label="Dates"
                        value={item.date}
                        onChange={(v) =>
                          updateRecord("experience", i, { date: v })
                        }
                      />
                      <Field
                        label="Description"
                        multiline
                        value={item.desc}
                        onChange={(v) =>
                          updateRecord("experience", i, { desc: v })
                        }
                      />
                    </div>
                  </details>
                </section>
              ))}
            {section === "skills" &&
              content.skills.map((item, i) => (
                <section className="record-card" key={item.id}>
                  <header>
                    <div className="record-title">
                      <span className="record-mark">
                        <Code2 size={19} />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          {item.skills.filter(Boolean).length} technologies
                        </small>
                      </span>
                    </div>
                    {tools("skills", i)}
                  </header>
                  <div className="field-grid">
                    <Field
                      label="Group name"
                      value={item.title}
                      onChange={(v) => updateRecord("skills", i, { title: v })}
                    />
                    <Field
                      label="Skills (comma separated)"
                      multiline
                      value={item.skills.join(",")}
                      onChange={(v) =>
                        updateRecord("skills", i, { skills: v.split(",") })
                      }
                    />
                  </div>
                </section>
              ))}
          </fieldset>
          <footer className="studio-bottom-note">
            <span>Made for the way you work.</span>
            <span>Changes go live only when you publish.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
