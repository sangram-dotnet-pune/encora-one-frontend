import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { 
  FileText, ShieldCheck, Bell, BarChart3, 
  Ticket, MessageSquare, UploadCloud, Building2, Zap 
} from 'lucide-react';

/**
 * 3D Tilt & Spotlight Card Component
 */
const BentoCard = ({ children, className = "", spotlightColor = "rgba(124, 58, 237, 0.15)" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      className={`group relative border border-white/10 bg-neutral-900/50 overflow-hidden ${className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Content Layer */}
      <div className="relative h-full">{children}</div>
      
      {/* Animated Border Gradient on Hover */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500" />
    </motion.div>
  );
};

/**
 * Header for each card
 */
const CardHeader = ({ title, description, icon: Icon, colorClass }) => (
  <div className="flex flex-col h-full p-6 sm:p-8 z-10 relative">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass} bg-opacity-10 backdrop-blur-md border border-white/5`}>
      <Icon size={24} className="text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
  </div>
);

/**
 * Decorative Background Patterns
 */
const GridPattern = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
    <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
  </div>
);

const GlowingOrb = ({ color }) => (
  <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] opacity-20 ${color}`} />
);

const MagicBento = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      
      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. MAIN FEATURE: Create & Track Complaints (8 cols, 2 rows) */}
        <BentoCard className="md:col-span-6 lg:col-span-8 row-span-2 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950">
          <GridPattern />
          <GlowingOrb color="bg-violet-600" />
          <div className="flex flex-col md:flex-row h-full items-center">
            <div className="flex-1 p-8 sm:p-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-6">
                  <Zap size={12} /> CORE ENGINE
               </div>
               <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Create & Track Complaints</h3>
               <p className="text-neutral-400 text-lg mb-8 max-w-md">
                 A streamlined workflow for logging grievances. Track status changes from "Pending" to "Resolved" with complete transparency at every step.
               </p>
               
               {/* Mock UI Element */}
               <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/20 w-fit backdrop-blur-sm">
                  <div className="h-2 w-24 rounded-full bg-neutral-700 overflow-hidden">
                    <div className="h-full w-3/4 bg-violet-500 animate-pulse" />
                  </div>
                  <span className="text-xs text-violet-300 font-mono font-bold">STATUS: IN_PROGRESS</span>
               </div>
            </div>
            
            {/* Decorative Visual */}
            <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden opacity-60">
               <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10" />
               {/* Abstract data flow lines */}
               <svg className="absolute top-10 right-0 w-full h-full stroke-violet-500/20" viewBox="0 0 400 400">
                 <path d="M0,100 Q150,50 200,150 T400,100" fill="none" strokeWidth="2" />
                 <path d="M0,200 Q150,150 200,250 T400,200" fill="none" strokeWidth="2" />
                 <path d="M0,300 Q150,250 200,350 T400,300" fill="none" strokeWidth="2" />
               </svg>
            </div>
          </div>
        </BentoCard>

        {/* 2. SMART NOTIFICATIONS (4 cols, 2 rows) */}
        <BentoCard className="md:col-span-3 lg:col-span-4 row-span-2 rounded-3xl bg-neutral-900">
          <GlowingOrb color="bg-amber-500" />
          <CardHeader 
            icon={Bell}
            colorClass="bg-amber-500 text-amber-200"
            title="Smart Notifications"
            description="Instant real-time alerts via SignalR. Never miss a status update, new assignment, or urgent escalation."
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
        </BentoCard>

        {/* 3. DASHBOARD ANALYTICS (4 cols, 1 row) */}
        <BentoCard className="md:col-span-3 lg:col-span-4 row-span-1 rounded-3xl bg-neutral-900">
          <CardHeader 
            icon={BarChart3}
            colorClass="bg-emerald-500 text-emerald-200"
            title="Real-Time Analytics"
            description="Visualize trends, resolution rates, and department performance with interactive charts."
          />
        </BentoCard>

        {/* 4. ROLE-BASED ACCESS (4 cols, 1 row) */}
        <BentoCard className="md:col-span-3 lg:col-span-4 row-span-1 rounded-3xl bg-neutral-900">
          <CardHeader 
            icon={ShieldCheck}
            colorClass="bg-blue-500 text-blue-200"
            title="Role-Based Access"
            description="Secure Admin, Manager, and Employee portals with granular permissions using JWT."
          />
        </BentoCard>

        {/* 5. TICKET ASSIGNMENT (4 cols, 1 row) */}
        <BentoCard className="md:col-span-3 lg:col-span-4 row-span-1 rounded-3xl bg-neutral-900">
          <CardHeader 
            icon={Ticket}
            colorClass="bg-pink-500 text-pink-200"
            title="Ticket Assignment"
            description="Auto-route complaints to specific departments and escalate critical issues seamlessly."
          />
        </BentoCard>
        
        {/* 6. FILE ATTACHMENTS (4 cols, 1 row - Small) */}
         <BentoCard className="md:col-span-6 lg:col-span-4 row-span-1 rounded-3xl bg-neutral-900 flex items-center">
           <div className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <UploadCloud size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">File Attachments</h4>
                <p className="text-neutral-500 text-xs mt-1">Support evidence upload.</p>
              </div>
           </div>
        </BentoCard>

        {/* 7. MULTI-DEPARTMENT (4 cols, 1 row - Small) */}
        <BentoCard className="md:col-span-6 lg:col-span-4 row-span-1 rounded-3xl bg-neutral-900 flex items-center">
           <div className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">Multi-Department</h4>
                <p className="text-neutral-500 text-xs mt-1">Unified organizational support.</p>
              </div>
           </div>
        </BentoCard>

        {/* 8. CHAT SUPPORT (4 cols, 1 row - Small - NEW) */}
        <BentoCard className="md:col-span-6 lg:col-span-4 row-span-1 rounded-3xl bg-neutral-900 flex items-center">
           <div className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">Built-in Chat</h4>
                <p className="text-neutral-500 text-xs mt-1">Real-time discussions on tickets.</p>
              </div>
           </div>
        </BentoCard>
        
      </div>
    </div>
  );
};

export default MagicBento;