const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const ts = require("typescript");
// Use the project's compiler for server-module tests without a second TS runtime.
require.extensions[".ts"] = (module, filename) => {
  const source = require("node:fs").readFileSync(filename, "utf8");
  module._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
};
const { defaultContent, validateContent } = require("../lib/content.ts");
const {
  saveContent,
  readState,
  readPublished,
} = require("../lib/content-store.ts");
const auth = require("../lib/cms-auth.ts");
const route = require("../app/api/studio/content/route.ts");
const session = require("../app/api/studio/session/route.ts");
const original = { ...process.env };
let temporary;
beforeEach(async () => {
  temporary = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-cms-test-"));
  process.env.CMS_DATA_DIR = temporary;
  process.env.NODE_ENV = "production";
  process.env.CMS_PASSWORD = "a-test-password-with-at-least-24-characters";
  process.env.CMS_SESSION_SECRET =
    "a-different-test-secret-with-at-least-32-characters";
});
afterEach(async () => {
  await fs.rm(temporary, { force: true, recursive: true });
  for (const key of [
    "CMS_DATA_DIR",
    "CMS_PASSWORD",
    "CMS_SESSION_SECRET",
    "NODE_ENV",
  ]) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});
const clone = () => structuredClone(defaultContent);
function request(method, body, options = {}) {
  return new Request("https://portfolio.example/api/studio/content", {
    method,
    headers: {
      host: "portfolio.example",
      origin: options.origin || "https://portfolio.example",
      ...(options.auth
        ? { cookie: `${auth.SESSION_COOKIE}=${auth.issueSession()}` }
        : {}),
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
test("initial portfolio content validates and unsafe links and duplicate IDs are rejected", () => {
  assert.equal(validateContent(clone()).projects.length, 10);
  assert.equal(
    clone().projects.some((p) => p.id === "tonzscrow" || p.id === "morm"),
    false,
  );
  assert.equal(clone().projects.find((p) => p.id === "goose").featured, true);
  assert.equal(
    clone().projects.find((p) => p.id === "unideals").featured,
    true,
  );
  assert.equal(
    clone().projects.find((p) => p.id === "superkonnect").featured,
    false,
  );
  const content = clone();
  content.profile.resumeUrl = "//evil.example";
  assert.throws(() => validateContent(content), /valid link/);
  content.profile.resumeUrl = "javascript:alert(1)";
  assert.throws(() => validateContent(content), /valid link/);
  content.profile.resumeUrl = "/resume.docx";
  content.projects[1].id = content.projects[0].id;
  assert.throws(() => validateContent(content), /unique IDs/);
});
test("draft survives storage reads without changing published content; publishing promotes it", async () => {
  const draft = clone();
  draft.profile.headline = "A test draft";
  const saved = await saveContent(draft, "initial", false);
  assert.equal((await readState()).draft.profile.headline, "A test draft");
  assert.equal(
    (await readPublished()).profile.headline,
    defaultContent.profile.headline,
  );
  const published = await saveContent(draft, saved.revision, true);
  assert.equal((await readPublished()).profile.headline, "A test draft");
  assert.ok(published.publishedAt);
  assert.equal(
    (await fs.stat(path.join(temporary, "content.json"))).mode & 0o777,
    0o600,
  );
});
test("stale and simultaneous saves cannot silently overwrite a newer version", async () => {
  const outcomes = await Promise.allSettled([
    saveContent(clone(), "initial", false),
    saveContent(clone(), "initial", false),
  ]);
  assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(outcomes.filter((r) => r.status === "rejected").length, 1);
  await assert.rejects(
    saveContent(clone(), "initial", true),
    /another session/,
  );
  assert.notEqual((await readState()).revision, "initial");
});
test("corrupt storage fails visibly instead of silently resetting portfolio content", async () => {
  await fs.writeFile(path.join(temporary, "content.json"), "{bad data");
  await assert.rejects(readPublished());
});
test("production sessions require configuration, expire, and reject tampering", () => {
  const now = Date.now();
  const token = auth.issueSession(now);
  assert.equal(auth.validSession(token, now), true);
  assert.equal(
    auth.validSession(token, now + auth.SESSION_SECONDS * 1000 + 1),
    false,
  );
  assert.equal(auth.validSession(token + "x", now), false);
  assert.equal(auth.passwordMatches("wrong"), false);
  assert.equal(auth.passwordMatches(process.env.CMS_PASSWORD), true);
  delete process.env.CMS_PASSWORD;
  assert.equal(auth.validSession(token, now), false);
  assert.equal(auth.localDevelopment("localhost:3000"), false);
});
test("configuration diagnostics trim values and identify incomplete settings", () => {
  process.env.CMS_PASSWORD = `  ${"p".repeat(24)}  `;
  process.env.CMS_SESSION_SECRET = `  ${"s".repeat(32)}  `;
  assert.deepEqual(auth.cmsConfiguration(), {
    ready: true,
    password: { loaded: true, length: 24, valid: true },
    sessionSecret: { loaded: true, length: 32, valid: true },
  });
  process.env.CMS_PASSWORD = "short";
  const incomplete = auth.cmsConfiguration();
  assert.equal(incomplete.ready, false);
  assert.deepEqual(incomplete.password, {
    loaded: true,
    length: 5,
    valid: false,
  });
});
test("development bypass is limited to localhost and is disabled when a password is set", () => {
  process.env.NODE_ENV = "development";
  delete process.env.CMS_PASSWORD;
  assert.equal(auth.localDevelopment("localhost:3000"), true);
  assert.equal(auth.localDevelopment("127.0.0.1:3000"), true);
  assert.equal(auth.localDevelopment("portfolio.example"), false);
  process.env.CMS_PASSWORD = "configured";
  assert.equal(auth.localDevelopment("localhost:3000"), false);
});
test("content API protects drafts and rejects cross-origin writes", async () => {
  assert.equal((await route.GET(request("GET"))).status, 401);
  assert.equal(
    (
      await route.PUT(
        request("PUT", {
          content: clone(),
          revision: "initial",
          action: "save",
        }),
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await route.PUT(
        request(
          "PUT",
          { content: clone(), revision: "initial", action: "publish" },
          { auth: true, origin: "https://evil.example" },
        ),
      )
    ).status,
    403,
  );
  assert.equal((await readState()).revision, "initial");
});
test("authenticated API supports save, conflict reporting, validation and publish", async () => {
  const draft = clone();
  draft.profile.intro = "An integration test";
  const saved = await route.PUT(
    request(
      "PUT",
      { content: draft, revision: "initial", action: "save" },
      { auth: true },
    ),
  );
  assert.equal(saved.status, 200);
  const state = await saved.json();
  assert.equal(
    (await readPublished()).profile.intro,
    defaultContent.profile.intro,
  );
  const stale = await route.PUT(
    request(
      "PUT",
      { content: draft, revision: "initial", action: "save" },
      { auth: true },
    ),
  );
  assert.equal(stale.status, 409);
  const invalid = clone();
  invalid.projects[0].githubUrl = "javascript:alert(1)";
  assert.equal(
    (
      await route.PUT(
        request(
          "PUT",
          { content: invalid, revision: state.revision, action: "publish" },
          { auth: true },
        ),
      )
    ).status,
    400,
  );
  const published = await route.PUT(
    request(
      "PUT",
      { content: draft, revision: state.revision, action: "publish" },
      { auth: true },
    ),
  );
  assert.equal(published.status, 200);
  assert.equal((await readPublished()).profile.intro, "An integration test");
  const get = await route.GET(request("GET", null, { auth: true }));
  assert.equal(get.headers.get("cache-control"), "no-store");
});
test("login issues secure HTTP-only cookies; logout expires the cookie; repeated failures are throttled", async () => {
  assert.equal(
    (
      await session.POST(
        request(
          "POST",
          { password: "wrong" },
          { origin: "https://evil.example" },
        ),
      )
    ).status,
    403,
  );
  const login = await session.POST(
    request("POST", { password: process.env.CMS_PASSWORD }),
  );
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=strict/i);
  const logout = await session.DELETE(request("DELETE"));
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/i);
  for (let i = 0; i < 5; i++)
    assert.equal(
      (await session.POST(request("POST", { password: "wrong" }))).status,
      401,
    );
  assert.equal(
    (await session.POST(request("POST", { password: "wrong" }))).status,
    429,
  );
});
