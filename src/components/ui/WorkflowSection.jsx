import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus, UserCheck, BarChart3, MessageSquare, ChevronRight, ChevronDown } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Raise Ticket",
    description: "Submit issues instantly with priority tagging.",
    icon: FilePlus,
    color: "from-blue-500 to-blue-600",
    shadow: "group-hover:shadow-blue-500/20",
    iconColor: "text-blue-400",
    arrowColor: "text-blue-500", // Color for the glowing arrow
    glowColor: "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
  },
  {
    id: 2,
    title: "Manager Review",
    description: "Auto-routing to heads for quick approval.",
    icon: UserCheck,
    color: "from-violet-500 to-violet-600",
    shadow: "group-hover:shadow-violet-500/20",
    iconColor: "text-violet-400",
    arrowColor: "text-violet-500",
    glowColor: "drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
  },
  {
    id: 3,
    title: "System Oversight",
    description: "Real-time SLA tracking for admins.",
    icon: BarChart3,
    color: "from-fuchsia-500 to-fuchsia-600",
    shadow: "group-hover:shadow-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
    arrowColor: "text-fuchsia-500",
    glowColor: "drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
  },
  {
    id: 4,
    title: "Resolution",
    description: "Collaborate and close via built-in chat.",
    icon: MessageSquare,
    color: "from-emerald-500 to-emerald-600",
    shadow: "group-hover:shadow-emerald-500/20",
    iconColor: "text-emerald-400",
    arrowColor: "text-emerald-500",
    glowColor: "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
  }
];

// Sub-component for the glowing animated arrows
const GlowingArrow = ({ color, glow, isVertical = false }) => {
  return (
    <div className={`flex ${isVertical ? 'flex-col -space-y-4' : '-space-x-4'} items-center justify-center`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2, // Staggered delay creates the "traveling" effect
            ease: "easeInOut"
          }}
          className={`${color} ${glow}`}
        >
          {isVertical ? <ChevronDown size={32} strokeWidth={3} /> : <ChevronRight size={32} strokeWidth={3} />}
        </motion.div>
      ))}
    </div>
  );
};

const WorkflowSection = () => {
  return (
    <section className="py-24 bg-[#050505] text-white overflow-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Streamlined <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Process</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            From initiation to completion, our intelligent workflow keeps your team in sync.
          </motion.p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 relative">
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                
                {/* --- CARD --- */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`
                    group relative flex-1 min-w-[240px]
                    bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden
                    hover:-translate-y-2 transition-all duration-300
                    ${step.shadow} hover:shadow-2xl hover:border-white/20
                    z-10
                  `}
                >
                  {/* Top Color Bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${step.color}`} />

                  <div className="p-8 flex flex-col items-center text-center lg:items-start lg:text-left h-full">
                    
                    {/* Icon Container */}
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                      <div className={`relative w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${step.iconColor}`}>
                        <Icon size={28} />
                      </div>
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                        0{step.id}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Hover Glow Effect inside card */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
                </motion.div>

                {/* --- ANIMATED GLOWING ARROWS --- */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center py-4 lg:py-0 relative z-0">
                    {/* Desktop Horizontal Arrows */}
                    <div className="hidden lg:block mx-2">
                        <GlowingArrow color={step.arrowColor} glow={step.glowColor} isVertical={false} />
                    </div>

                    {/* Mobile Vertical Arrows */}
                    <div className="lg:hidden my-2">
                        <GlowingArrow color={step.arrowColor} glow={step.glowColor} isVertical={true} />
                    </div>
                  </div>
                )}
                
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;