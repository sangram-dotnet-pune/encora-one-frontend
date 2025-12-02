import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Shield, MessageSquare, Clock, 
  Server, Database, Code2, Globe 
} from 'lucide-react';
import GlassNavbar from '../components/ui/GlassNavbar.jsx';

// --- TEAM DATA ---
const teamMembers = [
  {
    image: 'https://i.ibb.co/0jfgjrmm/Pics-Art-11-06-09-09-43.jpg',
    link: '#',
    title: 'Roshan Wadhai',
    description: 'Full Stack Developer'
  },
  {
    image: 'https://i.ibb.co/cn0mV02/IMG-20251202-WA0004.jpg',
    link: '#',
    title: 'Sangram Sankpal',
    description: 'Backend Developer'
  },
  {
    image: 'https://i.ibb.co/m5xXb1cP/IMG-20251202-WA0005.jpg',
    link: '#',
    title: 'Sujal Koli',
    description: 'Full Stack Developer'
  },
  {
    image: 'https://i.ibb.co/PGJQ23nj/YASH.png',
    link: '#',
    title: 'Yashraj Chavan',
    description: 'Frontend Developer'
  },
  {
    image: 'https://i.ibb.co/C3YbNZd2/IMG-20251202-WA0006.jpg',
    link: '#',
    title: 'Dipanshu Mandal',
    description: 'Frontend Developer'
  }
];

// --- INLINE COMPONENTS ---

