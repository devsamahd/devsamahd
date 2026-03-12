"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Arsenal", href: "#arsenal" },
  { name: "Experience", href: "#experience" },
  { name: "Work", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll to trigger the glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Framer Motion variants for the staggered fade-in on load
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/80 backdrop-blur-md border-b border-white/5 shadow-lg py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* 📌 Logo */}
        <motion.div 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  transition={{ duration: 0.5 }}
  className="relative group cursor-pointer"
>
  <a href="/" className="flex items-center gap-4">
    
    {/* The Technical "A" Mark */}
    <div className="relative w-7 h-8 flex items-end">
      
      {/* 📌 Left Leg (Pillar) */}
      {/* <div className="absolute left-0 bottom-0 w-[4px] h-full bg-zinc-100 rounded-full group-hover:bg-zinc-300 transition-colors duration-300"></div> */}
      
      {/* 📌 Right Leg (Forward Slash) */}
      {/* <div className="absolute left-[2px] top-0 w-[4px] h-[110%] bg-emerald-500 rounded-full rotate-[30deg] origin-top-left shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-300"></div> */}
      
      {/* 📌 Crossbar (Blivking Underscore) */}
      <div className="absolute -right-2
       bottom-2 w-3 h-[4px] bg-zinc-400 group-hover:bg-emerald-300 rounded-full animate-pulse transition-colors duration-300"></div>
    </div>

    {/* The Name (Typography) */}
    <span className="text-lg font-medium font-sans tracking-[0.2em] uppercase text-zinc-100 transition-colors duration-300 group-hover:text-emerald-100">
      DS
    </span>
  </a>
</motion.div>

        {/* 📌 Desktop Navigation */}
        <motion.nav 
          variants={navVariants}
          initial="hidden"
          animate="show"
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              variants={itemVariants as any}
              className="text-sm font-mono text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <span className="text-emerald-500/50 text-xs">0{i + 1}.</span>
              {link.name}
            </motion.a>
          ))}

          {/* Resume Button */}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants as any}
            className="px-4 py-2 text-sm font-mono text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/10 transition-colors"
          >
            Resume
          </motion.a>
        </motion.nav>

        {/* 📌 Mobile Menu Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden text-zinc-300 hover:text-emerald-400 transition-colors p-2 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

      </div>

      {/* 📌 Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-zinc-950/90 z-40 flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-medium text-zinc-300 hover:text-emerald-400 transition-colors flex flex-col items-center gap-2"
                >
                  <span className="text-emerald-500 font-mono text-sm">0{i + 1}.</span>
                  {link.name}
                </motion.a>
              ))}
              
              <motion.a
                href="/resume.pdf"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 px-8 py-4 text-lg font-mono text-emerald-400 border border-emerald-500/50 rounded-xl hover:bg-emerald-500/10 transition-colors"
              >
                Resume
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};