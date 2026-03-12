"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export const HeroSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-3xl"
    >
      <motion.div variants={item as any} className="flex items-center gap-2 text-emerald-400 font-mono text-sm mb-5">
        <Terminal size={16} />
        <span>System.out.println("Hello, World");</span>
      </motion.div>

      <motion.h1 variants={item as any} className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-100 mb-6">
        Abdulsamad.
        <br />
        <span className="text-zinc-500">I architect scalable systems.</span>
      </motion.h1>

      <motion.p variants={item as any} className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed">
        I'm a Fullstack Software Engineer with a deep focus on backend infrastructure. 
        I build high-performance APIs, integrate intelligent AI models, and develop decentralized Web3 applications.
      </motion.p>

      <motion.div variants={item as any} className="flex flex-wrap items-center gap-4">
        <a 
          href="#projects" 
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-3 rounded-xl font-medium transition-colors"
        >
          View Projects <ArrowRight size={16} />
        </a>
        <a 
          href="https://github.com/yourgithub" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-300 px-6 py-3 rounded-xl font-medium transition-all"
        >
          GitHub
        </a>
      </motion.div>
    </motion.section>
  );
};