import { Portfolio } from "../components/Portfolio";
import { readPublished } from "../lib/content-store";
import { siteUrl } from "../lib/site";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const { profile } = await readPublished();
  return {
    title: `${profile.name} | ${profile.role}`,
    description: profile.intro,
    alternates: { canonical: "/" },
    openGraph: {
      title: `${profile.name} | ${profile.role}`,
      description: profile.intro,
      url: siteUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${profile.name} | ${profile.role}`,
      description: profile.intro,
    },
  };
}
export default async function Home() {
  return <Portfolio content={await readPublished()} />;
}
