
import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Database, Server, Cloud, Zap, Layout, Box, ShieldCheck
} from 'lucide-react';
 
const techs = [
  { name: ".NET 8", icon: Server, color: "text-purple-500" },
  { name: "React", icon: Code2, color: "text-cyan-400" },
  { name: "SQL Server", icon: Database, color: "text-red-500" },
  { name: "SignalR", icon: Zap, color: "text-blue-400" },
  { name: "Tailwind", icon: Layout, color: "text-teal-400" },
  // { name: "Azure", icon: Cloud, color: "text-blue-600" },
  { name: "EF Core", icon: Box, color: "text-indigo-500" },
  { name: "JWT Auth", icon: ShieldCheck, color: "text-yellow-400" },
];
 
const LogoWall = () => {
  // Tripling the array ensures smooth continuity on ultra-wide screens
  const marqueeItems = [...techs, ...techs, ...techs];
 
  return (
    <section className="py-24 bg-[#050505] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-16 text-center">
        <h3 className="text-xl font-mono text-gray-500 uppercase tracking-[0.2em]">
          Powering The Platform
        </h3>
      </div>
 
      <div className="relative w-full overflow-hidden">
        {/* Left/Right Fade Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
 
        <div className="flex">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-33.33%" }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity
            }}
            className="flex flex-none gap-16 pr-16 items-center"
          >
            {marqueeItems.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col items-center gap-4 justify-center min-w-[120px] cursor-default"
                >
                  <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors duration-300 group-hover:bg-white/[0.05]`}>
                    <Icon
                      size={40}
                      className={`${tech.color} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 group-hover:text-white transition-colors duration-300">
                    {tech.name}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
 
export default LogoWall;
 
 