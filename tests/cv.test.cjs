const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
  module._compile(
    ts.transpileModule(require("node:fs").readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
};
const { defaultContent } = require("../lib/content.ts");
const {
  cvFromPortfolio,
  initialCvState,
  validateCv,
  validateWorkspace,
  cvText,
} = require("../lib/cv.ts");
const { readCvState, saveCvState } = require("../lib/cv-store.ts");
const { readState } = require("../lib/content-store.ts");
const { applySuggestion, tailorCv } = require("../lib/cv-tailor.ts");
const { cvDocx } = require("../lib/cv-docx.ts");
const { cvBody } = require("../lib/cv-http.ts");
const route = require("../app/api/studio/cv/route.ts");
const exporting = require("../app/api/studio/cv/export/route.ts");
const tailoring = require("../app/api/studio/cv/tailor/route.ts");
const auth = require("../lib/cms-auth.ts");
const JSZip = require("jszip");
const original = { ...process.env },
  originalFetch = global.fetch;
let directory;
beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "cv-workspace-test-"));
  process.env.CMS_DATA_DIR = directory;
  process.env.CMS_PASSWORD = "test-password-longer-than-24-characters";
  process.env.CMS_SESSION_SECRET =
    "test-session-secret-longer-than-32-characters";
  process.env.NODE_ENV = "production";
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_MODEL;
});
afterEach(async () => {
  global.fetch = originalFetch;
  await fs.rm(directory, { force: true, recursive: true });
  for (const key of [
    "CMS_DATA_DIR",
    "CMS_PASSWORD",
    "CMS_SESSION_SECRET",
    "NODE_ENV",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
  ]) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});
const fresh = () => initialCvState(defaultContent);
const cv = () => cvFromPortfolio(defaultContent);
const job =
  "Backend engineer needed to build Go APIs, PostgreSQL services, and reliable infrastructure.";
