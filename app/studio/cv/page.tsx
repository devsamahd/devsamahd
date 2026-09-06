import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { CvStudio } from "../../../components/CvStudio";
import { StudioLogin } from "../../../components/StudioLogin";
import {
  cmsConfiguration,
  localDevelopment,
  SESSION_COOKIE,
  validSession,
} from "../../../lib/cms-auth";
import { readCvState } from "../../../lib/cv-store";
import { tailoringConfigured } from "../../../lib/cv-tailor";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "CV workspace | Studio",
  robots: { index: false, follow: false },
};
export default async function CvPage() {
  const local = localDevelopment((await headers()).get("host"));
  if (!local && !validSession((await cookies()).get(SESSION_COOKIE)?.value))
    return <StudioLogin configuration={cmsConfiguration()} />;
  return (
    <CvStudio
      initial={await readCvState()}
      tailoringAvailable={tailoringConfigured()}
    />
  );
}
