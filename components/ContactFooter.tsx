"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";

export const ContactFooter = () => {
  return (
    <motion.section 
      id="contact" 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="py-32 flex flex-col items-center justify-center text-center relative max-w-3xl mx-auto"
    >
      {/* 📌 Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-emerald-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

      {/* 📌 1. The Supertitle */}
      <motion.p 
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
        }}
        className="text-emerald-400 font-mono text-sm mb-4 tracking-widest uppercase"
      >
        04. What's Next?
      </motion.p>

      {/* 📌 2. The Massive Header */}
      <motion.h2 
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
        }}
        className="text-5xl md:text-7xl font-bold text-zinc-100 mb-8 tracking-tight"
      >
        Get In Touch
      </motion.h2>

      {/* 📌 3. The Pitch */}
      <motion.p 
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
        }}
        className="text-lg text-zinc-400 mb-12 max-w-xl leading-relaxed"
      >
        Although I’m currently building scalable systems and exploring the edges of Web3 and AI, my inbox is always open. Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!
      </motion.p>

      {/* 📌 4. The Magnetic / Glowing CTA Button */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.3 } }
        }}
      >
        <motion.a 
          href="mailto:Devsamahd@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-zinc-100 text-zinc-950 rounded-full font-bold text-lg overflow-hidden transition-all hover:bg-white"
        >
          <Mail size={20} className="group-hover:rotate-12 transition-transform" />
          Say Hello
          
          {/* Subtle swipe effect on hover */}
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </motion.a>
      </motion.div>

      {/* 📌 5. The Minimalist Bottom Bar */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 1, delay: 0.6 } }
        }}
        className="mt-32 w-full flex flex-col items-center gap-4 text-zinc-500 text-sm font-mono"
      >
        <div className="flex items-center gap-4">
          <a href="https://github.com/devsamahd" className="hover:text-emerald-400 transition-colors flex items-center gap-1">GitHub <ArrowUpRight size={14} /></a>
          <a href="https://linkedin.com/in/yourlinkedin" className="hover:text-emerald-400 transition-colors flex items-center gap-1">LinkedIn <ArrowUpRight size={14} /></a>
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <p>Built with Next.js & Framer Motion</p>
          <p className="text-xs text-zinc-600 mt-1">Based in Abuja, Nigeria • &copy; {new Date().getFullYear()}</p>
        </div>
      </motion.div>

    </motion.section>
  );
};