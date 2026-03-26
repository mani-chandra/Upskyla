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
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Taxi & Vehicle Rental</h1>
          <p className="text-gray-500">Book airport pickups, hourly rentals, or daily vehicles.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Book Your Ride</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    placeholder="Search pickup point..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Drop Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    placeholder="Search drop point..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="datetime-local" 
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Service Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900">
                  <option>Airport Pickup</option>
                  <option>Airport Drop</option>
                  <option>Hourly Rental</option>
                  <option>Daily Rental</option>
                </select>
              </div>
            </div>

            <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center">
              Check Availability
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          {/* Quick Stats/Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pricing Estimation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Base Fare</span>
                  <span className="font-medium text-gray-900">{formatCurrency(150)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Per KM Charge</span>
                  <span className="font-medium text-gray-900">{formatCurrency(12)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Waiting Charge</span>
                  <span className="font-medium text-gray-900">{formatCurrency(2)}/min</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 text-sm">Safety Reminder</h3>
                  <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                    Always share your ride details with a friend or family member for security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Selection */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Available Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className={cn(
                "bg-white rounded-xl shadow-sm border p-6 transition-all",
                v.available ? "border-gray-200 hover:shadow-md hover:border-primary-200" : "opacity-60 border-gray-100 grayscale cursor-not-allowed"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", v.available ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-gray-400")}>
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    <span className="text-sm font-bold">{v.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{v.type}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(v.price)}</span>
                    <span className="text-xs text-gray-500">/hr</span>
                  </div>
                  {v.available ? (
                    <button className="text-sm font-bold text-primary-600 hover:underline">Select</button>
                  ) : (
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Busy</span>
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
