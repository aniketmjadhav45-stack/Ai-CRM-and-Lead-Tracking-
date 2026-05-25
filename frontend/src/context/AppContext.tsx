"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "new" | "contacted" | "calling" | "scheduled" | "won" | "lost";
  value: number;
  source: "Google Ads" | "Facebook Ads" | "Local SEO" | "Yelp Search" | "Organic";
  utmSource: string;
  utmCampaign: string;
  utmKeyword: string;
  createdTime: string;
  callSentiment: "positive" | "neutral" | "negative" | null;
  callSummary: string | null;
  transcript: { sender: "agent" | "lead"; text: string; time: string }[] | null;
  notionSynced: boolean;
  slackNotified: boolean;
  hubspotSynced: boolean;
  jobberSynced: boolean;
  smsHistory: { sender: "agent" | "lead" | "system"; text: string; time: string }[];
}

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  time: string;
  service: string;
  assignedTo: string;
  status: "confirmed" | "completed" | "cancelled";
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  payload: string;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  webhookLogs: WebhookLog[];
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLog[]>>;
  smsThreads: { [key: string]: Lead["smsHistory"] };
  workflowSettings: {
    smsTemplate: string;
    emailSubject: string;
    emailTemplate: string;
    aiScript: string;
  };
  setWorkflowSettings: React.Dispatch<React.SetStateAction<any>>;
  voiceSettings: {
    voiceId: string;
    latency: number;
    stability: number;
    clarity: number;
    greeting: string;
    agentName: string;
  };
  setVoiceSettings: React.Dispatch<React.SetStateAction<any>>;
  simulateNewLead: (details: Partial<Lead>) => void;
  triggerWorkflowSimulation: (leadId: string) => void;
  updateLeadStatus: (leadId: string, status: Lead["status"]) => void;
  sendManualSMS: (leadId: string, text: string) => void;
  activeCallSimulator: {
    leadId: string | null;
    status: "idle" | "calling" | "connected" | "ended";
    currentLineIndex: number;
    transcript: { sender: "agent" | "lead"; text: string; time: string }[];
  };
  setActiveCallSimulator: React.Dispatch<React.SetStateAction<any>>;
  startCallSimulation: (leadId: string) => void;
  respondToCallAgent: (inputText: string) => void;
  endCallSimulation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to format date
