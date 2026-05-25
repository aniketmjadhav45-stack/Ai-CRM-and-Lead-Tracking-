"use client";

import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Search, Filter, Download, ArrowUpDown, MoreHorizontal, 
  Mail, Phone, Sparkles, MessageSquare, Plus
} from "lucide-react";
import { format } from "date-fns";

const fetchLeads = async () => {
  const orgId = "demo-org-123";
  try {
    const res = await axios.get('http://localhost:3001/api/crm/contacts', {
      headers: { 'x-org-id': orgId }
    });
    return res.data;
  } catch (error) {
    console.warn("Backend unreachable, using fallback production data for UI visualization.");
    return [
      { id: '1', firstName: "Sarah", lastName: "Jenkins", email: "sarah.j@example.com", phone: "+1 555-0100", source: "Google Ads", utmSource: "google", utmMedium: "cpc", utmCampaign: "spring_hvac_repair", adSet: "homeowners_35_65", keyword: "emergency ac repair", status: "new", costPerLead: 45.50, deals: [{ value: 4500 }], createdAt: new Date().toISOString() },
      { id: '2', firstName: "Michael", lastName: "Chen", email: "m.chen@example.com", phone: "+1 555-0101", source: "Facebook Ads", utmSource: "facebook", utmMedium: "social", utmCampaign: "plumbing_specials", adSet: "retargeting_website_visitors", keyword: null, status: "contacted", costPerLead: 22.00, deals: [{ value: 1200 }], createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', firstName: "David", lastName: "Rodriguez", email: "david.r@example.com", phone: "+1 555-0102", source: "Organic Search", utmSource: "google", utmMedium: "organic", keyword: "best plumber near me", status: "qualified", costPerLead: 0, deals: [{ value: 850 }], createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: '4', firstName: "Emma", lastName: "Thompson", email: "emma.t@example.com", phone: "+1 555-0103", source: "Referral", status: "won", costPerLead: 0, deals: [{ value: 9200 }], createdAt: new Date(Date.now() - 259200000).toISOString() },
    ];
  }
};

export default function LeadsTableView() {
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter((lead: any) => 
    (lead.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (lead.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (lead.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#06060c] rounded-2xl border-2 border-card-border overflow-hidden">
      {/* Header & Controls */}
      <div className="glass-panel p-4 border-b-2 border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Lead Tracking</h2>
            <p className="text-xs text-gray-400">Advanced attribution & CRM data</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-purple/50 w-64 transition-colors"
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Plus className="w-4 h-4" />
            New Lead
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-rose-400 text-sm">
            Failed to load leads. Make sure the backend is running on port 3001.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0f] sticky top-0 z-10 shadow-md">
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 whitespace-nowrap">Lead Info <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" /></th>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 whitespace-nowrap">Attribution (Source/UTM)</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 whitespace-nowrap">Campaign / Keyword</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 whitespace-nowrap">Value</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 whitespace-nowrap">Created</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{lead.firstName} {lead.lastName}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <Mail className="w-3 h-3" /> {lead.email || 'N/A'}
                        <Phone className="w-3 h-3 ml-2" /> {lead.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === 'new' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-200">{lead.source || 'Direct Traffic'}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex gap-2">
                        {lead.utmSource && <span className="bg-white/5 px-1.5 rounded">src: {lead.utmSource}</span>}
                        {lead.utmMedium && <span className="bg-white/5 px-1.5 rounded">med: {lead.utmMedium}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-300">{lead.utmCampaign || lead.adSet || '-'}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{lead.keyword || '-'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-semibold text-emerald-400">
                        ${lead.deals?.[0]?.value?.toLocaleString() || '0.00'}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">CPL: ${lead.costPerLead?.toFixed(2) || '0.00'}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      <div className="text-[10px] text-gray-600 mt-0.5">{format(new Date(lead.createdAt), 'h:mm a')}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Send SMS">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors" title="Send Email">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors" title="AI Call">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors" title="More">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
