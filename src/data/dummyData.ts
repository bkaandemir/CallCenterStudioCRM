import { Contact, TicketType as Ticket, Note, Activity, Task } from '../types';

const generatePhoneNumber = () => {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const firstPart = Math.floor(Math.random() * 900) + 100;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
};

const companies = [
  'Acme Corporation', 'TechGlobe Solutions', 'Quantum Dynamics', 'Stellar Systems',
  'Innovate Labs', 'Peak Performance Inc.', 'Future Dynamics', 'Cloud Nine Solutions',
  'Elite Enterprises', 'Nexus Technologies'
];

const jobTitles = [
  'Chief Executive Officer', 'Chief Technology Officer', 'Sales Director',
  'Marketing Manager', 'Product Manager', 'Operations Director', 'HR Manager',
  'Finance Director', 'Business Development Manager', 'Project Manager'
];

const ticketTypes = ['Bug Report', 'Feature Request', 'Customer Support', 'Technical Issue', 'Billing Query'];
const ticketPriorities = ['Low', 'Medium', 'High', 'Urgent'];
const ticketStatuses = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

const generateDummyContacts = (count: number): Contact[] => {
  const contacts: Contact[] = [];
  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const generateLinkedInUrl = (firstName: string, lastName: string) => {
    return Math.random() > 0.3 ? `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 100000)}` : undefined;
  };

  const generateCustomerJourney = () => {
    const journey = [];
    const types: ('Call' | 'Email' | 'Meeting' | 'Note' | 'Other')[] = ['Call', 'Email', 'Meeting', 'Note', 'Other'];
    const sentiments: ('Positive' | 'Neutral' | 'Negative')[] = ['Positive', 'Neutral', 'Negative'];
    
    for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
      journey.push({
        id: `journey-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        summary: `Interaction summary ${i + 1}`,
        sentiment: Math.random() > 0.3 ? sentiments[Math.floor(Math.random() * sentiments.length)] : undefined
      });
    }
    return journey;
  };

  const generateCallCenterData = () => {
    const cdrLogs = [];
    for (let i = 0; i < Math.floor(Math.random() * 8) + 3; i++) {
      cdrLogs.push({
        id: `cdr-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        duration: Math.floor(Math.random() * 900) + 60, // 1-15 minutes
        direction: Math.random() > 0.5 ? 'Inbound' as const : 'Outbound' as const,
        agentId: `agent-${Math.floor(Math.random() * 5) + 1}`,
        disposition: ['Completed', 'Transferred', 'Voicemail', 'Missed'][Math.floor(Math.random() * 4)],
        recordingUrl: Math.random() > 0.3 ? `https://recordings.callcenter.com/${Math.random().toString(36).substr(2, 9)}` : undefined,
        queueTime: Math.floor(Math.random() * 300),
        transferCount: Math.floor(Math.random() * 3),
        metadata: {
          queue: ['Sales', 'Support', 'Billing'][Math.floor(Math.random() * 3)],
          language: ['English', 'Spanish', 'French'][Math.floor(Math.random() * 3)],
          platform: ['Web', 'Mobile', 'Desktop'][Math.floor(Math.random() * 3)]
        }
      });
    }

    return {
      cdrLogs,
      lastInteractionSummary: {
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        agentName: `Agent ${Math.floor(Math.random() * 5) + 1}`,
        duration: Math.floor(Math.random() * 900) + 60,
        outcome: ['Resolved', 'Pending', 'Follow-up Required'][Math.floor(Math.random() * 3)],
        notes: 'Last interaction summary notes',
        followUpRequired: Math.random() > 0.7,
        tags: ['Priority', 'Sales Opportunity', 'Support Case'][Math.floor(Math.random() * 3)].split(' ')
      },
      metrics: {
        totalCallTime: Math.floor(Math.random() * 36000) + 3600,
        averageCallDuration: Math.floor(Math.random() * 600) + 180,
        missedCalls: Math.floor(Math.random() * 5),
        satisfactionScore: Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : undefined,
        responseTime: Math.floor(Math.random() * 300) + 30
      }
    };
  };

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const linkedInUrl = generateLinkedInUrl(firstName, lastName);
    
    contacts.push({
      id: `contact-${i + 1}`,
      name: `${firstName} ${lastName}`,
      phone: generatePhoneNumber(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      company: companies[Math.floor(Math.random() * companies.length)],
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      linkedInUrl,
      linkedInAvatar: linkedInUrl ? `https://api.linkedin.com/v2/profile-photos/${Math.random().toString(36).substr(2, 9)}` : undefined,
      lastInteraction: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      status: Math.random() > 0.5 ? 'Active' : 'Inactive',
      tags: ['Customer', Math.random() > 0.5 ? 'VIP' : 'Standard'],
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      customFields: {
        industry: ['Technology', 'Healthcare', 'Finance', 'Retail'][Math.floor(Math.random() * 4)],
        source: ['Website', 'Referral', 'LinkedIn', 'Conference'][Math.floor(Math.random() * 4)]
      },
      customerJourney: generateCustomerJourney(),
      callCenterData: generateCallCenterData()
    });
  }

  return contacts;
};

