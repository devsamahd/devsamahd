// app/page.tsx

import { ContactFooter } from "../components/ContactFooter";
import { Experience } from "../components/Experience";
import { FloatingSidebars } from "../components/FloatingSidebars";
import { HeroSection } from "../components/HeroSection";
import { ProjectSection } from "../components/ProjectSection";
import { TechArsenal } from "../components/TechArsenal";

import projectsData from "../data/projects.json"; // 📌 Import your JSON data

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center">
      <FloatingSidebars />

      <div className="w-full max-w-5xl px-6 md:px-12 lg:px-24 mx-auto pt-32 pb-24 space-y-32">
        <HeroSection />
        <TechArsenal />
        <Experience />
        {/* 📌 2. Pass the JSON data straight to your component */}
        <ProjectSection projects={projectsData} />
        <ContactFooter />
      </div>
    </main>
  );
}