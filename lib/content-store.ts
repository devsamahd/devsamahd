import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  defaultContent,
  validateContent,
  type ContentState,
  type PortfolioContent,
} from "./content";

const directory = () =>
  process.env.CMS_DATA_DIR || path.join(process.cwd(), "data", "cms");
export class StoreError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function readState(): Promise<ContentState> {
  try {
    const state = JSON.parse(
      await readFile(path.join(directory(), "content.json"), "utf8"),
    );
    return {
      ...state,
      published: validateContent(state.published),
      draft: validateContent(state.draft),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      return {
        draft: defaultContent,
        published: defaultContent,
        revision: "initial",
        publishedAt: null,
      };
    throw error;
  }
}
export async function readPublished(): Promise<PortfolioContent> {
  return (await readState()).published;
}
export async function saveContent(
  content: unknown,
  revision: string,
  publish: boolean,
): Promise<ContentState> {
  const validated = validateContent(content);
  const dir = directory();
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const lock = path.join(dir, ".write-lock");
  try {
    await mkdir(lock);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST")
      throw new StoreError(
        "Another save is in progress. Please retry in a moment.",
        409,
      );
    throw error;
  }
  const temporary = path.join(dir, `.${randomUUID()}.tmp`);
  try {
    const current = await readState();
    if (current.revision !== revision)
      throw new StoreError(
        "Content changed in another session. Export your edits, then reload before saving.",
        409,
      );
    const next = {
      draft: validated,
      published: publish ? validated : current.published,
      revision: randomUUID(),
      publishedAt: publish ? new Date().toISOString() : current.publishedAt,
    };
    await writeFile(temporary, JSON.stringify(next, null, 2) + "\n", {
      mode: 0o600,
    });
    await rename(temporary, path.join(dir, "content.json"));
    return next;
  } finally {
    await rm(temporary, { force: true });
    await rm(lock, { recursive: true, force: true });
  }
}
