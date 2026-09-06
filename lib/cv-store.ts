import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { initialCvState, validateWorkspace, type CvState } from "./cv";
import { readPublished, StoreError } from "./content-store";
const directory = () =>
  process.env.CMS_DATA_DIR || path.join(process.cwd(), "data", "cms");
export async function readCvState(): Promise<CvState> {
  try {
    const saved = JSON.parse(
      await readFile(path.join(directory(), "cv.json"), "utf8"),
    );
    return {
      ...validateWorkspace(saved),
      revision: saved.revision,
      savedAt: saved.savedAt,
    };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT")
      return initialCvState(await readPublished());
    throw e;
  }
}
export async function saveCvState(
  input: unknown,
  revision: string,
): Promise<CvState> {
  const workspace = validateWorkspace(input),
    dir = directory();
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const lock = path.join(dir, ".cv-write-lock");
  try {
    await mkdir(lock);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "EEXIST")
      throw new StoreError(
        "Another CV save is running. Retry in a moment.",
        409,
      );
    throw e;
  }
  const temp = path.join(dir, `.cv-${randomUUID()}.tmp`);
  try {
    const current = await readCvState();
    if (current.revision !== revision)
      throw new StoreError(
        "Your CV changed in another session. Download a backup of these edits before reloading.",
        409,
      );
    const next = {
      ...workspace,
      revision: randomUUID(),
      savedAt: new Date().toISOString(),
    };
    await writeFile(temp, JSON.stringify(next, null, 2) + "\n", {
      mode: 0o600,
    });
    await rename(temp, path.join(dir, "cv.json"));
    return next;
  } finally {
    await rm(temp, { force: true });
    await rm(lock, { recursive: true, force: true });
  }
}