// 1. Fixed Infinite Menu (Text On Top of Image)
const InfiniteMenu = ({ items }) => {
  return (
    <div className="relative flex w-full overflow-hidden mask-image-gradient">
      <motion.div
        className="flex gap-8 py-4"
        // Move -50% because we duplicate the items array
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 30, 
          ease: "linear", 
          repeat: Infinity 
        }}
        // Hover to pause scrolling
        whileHover={{ animationPlayState: "paused" }} 
      >
        {/* We double the items list to create the seamless loop */}
        {[...items, ...items].map((item, idx) => (
          <div 
            key={idx} 
            className="relative w-[300px] h-[450px] flex-shrink-0 rounded-3xl overflow-hidden group border border-white/10 shadow-2xl bg-slate-900"
          >
            {/* IMAGE - Z-Index 0 */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* GRADIENT OVERLAY - Z-Index 10 (Makes text readable) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />

            {/* TEXT CONTENT - Z-Index 20 (Sits on TOP of image) */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                {item.title}
              </h3>
              <p className="text-violet-400 font-medium tracking-wide text-sm drop-shadow-md bg-violet-500/10 inline-block px-2 py-1 rounded-md border border-violet-500/20 backdrop-blur-sm self-start">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-20 relative z-10">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
    >
      {subtitle}
    </motion.p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all group relative overflow-hidden backdrop-blur-sm"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} to-transparent transition-opacity duration-500`} />
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const TechCard = ({ title, stack, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md"
  >
    <div className="mb-4 p-4 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
      <Icon size={32} />
    </div>
    <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
    <p className="text-sm text-slate-500 font-mono">{stack}</p>
  </motion.div>
);

const AboutPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load the Spline Viewer script
    const scriptUrl = 'https://unpkg.com/@splinetool/viewer@1.12.5/build/spline-viewer.js';
    
    // Check if script already exists to prevent duplicate loading
    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = scriptUrl;
      script.onload = () => {
        // Add a slight delay to allow the canvas to initialize before fading in
        setTimeout(() => setIsLoaded(true), 500);
      };
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      <GlassNavbar />
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
        
        {/* 1. Spline 3D Viewer Background (Hero) */}
        <div className={`absolute inset-x-0 top-0 h-[115%] z-0 transition-all duration-[1500ms] ease-out transform ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-lg'}`}>
          <spline-viewer 
            url="https://prod.spline.design/PXx275Yj23goXwsK/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* 2. Hero Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 pb-20 pointer-events-none">
          <div className="pointer-events-auto max-w-3xl mx-auto text-center space-y-3">
            
            <motion.h1 
              initial={{ opacity: 0, y: 30, letterSpacing: '0em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-3xl md:text-5xl font-black uppercase text-white"
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Transparency.
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                Accountability.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex items-center justify-center gap-3 text-xs md:text-sm font-mono text-violet-300/80 uppercase tracking-[0.3em] mt-4"
            >
              <span>System</span>
              <span className="w-1 h-1 bg-violet-500 rounded-full animate-pulse" />
              <span>Culture</span>
              <span className="w-1 h-1 bg-violet-500 rounded-full animate-pulse" />
              <span>Shift</span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 2. MEET THE TEAM (INFINITE MENU) */}
      <section className="py-32 relative bg-[#080808] border-t border-white/5">
           <SectionHeader 
            title="Meet The Team" 
            subtitle="The minds behind the magic of EncoraOne."
          />
          {/* The Infinite Menu Container */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
              <InfiniteMenu items={teamMembers} />
          </div>
      </section>

      {/* 3. THE STORY */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-red-400 mb-6">The Old Way</h3>
              <div className="space-y-6 border-l-2 border-red-500/20 pl-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Lost in Inbox</h4>
                  <p className="text-slate-400">Emails get buried. Complaints go unnoticed for weeks, leading to employee frustration and disengagement.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Zero Visibility</h4>
                  <p className="text-slate-400">"Did they see my email?" Employees are left guessing about the status of their critical issues.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-emerald-400 mb-6">The EncoraOne Way</h3>
              <div className="space-y-6 border-l-2 border-emerald-500/20 pl-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Automated & Instant</h4>
                  <p className="text-slate-400">Tickets are instantly routed to the right manager. SLAs ensure no issue is ignored.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Real-Time Dialogue</h4>
                  <p className="text-slate-400">Built-in chat allows for immediate clarification, closing the loop faster than ever.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. UNIQUE FEATURES */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Built Different." 
            subtitle="We focused on features that actually drive resolution, not just data entry."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={MessageSquare} 
              title="Real-Time Chat" 
              desc="Integrated discussion threads allow employees and managers to communicate directly within the ticket context."
              color="from-violet-600"
              delay={0.1}
            />
            <FeatureCard 
              icon={Shield} 
              title="Role-Based Security" 
              desc="Granular JWT-based access control ensures strict data privacy between Employees, Managers, and Admins."
              color="from-blue-600"
              delay={0.2}
            />
            <FeatureCard 
              icon={Zap} 
              title="Automated Escalation" 
              desc="Smart workflows automatically flag overdue tickets to higher management to prevent bottlenecks."
              color="from-amber-500"
              delay={0.3}
            />
            <FeatureCard 
              icon={Clock} 
              title="Fast Resolution" 
              desc="Streamlined UI/UX designed to minimize clicks and maximize speed for busy managers."
              color="from-emerald-500"
              delay={0.4}
            />
            <FeatureCard 
              icon={Globe} 
              title="Multi-Department" 
              desc="Scalable architecture that supports IT, HR, Admin, and Finance workflows in a single portal."
              color="from-pink-500"
              delay={0.5}
            />
            <FeatureCard 
              icon={Database} 
              title="Audit Ready" 
              desc="Every action, status change, and comment is logged permanently for full accountability."
              color="from-cyan-500"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* 5. TECH STACK */}
      <section className="py-32 px-6 border-t border-white/10 bg-[#080808]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-16 drop-shadow-lg">Powered By Modern Engineering</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TechCard title="Frontend" stack="React + Tailwind + Framer" icon={Code2} />
            <TechCard title="Backend API" stack=".NET 8 Core Web API" icon={Server} />
            <TechCard title="Database" stack="SQL Server + EF Core" icon={Database} />
            <TechCard title="Real-Time" stack="SignalR WebSockets" icon={Zap} />
          </div>
        </div>
      </section>

      {/* 6. BOTTOM ROBOT VISUAL SECTION + FOOTER TEXT OVERLAY */}
      <div className="relative w-full h-[600px] overflow-hidden bg-[#050505] border-t border-white/5">
          
          {/* Spline Viewer Container - Scaled to hide watermark */}
          <div className={`absolute inset-x-0 top-0 h-[120%] transition-all duration-[2000ms] ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'}`}>
            <spline-viewer 
              url="https://prod.spline.design/a6XkQdgy5sjlsweN/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
        </div>

        {/* Vignette to blend edges */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient-fade" />

        {/* COPYRIGHT OVERLAY */}
        <div className="absolute bottom-10 inset-x-0 z-20 pointer-events-none flex justify-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em] opacity-80 mix-blend-screen">
                &copy; 2025 EncoraOne. Transforming Workplaces.
            </p>
        </div>
      </div>

      <style>{`
        .bg-radial-gradient-fade {
            background: radial-gradient(circle at center, transparent 0%, #050505 100%);
            opacity: 0.4;
        }
      `}</style>

    </div>
  );
};

export default AboutPage;