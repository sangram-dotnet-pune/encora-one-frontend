import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, MapPin, Globe } from 'lucide-react';

const ContactCard = ({ icon: Icon, title, value, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group cursor-pointer"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-violet-500/20">
      <Icon className="text-violet-400" size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-0.5">{title}</p>
      <p className="text-slate-200 font-medium text-lg group-hover:text-white transition-colors">{value}</p>
    </div>
  </motion.div>
);

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-[#050505] relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: INFO */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Get in touch with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Admin Support
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-lg mb-10 leading-relaxed"
            >
              Facing technical issues with the portal or need to report a critical bug? Our support team is ready to assist you.
            </motion.p>

            <div className="space-y-4">
              <ContactCard icon={Mail} title="Email Support" value="support@encoraone.com" delay={0.2} />
              <ContactCard icon={Phone} title="Helpline" value="+1 (555) 000-1234" delay={0.3} />
              <ContactCard icon={MapPin} title="HQ Office" value="Silicon Valley, CA" delay={0.4} />
            </div>
          </div>

          {/* RIGHT: FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative Gradient Blob behind form */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur opacity-20 animate-pulse" />
            
            <div className="relative bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="IT / HR" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="john@encora.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                  <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none" placeholder="How can we help you?" />
                </div>

                <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group">
                  Send Message 
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;