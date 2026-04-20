"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
    badge?: string;
  }[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-5 flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 font-bold text-xs group-hover:bg-accent-primary group-hover:text-white transition-colors">
                {idx + 1}
              </span>
              <span className="font-black text-slate-900 tracking-tight">{item.title}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-lg bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-wider border border-accent-primary/20">
                  {item.badge}
                </span>
              )}
            </div>
            {openIndex === idx ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 pt-0 border-t border-slate-50 mt-2">
                  <div className="pt-4 text-slate-600 font-medium">
                    {item.content}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
