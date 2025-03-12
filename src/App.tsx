import React, { useState } from 'react';
import { 
  Plus, Phone, MessageSquare, History, Building2, User, Mail, Search, 
  MoreHorizontal, Home, Users, Ticket, Calendar, Settings, Bell, ChevronDown,
  BarChart2, Clock, AlertCircle, Filter, Star, CheckSquare, ListTodo, Paperclip,
  MessageCircle, AlarmClock, Cog
} from 'lucide-react';
import { dummyData } from './data/dummyData';
import { Contact, TicketType, Activity, Task, CustomField } from './types';
import IntegrationSettings from './pages/IntegrationSettings';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'contacts' | 'tickets' | 'tasks' | 'integrations'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    status: 'Active',
    tags: []
  });
  const [newTicket, setNewTicket] = useState<Partial<TicketType>>({
    title: '',
    description: '',
    type: 'Customer Support',
    priority: 'Medium',
    status: 'Open'
  });
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Not Started',
    category: 'Follow Up',
    progress: 0
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([
    {
      id: 'cf-1',
      name: 'Müşteri Değeri',
      type: 'number',
      module: 'contact',
      description: 'Müşterinin yıllık değeri',
      defaultValue: 0,
      path: 'contact.customerValue'
    },
    {
      id: 'cf-2',
      name: 'İletişim Tercihi',
      type: 'select',
      module: 'contact',
      description: 'Tercih edilen iletişim yöntemi',
      options: ['Telefon', 'Email', 'SMS'],
      defaultValue: 'Email',
      path: 'contact.preferredContact'
    }
  ]);

  const recentContacts = dummyData.contacts.slice(0, 5);
  const pendingTickets = dummyData.tickets.filter(ticket => ticket.status === 'Open' || ticket.status === 'In Progress');
  const recentActivities = dummyData.activities.slice(0, 5);

  const handleCreateContact = () => {
    // Here you would typically make an API call
    const contact: Contact = {
      id: `contact-${Date.now()}`,
      ...newContact as Omit<Contact, 'id'>,
      lastInteraction: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.name || '')}&background=4e86fd&color=fff`,
      customFields: {},
      customerJourney: [],
      callCenterData: {
        cdrLogs: [],
        metrics: {
          totalCallTime: 0,
          averageCallDuration: 0,
          missedCalls: 0,
          responseTime: 0
        }
      }
    };
    dummyData.contacts.unshift(contact);
    setIsNewContactModalOpen(false);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      status: 'Active',
      tags: []
    });
  };

  const handleCreateTicket = () => {
    // Here you would typically make an API call
    const ticket: TicketType = {
      id: `ticket-${Date.now()}`,
      ...newTicket as Omit<TicketType, 'id'>,
      assignedTo: `agent-${Math.floor(Math.random() * 5) + 1}`,
      contactId: selectedContact?.id || dummyData.contacts[0].id,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    dummyData.tickets.unshift(ticket);
    setIsNewTicketModalOpen(false);
    setNewTicket({
      title: '',
      description: '',
      type: 'Customer Support',
      priority: 'Medium',
      status: 'Open'
    });
  };

  const handleCreateTask = () => {
    const task: Task = {
      id: `task-${Date.now()}`,
      ...newTask as Omit<Task, 'id'>,
      assignedTo: `user-${Math.floor(Math.random() * 5) + 1}`,
      assignedBy: 'user-1', // Current user
      contactId: selectedContact?.id || dummyData.contacts[0].id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      customFields: {
        department: 'Sales',
        estimatedHours: 2,
        relatedCompany: selectedContact?.company || '',
        contactRole: selectedContact?.jobTitle || ''
      }
    };
    dummyData.tasks.unshift(task);
    setIsNewTaskModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Not Started',
      category: 'Follow Up',
      progress: 0
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30">
        <div className="p-6">
          <h1 className="text-xl font-bold text-[#1c1c1c]">CCS CRM</h1>
        </div>
        <nav className="mt-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center space-x-3 px-6 py-3 ${
              currentView === 'dashboard' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setCurrentView('contacts')}
            className={`w-full flex items-center space-x-3 px-6 py-3 ${
              currentView === 'contacts' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            <span>Contacts</span>
          </button>
          <button 
            onClick={() => setCurrentView('tickets')}
            className={`w-full flex items-center space-x-3 px-6 py-3 ${
              currentView === 'tickets' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Ticket size={20} />
            <span>Tickets</span>
          </button>
          <button 
            onClick={() => setCurrentView('tasks')}
            className={`w-full flex items-center space-x-3 px-6 py-3 ${
              currentView === 'tasks' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListTodo size={20} />
            <span>Tasks</span>
          </button>
          <button 
            onClick={() => setCurrentView('integrations')}
            className={`w-full flex items-center space-x-3 px-6 py-3 ${
              currentView === 'integrations' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Cog size={20} />
            <span>Integrations</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-20">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-[#1c1c1c]">
                  {currentView === 'dashboard' ? 'Dashboard' : 
                   currentView === 'contacts' ? 'Contacts' :
                   currentView === 'tickets' ? 'Tickets' :
                   currentView === 'tasks' ? 'Tasks' : 'Integrations'}
                </h2>
              </div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4e86fd]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Doe&background=4e86fd&color=fff"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-[#1c1c1c]">John Doe</p>
                    <p className="text-gray-500">Admin</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          {currentView === 'integrations' ? (
            <IntegrationSettings />
          ) : currentView === 'dashboard' ? (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Contacts</p>
                      <h3 className="text-2xl font-bold text-[#1c1c1c] mt-1">{dummyData.contacts.length}</h3>
                    </div>
                    <div className="p-3 bg-[#4e86fd]/10 rounded-full">
                      <Users className="text-[#4e86fd]" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-green-500">
                      <BarChart2 size={16} className="mr-1" />
                      <span>+12.5% from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Open Tickets</p>
                      <h3 className="text-2xl font-bold text-[#1c1c1c] mt-1">{pendingTickets.length}</h3>
                    </div>
                    <div className="p-3 bg-[#F47A00]/10 rounded-full">
                      <Ticket className="text-[#F47A00]" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-[#F47A00]">
                      <AlertCircle size={16} className="mr-1" />
                      <span>{pendingTickets.length} needs attention</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Recent Activities</p>
                      <h3 className="text-2xl font-bold text-[#1c1c1c] mt-1">{recentActivities.length}</h3>
                    </div>
                    <div className="p-3 bg-[#39b171]/10 rounded-full">
                      <History className="text-[#39b171]" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-[#39b171]">
                      <Clock size={16} className="mr-1" />
                      <span>Last 24 hours</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">VIP Contacts</p>
                      <h3 className="text-2xl font-bold text-[#1c1c1c] mt-1">
                        {dummyData.contacts.filter(c => c.tags.includes('VIP')).length}
                      </h3>
                    </div>
                    <div className="p-3 bg-[#b36cc4]/10 rounded-full">
                      <Star className="text-[#b36cc4]" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-[#b36cc4]">
                      <BarChart2 size={16} className="mr-1" />
                      <span>+3 this week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Contacts and Tickets Grid */}
              <div className="grid grid-cols-12 gap-6">
                {/* Recent Contacts */}
                <div className="col-span-8">
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-[#1c1c1c]">Recent Contacts</h2>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Filter size={20} className="text-gray-500" />
                          </button>
                          <button className="text-[#4e86fd] hover:text-blue-700 text-sm font-medium">
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentContacts.map((contact) => (
                          <div key={contact.id} 
                               className="flex items-center justify-between p-4 hover:bg-[#f9f9f9] rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center space-x-4">
                              <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-[#1c1c1c]">{contact.name}</h3>
                                  {contact.tags.includes('VIP') && (
                                    <span className="px-2 py-1 text-xs bg-[#F47A00]/10 text-[#F47A00] rounded-full">
                                      VIP
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{contact.jobTitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors">
                                <Phone size={18} className="text-[#4e86fd]" />
                              </button>
                              <button className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors">
                                <Mail size={18} className="text-[#4e86fd]" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-full">
                                <MoreHorizontal size={18} className="text-gray-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Tickets */}
                <div className="col-span-4">
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-[#1c1c1c]">Pending Tickets</h2>
                        <button className="text-[#4e86fd] hover:text-blue-700 text-sm font-medium">
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {pendingTickets.slice(0, 5).map((ticket) => (
                          <div key={ticket.id} className="p-4 bg-[#f9f9f9] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                                ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {ticket.priority}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(ticket.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-medium text-[#1c1c1c] mb-1">{ticket.title}</h4>
                            <p className="text-sm text-gray-500 truncate">{ticket.description}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Assigned to: Agent {ticket.assignedTo.split('-')[1]}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {ticket.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentView === 'contacts' ? (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsNewContactModalOpen(true)}
                    className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
                  >
                    <Plus size={20} />
                    <span>Add Contact</span>
                  </button>
                  <button className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                    <Filter size={20} className="text-gray-600" />
                    <span>Filter</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-200 px-4 py-2 rounded-lg bg-white">
                    <option>All Contacts</option>
                    <option>VIP Contacts</option>
                    <option>Active Contacts</option>
                    <option>Inactive Contacts</option>
                  </select>
                </div>
              </div>

              {/* Contacts Grid */}
              <div className="grid grid-cols-1 gap-4">
                {dummyData.contacts.map((contact) => (
                  <div key={contact.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={contact.linkedInAvatar || contact.avatar} 
                          alt={contact.name} 
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-[#1c1c1c]">{contact.name}</h3>
                            {contact.tags.includes('VIP') && (
                              <span className="px-2 py-1 text-xs bg-[#F47A00]/10 text-[#F47A00] rounded-full">
                                VIP
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              contact.status === 'Active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">{contact.jobTitle}</p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500">{contact.company}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors">
                          <Phone size={18} className="text-[#4e86fd]" />
                        </button>
                        <button className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors">
                          <Mail size={18} className="text-[#4e86fd]" />
                        </button>
                        <button className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors">
                          <MessageSquare size={18} className="text-[#4e86fd]" />
                        </button>
                        {contact.linkedInUrl && (
                          <a 
                            href={contact.linkedInUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-[#0077b5]/10 rounded-full transition-colors"
                          >
                            <svg className="w-[18px] h-[18px] text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                          </a>
                        )}
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full"
                          onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
                        >
                          <MoreHorizontal size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">{contact.email}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">{contact.phone}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Last Interaction</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">
                          {new Date(contact.lastInteraction).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Contact Detail View */}
                    {selectedContact?.id === contact.id && (
                      <div className="mt-6 border-t border-gray-100 pt-6">
                        {/* Custom Fields */}
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-[#1c1c1c] mb-4">Özel Alanlar</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {customFields
                              .filter(field => field.module === 'contact')
                              .map((field) => (
                                <div key={field.id} className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-500">{field.name}</p>
                                  {field.type === 'select' ? (
                                    <select
                                      value={contact.customFields[field.path] || field.defaultValue}
                                      onChange={(e) => {
                                        const updatedContact = {...contact};
                                        updatedContact.customFields[field.path] = e.target.value;
                                        // Burada normalde bir API çağrısı yapılır
                                        dummyData.contacts = dummyData.contacts.map(c =>
                                          c.id === contact.id ? updatedContact : c
                                        );
                                      }}
                                      className="w-full mt-1 text-sm font-medium text-[#1c1c1c] bg-transparent border-none focus:ring-0"
                                    >
                                      {field.options?.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : field.type === 'boolean' ? (
                                    <div className="mt-1">
                                      <input
                                        type="checkbox"
                                        checked={contact.customFields[field.path] === 'true' || field.defaultValue === true}
                                        onChange={(e) => {
                                          const updatedContact = {...contact};
                                          updatedContact.customFields[field.path] = e.target.checked.toString();
                                          // Burada normalde bir API çağrısı yapılır
                                          dummyData.contacts = dummyData.contacts.map(c =>
                                            c.id === contact.id ? updatedContact : c
                                          );
                                        }}
                                        className="rounded text-[#4e86fd]"
                                      />
                                    </div>
                                  ) : (
                                    <input
                                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                      value={contact.customFields[field.path] || field.defaultValue || ''}
                                      onChange={(e) => {
                                        const updatedContact = {...contact};
                                        updatedContact.customFields[field.path] = e.target.value;
                                        // Burada normalde bir API çağrısı yapılır
                                        dummyData.contacts = dummyData.contacts.map(c =>
                                          c.id === contact.id ? updatedContact : c
                                        );
                                      }}
                                      className="w-full mt-1 text-sm font-medium text-[#1c1c1c] bg-transparent border-none focus:ring-0"
                                      placeholder={`${field.name} girin`}
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Customer Journey */}
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-[#1c1c1c] mb-4">Customer Journey</h4>
                          <div className="space-y-4">
                            {contact.customerJourney.map((journey) => (
                              <div key={journey.id} className="flex items-start space-x-4">
                                <div className={`p-2 rounded-full ${
                                  journey.type === 'Call' ? 'bg-blue-100 text-blue-700' :
                                  journey.type === 'Email' ? 'bg-purple-100 text-purple-700' :
                                  journey.type === 'Meeting' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {journey.type === 'Call' && <Phone size={16} />}
                                  {journey.type === 'Email' && <Mail size={16} />}
                                  {journey.type === 'Meeting' && <Calendar size={16} />}
                                  {journey.type === 'Note' && <MessageSquare size={16} />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-[#1c1c1c]">{journey.type}</p>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-500">
                                        {new Date(journey.date).toLocaleDateString()}
                                      </span>
                                      {journey.sentiment && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                          journey.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                          journey.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                                          'bg-gray-100 text-gray-700'
                                        }`}>
                                          {journey.sentiment}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">{journey.summary}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Call Center Data */}
                        <div>
                          <h4 className="text-lg font-medium text-[#1c1c1c] mb-4">Call Center Analytics</h4>
                          
                          {/* Metrics */}
                          <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">Total Call Time</p>
                              <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                                {Math.floor(contact.callCenterData.metrics.totalCallTime / 3600)}h {Math.floor((contact.callCenterData.metrics.totalCallTime % 3600) / 60)}m
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">Avg. Call Duration</p>
                              <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                                {Math.floor(contact.callCenterData.metrics.averageCallDuration / 60)}m
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">Missed Calls</p>
                              <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                                {contact.callCenterData.metrics.missedCalls}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">Satisfaction Score</p>
                              <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                                {contact.callCenterData.metrics.satisfactionScore || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Last Interaction Summary */}
                          {contact.callCenterData.lastInteractionSummary && (
                            <div className="mb-6">
                              <h5 className="text-md font-medium text-[#1c1c1c] mb-3">Last Interaction Summary</h5>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-500">
                                    {new Date(contact.callCenterData.lastInteractionSummary.timestamp).toLocaleString()}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {contact.callCenterData.lastInteractionSummary.agentName}
                                  </span>
                                </div>
                                <p className="text-sm text-[#1c1c1c] mb-2">
                                  {contact.callCenterData.lastInteractionSummary.notes}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {contact.callCenterData.lastInteractionSummary.tags.map((tag, index) => (
                                      <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  {contact.callCenterData.lastInteractionSummary.followUpRequired && (
                                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                                      Follow-up Required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CDR Logs */}
                          <div>
                            <h5 className="text-md font-medium text-[#1c1c1c] mb-3">Call Detail Records</h5>
                            <div className="space-y-3">
                              {contact.callCenterData.cdrLogs.map((log) => (
                                <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        log.direction === 'Inbound' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        {log.direction}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      Duration: {Math.floor(log.duration / 60)}m {log.duration % 60}s
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-sm text-gray-500">
                                        Agent {log.agentId.split('-')[1]}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        Queue: {log.metadata.queue}
                                      </span>
                                    </div>
                                    {log.recordingUrl && (
                                      <a 
                                        href={log.recordingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#4e86fd] text-sm hover:underline"
                                      >
                                        View Recording
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : currentView === 'tickets' ? (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsNewTicketModalOpen(true)}
                    className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
                  >
                    <Plus size={20} />
                    <span>Create Ticket</span>
                  </button>
                  <button className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                    <Filter size={20} className="text-gray-600" />
                    <span>Filter</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-200 px-4 py-2 rounded-lg bg-white">
                    <option>All Tickets</option>
                    <option>Open Tickets</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              {/* Tickets Grid */}
              <div className="grid grid-cols-1 gap-4">
                {dummyData.tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-[#1c1c1c]">{ticket.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                            ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal size={18} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">Agent {ticket.assignedTo.split('-')[1]}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">
                          {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentView === 'tasks' ? (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
                  >
                    <Plus size={20} />
                    <span>Create Task</span>
                  </button>
                  <button className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                    <Filter size={20} className="text-gray-600" />
                    <span>Filter</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-200 px-4 py-2 rounded-lg bg-white">
                    <option>All Tasks</option>
                    <option>My Tasks</option>
                    <option>Assigned by Me</option>
                    <option>Completed Tasks</option>
                    <option>Overdue Tasks</option>
                  </select>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 gap-4">
                {dummyData.tasks.map((task) => (
                  <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-[#1c1c1c]">{task.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                            task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'Not Started' ? 'bg-gray-100 text-gray-700' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {task.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      </div>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                      >
                        <MoreHorizontal size={18} className="text-gray-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">Progress</p>
                          <p className="text-sm font-medium text-[#1c1c1c]">{task.progress}%</p>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#4e86fd] rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="text-sm font-medium text-[#1c1c1c] mt-1">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${task.assignedBy}&background=4e86fd&color=fff`}
                            alt={task.assignedBy}
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                          <img
                            src={`https://ui-avatars.com/api/?name=${task.assignedTo}&background=39b171&color=fff`}
                            alt={task.assignedTo}
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Assigned by {task.assignedBy.split('-')[1]}</p>
                          <p className="text-xs text-gray-500">to {task.assignedTo.split('-')[1]}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        {task.attachments && (
                          <span className="flex items-center space-x-1 text-gray-500">
                            <Paperclip size={14} />
                            <span className="text-xs">{task.attachments.length}</span>
                          </span>
                        )}
                        {task.comments && (
                          <span className="flex items-center space-x-1 text-gray-500">
                            <MessageCircle size={14} />
                            <span className="text-xs">{task.comments.length}</span>
                          </span>
                        )}
                        {task.reminders && (
                          <span className="flex items-center space-x-1 text-gray-500">
                            <AlarmClock size={14} />
                            <span className="text-xs">{task.reminders.length}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Task Detail View */}
                    {selectedTask?.id === task.id && (
                      <div className="mt-6 border-t border-gray-100 pt-6">
                        {/* Subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium text-[#1c1c1c] mb-4">Subtasks</h4>
                            <div className="space-y-3">
                              {task.subtasks.map((subtask) => (
                                <div key={subtask.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={subtask.completed}
                                      className="w-4 h-4 text-[#4e86fd] rounded"
                                      readOnly
                                    />
                                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-[#1c1c1c]'}`}>
                                      {subtask.title}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comments */}
                        {task.comments && task.comments.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium text-[#1c1c1c] mb-4">Comments</h4>
                            <div className="space-y-4">
                              {task.comments.map((comment) => (
                                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <img
                                      src={`https://ui-avatars.com/api/?name=${comment.userName}&background=random`}
                                      alt={comment.userName}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-[#1c1c1c]">{comment.userName}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(comment.timestamp).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600">{comment.content}</p>
                                  {comment.attachments && (
                                    <div className="mt-2 flex items-center space-x-2">
                                      {comment.attachments.map((attachment) => (
                                        <a
                                          key={attachment.id}
                                          href={attachment.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center space-x-1 text-[#4e86fd] text-sm hover:underline"
                                        >
                                          <Paperclip size={14} />
                                          <span>{attachment.name}</span>
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reminders */}
                        {task.reminders && task.reminders.length > 0 && (
                          <div>
                            <h4 className="text-lg font-medium text-[#1c1c1c] mb-4">Reminders</h4>
                            <div className="space-y-3">
                              {task.reminders.map((reminder) => (
                                <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      reminder.type === 'Email' ? 'bg-blue-100 text-blue-700' :
                                      reminder.type === 'Push' ? 'bg-purple-100 text-purple-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {reminder.type}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {new Date(reminder.time).toLocaleString()}
                                    </span>
                                  </div>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    reminder.sent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {reminder.sent ? 'Sent' : 'Pending'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* New Contact Modal */}
      {isNewContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Create New Contact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={newContact.jobTitle}
                  onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsNewContactModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContact}
                className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                Create Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Create New Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newTicket.type}
                  onChange={(e) => setNewTicket({...newTicket, type: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option>Customer Support</option>
                  <option>Technical Issue</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Billing Query</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[600px]">
            <h3 className="text-xl font-bold mb-4">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 h-24"
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as Task['category']})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option>Follow Up</option>
                    <option>Call</option>
                    <option>Meeting</option>
                    <option>Email</option>
                    <option>Documentation</option>
                    <option>Research</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTask.progress}
                  onChange={(e) => setNewTask({...newTask, progress: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0%</span>
                  <span>{newTask.progress}%</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value as Task['status']})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;