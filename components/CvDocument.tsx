import type { Cv } from "../lib/cv";
export function CvDocument({ cv }: { cv: Cv }) {
  return (
    <article className="cv-paper" aria-label="CV document preview">
      <h1>{cv.name}</h1>
      <p className="cv-paper-title">{cv.title}</p>
      <p>{[cv.location, cv.email, cv.phone].filter(Boolean).join(" | ")}</p>
      {cv.links.map((link, i) => (
        <p key={i} className="cv-paper-link">
          {link}
        </p>
      ))}
      {cv.summary.trim() && (
        <section>
          <h2>Professional Summary</h2>
          <p>{cv.summary}</p>
        </section>
      )}
      {cv.skills.filter(Boolean).length > 0 && (
        <section>
          <h2>Technical Skills</h2>
          <p>{cv.skills.filter(Boolean).join(", ")}</p>
        </section>
      )}
      {(
        [
          ["Professional Experience", cv.experience],
          ["Selected Projects", cv.projects],
          ["Education", cv.education],
        ] as const
      ).map(
        ([title, entries]) =>
          entries.length > 0 && (
            <section key={title}>
              <h2>{title}</h2>
              {entries.map((e) => (
                <div className="cv-paper-entry" key={e.id}>
                  <h3>{e.title}</h3>
                  {e.organization && <p>{e.organization}</p>}
                  {e.dates && <p>{e.dates}</p>}
                  {e.link && <p className="cv-paper-link">{e.link}</p>}
                  <ul>
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
      )}
    </article>
  );
}
