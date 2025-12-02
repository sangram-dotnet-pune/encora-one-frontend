import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How are complaints assigned?",
    answer: "Our intelligent routing engine automatically assigns tickets based on the selected department (e.g., IT, HR). Critical issues that remain pending are auto-escalated to Administrators after 48 hours to ensure swift resolution."
  },
  {
    question: "Who can see my grievance data?",
    answer: "Privacy is paramount. We use strict Role-Based Access Control (RBAC). Employees can only see their own tickets. Managers can only view tickets within their specific department. Only Super Admins have system-wide visibility for auditing purposes."
  },
  {
    question: "Can I track the progress of my ticket?",
    answer: "Absolutely. Your dashboard updates in real-time via SignalR. You will see status changes (Pending → In Progress → Resolved) instantly, and receive notifications whenever a manager adds a comment or requests more information."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`border border-white/10 rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-white/[0.03] border-violet-500/50' : 'bg-transparent hover:bg-white/[0.02]'}`}
    >
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-violet-300' : 'text-slate-200'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-full ${isOpen ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-slate-400'}`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-slate-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-sm font-bold mb-6">
            <HelpCircle size={16} /> FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Common Questions
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about the grievance process.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              index={index}
              question={faq.question} 
              answer={faq.answer} 
              isOpen={openIndex === index} 
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;