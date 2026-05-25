"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  CalendarDays, 
  UserCheck, 
  Clock, 
  MapPin, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Bot
} from "lucide-react";

export default function CalendarView() {
  const { appointments, leads } = useApp();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Team availability mock data
  const technicians = [
    { name: "Mike (HVAC Master)", status: "Active", assignments: 4, color: "bg-accent-purple" },
    { name: "Sarah (Lead Plumber)", status: "Active", assignments: 3, color: "bg-accent-indigo" },
    { name: "David (Water Heater Specialist)", status: "On Leave", assignments: 0, color: "bg-gray-500" }
  ];

  // Calendar dates generator
  const getDatesOfWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    // Align to Monday
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + (currentWeekOffset * 7));
    
    return Array.from({ length: 5 }).map((_, idx) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + idx);
      return d;
    });
  };

  const weekDates = getDatesOfWeek();
  const timeSlots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

  // Match appointment to slot
  const getAppointmentForSlot = (dateStr: string, slot: string) => {
    return appointments.find(appt => {
      const apptDate = appt.time.split(" ")[0];
      const apptTime = appt.time.substring(apptDate.length + 1);
      return apptDate === dateStr && apptTime === slot;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)] overflow-hidden">
      
      {/* Calendar Grid Sheet */}
      <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-card-border bg-black/40 flex flex-col justify-between overflow-y-auto">
        
        {/* Calendar Header controls */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
              <CalendarDays className="w-4.5 h-4.5 text-accent-purple" />
              Service Dispatch Scheduling Console
            </h4>
            <p className="text-xs text-gray-400">Team scheduling blocks managed dynamically by round-robin algorithms.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-black/35 rounded-xl border border-card-border overflow-hidden">
              <button 
                onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3.5 py-2 text-xs font-bold text-white uppercase border-x border-card-border">
                Week {currentWeekOffset === 0 ? "Current" : currentWeekOffset > 0 ? `+${currentWeekOffset}` : currentWeekOffset}
              </span>
              <button 
                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-card-border">
                <th className="py-3 px-2 text-gray-400 font-semibold uppercase tracking-wider w-20">Time</th>
                {weekDates.map((date, idx) => (
                  <th key={idx} className="py-3 px-3 text-center">
                    <span className="block font-bold text-white">
                      {date.toLocaleDateString([], { weekday: "short" })}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {date.toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-gray-300 font-medium">
              {timeSlots.map((slot) => (
                <tr key={slot} className="hover:bg-white/[0.01]">
                  <td className="py-4 px-2 font-mono text-[10px] text-gray-500 font-bold">{slot}</td>
                  
                  {weekDates.map((date, dayIdx) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const appt = getAppointmentForSlot(dateStr, slot);
                    
                    return (
                      <td key={dayIdx} className="p-2 h-20 border-l border-card-border w-[18%]">
                        {appt ? (
                          <div className={`p-2.5 rounded-xl border h-full flex flex-col justify-between transition-all ${
                            appt.status === "completed" 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-accent-purple/10 border-accent-purple/20 text-accent-purple"
                          }`}>
                            <div>
                              <p className="font-bold text-[10px] truncate leading-tight">{appt.leadName}</p>
                              <p className="text-[9px] text-gray-400 font-semibold truncate mt-0.5">{appt.service}</p>
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-500 mt-1 block truncate">
                              👤 {appt.assignedTo.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-xl border border-dashed border-white/5 hover:border-accent-purple/20 hover:bg-accent-purple/5 transition-all flex items-center justify-center text-[10px] text-gray-600 font-semibold cursor-pointer">
                            + Book Slot
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Round Robin Dispatch Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between space-y-6 overflow-y-auto">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
            <UserCheck className="w-4.5 h-4.5 text-accent-purple" />
            Dispatch Algorithms
          </h4>
          <p className="text-xs text-gray-400 mt-1 leading-normal">
            Automated calendar routing maps booked leads based on round-robin technician load.
          </p>
        </div>

        <div className="space-y-4 flex-1 py-4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Technician roster</label>
          
          <div className="space-y-3.5">
            {technicians.map((tech) => (
              <div key={tech.name} className="p-3.5 rounded-xl bg-black/30 border border-card-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${tech.color}`}></div>
                  <div>
                    <h5 className="font-bold text-xs text-white">{tech.name}</h5>
                    <p className="text-[9px] text-gray-400 font-semibold">Active Jobs Scheduled: {tech.assignments}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                  tech.status === "Active" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-white/5 text-gray-500 border border-white/10"
                }`}>
                  {tech.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
              <Bot className="w-4 h-4" />
              AI Round-Robin Assignment Active
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-card-border text-[10px] text-gray-500 leading-normal font-semibold">
          Synchronizing calendar records triggers automated SMS arrival notices and sets up feedback workflows upon job completion.
        </div>

      </div>

    </div>
  );
}
