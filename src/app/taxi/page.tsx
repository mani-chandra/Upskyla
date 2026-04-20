"use client";

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { 
  Car, 
  MapPin, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const vehicles = [
  { id: 1, name: "Sedan (Swift/Etios)", type: "Economy", price: 450, rating: 4.8, available: true },
  { id: 2, name: "SUV (Innova/Ertiga)", type: "Premium", price: 850, rating: 4.9, available: true },
  { id: 3, name: "Motorbike (Activa/Jupiter)", type: "Bike", price: 150, rating: 4.5, available: false },
];

export default function TaxiPage() {
  return (
    <ModuleLayout moduleName="taxi">
      <div className="space-y-8 bg-module min-h-full transition-colors duration-300">
        <div className="pt-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Speed & <span className="text-accent-primary">Energy</span></h1>
          <p className="text-slate-500 font-medium mt-1">Book airport pickups, hourly rentals, or daily vehicles with ease.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
          {/* Booking Form Card */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-colors" />
            
            <h2 className="text-2xl font-black text-slate-900 relative z-10 flex items-center">
              <Car className="h-6 w-6 mr-3 text-accent-primary" />
              Book Your Ride
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Location</label>
                <div className="relative group/input">
                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within/input:text-accent-primary transition-colors" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all font-medium placeholder:text-slate-400"
                    placeholder="Search pickup point..."
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Drop Location</label>
                <div className="relative group/input">
                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within/input:text-accent-primary transition-colors" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all font-medium placeholder:text-slate-400"
                    placeholder="Search drop point..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                <div className="relative group/input">
                  <Clock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within/input:text-accent-primary transition-colors" />
                  <input 
                    type="datetime-local" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all appearance-none cursor-pointer">
                  <option>Airport Pickup</option>
                  <option>Airport Drop</option>
                  <option>Hourly Rental</option>
                  <option>Daily Rental</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => alert("Checking vehicle availability in your area... Feature coming soon!")}
                className="w-full py-4 bg-accent-primary text-white rounded-2xl font-black text-lg hover:bg-accent-secondary transition-all shadow-xl shadow-accent-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center group"
              >
                Check Availability
                <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center uppercase tracking-tight">
                <CreditCard className="h-5 w-5 mr-3 text-accent-primary" />
                Price Estimator
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Base Fare</span>
                  <span className="text-lg font-black text-slate-900">{formatCurrency(150)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Per KM</span>
                  <span className="text-lg font-black text-slate-900">{formatCurrency(12)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-accent-highlight/10 rounded-2xl border border-accent-highlight/20">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Waiting</span>
                  <span className="text-lg font-black text-accent-primary">{formatCurrency(2)}/min</span>
                </div>
              </div>
            </div>

            <div className="bg-accent-primary/5 rounded-[2rem] p-8 border border-accent-primary/10 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-primary/10 rounded-full blur-2xl -mr-12 -mb-12" />
              <div className="flex items-start relative z-10">
                <div className="bg-white p-3 rounded-xl shadow-lg shadow-accent-primary/10 mr-4">
                  <AlertCircle className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Safety First</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
                    Always share your ride details with a friend or family member for a secure travel experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Selection */}
        <div className="space-y-8 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Vehicles</h2>
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-primary animate-ping" />
              <span className="text-xs font-black text-accent-primary uppercase tracking-widest">Live Availability</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div key={v.id} className={cn(
                "bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border p-10 transition-all group relative overflow-hidden",
                v.available 
                  ? "border-slate-100 hover:shadow-2xl hover:-translate-y-2 hover:border-accent-primary/20" 
                  : "opacity-60 border-slate-200 grayscale cursor-not-allowed"
              )}>
                {v.available && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-primary/10 transition-colors" />
                )}
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className={cn(
                    "p-4 rounded-2xl shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6", 
                    v.available ? "bg-accent-primary text-white shadow-accent-primary/20" : "bg-slate-200 text-slate-400 shadow-none"
                  )}>
                    <Car className="h-8 w-8" />
                  </div>
                  <div className="flex items-center bg-accent-highlight/10 px-3 py-1.5 rounded-full border border-accent-highlight/20">
                    <Star className="h-4 w-4 text-accent-highlight fill-current mr-1.5" />
                    <span className="text-sm font-black text-slate-900">{v.rating}</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-accent-primary transition-colors">{v.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{v.type}</p>
                </div>

                <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-100 relative z-10">
                  <div>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(v.price)}</span>
                    <span className="text-sm font-bold text-slate-400 ml-1">/hr</span>
                  </div>
                  {v.available ? (
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-accent-primary transition-all shadow-lg hover:scale-105 active:scale-95">
                      Select
                    </button>
                  ) : (
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest border border-slate-200">
                      Booked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
