"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    id: 1,
    role: "Senior Backend Engineer",
    company: "Web3 Startup",
    date: "2024 - Present",
    desc: "Architected high-throughput microservices in Go. Integrated smart contracts with the backend infrastructure handling $5M+ in daily volume.",
  },
  {
    id: 2,
    role: "Fullstack Developer",
    company: "AI Solutions Inc",
    date: "2022 - 2024",
    desc: "Built RAG pipelines connecting OpenAI's LLMs with enterprise vector databases. Reduced query latency by 40% through Redis caching.",
  },
  {
    id: 3,
    role: "Software Engineer",
    company: "Tech Agency",
    date: "2020 - 2022",
    desc: "Developed and maintained RESTful APIs using Node.js and Express. Migrated legacy PHP codebases to modern TypeScript architectures.",
  }
];

export const Experience = () => {
  const containerRef = useRef(null);
  
  // Track how far the user has scrolled through this specific component
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Map the scroll progress (0 to 1) to the height of the line (0% to 100%)
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 relative" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-16"
      >
        <h2 className="text-3xl font-bold text-zinc-100">Where I've Built</h2>
        <div className="h-px bg-zinc-800 flex-1 ml-4" />
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {/* The glowing background line (static) */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2" />
        
        {/* The animated line that draws on scroll */}
        <motion.div 
          style={{ height: lineHeight }}
          className="absolute left-8 md:left-1/2 top-0 w-px bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] -translate-x-1/2 origin-top"
        />

        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 last:mb-0">
              
              {/* The Icon Node */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-zinc-950 border-2 border-zinc-700 group-hover:border-emerald-500 -translate-x-1/2 flex items-center justify-center z-10 transition-colors duration-300"
              >
                <Briefcase size={16} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
              </motion.div>

              {/* The Content Card */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 bg-zinc-900/40 border border-white/5 hover:border-white/10 p-6 rounded-2xl backdrop-blur-sm"
              >
                <span className="text-emerald-400 font-mono text-xs mb-2 block">{exp.date}</span>
                <h3 className="text-xl font-bold text-zinc-100">{exp.role}</h3>
                <h4 className="text-md font-medium text-zinc-500 mb-4">{exp.company}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{exp.desc}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};