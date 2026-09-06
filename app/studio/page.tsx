import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { Studio } from "../../components/Studio";
import { StudioLogin } from "../../components/StudioLogin";
import {
  cmsConfiguration,
  localDevelopment,
  SESSION_COOKIE,
  validSession,
} from "../../lib/cms-auth";
import { readState } from "../../lib/content-store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio | Abdulsamad",
  robots: { index: false, follow: false },
};
export default async function StudioPage() {
  const local = localDevelopment((await headers()).get("host"));
  const signedIn = validSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!local && !signedIn)
    return <StudioLogin configuration={cmsConfiguration()} />;
  return <Studio initialState={await readState()} local={local} />;
}
