import { Portfolio } from "../components/Portfolio";
import { readPublished } from "../lib/content-store";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const { profile } = await readPublished();
  return {
    title: `${profile.name} | ${profile.role}`,
    description: profile.intro,
  };
}
export default async function Home() {
  return <Portfolio content={await readPublished()} />;
}