const getFormattedTime = (offsetMinutes = 0) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getFormattedDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // High-fidelity Initial Mock Leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "L-101",
      name: "Marcus Vance",
      phone: "(512) 555-8921",
      email: "marcus.vance@gmail.com",
      status: "won",
      value: 1850,
      source: "Google Ads",
      utmSource: "google",
      utmCampaign: "hvac_repair_austin",
      utmKeyword: "emergency ac repair cost",
      createdTime: `${getFormattedDate(-2)} 09:34 AM`,
      callSentiment: "positive",
      callSummary: "Lead called seeking urgent AC compressor replacement. AI Agent qualified lead budget, verified home ownership, and successfully booked Mike for service. Job was completed and payment processed via Stripe integration.",
      notionSynced: true,
      slackNotified: true,
      hubspotSynced: true,
      jobberSynced: true,
      smsHistory: [
        { sender: "system", text: "Workflow 'AC Emergency Intake' triggered.", time: "09:34 AM" },
        { sender: "agent", text: "Hi Marcus! Apex Climate is on the way. Our technician Mike will arrive between 1-3 PM today. Track arrival: apex.flow/t/m101", time: "09:35 AM" },
        { sender: "lead", text: "Awesome! Thanks for the fast response, my house was getting boiling.", time: "09:36 AM" }
      ],
      transcript: [
        { sender: "agent", text: "Thank you for calling Apex Climate & Plumbing Services, this is Chloe, your automated AI assistant. How can I help you today?", time: "09:34 AM" },
        { sender: "lead", text: "Hey! Yes, my AC completely stopped blowing cold air this morning. I have an elderly relative at home and need someone out here today.", time: "09:34 AM" },
        { sender: "agent", text: "I understand that completely, Marcus. Let's get that fixed. Are you the homeowner at the Austin address?", time: "09:34 AM" },
        { sender: "lead", text: "Yes, I am the owner.", time: "09:35 AM" },
        { sender: "agent", text: "Perfect. I have our top tech, Mike, available this afternoon between 1 PM and 3 PM. Would that work for you?", time: "09:35 AM" },
        { sender: "lead", text: "Yes, absolutely! Please book that.", time: "09:35 AM" },
        { sender: "agent", text: "Excellent! I have booked that AC Diagnostic appointment for you. You'll receive a confirmation text immediately. Is there anything else?", time: "09:35 AM" },
        { sender: "lead", text: "No, that's all. Thank you Chloe!", time: "09:35 AM" }
      ]
    },
    {
      id: "L-102",
      name: "Sarah Jenkins",
      phone: "(512) 555-4389",
      email: "sarahj@outlook.com",
      status: "scheduled",
      value: 450,
      source: "Facebook Ads",
      utmSource: "facebook",
      utmCampaign: "plumbing_drain_cleaning",
      utmKeyword: "clogged drain emergency",
      createdTime: `${getFormattedDate(-1)} 02:15 PM`,
      callSentiment: "positive",
      callSummary: "Sarah requested scheduling for kitchen sink drain cleaning. AI Call Agent verified issues, confirmed $99 diagnostic charge, and automatically booked Sarah into the dispatch system calendar.",
      notionSynced: true,
      slackNotified: true,
      hubspotSynced: true,
      jobberSynced: true,
      smsHistory: [
        { sender: "system", text: "Workflow 'Lead Auto-Response' triggered.", time: "02:15 PM" },
        { sender: "agent", text: "Hi Sarah! Confirming your appointment with Apex Plumbing tomorrow, May 24th, at 10:00 AM. Click here to reschedule if needed: apex.flow/r/s102", time: "02:17 PM" },
        { sender: "lead", text: "Got it, thank you. Will the plumber call before arriving?", time: "02:19 PM" },
        { sender: "agent", text: "Yes, absolutely! Tech Sarah will text when she is 20 minutes away.", time: "02:20 PM" }
      ],
      transcript: [
        { sender: "agent", text: "Apex Climate and Plumbing, this is Chloe. How can I help you?", time: "02:15 PM" },
        { sender: "lead", text: "Hi, I have a badly clogged kitchen drain. Water is backing up.", time: "02:15 PM" },
        { sender: "agent", text: "Oh dear, that is definitely annoying! I can get a plumber out tomorrow at 10:00 AM. Does that time work for you?", time: "02:16 PM" },
        { sender: "lead", text: "Yes, 10 AM works perfectly.", time: "02:16 PM" },
        { sender: "agent", text: "Great, I've got you locked in for 10 AM tomorrow. We will see you then!", time: "02:17 PM" }
      ]
    },
    {
      id: "L-103",
      name: "Robert Chen",
      phone: "(512) 555-7104",
      email: "robert.chen@gmail.com",
      status: "new",
      value: 3200,
      source: "Local SEO",
      utmSource: "google_map_pack",
      utmCampaign: "water_heater_install",
      utmKeyword: "tankless water heater installers near me",
      createdTime: `${getFormattedDate()} 08:12 AM`,
      callSentiment: null,
      callSummary: null,
      notionSynced: false,
      slackNotified: false,
      hubspotSynced: false,
      jobberSynced: false,
      smsHistory: [],
      transcript: null
    },
    {
      id: "L-104",
      name: "Eliza Smith",
      phone: "(512) 555-0912",
      email: "esmith@yahoo.com",
      status: "calling",
      value: 1200,
      source: "Yelp Search",
      utmSource: "yelp",
      utmCampaign: "leak_detection",
      utmKeyword: "slab leak repair specialist",
      createdTime: `${getFormattedDate()} 09:40 AM`,
      callSentiment: "neutral",
      callSummary: "AI voice call active. Lead reported slab leak symptoms in the master bathroom. Agent currently qualifying home details and preparing to present team scheduling slots.",
      notionSynced: true,
      slackNotified: true,
      hubspotSynced: true,
      jobberSynced: false,
      smsHistory: [
        { sender: "system", text: "Yelp Webhook lead captured.", time: "09:40 AM" },
        { sender: "agent", text: "Hello Eliza! Apex Services received your request on Yelp. We are reviewing it now and our AI voice assistant will reach out shortly.", time: "09:40 AM" }
      ],
      transcript: [
        { sender: "agent", text: "Hello Eliza, this is Chloe calling from Apex Services. I saw your inquiry regarding a suspected slab leak. Are you experiencing pooling water?", time: "09:42 AM" },
        { sender: "lead", text: "Yes! There is a warm spot on my floor and a faint sound of running water behind the toilet.", time: "09:43 AM" }
      ]
    }
  ]);

  // Initial Mock Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "A-501",
      leadId: "L-102",
      leadName: "Sarah Jenkins",
      time: `${getFormattedDate(1)} 10:00 AM`,
      service: "Drain Cleaning Diagnostic",
      assignedTo: "Sarah (Lead Plumber)",
      status: "confirmed"
    },
    {
      id: "A-502",
      leadId: "L-101",
      leadName: "Marcus Vance",
      time: `${getFormattedDate(-2)} 01:00 PM`,
      service: "AC Diagnostic & Re-Charge",
      assignedTo: "Mike (HVAC Master)",
      status: "completed"
    }
  ]);

  // Initial Webhook Developer logs
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: "WH-901",
      timestamp: `${getFormattedTime(-120)}`,
      event: "lead.incoming",
      source: "WhatConverts Webhook",
      payload: JSON.stringify({
        lead_id: "wc_83921",
        name: "Robert Chen",
        source: "google_map_pack",
        utm_medium: "organic",
        utm_keyword: "tankless water heater cost",
        phone: "(512) 555-7104",
        ip: "192.168.1.43"
      }, null, 2)
    },
    {
      id: "WH-902",
      timestamp: `${getFormattedTime(-119)}`,
      event: "crm.contact_created",
      source: "HubSpot Sync Service",
      payload: JSON.stringify({
        id: "hs_812301",
        properties: {
          firstname: "Robert",
          lastname: "Chen",
          phone: "(512) 555-7104",
          lead_source: "WhatConverts"
        }
      }, null, 2)
    }
  ]);

  // Settings
  const [workflowSettings, setWorkflowSettings] = useState({
    smsTemplate: "Hi {{lead_name}}! This is {{company_name}} confirming your appointment on {{appointment_time}} with technician {{assigned_tech}}.",
    emailSubject: "Welcome to Apex Services - We are on the way!",
    emailTemplate: "Hello {{lead_name}},\n\nThank you for choosing Apex Services! We have successfully received your service request for {{service_type}}.\n\nOur top professional, {{assigned_tech}}, will arrive at your home during your window. You can view progress directly in our dashboard.\n\nBest Regards,\nApex Operations Team",
    aiScript: "You are Chloe, an ultra-professional, friendly customer service agent at Apex Climate & Plumbing. Your primary goal is to qualify the homeowner, explain our $79 service dispatch fee, confirm they own the property, and schedule them into an available calendar slot. Keep responses warm and concise."
  });

  const [voiceSettings, setVoiceSettings] = useState({
    voiceId: "elevenlabs_warm_chloe",
    latency: 180, // milliseconds
    stability: 0.75,
    clarity: 0.85,
    greeting: "Thank you for contacting Apex Climate and Plumbing, this is Chloe! How can I bring comfort to your home today?",
    agentName: "Chloe (AI Assistant)"
  });

  // Call Simulator State
  const [activeCallSimulator, setActiveCallSimulator] = useState<{
    leadId: string | null;
    status: "idle" | "calling" | "connected" | "ended";
    currentLineIndex: number;
    transcript: { sender: "agent" | "lead"; text: string; time: string }[];
  }>({
    leadId: null,
    status: "idle",
    currentLineIndex: 0,
    transcript: []
  });

  // Active call dialogue tree (script)
  const scriptDialogue = [
    { sender: "agent", text: "Hello! This is Chloe calling from Apex Climate & Plumbing. I noticed you requested emergency diagnostic support for your water heater on our website. Am I speaking with Robert?" },
    { sender: "lead", text: "Yes, this is Robert. My tank is leaking all over my garage floor." },
    { sender: "agent", text: "Oh, that sounds incredibly stressful! Let's get that resolved immediately. Before I check our plumbers' schedules, are you the homeowner of the property?" },
    { sender: "lead", text: "Yes, I am the owner. It is a 50-gallon standard gas water heater." },
    { sender: "agent", text: "Excellent, thank you. There is a standard seventy-nine dollar dispatch and diagnostic fee to send a certified plumber. Does that sound fair to you?" },
    { sender: "lead", text: "Yes, that's fine. I just need it fixed before my basement floods." },
    { sender: "agent", text: "Completely understand! I have Sarah, our water heater specialist, available today between 2 PM and 4 PM, or tomorrow at 9 AM. Which option would you prefer?" },
    { sender: "lead", text: "Today between 2 PM and 4 PM works best." },
    { sender: "agent", text: "Wonderful, Robert. I've locked Sarah in for today between 2 PM and 4 PM. She will text you when she is twenty minutes away. I'm updating your HubSpot card right now." },
    { sender: "lead", text: "Thank you so much! That is such a relief." },
    { sender: "agent", text: "Of course! We are always happy to help. Have a wonderful rest of your day, Robert. Goodbye!" }
  ];

  // Initiate call
  const startCallSimulation = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setActiveCallSimulator({
      leadId,
      status: "calling",
      currentLineIndex: 0,
      transcript: []
    });

    // Simulate ring and pickup
    setTimeout(() => {
      setActiveCallSimulator(prev => ({
        ...prev,
        status: "connected",
        transcript: [{ sender: "agent", text: voiceSettings.greeting, time: getFormattedTime() }]
      }));
      
      // Update lead state to calling
      setLeads(prevLeads =>
        prevLeads.map(l => (l.id === leadId ? { ...l, status: "calling" } : l))
      );

      // Log webhook trigger
      addWebhookLog("vapi.call_started", "Vapi Phone Service", {
        call_id: `vap_${Math.random().toString(36).substr(2, 9)}`,
        lead_id: leadId,
        agent: voiceSettings.agentName,
        phone: lead.phone
      });
    }, 1500);
  };

  // Type or respond during call simulation
  const respondToCallAgent = (inputText: string) => {
    if (activeCallSimulator.status !== "connected") return;

    // Add user line
    const userLine = { sender: "lead" as const, text: inputText, time: getFormattedTime() };
    
    setActiveCallSimulator(prev => {
      const updatedTranscript = [...prev.transcript, userLine];
      
      // Compute mock response from Chloe based on conversation progress
      setTimeout(() => {
        let responseText = "Understood. Let me check the schedule to see how we can assist you today.";
        
        if (inputText.toLowerCase().includes("leak") || inputText.toLowerCase().includes("broken") || inputText.toLowerCase().includes("heater")) {
          responseText = "I see. Water heater and pipe issues require fast attention. Are you the owner of the property so I can dispatch our technician?";
        } else if (inputText.toLowerCase().includes("yes") || inputText.toLowerCase().includes("owner")) {
          responseText = "Great! There is a standard $79 diagnostic fee to dispatch our specialist and assess the repair. Does that sound good?";
        } else if (inputText.toLowerCase().includes("fine") || inputText.toLowerCase().includes("good") || inputText.toLowerCase().includes("ok") || inputText.toLowerCase().includes("sure")) {
          responseText = "Perfect! I have our master technician, Sarah, available today between 2 PM and 4 PM, or tomorrow at 10 AM. Which one should I book?";
        } else if (inputText.toLowerCase().includes("today") || inputText.toLowerCase().includes("pm")) {
          responseText = "Fantastic! I've booked Sarah for today between 2 PM and 4 PM. Your HubSpot records have been updated and you will receive an SMS confirmation right away.";
          
          // Complete and schedule
          setTimeout(() => {
            endCallSimulation();
            // Automatically promote lead to scheduled
            promoteLeadToScheduled(activeCallSimulator.leadId!);
          }, 3000);
        }

        const agentLine = { sender: "agent" as const, text: responseText, time: getFormattedTime() };
        setActiveCallSimulator(p => ({
          ...p,
          transcript: [...p.transcript, agentLine]
        }));

        addWebhookLog("vapi.speech_generated", "Vapi Speech Synthesis", {
          text: responseText,
          voice: voiceSettings.voiceId,
          latency_ms: voiceSettings.latency
        });

      }, 1200);

      return {
        ...prev,
        transcript: updatedTranscript
      };
    });
  };

  const endCallSimulation = () => {
    setActiveCallSimulator(prev => {
      if (prev.leadId) {
        // Update the lead transcript and summary
        setLeads(prevLeads =>
          prevLeads.map(l =>
            l.id === prev.leadId
              ? {
                  ...l,
                  callSentiment: "positive",
                  callSummary: "AI call concluded successfully. Lead confirmed property ownership and scheduled emergency technician. CRM synchronized in real time.",
                  transcript: prev.transcript
                }
              : l
          )
        );
      }
      return {
        ...prev,
        status: "ended"
      };
    });

    setTimeout(() => {
      setActiveCallSimulator({
        leadId: null,
        status: "idle",
        currentLineIndex: 0,
        transcript: []
      });
    }, 2000);
  };

  const promoteLeadToScheduled = (leadId: string) => {
    setLeads(prevLeads =>
      prevLeads.map(l => {
        if (l.id === leadId) {
          // Check if already scheduled
          const newAppt: Appointment = {
            id: `A-${Math.floor(Math.random() * 900) + 500}`,
            leadId: l.id,
            leadName: l.name,
            time: `${getFormattedDate(0)} 02:00 PM`,
            service: "Emergency Tech Inspection",
            assignedTo: "Sarah (Lead Plumber)",
            status: "confirmed"
          };
          setAppointments(prev => [...prev, newAppt]);
          return { ...l, status: "scheduled" };
        }
        return l;
      })
    );
  };

  // Helper to add webhook log
  const addWebhookLog = (event: string, source: string, payloadObj: any) => {
    const newLog: WebhookLog = {
      id: `WH-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: getFormattedTime(),
      event,
      source,
      payload: JSON.stringify(payloadObj, null, 2)
    };
    setWebhookLogs(prev => [newLog, ...prev].slice(0, 30)); // Cap at 30
  };

  // Drag and Drop Pipeline trigger
  const updateLeadStatus = (leadId: string, status: Lead["status"]) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          // Add system logs for this transition
          const logPayload = {
            lead_id: leadId,
            old_status: l.status,
            new_status: status,
            timestamp: new Date().toISOString()
          };
          addWebhookLog("crm.pipeline_stage_changed", "HubSpot Direct Sync", logPayload);
          
          let updatedSms = [...l.smsHistory];
          if (status === "won") {
            updatedSms.push({ sender: "system", text: "Deal marked Won. Invoicing workflow active.", time: getFormattedTime() });
            addWebhookLog("stripe.invoice_created", "Stripe Integration", {
              amount: l.value,
              currency: "usd",
              customer_email: l.email
            });
          }

          return { ...l, status, smsHistory: updatedSms };
        }
        return l;
      })
    );
  };

  // Manual SMS inside Inbox
  const sendManualSMS = (leadId: string, text: string) => {
    const newMessage = { sender: "agent" as const, text, time: getFormattedTime() };
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          // Echo back a simulated automated reply shortly after
          setTimeout(() => {
            const replies = [
              "Perfect, sounds good to me!",
              "Thanks for letting me know. See you then.",
              "Yes, that's exactly what I needed.",
              "Excellent, I appreciate the quick response.",
              "I'm at home now, so you can send them anytime."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const leadReply = { sender: "lead" as const, text: randomReply, time: getFormattedTime(1) };
            
            setLeads(currentLeads =>
              currentLeads.map(cl =>
                cl.id === leadId
                  ? { ...cl, smsHistory: [...cl.smsHistory, leadReply] }
                  : cl
              )
            );

            addWebhookLog("twilio.sms_received", "Twilio Messaging", {
              from: l.phone,
              body: randomReply,
              sid: `SM${Math.random().toString(36).substr(2, 12)}`
            });
          }, 2000);

          addWebhookLog("twilio.sms_sent", "Twilio Messaging", {
            to: l.phone,
            body: text,
            sid: `SM${Math.random().toString(36).substr(2, 12)}`
          });

          return { ...l, smsHistory: [...l.smsHistory, newMessage] };
        }
        return l;
      })
    );
  };

  // Simulating an entire lead intake + automated Zapier pipeline execution
  const simulateNewLead = (details: Partial<Lead>) => {
    const newId = `L-${Math.floor(Math.random() * 900) + 200}`;
    const newLead: Lead = {
      id: newId,
      name: details.name || "Jane Miller",
      phone: details.phone || "(512) 555-9012",
      email: details.email || "jane.miller@yahoo.com",
      status: "new",
      value: details.value || 950,
      source: details.source || "Google Ads",
      utmSource: details.utmSource || "google",
      utmCampaign: details.utmCampaign || "plumbing_repair_texas",
      utmKeyword: details.utmKeyword || "emergency pipe repair plumber",
      createdTime: `${getFormattedDate()} ${getFormattedTime()}`,
      callSentiment: null,
      callSummary: null,
      notionSynced: false,
      slackNotified: false,
      hubspotSynced: false,
      jobberSynced: false,
      smsHistory: [
        { sender: "system", text: "WhatConverts Webhook trigger detected.", time: getFormattedTime() }
      ],
      transcript: null
    };

    setLeads(prev => [newLead, ...prev]);

    // Triggers the simulated BullMQ Workflow runner!
    triggerWorkflowSimulation(newId);
  };

  // BullMQ & Zapier multi-step automation workflow runner simulation
  const triggerWorkflowSimulation = (leadId: string) => {
    // Step 1: Webhook intake logged
    addWebhookLog("workflow.triggered", "Antigravity BullMQ Queue", {
      lead_id: leadId,
      trigger: "New WhatConverts Intake",
      queue_active: true,
      timestamp: new Date().toISOString()
    });

    // Step 2: Sync to HubSpot & Jobber CRMs (after 1s)
    setTimeout(() => {
      setLeads(prev =>
        prev.map(l =>
          l.id === leadId
            ? {
                ...l,
                hubspotSynced: true,
                jobberSynced: true,
                smsHistory: [...l.smsHistory, { sender: "system", text: "Contact created in HubSpot & Jobber CRM.", time: getFormattedTime() }]
              }
            : l
        )
      );

      addWebhookLog("crm.hubspot_sync", "HubSpot Contact API", {
        status: "success",
        crm_record_id: `hs_${Math.floor(Math.random() * 800000) + 100000}`
      });

      addWebhookLog("crm.jobber_sync", "Jobber Client API", {
        status: "success",
        client_id: `jb_${Math.floor(Math.random() * 800000) + 100000}`
      });
    }, 1200);

    // Step 3: Trigger Slack notification and welcome communication (after 2s)
    setTimeout(() => {
      setLeads(prev =>
        prev.map(l =>
          l.id === leadId
            ? {
                ...l,
                slackNotified: true,
                smsHistory: [...l.smsHistory, { sender: "system", text: "Slack notification sent. Welcome Email drafted.", time: getFormattedTime() }]
              }
            : l
        )
      );

      addWebhookLog("slack.notification", "Slack Webhook integration", {
        channel: "#leads-alert",
        text: `🚀 *New High-Value Lead Intake!* \n*Name:* {{lead_name}} \n*Source:* {{lead_source}} \n*Value:* \${{lead_value}} \n*Action:* AI Calling module scheduled.`,
        status: "delivered"
      });
    }, 2400);

    // Step 4: Automatically schedule and trigger Vapi AI phone call (after 3.5s)
    setTimeout(() => {
      // Prompt Vapi simulated dialer!
      setLeads(prev =>
        prev.map(l =>
          l.id === leadId
            ? {
                ...l,
                smsHistory: [...l.smsHistory, { sender: "system", text: "Queuing outgoing ElevenLabs/Vapi AI Phone Agent dialer...", time: getFormattedTime() }]
              }
            : l
        )
      );

      // Open AI Call tab or trigger a call simulator notice in layout
      startCallSimulation(leadId);

    }, 3800);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        leads,
        setLeads,
        appointments,
        setAppointments,
        webhookLogs,
        setWebhookLogs,
        smsThreads: {},
        workflowSettings,
        setWorkflowSettings,
        voiceSettings,
        setVoiceSettings,
        simulateNewLead,
        triggerWorkflowSimulation,
        updateLeadStatus,
        sendManualSMS,
        activeCallSimulator,
        setActiveCallSimulator,
        startCallSimulation,
        respondToCallAgent,
        endCallSimulation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
