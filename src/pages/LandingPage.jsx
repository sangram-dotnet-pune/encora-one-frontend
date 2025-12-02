import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoWall from '../components/ui/LogoWall.jsx';
import MagicBento from '../components/ui/MagicBento.jsx';
import WorkflowSection from '../components/ui/WorkflowSection.jsx';
import FAQSection from '../components/ui/FAQSection.jsx';
import ContactSection from '../components/ui/ContactSection.jsx';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
        
        {/* 1. Spline 3D Viewer Background */}
        {/* h-[115%] makes the viewer taller than the screen.
            The parent overflow-hidden cuts off the bottom 15%, hiding the watermark.
        */}
        <div className={`absolute inset-x-0 top-0 h-[115%] z-0 transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <spline-viewer 
            url="https://prod.spline.design/NjhQZrr-TURGcEFS/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* 2. The Hero Content Overlay (Bottom Positioned) */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full px-4 text-center pointer-events-none pb-24">
          
          {/* 'pointer-events-auto' allows interaction with the buttons */}
          <div className={`pointer-events-auto flex flex-col items-center gap-6 transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Minimalist Tagline */}
            <div className="space-y-2 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                    Next Gen Intelligence
                </h2>
                <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">
                    Automate. Optimize. Dominate.
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ArrowRight size={18} />
                </span>
              </button>
              
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-all hover:border-white/20"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* --- TECH STACK LOGO WALL --- */}
      <LogoWall />

      {/* --- FEATURES SECTION (MAGIC BENTO) --- */}
      <section id="features" className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
               Why Choose Us?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A powerful suite of tools built for scalability and ease of use.
            </p>
          </div>

          <div className="flex justify-center">
            <MagicBento />
          </div>

        </div>
      </section>

      {/* --- WORKFLOW SECTION --- */}
      <WorkflowSection />

      {/* --- FAQ SECTION --- */}
      <FAQSection />

      {/* --- CONTACT SECTION --- */}
      <ContactSection />

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 EncoraOne. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;