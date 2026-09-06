import initialContent from "../data/portfolio.json";
export type PortfolioContent = typeof initialContent;
export type Project = PortfolioContent["projects"][number];
export type ContentState = {
  draft: PortfolioContent;
  published: PortfolioContent;
  revision: string;
  publishedAt: string | null;
};
export const defaultContent: PortfolioContent = initialContent;
export function safeUrl(value: string, local = false): boolean {
  if (!value) return true;
  if (local && /^\/(?!\/)[^\\\s]*$/.test(value)) return true;
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
export function validateContent(input: unknown): PortfolioContent {
  const fail = (message: string): never => {
    throw new Error(message);
  };
  const obj = (value: unknown): Record<string, unknown> =>
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : fail("Content must be an object.");
  const string = (value: unknown, label: string, max = 4000): string =>
    typeof value === "string" && value.length <= max
      ? value
      : fail(`${label} is missing or too long.`);
  const list = (value: unknown, label: string): unknown[] =>
    Array.isArray(value) && value.length <= 100
      ? value
      : fail(`${label} must contain at most 100 items.`);
  const strings = (value: unknown, label: string) =>
    Array.from(
      new Set(
        list(value, label)
          .map((v) => string(v, label, 100).trim())
          .filter(Boolean),
      ),
    );
  const source = obj(input),
    rawProfile = obj(source.profile);
  const profile = Object.fromEntries(
    Object.keys(defaultContent.profile).map((key) => [
      key,
      string(rawProfile[key], key),
    ]),
  ) as PortfolioContent["profile"];
  if (!profile.name.trim() || !profile.headline.trim())
    fail("Name and headline are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
    fail("Enter a valid email address.");
  for (const key of ["github", "linkedin", "resumeUrl"] as const)
    if (!safeUrl(profile[key], key === "resumeUrl"))
      fail(`${key} must be a valid link.`);
  const projects = list(source.projects, "Projects").map((value) => {
    const p = obj(value);
    const project = {
      id: string(p.id, "Project ID", 100),
      title: string(p.title, "Project title", 200),
      description: string(p.description, "Description"),
      category: string(p.category, "Category", 100),
      techStack: strings(p.techStack, "Technologies"),
      githubUrl: string(p.githubUrl, "Source URL"),
      liveUrl: string(p.liveUrl, "Live URL"),
      featured: p.featured === true,
    };
    if (
      !project.title.trim() ||
      !project.id ||
      !safeUrl(project.githubUrl) ||
      !safeUrl(project.liveUrl)
    )
      fail("Every project needs a title, ID, and valid links.");
    return project;
  });
  const experience = list(source.experience, "Experience").map((value) => {
    const e = obj(value);
    return {
      id: string(e.id, "Experience ID", 100),
      role: string(e.role, "Role", 200),
      company: string(e.company, "Company", 200),
      date: string(e.date, "Dates", 100),
      desc: string(e.desc, "Experience description"),
    };
  });
  const skills = list(source.skills, "Skill groups").map((value) => {
    const s = obj(value);
    return {
      id: string(s.id, "Skill ID", 100),
      title: string(s.title, "Group title", 200),
      skills: strings(s.skills, "Skills"),
    };
  });
  for (const records of [projects, experience, skills])
    if (new Set(records.map((r) => r.id)).size !== records.length)
      fail("Items must have unique IDs.");
  return { profile, projects, experience, skills };
}
