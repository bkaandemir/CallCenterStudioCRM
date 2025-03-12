export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  linkedInUrl?: string;
  linkedInAvatar?: string;
  lastInteraction: string;
  status: 'Active' | 'Inactive';
  tags: string[];
  avatar: string;
  customFields: {
    [key: string]: string;
  };
  customerJourney: {
    id: string;
    date: string;
    type: 'Call' | 'Email' | 'Meeting' | 'Note' | 'Other';
    summary: string;
    sentiment?: 'Positive' | 'Neutral' | 'Negative';
  }[];
  callCenterData: {
    cdrLogs: {
      id: string;
      timestamp: string;
      duration: number;
      direction: 'Inbound' | 'Outbound';
      agentId: string;
      disposition: string;
      recordingUrl?: string;
      queueTime?: number;
      transferCount?: number;
      metadata: {
        [key: string]: any;
      };
    }[];
    lastInteractionSummary?: {
      timestamp: string;
      agentName: string;
      duration: number;
      outcome: string;
      notes: string;
      followUpRequired: boolean;
      tags: string[];
    };
    metrics: {
      totalCallTime: number;
      averageCallDuration: number;
      missedCalls: number;
      satisfactionScore?: number;
      responseTime: number;
    };
  };
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  module: 'contact' | 'ticket' | 'task';
  description?: string;
  options?: string[];  // For select type fields
  defaultValue?: any;
  required?: boolean;
  path: string;  // For API mapping
}

export interface TicketType {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  assignedTo: string;
  contactId: string;
  createdAt: string;
  dueDate: string;
  lastUpdated: string;
}

export interface Note {
  id: string;
  contactId: string;
  type: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Activity {
  id: string;
  contactId: string;
  type: string;
  description: string;
  duration: number;
  createdAt: string;
  status: 'Completed' | 'Pending';
}

export interface DashboardStats {
  totalContacts: number;
  activeContacts: number;
  openTickets: number;
  completedActivities: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  contactId?: string;
  ticketId?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  category: 'Follow Up' | 'Call' | 'Meeting' | 'Email' | 'Documentation' | 'Research' | 'Other';
  progress: number;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  comments?: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
    attachments?: {
      id: string;
      name: string;
      url: string;
      type: string;
    }[];
  }[];
  reminders?: {
    id: string;
    type: 'Email' | 'Push' | 'SMS';
    time: string;
    sent: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  customFields?: {
    [key: string]: any;
  };
}