import type { PortfolioContent } from "./content";
import { safeUrl } from "./content";
export type CvEntry = {
  id: string;
  title: string;
  organization: string;
  dates: string;
  link: string;
  bullets: string[];
};
export type Cv = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
  summary: string;
  skills: string[];
  experience: CvEntry[];
  projects: CvEntry[];
  education: CvEntry[];
};
export type CvPreset = { id: string; name: string; cv: Cv; job: string };
export type CvWorkspace = { cv: Cv; job: string; presets: CvPreset[] };
export type CvState = CvWorkspace & {
  revision: string;
  savedAt: string | null;
};
export const emptyEntry = (id: string): CvEntry => ({
  id,
  title: "",
  organization: "",
  dates: "",
  link: "",
  bullets: [],
});
export function cvFromPortfolio(content: PortfolioContent): Cv {
  const p = content.profile;
  return {
    name: p.name,
    title: "Backend & Platform Engineer",
    email: p.email,
    phone: "",
    location: p.location,
    links: [p.github, p.linkedin].filter(Boolean),
    summary: p.about,
    skills: Array.from(new Set(content.skills.flatMap((g) => g.skills))),
    experience: content.experience.map((e) => ({
      id: e.id,
      title: e.role,
      organization: e.company,
      dates: e.date,
      link: "",
      bullets: [e.desc],
    })),
    projects: content.projects
      .filter((p) => p.featured)
      .map((p) => ({
        id: p.id,
        title: p.title,
        organization: p.techStack.join(", "),
        dates: "",
        link: p.liveUrl || p.githubUrl,
        bullets: [p.description],
      })),
    education: [
      {
        ...emptyEntry("diploma"),
        title: "Diploma in Software Development and Application Design",
        bullets: [
          "Focus: Software development, systems design, and backend engineering.",
        ],
      },
      {
        ...emptyEntry("degree"),
        title: "Bachelor of Engineering in Civil and Environmental Engineering",
        bullets: [
          "Focus: Transportation systems analysis and civil engineering.",
        ],
      },
    ],
  };
}
export function initialCvState(content: PortfolioContent): CvState {
  const base = cvFromPortfolio(content);
  const backend = {
    ...base,
    title: "Backend Engineer",
    summary:
      "Backend engineer with production experience building APIs, network automation, and developer tools with Go, Node.js, TypeScript, PostgreSQL, Redis, and Docker. Built Zentramesh, the network automation engine handling authentication, billing, and bandwidth shaping for hundreds of active users and millions of NGN in revenue. Built Goose, a type-safe MongoDB ODM for Go.",
  };
  const platform = {
    ...base,
    title: "Platform Engineer",
    summary:
      "Platform engineer building reliable services, network integrations, and developer tooling with Go, Node.js, PostgreSQL, Redis, and Docker. Built Zentramesh, which connects TP-Link Omada SDN controllers to automate authentication, billing, and bandwidth shaping for hundreds of active users and millions of NGN in revenue. Built Goose, a type-safe MongoDB ODM for Go.",
  };
  const fullstack = {
    ...base,
    title: "Full Stack Engineer",
    summary:
      "Full stack engineer with a strong backend foundation in TypeScript, Next.js, Node.js, Go, and SQL databases. Built network access and billing platforms, APIs, and developer tools; also designed a scalable marketing system and complex multi-step form builder with Next.js, Express.js, PHP, and MySQL.",
  };
  return {
    cv: base,
    job: "",
    presets: [
      { id: "backend", name: "Backend job", cv: backend, job: "" },
      { id: "platform", name: "Platform job", cv: platform, job: "" },
      { id: "fullstack", name: "Full stack job", cv: fullstack, job: "" },
    ],
    revision: "initial",
    savedAt: null,
  };
}
export function validateCv(value: unknown): Cv {
  const object = (v: unknown): Record<string, unknown> => {
    if (!v || typeof v !== "object" || Array.isArray(v))
      throw new Error("Invalid CV structure.");
    return v as Record<string, unknown>;
  };
  const str = (v: unknown, max = 6000): string => {
    if (typeof v !== "string" || v.length > max)
      throw new Error(`CV text must be at most ${max} characters per field.`);
    return v;
  };
  const list = (v: unknown, max = 60): unknown[] => {
    if (!Array.isArray(v) || v.length > max)
      throw new Error(`Use at most ${max} entries.`);
    return v;
  };
  const strings = (v: unknown, max = 60) =>
    list(v, max)
      .map((s) => str(s, 2000).trim())
      .filter(Boolean);
  const source = object(value);
  const entries = (v: unknown) => {
    const result = list(v, 30).map((raw) => {
      const e = object(raw);
      const entry = {
        id: str(e.id, 100),
        title: str(e.title, 250),
        organization: str(e.organization, 1000),
        dates: str(e.dates, 100),
        link: str(e.link, 2000),
        bullets: strings(e.bullets, 20),
      };
      if (!entry.id || !entry.title.trim() || !safeUrl(entry.link))
        throw new Error(
          "Each CV entry needs a title, unique ID, and a valid link.",
        );
      return entry;
    });
    if (new Set(result.map((e) => e.id)).size !== result.length)
      throw new Error("CV entries must have unique IDs.");
    return result;
  };
  const cv = {
    name: str(source.name, 200),
    title: str(source.title, 200),
    email: str(source.email, 250),
    phone: str(source.phone, 100),
    location: str(source.location, 200),
    links: strings(source.links, 8),
    summary: str(source.summary),
    skills: strings(source.skills, 100),
    experience: entries(source.experience),
    projects: entries(source.projects),
    education: entries(source.education),
  };
  if (!cv.name.trim() || !cv.title.trim())
    throw new Error("Name and professional title are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.email))
    throw new Error("Enter a valid CV email address.");
  if (cv.links.some((link) => !safeUrl(link)))
    throw new Error("CV links must start with https:// or http://.");
  return cv;
}
export function validateWorkspace(value: unknown): CvWorkspace {
  if (!value || typeof value !== "object")
    throw new Error("Invalid CV workspace.");
  const source = value as Record<string, unknown>;
  const job = (v: unknown) => {
    if (typeof v !== "string" || v.length > 20000)
      throw new Error("Job descriptions must be at most 20,000 characters.");
    return v;
  };
  if (!Array.isArray(source.presets) || source.presets.length > 30)
    throw new Error("Save up to 30 presets.");
  const presets = source.presets.map((raw: unknown) => {
    if (!raw || typeof raw !== "object") throw new Error("Invalid preset.");
    const p = raw as Record<string, unknown>;
    if (
      typeof p.id !== "string" ||
      !p.id ||
      p.id.length > 100 ||
      typeof p.name !== "string" ||
      !p.name.trim() ||
      p.name.length > 100
    )
      throw new Error("Each preset needs a name (up to 100 characters).");
    return {
      id: p.id,
      name: p.name.trim(),
      cv: validateCv(p.cv),
      job: job(p.job),
    };
  });
  if (
    new Set(presets.map((p) => p.id)).size !== presets.length ||
    new Set(presets.map((p) => p.name.toLowerCase())).size !== presets.length
  )
    throw new Error("Preset names and IDs must be unique.");
  return { cv: validateCv(source.cv), job: job(source.job), presets };
}
export function cvText(cv: Cv): string {
  const blocks = [
    cv.name,
    cv.title,
    [cv.location, cv.email, cv.phone].filter(Boolean).join(" | "),
    ...cv.links,
  ];
  if (cv.summary.trim()) blocks.push("\nPROFESSIONAL SUMMARY", cv.summary);
  if (cv.skills.length) blocks.push("\nTECHNICAL SKILLS", cv.skills.join(", "));
  for (const [title, entries] of [
    ["PROFESSIONAL EXPERIENCE", cv.experience],
    ["SELECTED PROJECTS", cv.projects],
    ["EDUCATION", cv.education],
  ] as const) {
    if (!entries.length) continue;
    blocks.push(`\n${title}`);
    for (const e of entries)
      blocks.push(
        [e.title, e.organization].filter(Boolean).join(" | "),
        ...[e.dates, e.link].filter(Boolean),
        ...e.bullets.map((b) => `- ${b}`),
        "",
      );
  }
  return blocks.join("\n").trim() + "\n";
}
