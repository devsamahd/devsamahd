"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

export const FloatingSidebars = () => {
  return (
    <>
      {/* Left Side - Socials */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="hidden md:flex flex-col items-center fixed bottom-0 left-10 z-10 gap-6 after:content-[''] after:w-px after:h-24 after:bg-zinc-800"
      >
        <a href="#" className="text-zinc-400 hover:text-emerald-400 hover:-translate-y-1 transition-all"><Github size={20} /></a>
        <a href="#" className="text-zinc-400 hover:text-emerald-400 hover:-translate-y-1 transition-all"><Linkedin size={20} /></a>
        <a href="#" className="text-zinc-400 hover:text-emerald-400 hover:-translate-y-1 transition-all"><Twitter size={20} /></a>
      </motion.div>

      {/* Right Side - Email */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="hidden md:flex flex-col items-center fixed bottom-0 right-10 z-10 gap-6 after:content-[''] after:w-px after:h-24 after:bg-zinc-800"
      >
        <a 
          href="mailto:Devsamahd@gmail.com" 
          className="text-zinc-400 hover:text-emerald-400 hover:-translate-y-1 transition-all font-mono text-xs tracking-widest"
          style={{ writingMode: 'vertical-rl' }}
        >
          Devsamahd@gmail.com
        </a>
      </motion.div>
    </>
  );
};