const generateDummyTickets = (count: number): Ticket[] => {
  const tickets: Ticket[] = [];

  for (let i = 0; i < count; i++) {
    const createdDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    const dueDate = new Date(createdDate.getTime() + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000));

    tickets.push({
      id: `ticket-${i + 1}`,
      title: `Ticket #${i + 1} - ${ticketTypes[Math.floor(Math.random() * ticketTypes.length)]}`,
      description: `This is a sample ticket description for ticket #${i + 1}. It contains important details about the issue or request.`,
      type: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
      priority: ticketPriorities[Math.floor(Math.random() * ticketPriorities.length)],
      status: ticketStatuses[Math.floor(Math.random() * ticketStatuses.length)],
      assignedTo: `agent-${Math.floor(Math.random() * 5) + 1}`,
      contactId: `contact-${Math.floor(Math.random() * 20) + 1}`,
      createdAt: createdDate.toISOString(),
      dueDate: dueDate.toISOString(),
      lastUpdated: new Date(createdDate.getTime() + Math.floor(Math.random() * (Date.now() - createdDate.getTime()))).toISOString()
    });
  }

  return tickets;
};

const generateDummyNotes = (count: number): Note[] => {
  const notes: Note[] = [];
  const noteTypes = ['Call Note', 'Meeting Note', 'Email Note', 'General Note'];

  for (let i = 0; i < count; i++) {
    notes.push({
      id: `note-${i + 1}`,
      contactId: `contact-${Math.floor(Math.random() * 20) + 1}`,
      type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
      content: `This is a sample note content for note #${i + 1}. It contains important information about the interaction.`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      createdBy: `agent-${Math.floor(Math.random() * 5) + 1}`
    });
  }

  return notes;
};

const generateDummyActivities = (count: number): Activity[] => {
  const activities: Activity[] = [];
  const activityTypes = ['Call', 'Email', 'Meeting', 'Task', 'Note'];

  for (let i = 0; i < count; i++) {
    activities.push({
      id: `activity-${i + 1}`,
      contactId: `contact-${Math.floor(Math.random() * 20) + 1}`,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      description: `Activity description for activity #${i + 1}`,
      duration: Math.floor(Math.random() * 60) + 1,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      status: Math.random() > 0.5 ? 'Completed' : 'Pending'
    });
  }

  return activities;
};

const generateDummyTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  const categories: Task['category'][] = ['Follow Up', 'Call', 'Meeting', 'Email', 'Documentation', 'Research', 'Other'];
  const priorities: Task['priority'][] = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses: Task['status'][] = ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
  const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];
  const userIds = users.map((_, index) => `user-${index + 1}`);

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    const dueDate = new Date(createdAt.getTime() + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const completedAt = status === 'Completed' 
      ? new Date(dueDate.getTime() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString()
      : undefined;

    // Link task to a random contact
    const randomContactIndex = Math.floor(Math.random() * contacts.length);
    const linkedContact = contacts[randomContactIndex];

    // Link task to a random ticket if available
    const contactTickets = tickets.filter(ticket => ticket.contactId === linkedContact.id);
    const linkedTicket = contactTickets.length > 0 
      ? contactTickets[Math.floor(Math.random() * contactTickets.length)]
      : undefined;

    // Assign to a random agent
    const assignedToIndex = Math.floor(Math.random() * users.length);
    const assignedByIndex = (assignedToIndex + 1) % users.length; // Assign by a different user

    const task: Task = {
      id: `task-${i + 1}`,
      title: `Task #${i + 1} - ${categories[Math.floor(Math.random() * categories.length)]} for ${linkedContact.name}`,
      description: `This is a detailed description for task #${i + 1}. It involves working with ${linkedContact.name} from ${linkedContact.company} regarding their ${linkedTicket ? `ticket: ${linkedTicket.title}` : 'general inquiry'}.`,
      assignedTo: userIds[assignedToIndex],
      assignedBy: userIds[assignedByIndex],
      contactId: linkedContact.id,
      ticketId: linkedTicket?.id,
      dueDate: dueDate.toISOString(),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      category: categories[Math.floor(Math.random() * categories.length)],
      progress: status === 'Completed' ? 100 : Math.floor(Math.random() * 100),
      createdAt: createdAt.toISOString(),
      updatedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * (Date.now() - createdAt.getTime()))).toISOString(),
      completedAt,
      customFields: {
        department: ['Sales', 'Support', 'Marketing', 'Development'][Math.floor(Math.random() * 4)],
        estimatedHours: Math.floor(Math.random() * 8) + 1,
        relatedCompany: linkedContact.company,
        contactRole: linkedContact.jobTitle
      }
    };

    // Add attachments for some tasks
    if (Math.random() > 0.7) {
      task.attachments = Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, index) => ({
        id: `attachment-${i}-${index}`,
        name: `Document-${index + 1}.${['pdf', 'doc', 'xlsx'][Math.floor(Math.random() * 3)]}`,
        url: `https://storage.example.com/tasks/${task.id}/attachments/${index}`,
        type: ['application/pdf', 'application/msword', 'application/excel'][Math.floor(Math.random() * 3)]
      }));
    }

    // Add subtasks for some tasks
    if (Math.random() > 0.5) {
      task.subtasks = Array(Math.floor(Math.random() * 4) + 2).fill(null).map((_, index) => ({
        id: `subtask-${i}-${index}`,
        title: `Subtask ${index + 1} for ${task.title}`,
        completed: Math.random() > 0.6
      }));
    }

    // Add comments for some tasks
    if (Math.random() > 0.4) {
      task.comments = Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, index) => {
        const commentUserId = userIds[Math.floor(Math.random() * userIds.length)];
        return {
          id: `comment-${i}-${index}`,
          userId: commentUserId,
          userName: users[userIds.indexOf(commentUserId)],
          content: `This is comment ${index + 1} for the task. Providing updates on progress.`,
          timestamp: new Date(createdAt.getTime() + Math.floor(Math.random() * (Date.now() - createdAt.getTime()))).toISOString(),
          attachments: Math.random() > 0.7 ? [{
            id: `comment-attachment-${i}-${index}`,
            name: `Comment-Doc-${index + 1}.pdf`,
            url: `https://storage.example.com/comments/${task.id}/attachments/${index}`,
            type: 'application/pdf'
          }] : undefined
        };
      });
    }

    // Add reminders for some tasks
    if (Math.random() > 0.6) {
      task.reminders = Array(Math.floor(Math.random() * 2) + 1).fill(null).map((_, index) => ({
        id: `reminder-${i}-${index}`,
        type: ['Email', 'Push', 'SMS'][Math.floor(Math.random() * 3)] as 'Email' | 'Push' | 'SMS',
        time: new Date(dueDate.getTime() - (24 * 60 * 60 * 1000 * (index + 1))).toISOString(),
        sent: Math.random() > 0.5
      }));
    }

    tasks.push(task);
  }

  return tasks;
};

// First, create contacts and tickets
const contacts = generateDummyContacts(20);
const tickets = generateDummyTickets(15);

// Then create the rest of the data
const notes = generateDummyNotes(30);
const activities = generateDummyActivities(50);
const tasks = generateDummyTasks(10);

export const dummyData = {
  contacts,
  tickets,
  notes,
  activities,
  tasks
};