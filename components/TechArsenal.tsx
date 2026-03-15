"use client";

import { motion } from "framer-motion";

const techCategories = [
  {
    title: "Backend & Systems",
    skills: ["Go", "Node.js", "PostgreSQL", "MySQL", "MongoDB", "Kafka", "Redis", "Docker", "Kubernetes"],
  },
  {
    title: "Web3 & AI",
    skills: ["Solidity", "Ethers.js", "OpenAI API", "RAG", "LangChain", "Smart Contracts"],
  },
  {
    title: "Frontend & Mobile",
    skills: ["TypeScript", "Next.js", "React", "TailwindCSS", "Framer Motion", "SwiftUI","ChakraUI","Figma"],
  }
];

// Helper component for the continuous floating effect
const FloatingBadge = ({ children, delay }: { children: React.ReactNode, delay: number }) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay, // Stagger the floating so they don't move in unison
    }}
    className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full text-sm font-mono text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-crosshair backdrop-blur-md"
  >
    {children}
  </motion.div>
);

export const TechArsenal = () => {
  return (
    <section id="arsenal" className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-16"
      >
        <h2 className="text-3xl font-bold text-zinc-100">Technical Arsenal</h2>
        <div className="h-px bg-zinc-800 flex-1 ml-4" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {techCategories.map((category, catIndex) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.2 }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-lg font-medium text-zinc-100 border-b border-zinc-800 pb-2">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill, i) => (
                <FloatingBadge key={skill} delay={(catIndex * 0.5) + (i * 0.2)}>
                  {skill}
                </FloatingBadge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};