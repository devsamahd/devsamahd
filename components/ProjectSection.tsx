"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink, Github } from "lucide-react";

// Define the shape of your JSON data
interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

export const ProjectSection = ({ projects }: { projects: Project[] }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section id="projects" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex items-center gap-4 mb-12"
      >
        <h2 className="text-3xl font-bold text-zinc-100">Featured Work</h2>
        <div className="h-px bg-zinc-800 flex-1 ml-4" />
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            variants={item}
            className="group relative flex flex-col justify-between bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 hover:border-emerald-500/30 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300"
          >
            {/* Top Icons */}
            <div className="flex justify-between items-center mb-6 text-zinc-400 group-hover:text-emerald-400 transition-colors">
              <FolderGit2 size={32} strokeWidth={1.5} />
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <Github size={20} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-emerald-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <ul className="flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
              {project.techStack.map((tech, i) => (
                <li key={i} className="bg-zinc-950/50 px-2 py-1 rounded-md border border-white/5">
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};