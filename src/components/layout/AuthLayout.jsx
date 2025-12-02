import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
 
const AuthLayout = ({ children, title, subtitle }) => {
    const [isLoaded, setIsLoaded] = useState(false);
 
    useEffect(() => {
        // Dynamically load the Spline Viewer script
        const scriptUrl = 'https://unpkg.com/@splinetool/viewer@1.12.5/build/spline-viewer.js';
       
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = scriptUrl;
            script.onload = () => {
                // Delay showing the canvas slightly to prevent "pop-in"
                setTimeout(() => setIsLoaded(true), 500);
            };
            document.body.appendChild(script);
        } else {
            setIsLoaded(true);
        }
    }, []);
 
    return (
        <div className="min-h-screen relative w-full overflow-hidden bg-[#050505] font-sans text-white selection:bg-violet-500 selection:text-white flex items-center justify-center">
           
            {/* --- BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0">
                {/* Ambient Glows for Atmosphere */}
                <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
               
                                {/* Spline Viewer - Full Screen Background with Dramatic Entrance */}
                <div className={`absolute inset-x-0 top-0 h-[120%] transition-all duration-[1500ms] ease-out transform ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-lg'}`}>
                     {/* UPDATED SPLINE URL HERE */}
                     <spline-viewer
                        url="https://prod.spline.design/SNzyYbJwaar5fagc/scene.splinecode"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
 
                {/* Vignette Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-radial-gradient-fade pointer-events-none" />
            </div>
 
            {/* --- CONTENT LAYER --- */}
            {/* Moved form little left by reducing right padding from lg:pr-24 to lg:pr-8 */}
            <div className="relative z-10 w-full h-screen flex items-center justify-center lg:justify-end p-4 lg:pr-8">
               
                {/* Right Aligned Auth Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }} // Increased delay slightly to wait for spline
                    className="w-full max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] border border-white/10"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h2>
                        <p className="text-slate-400 text-sm">{subtitle}</p>
                    </div>
                   
                    {children}
                </motion.div>
            </div>
 
            {/* Custom Styles for Gradient Overlay */}
            <style>{`
                .bg-radial-gradient-fade {
                    background: radial-gradient(circle at center, transparent 0%, #050505 90%);
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
};
 
export default AuthLayout;