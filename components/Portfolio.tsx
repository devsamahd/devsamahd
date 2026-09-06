"use client";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Layers3,
  Network,
  ArrowRight,
  Code2,
} from "lucide-react";
import type { PortfolioContent, Project } from "../lib/content";
import { siteUrl } from "../lib/site";
function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer">
          Visit project <ArrowUpRight size={15} />
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} source on GitHub`}
        >
          <Github size={17} />
        </a>
      )}
    </div>
  );
}
export function Portfolio({
  content,
  preview = false,
}: {
  content: PortfolioContent;
  preview?: boolean;
}) {
  const { profile: p, projects, experience, skills } = content;
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const featured = projects.filter((project) => project.featured);
  const categories = [
    "All",
    ...Array.from(
      new Set(projects.map((project) => project.category).filter(Boolean)),
    ),
  ];
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: p.name,
        url: siteUrl.toString(),
        jobTitle: p.role,
        description: p.intro,
        email: `mailto:${p.email}`,
        address: { "@type": "PostalAddress", addressLocality: p.location },
        sameAs: [p.github, p.linkedin].filter(Boolean),
        knowsAbout: skills.flatMap((group) => group.skills),
      },
      {
        "@type": "WebSite",
        name: `${p.name} portfolio`,
        url: siteUrl.toString(),
        description: p.intro,
        publisher: { "@type": "Person", name: p.name },
      },
      {
        "@type": "ItemList",
        name: "Selected work",
        itemListElement: featured.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            url: project.liveUrl || project.githubUrl || siteUrl.toString(),
            keywords: project.techStack.join(", "),
          },
        })),
      },
    ],
  }).replace(/</g, "\\u003c");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(p.email);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <div className={`portfolio ${preview ? "is-preview" : ""}`}>
      {!preview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-nav">
        <a className="wordmark" href="#main" aria-label="Back to introduction">
          <span className="monogram">
            ds<span>_</span>
          </span>
          <span>{p.handle}</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Work</a>
          <a href="#about">About</a>
          <a href={`mailto:${p.email}`} className="nav-contact">
            Let’s talk <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>
      <main id="main" className="portfolio-main">
        <section className="hero">
          <div className="eyebrow">
            <span className="status-dot" /> {p.availability}
          </div>
          <div className="intro-line">
            <span className="pixel-avatar">
              <img src="/me.svg" alt="" width="24" height="26" />
            </span>
            <span>
              Hello, I’m {p.name.split(" ")[0]}{" "}
              <span className="muted">/ {p.role}</span>
            </span>
          </div>
          <h1>
            {p.headline.split("\n").map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h1>
          <p className="hero-description">{p.intro}</p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              Explore my work <ArrowDown size={16} />
            </a>
            <a className="text-link" href={`mailto:${p.email}`}>
              Get in touch <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="now-strip">
            <span className="mono">NOW</span>
            <p>{p.now}</p>
            <span className="now-spark" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
        <section id="projects" className="work-section">
          <div className="section-heading">
            <div>
              <span className="section-index">01 / SELECTED WORK</span>
              <h2>
                Ideas, made real<span className="accent">.</span>
              </h2>
            </div>
            <span className="mono muted">
              {String(projects.length).padStart(2, "0")} projects & counting
            </span>
          </div>
          <div className="featured-grid">
            {featured.map((project, index) => (
              <article
                className={`feature-card feature-${index % 3}`}
                key={project.id}
              >
                <div className="feature-top">
                  <span className="project-category">{project.category}</span>
                  <span className="mono muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="project-visual" aria-hidden="true">
                  {project.id === "zentramesh" ? (
                    <div className="system-map">
                      <div className="system-node">
                        <Network size={20} />
                        <span>Zentramesh</span>
                      </div>
                      <div className="system-branches">
                        <span>Netra.ng</span>
                        <span>Superkonnect</span>
                      </div>
                    </div>
                  ) : (
                    <div className="project-letter">
                      <span>{project.title.substring(0, 1)}</span>
                      {project.category === "Web3" ? (
                        <Layers3 size={32} strokeWidth={1} />
                      ) : (
                        <Code2 size={32} strokeWidth={1} />
                      )}
                    </div>
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="feature-bottom">
                  <span className="mono muted">
                    {project.techStack.slice(0, 3).join(" · ")}
                  </span>
                  <ProjectLinks project={project} />
                </div>
              </article>
            ))}
          </div>
          <div className="index-header">
            <h3>
              The project index <span>{projects.length}</span>
            </h3>
            <div className="filter-list" aria-label="Filter projects">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="project-index">
            {projects
              .filter(
                (project) =>
                  category === "All" || project.category === category,
              )
              .map((project) => (
                <details className="project-row" key={project.id}>
                  <summary>
                    <span className="project-number">
                      {String(projects.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                    <span className="project-row-name">{project.title}</span>
                    <span className="project-row-category">
                      {project.category}
                    </span>
                    <ArrowUpRight size={17} />
                  </summary>
                  <div className="project-detail">
                    <p>{project.description}</p>
                    <div className="tags">
                      {project.techStack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <ProjectLinks project={project} />
                  </div>
                </details>
              ))}
          </div>
        </section>
        <section id="about" className="about-section">
          <div className="section-heading">
            <div>
              <span className="section-index">
                02 / THE PERSON BEHIND THE CODE
              </span>
              <h2>Curious by default.</h2>
            </div>
          </div>
          <div className="about-grid">
            <div>
              <p className="about-copy">{p.about}</p>
              <p className="location">
                <span className="status-dot" /> Based in {p.location}
              </p>
              <div className="social-links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer">
                    GitHub <ArrowUpRight size={14} />
                  </a>
                )}
                {p.linkedin && (
                  <a href={p.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                )}
                {p.resumeUrl && (
                  <a href={p.resumeUrl}>
                    Résumé <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
            <aside className="principle">
              <span className="mono">A SIMPLE OPERATING PRINCIPLE</span>
              <span className="principle-symbol" aria-hidden="true">
                ✳
              </span>
              <blockquote>{p.philosophy}</blockquote>
              <span className="mono muted">— {p.handle}</span>
            </aside>
          </div>
        </section>
        <section id="experience" className="experience-section">
          <div className="section-heading">
            <div>
              <span className="section-index">03 / ALONG THE WAY</span>
              <h2>Where I’ve built.</h2>
            </div>
          </div>
          <div className="experience-list">
            {experience.map((e) => (
              <article key={e.id}>
                <span className="experience-date mono">{e.date}</span>
                <div>
                  <h3>{e.role}</h3>
                  <span className="company">{e.company}</span>
                  <p>{e.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="arsenal" className="skills-section">
          <div className="section-heading">
            <div>
              <span className="section-index">04 / THE TOOLKIT</span>
              <h2>Built on good foundations.</h2>
            </div>
          </div>
          <div className="skills-grid">
            {skills.map((group) => (
              <div key={group.id}>
                <h3>{group.title}</h3>
                <p>{group.skills.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-section">
          <span className="section-index">HAVE SOMETHING IN MIND?</span>
          <h2>
            Let’s build
            <br />
            <span>something that matters.</span>
          </h2>
          <div className="contact-actions">
            <a href={`mailto:${p.email}`} className="contact-email">
              {p.email}
              <ArrowUpRight size={24} />
            </a>
            <button
              className="icon-button"
              onClick={copyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
          <span className="copy-status" role="status">
            {copied
              ? "Email copied."
              : copyError
                ? `Copy this address: ${p.email}`
                : ""}
          </span>
        </section>
      </main>
      <footer className="site-footer">
        <span>
          © {new Date().getFullYear()} {p.name.split(" ")[0]}
        </span>
        <span className="footer-note">A little craft. A lot of curiosity.</span>
        <a href="#main">
          Back to top <ArrowRight size={14} className="arrow-up" />
        </a>
      </footer>
    </div>
  );
}
