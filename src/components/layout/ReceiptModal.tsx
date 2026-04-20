"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  X, 
  Receipt as ReceiptIcon,
  ShieldCheck,
  Calendar,
  CreditCard,
  User
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReceiptProps {
  transactionId: string;
  amount: number;
  date: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  status: "SUCCESS" | "PENDING";
  onClose: () => void;
}

export function ReceiptModal({ 
  transactionId, 
  amount, 
  date, 
  customerName, 
  customerEmail, 
  itemName, 
  status,
  onClose 
}: ReceiptProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-accent-primary to-emerald-500" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="p-10 md:p-12 space-y-8 print:p-0">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Successful!</h2>
              <p className="text-slate-500 font-medium">Your digital receipt is ready.</p>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner">
            <div className="p-8 space-y-6">
              {/* Item Details */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction for</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{itemName}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</p>
                  <p className="text-2xl font-black text-emerald-600 tracking-tighter">{formatCurrency(amount)}</p>
                </div>
              </div>

              <div className="h-px bg-slate-200/50 w-full" />

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <DetailItem 
                  icon={ReceiptIcon} 
                  label="Transaction ID" 
                  value={transactionId.slice(-10).toUpperCase()} 
                />
                <DetailItem 
                  icon={Calendar} 
                  label="Date" 
                  value={new Date(date).toLocaleDateString()} 
                />
                <DetailItem 
                  icon={User} 
                  label="Customer" 
                  value={customerName || "Student"} 
                />
                <DetailItem 
                  icon={CreditCard} 
                  label="Method" 
                  value="Razorpay / UPI" 
                />
              </div>

              <div className="h-px bg-slate-200/50 w-full" />

              {/* Trust Badge */}
              <div className="flex items-center gap-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">
                  Verified Payment • Secure Transaction
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 no-print">
            <button 
              onClick={handlePrint}
              className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group active:scale-95"
            >
              <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Print Receipt
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Done
            </button>
          </div>
          
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] no-print">
            A confirmation email has been sent to {customerEmail}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      </div>
      <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