function request(
  method,
  body,
  authorized = true,
  origin = "https://portfolio.example",
) {
  return new Request("https://portfolio.example/api/studio/cv", {
    method,
    headers: {
      host: "portfolio.example",
      origin,
      ...(authorized
        ? { cookie: `${auth.SESSION_COOKIE}=${auth.issueSession()}` }
        : {}),
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
function suggestion(source) {
  return {
    summary: source.summary,
    skills: source.skills.slice(0, 8),
    experience: source.experience.map((e) => ({
      id: e.id,
      bullets: e.bullets,
    })),
    projects: source.projects
      .slice(0, 1)
      .map((e) => ({ id: e.id, bullets: e.bullets })),
    notes: ["Emphasized backend skills and selected a relevant project."],
  };
}
function configureAi() {
  process.env.OPENAI_API_KEY = "unit-test-key-not-real";
  process.env.OPENAI_MODEL = "test-model";
}
test("backend, platform, and full stack presets start from real portfolio facts and exclude unfinished work", () => {
  const state = fresh();
  assert.deepEqual(
    state.presets.map((p) => p.name),
    ["Backend job", "Platform job", "Full stack job"],
  );
  assert.equal(
    validateWorkspace(state).cv.title,
    "Backend & Platform Engineer",
  );
  assert.ok(state.cv.projects.some((p) => p.id === "goose"));
  assert.ok(!cvText(state.cv).includes("Tonzscrow"));
  assert.ok(!cvText(state.cv).includes("PROFESSIONAL SUMMARY\n\n"));
});
test("manual edits and presets persist independently of the portfolio without an AI service", async () => {
  const state = fresh();
  state.cv.title = "Platform Engineer";
  state.job = job;
  state.presets.push({
    id: "custom",
    name: "Go backend role",
    cv: structuredClone(state.cv),
    job,
  });
  const saved = await saveCvState(state, "initial");
  const reloaded = await readCvState();
  assert.equal(reloaded.cv.title, "Platform Engineer");
  assert.equal(reloaded.presets[3].job, job);
  assert.equal(reloaded.revision, saved.revision);
  assert.equal((await readState()).revision, "initial");
  assert.equal(
    (await fs.stat(path.join(directory, "cv.json"))).mode & 0o777,
    0o600,
  );
});
test("stale or concurrent CV saves cannot overwrite newer edits", async () => {
  const state = fresh();
  const results = await Promise.allSettled([
    saveCvState(state, "initial"),
    saveCvState(state, "initial"),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  await assert.rejects(saveCvState(state, "initial"), /another session/);
});
test("validation catches invalid links, duplicate presets, missing entry titles and oversized job text", () => {
  let state = fresh();
  state.presets[1].name = "BACKEND JOB";
  assert.throws(() => validateWorkspace(state), /unique/);
  state = fresh();
  state.cv.links = ["javascript:alert(1)"];
  assert.throws(() => validateWorkspace(state), /links/);
  state = fresh();
  state.cv.experience[0].title = "";
  assert.throws(() => validateWorkspace(state), /title/);
  state = fresh();
  state.job = "a".repeat(20001);
  assert.throws(() => validateWorkspace(state), /20,000/);
});
test("private CV reads, saves, AI and exports all require authentication; writes reject foreign origins", async () => {
  assert.equal((await route.GET(request("GET", null, false))).status, 401);
  assert.equal(
    (
      await route.PUT(
        request("PUT", { workspace: fresh(), revision: "initial" }, false),
      )
    ).status,
    401,
  );
  assert.equal(
    (await exporting.POST(request("POST", { cv: cv(), format: "docx" }, false)))
      .status,
    401,
  );
  assert.equal(
    (await tailoring.POST(request("POST", { cv: cv(), job }, false))).status,
    401,
  );
  assert.equal(
    (
      await route.PUT(
        request(
          "PUT",
          { workspace: fresh(), revision: "initial" },
          true,
          "https://other.example",
        ),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await exporting.POST(
        request(
          "POST",
          { cv: cv(), format: "docx" },
          true,
          "https://other.example",
        ),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await tailoring.POST(
        request("POST", { cv: cv(), job }, true, "https://other.example"),
      )
    ).status,
    403,
  );
});
test("CV API saves edits, reports conflicts, and marks private data uncacheable", async () => {
  const state = fresh();
  state.cv.summary = "A manually edited summary.";
  const result = await route.PUT(
    request("PUT", { workspace: state, revision: "initial" }),
  );
  assert.equal(result.status, 200);
  assert.equal((await result.json()).cv.summary, state.cv.summary);
  assert.equal(
    (await route.PUT(request("PUT", { workspace: state, revision: "initial" })))
      .status,
    409,
  );
  const get = await route.GET(request("GET"));
  assert.equal(get.headers.get("cache-control"), "no-store");
});
test("AI unavailable, rate-limited, timeout, refusal, and malformed responses preserve the original CV", async () => {
  const source = cv(),
    before = JSON.stringify(source);
  await assert.rejects(tailorCv(source, job), /isn’t connected/);
  configureAi();
  global.fetch = async () => new Response("", { status: 429 });
  await assert.rejects(tailorCv(source, job), /usage limit/);
  global.fetch = async () => {
    throw new Error("timeout");
  };
  await assert.rejects(tailorCv(source, job), /didn’t respond/);
  for (const response of [
    { status: "incomplete", output: [] },
    {
      status: "completed",
      output: [
        { type: "message", content: [{ type: "refusal", refusal: "no" }] },
      ],
    },
    {
      status: "completed",
      output: [
        {
          type: "message",
          content: [{ type: "output_text", text: "not JSON" }],
        },
      ],
    },
  ]) {
    global.fetch = async () => Response.json(response);
    await assert.rejects(tailorCv(source, job), /couldn’t be safely applied/);
  }
  assert.equal(JSON.stringify(source), before);
});
test("successful AI tailoring excludes contact fields and preserves identity, employers, dates, and education", async () => {
  configureAi();
  const source = cv(),
    plan = suggestion(source);
  source.name = "Private Candidate";
  source.phone = "private-phone-123";
  source.email = "private-contact@example.com";
  global.fetch = async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    const payload = JSON.parse(options.body);
    assert.equal(payload.store, false);
    assert.equal(payload.text.format.strict, true);
    assert.ok(!payload.input.includes(source.email));
    assert.ok(!payload.input.includes(source.phone));
    assert.ok(!payload.input.includes(source.name));
    return Response.json({
      status: "completed",
      output: [
        {
          type: "message",
          content: [{ type: "output_text", text: JSON.stringify(plan) }],
        },
      ],
    });
  };
  const result = await tailorCv(source, job);
  assert.equal(result.cv.name, source.name);
  assert.deepEqual(result.cv.education, source.education);
  assert.deepEqual(
    result.cv.experience.map((e) => [e.title, e.organization, e.dates]),
    source.experience.map((e) => [e.title, e.organization, e.dates]),
  );
  assert.equal(result.cv.projects.length, 1);
});
test("AI cannot add skills or projects, duplicate entries, or omit employment history", () => {
  const source = cv();
  let plan = suggestion(source);
  plan.skills.push("Unsupported skill");
  assert.throws(() => applySuggestion(source, plan), /skill not present/);
  plan = suggestion(source);
  plan.projects = [{ id: "fake", bullets: ["Invented work"] }];
  assert.throws(() => applySuggestion(source, plan), /unsupported work/);
  plan = suggestion(source);
  plan.experience.pop();
  assert.throws(() => applySuggestion(source, plan), /omitted employment/);
  plan = suggestion(source);
  plan.experience[1] = plan.experience[0];
  assert.throws(() => applySuggestion(source, plan), /unsupported work/);
});
test("Word export contains selectable text, real headings, and no tables or text boxes", async () => {
  const source = validateCv(cv()),
    buffer = await cvDocx(source);
  assert.equal(buffer.subarray(0, 2).toString(), "PK");
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");
  assert.match(xml, /Professional Summary/);
  assert.match(xml, /Professional Experience/);
  assert.match(xml, /Goose/);
  assert.match(xml, /w:pStyle w:val="Title"/);
  assert.match(xml, /w:pStyle w:val="Heading1"/);
  assert.doesNotMatch(xml, /<w:tbl[ >]|<w:txbxContent|Tonzscrow/);
  for (const e of source.experience) assert.ok(xml.includes(e.title));
});
test("export API returns real Word/text attachments and never includes job descriptions", async () => {
  const source = cv();
  const result = await exporting.POST(
    request("POST", {
      cv: source,
      format: "docx",
      job: "PRIVATE JOB DESCRIPTION",
    }),
  );
  assert.equal(result.status, 200);
  assert.match(result.headers.get("content-disposition"), /attachment/);
  const zip = await JSZip.loadAsync(await result.arrayBuffer());
  assert.doesNotMatch(
    await zip.file("word/document.xml").async("string"),
    /PRIVATE JOB DESCRIPTION/,
  );
  const text = await exporting.POST(
    request("POST", { cv: source, format: "txt" }),
  );
  assert.equal(await text.text(), cvText(source));
  assert.equal(text.headers.get("cache-control"), "no-store");
});
test("streamed request limits reject excessive data before parsing or saving", async () => {
  await assert.rejects(
    cvBody(request("POST", { value: "x".repeat(5000) }), 100),
    /too large/,
  );
  assert.equal((await readCvState()).revision, "initial");
});
