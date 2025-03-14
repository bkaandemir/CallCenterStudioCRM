import React, { useState, useEffect } from 'react';
import { 
  Plus, Phone, MessageSquare, History, Building2, User, Mail, Search, 
  MoreHorizontal, Home, Users, Ticket, Calendar, Settings, Bell, ChevronDown,
  BarChart2, Clock, AlertCircle, Filter, Star, CheckSquare, ListTodo, Paperclip,
  MessageCircle, AlarmClock, Cog, X, LogOut, BarChart, MapPin, MoreVertical
} from 'lucide-react';
import { dummyData } from './data/dummyData';
import { Contact, TicketType, Activity, Task, CustomField, IUser, UserRole } from './types';
import IntegrationSettings from './pages/IntegrationSettings';
import Analytics from './pages/Analytics';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'contacts' | 'tickets' | 'tasks' | 'integrations' | 'users' | 'analytics'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false);
  const [contactFilter, setContactFilter] = useState('All Contacts');
  const [ticketFilter, setTicketFilter] = useState('All Tickets');
  const [taskFilter, setTaskFilter] = useState('All Tasks');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
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
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{
    type: 'contact' | 'ticket' | 'task';
    title: string;
    subtitle?: string;
  }>>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'contact' | 'ticket' | 'task' | 'activity';
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
  }>>([
    {
      id: 'n1',
      type: 'contact',
      title: 'New Contact Added',
      description: 'John Smith was added to your contacts',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      isRead: false
    },
    {
      id: 'n2',
      type: 'ticket',
      title: 'Urgent Ticket',
      description: 'New high-priority ticket requires attention',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      isRead: false
    },
    {
      id: 'n3',
      type: 'task',
      title: 'Task Due Soon',
      description: 'Follow-up task for Client Meeting is due in 1 hour',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      isRead: false
    },
    {
      id: 'n4',
      type: 'activity',
      title: 'Call Completed',
      description: 'Phone call with Sarah Johnson completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      isRead: true
    },
    {
      id: 'n5',
      type: 'contact',
      title: 'Contact Updated',
      description: 'Contact details updated for Tech Corp',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      isRead: true
    }
  ]);

  const recentContacts = dummyData.contacts.slice(0, 5);
  const pendingTickets = dummyData.tickets.filter(ticket => ticket.status === 'Open' || ticket.status === 'In Progress');
  const recentActivities = dummyData.activities.slice(0, 5);

  const [currentUser, setCurrentUser] = useState<IUser | null>(dummyData.users[0]); // Default to admin
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [users, setUsers] = useState<IUser[]>(dummyData.users);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

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

  // Filter functions
  const getFilteredContacts = () => {
    let filtered = [...dummyData.contacts];
    
    if (contactFilter === 'VIP Contacts') {
      filtered = filtered.filter(contact => contact.tags.includes('VIP'));
    } else if (contactFilter === 'Active Contacts') {
      filtered = filtered.filter(contact => contact.status === 'Active');
    } else if (contactFilter === 'Inactive Contacts') {
      filtered = filtered.filter(contact => contact.status === 'Inactive');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getFilteredTickets = () => {
    let filtered = [...dummyData.tickets];
    
    if (ticketFilter === 'Open Tickets') {
      filtered = filtered.filter(ticket => ticket.status === 'Open');
    } else if (ticketFilter === 'In Progress') {
      filtered = filtered.filter(ticket => ticket.status === 'In Progress');
    } else if (ticketFilter === 'Resolved') {
      filtered = filtered.filter(ticket => ticket.status === 'Resolved');
    } else if (ticketFilter === 'Closed') {
      filtered = filtered.filter(ticket => ticket.status === 'Closed');
    }
    
    return filtered;
  };

  const getFilteredTasks = () => {
    let filtered = [...dummyData.tasks];
    
    if (taskFilter === 'My Tasks') {
      filtered = filtered.filter(task => task.assignedTo === 'user-1');
    } else if (taskFilter === 'Assigned by Me') {
      filtered = filtered.filter(task => task.assignedBy === 'user-1');
    } else if (taskFilter === 'Completed Tasks') {
      filtered = filtered.filter(task => task.status === 'Completed');
    } else if (taskFilter === 'Overdue Tasks') {
      filtered = filtered.filter(task => new Date(task.dueDate) < new Date());
    }
    
    return filtered;
  };

  // Quick actions for dashboard contacts
  const handleQuickAction = (contact: Contact, action: 'call' | 'email' | 'message' | 'details' | 'more') => {
    switch (action) {
      case 'call':
        window.location.href = `tel:${contact.phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${contact.email}`;
        break;
      case 'message':
        setSelectedContact(contact);
        setIsMessageModalOpen(true);
        break;
      case 'details':
        setSelectedContact(contact);
        setIsContactDetailModalOpen(true);
        break;
      case 'more':
        setSelectedContact(contact);
        setIsContactDetailModalOpen(true);
        break;
    }
  };

  const handleSendMessage = () => {
    if (!selectedContact || !messageText.trim()) return;
    
    // Burada gerçek bir mesajlaşma sistemi entegrasyonu yapılabilir
    console.log('Message sent to:', selectedContact.name, 'Message:', messageText);
    
    // Modal'ı kapat ve formu temizle
    setIsMessageModalOpen(false);
    setMessageText('');
  };

  const renderMessageModal = () => {
    if (!selectedContact) return null;

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isMessageModalOpen ? '' : 'hidden'}`}>
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Send Message</h2>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(selectedContact.name)} flex items-center justify-center text-white text-lg font-semibold`}>
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContact.company}</p>
                </div>
              </div>
              
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add search suggestions function
  const updateSearchSuggestions = (term: string) => {
    if (!term.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions: Array<{
      type: 'contact' | 'ticket' | 'task';
      title: string;
      subtitle?: string;
    }> = [];

    // Search in contacts
    const contactMatches = dummyData.contacts
      .filter(contact => 
        contact.name.toLowerCase().includes(term.toLowerCase()) ||
        contact.email.toLowerCase().includes(term.toLowerCase()) ||
        contact.company.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 2);

    suggestions.push(
      ...contactMatches.map(contact => ({
        type: 'contact' as const,
        title: contact.name,
        subtitle: contact.company
      }))
    );

    // Search in tickets
    const ticketMatches = dummyData.tickets
      .filter(ticket =>
        ticket.title.toLowerCase().includes(term.toLowerCase()) ||
        ticket.description.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 2);

    suggestions.push(
      ...ticketMatches.map(ticket => ({
        type: 'ticket' as const,
        title: ticket.title,
        subtitle: `Status: ${ticket.status}`
      }))
    );

    // Search in tasks
    const taskMatches = dummyData.tasks
      .filter(task =>
        task.title.toLowerCase().includes(term.toLowerCase()) ||
        task.description.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 1);

    suggestions.push(
      ...taskMatches.map(task => ({
        type: 'task' as const,
        title: task.title,
        subtitle: `Priority: ${task.priority}`
      }))
    );

    setSearchSuggestions(suggestions.slice(0, 5));
  };

  // Update search suggestions when search term changes
  useEffect(() => {
    updateSearchSuggestions(searchTerm);
  }, [searchTerm]);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsProfileDropdownOpen(false);
    setCurrentView('dashboard');
  };

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = (updatedUser: IUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsEditUserModalOpen(false);
  };

  const handleProfileSettings = () => {
    setIsProfileSettingsModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const handleUserManagement = () => {
    setIsUserManagementModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'analytics':
        return <Analytics />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'dashboard':
        return (
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
                        <button 
                          onClick={() => setCurrentView('contacts')}
                          className="text-[#4e86fd] hover:text-blue-700 text-sm font-medium"
                        >
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
                            <button 
                              onClick={() => handleQuickAction(contact, 'call')}
                              className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors"
                            >
                              <Phone size={18} className="text-[#4e86fd]" />
                            </button>
                            <button 
                              onClick={() => handleQuickAction(contact, 'email')}
                              className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors"
                            >
                              <Mail size={18} className="text-[#4e86fd]" />
                            </button>
                            <button 
                              onClick={() => handleQuickAction(contact, 'message')}
                              className="p-2 hover:bg-[#4e86fd]/10 rounded-full transition-colors"
                            >
                              <MessageSquare size={18} className="text-[#4e86fd]" />
                            </button>
                            <button 
                              onClick={() => handleQuickAction(contact, 'more')}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
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
        );
      case 'contacts':
        return renderContacts();
      case 'tickets':
        return renderTickets();
      case 'tasks':
        return renderTasks();
      case 'users':
        if (!currentUser?.permissions.canManageUsers) {
          return (
            <div className="p-8 text-center">
              <p className="text-gray-500">You don't have permission to access this page.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">User Management</h2>
              <button
                onClick={() => setIsUserManagementModalOpen(true)}
                className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add User</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{user.email}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Settings size={20} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Profile dropdown menu
  const renderProfileDropdown = () => {
    if (!isProfileDropdownOpen) return null;

    return (
      <div className="absolute right-0 top-16 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="font-semibold text-gray-800">{currentUser?.name}</div>
          <div className="text-sm text-gray-600">{currentUser?.email}</div>
          <div className="text-sm text-gray-500">{currentUser?.department}</div>
        </div>
        
        <div className="py-1">
          <button
            onClick={handleProfileSettings}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <User size={18} />
            Profile Settings
          </button>
          
          <button
            onClick={handleChangePassword}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Settings size={18} />
            Change Password
          </button>
          
          {currentUser?.role === 'admin' && (
            <button
              onClick={handleUserManagement}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Users size={18} />
              User Management
            </button>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-1">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    );
  };

  // Profile Settings Modal
  const renderProfileSettingsModal = () => {
    if (!isProfileSettingsModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[500px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            <button onClick={() => setIsProfileSettingsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={currentUser?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={currentUser?.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={currentUser?.department}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={currentUser?.role}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsProfileSettingsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Change Password Modal
  const renderChangePasswordModal = () => {
    if (!isChangePasswordModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[400px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle password change logic here
                setIsChangePasswordModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-pink-500 to-rose-500',
      'bg-gradient-to-br from-purple-500 to-indigo-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-teal-500 to-emerald-500',
      'bg-gradient-to-br from-amber-500 to-orange-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderContacts = () => {
    const filteredContacts = getFilteredContacts();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1c1c1c]">Contacts</h2>
            <p className="text-gray-500">Manage your contacts and relationships</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNewContactModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm"
            >
              <Plus size={20} />
              <span>Add Contact</span>
            </button>
            <button
              onClick={() => setFilterModalOpen(true)}
              className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all duration-200"
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${getAvatarColor(contact.name)} flex items-center justify-center text-white text-xl font-semibold shadow-sm transform group-hover:scale-105 transition-transform duration-200`}>
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Building2 size={14} className="mr-1 text-gray-400" />
                        {contact.company}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <User size={14} className="mr-1 text-gray-400" />
                        {contact.jobTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {contact.tags.includes('VIP') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                        VIP
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.phone}
                  </div>
                  {contact.location && (
                    <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {contact.location}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center -space-x-1">
                    <button
                      onClick={() => handleQuickAction(contact, 'call')}
                      className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title="Call"
                    >
                      <Phone size={18} />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Call</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction(contact, 'email')}
                      className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
                      title="Email"
                    >
                      <Mail size={18} />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Email</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction(contact, 'message')}
                      className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                      title="Message"
                    >
                      <MessageSquare size={18} />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Message</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuickAction(contact, 'details')}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleQuickAction(contact, 'more')}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTickets = () => {
    const filteredTickets = getFilteredTickets();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1c1c1c]">Tickets</h2>
            <p className="text-gray-500">Manage support tickets and inquiries</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Ticket</span>
            </button>
            <button
              onClick={() => setFilterModalOpen(true)}
              className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                  ticket.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                  ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MessageCircle size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Paperclip size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTasks = () => {
    const filteredTasks = getFilteredTasks();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1c1c1c]">Tasks</h2>
            <p className="text-gray-500">Manage your tasks and follow-ups</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => setFilterModalOpen(true)}
              className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'Not Started' ? 'bg-gray-100 text-gray-700' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {task.status}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#4e86fd] h-2 rounded-full"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  <span>Category: {task.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <AlarmClock size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MessageCircle size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-6 py-3 ${
              currentView === 'analytics' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart size={20} />
            <span>Analytics</span>
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
          {currentUser?.permissions.canManageUsers && (
            <button 
              onClick={() => setCurrentView('users')}
              className={`w-full flex items-center space-x-3 px-6 py-3 ${
                currentView === 'users' ? 'bg-[#4e86fd]/10 text-[#4e86fd] border-r-4 border-[#4e86fd]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
          )}
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
                   currentView === 'tasks' ? 'Tasks' :
                   currentView === 'users' ? 'Users' : 'Integrations'}
                </h2>
              </div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search contacts, tickets, tasks..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4e86fd]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            setSearchTerm(suggestion.title);
                            if (suggestion.type === 'contact') setCurrentView('contacts');
                            if (suggestion.type === 'ticket') setCurrentView('tickets');
                            if (suggestion.type === 'task') setCurrentView('tasks');
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {suggestion.type === 'contact' && <Users size={16} className="text-blue-500" />}
                            {suggestion.type === 'ticket' && <Ticket size={16} className="text-orange-500" />}
                            {suggestion.type === 'task' && <CheckSquare size={16} className="text-green-500" />}
                            <div>
                              <p className="text-sm font-medium text-gray-800">{suggestion.title}</p>
                              {suggestion.subtitle && (
                                <p className="text-xs text-gray-500">{suggestion.subtitle}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button 
                    className="relative p-2 hover:bg-gray-100 rounded-full"
                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                  >
                    <Bell size={20} className="text-gray-600" />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">Notifications</h3>
                          <button 
                            className="text-sm text-[#4e86fd] hover:text-blue-700"
                            onClick={() => {
                              setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                            }}
                          >
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              setNotifications(notifications.map(n =>
                                n.id === notification.id ? { ...n, isRead: true } : n
                              ));
                              // Handle navigation based on notification type
                              if (notification.type === 'contact') setCurrentView('contacts');
                              if (notification.type === 'ticket') setCurrentView('tickets');
                              if (notification.type === 'task') setCurrentView('tasks');
                              setIsNotificationDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${
                                notification.type === 'contact' ? 'bg-blue-100 text-blue-700' :
                                notification.type === 'ticket' ? 'bg-orange-100 text-orange-700' :
                                notification.type === 'task' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {notification.type === 'contact' && <Users size={16} />}
                                {notification.type === 'ticket' && <Ticket size={16} />}
                                {notification.type === 'task' && <CheckSquare size={16} />}
                                {notification.type === 'activity' && <History size={16} />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-500">{notification.description}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button 
                          className="w-full text-center text-sm text-[#4e86fd] hover:text-blue-700"
                          onClick={() => setCurrentView('dashboard')}
                        >
                          View All Activities
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-[#1c1c1c]">{currentUser?.name}</p>
                      <p className="text-gray-500">{currentUser?.role}</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Render dropdowns and modals */}
        {renderProfileDropdown()}
        {renderProfileSettingsModal()}
        {renderChangePasswordModal()}

        {/* Main Content Area */}
        <main className="p-8">
          {renderContent()}
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

      {/* Contact Detail Modal */}
      {isContactDetailModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Contact Details</h3>
              <button 
                onClick={() => setIsContactDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Contact Header */}
            <div className="flex items-center space-x-4 mb-6">
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-16 h-16 rounded-full" />
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg font-medium">{selectedContact.name}</h4>
                  {selectedContact.tags.includes('VIP') && (
                    <span className="px-2 py-1 text-xs bg-[#F47A00]/10 text-[#F47A00] rounded-full">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-gray-500">{selectedContact.jobTitle} at {selectedContact.company}</p>
              </div>
            </div>

            {/* Rest of the contact detail content */}
            <div className="space-y-6">
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
                            value={selectedContact.customFields[field.path] || field.defaultValue}
                            onChange={(e) => {
                              const updatedContact = {...selectedContact};
                              updatedContact.customFields[field.path] = e.target.value;
                              // Burada normalde bir API çağrısı yapılır
                              dummyData.contacts = dummyData.contacts.map(c =>
                                c.id === selectedContact.id ? updatedContact : c
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
                              checked={selectedContact.customFields[field.path] === 'true' || field.defaultValue === true}
                              onChange={(e) => {
                                const updatedContact = {...selectedContact};
                                updatedContact.customFields[field.path] = e.target.checked.toString();
                                // Burada normalde bir API çağrısı yapılır
                                dummyData.contacts = dummyData.contacts.map(c =>
                                  c.id === selectedContact.id ? updatedContact : c
                                );
                              }}
                              className="rounded text-[#4e86fd]"
                            />
                          </div>
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            value={selectedContact.customFields[field.path] || field.defaultValue || ''}
                            onChange={(e) => {
                              const updatedContact = {...selectedContact};
                              updatedContact.customFields[field.path] = e.target.value;
                              // Burada normalde bir API çağrısı yapılır
                              dummyData.contacts = dummyData.contacts.map(c =>
                                c.id === selectedContact.id ? updatedContact : c
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
                  {selectedContact.customerJourney.map((journey) => (
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
                      {Math.floor(selectedContact.callCenterData.metrics.totalCallTime / 3600)}h {Math.floor((selectedContact.callCenterData.metrics.totalCallTime % 3600) / 60)}m
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Avg. Call Duration</p>
                    <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                      {Math.floor(selectedContact.callCenterData.metrics.averageCallDuration / 60)}m
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Missed Calls</p>
                    <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                      {selectedContact.callCenterData.metrics.missedCalls}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Satisfaction Score</p>
                    <p className="text-lg font-medium text-[#1c1c1c] mt-1">
                      {selectedContact.callCenterData.metrics.satisfactionScore || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Last Interaction Summary */}
                {selectedContact.callCenterData.lastInteractionSummary && (
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-[#1c1c1c] mb-3">Last Interaction Summary</h5>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date(selectedContact.callCenterData.lastInteractionSummary.timestamp).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {selectedContact.callCenterData.lastInteractionSummary.agentName}
                        </span>
                      </div>
                      <p className="text-sm text-[#1c1c1c] mb-2">
                        {selectedContact.callCenterData.lastInteractionSummary.notes}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {selectedContact.callCenterData.lastInteractionSummary.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        {selectedContact.callCenterData.lastInteractionSummary.followUpRequired && (
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
                    {selectedContact.callCenterData.cdrLogs.map((log) => (
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
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filter {currentView}</h3>
              <button 
                onClick={() => setFilterModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {currentView === 'contacts' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={contactFilter}
                      onChange={(e) => setContactFilter(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <option>All Contacts</option>
                      <option>VIP Contacts</option>
                      <option>Active Contacts</option>
                      <option>Inactive Contacts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, email, or company"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    />
                  </div>
                </>
              )}

              {currentView === 'tickets' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option>All Tickets</option>
                    <option>Open Tickets</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              )}

              {currentView === 'tasks' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option>All Tasks</option>
                    <option>My Tasks</option>
                    <option>Assigned by Me</option>
                    <option>Completed Tasks</option>
                    <option>Overdue Tasks</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setContactFilter('All Contacts');
                  setTicketFilter('All Tickets');
                  setTaskFilter('All Tasks');
                  setFilterModalOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={selectedUser.department || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageUsers}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        permissions: { ...selectedUser.permissions, canManageUsers: e.target.checked }
                      })}
                      className="rounded text-[#4e86fd] mr-2"
                    />
                    <span className="text-sm">Can Manage Users</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageRoles}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        permissions: { ...selectedUser.permissions, canManageRoles: e.target.checked }
                      })}
                      className="rounded text-[#4e86fd] mr-2"
                    />
                    <span className="text-sm">Can Manage Roles</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canViewReports}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        permissions: { ...selectedUser.permissions, canViewReports: e.target.checked }
                      })}
                      className="rounded text-[#4e86fd] mr-2"
                    />
                    <span className="text-sm">Can View Reports</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageSettings}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        permissions: { ...selectedUser.permissions, canManageSettings: e.target.checked }
                      })}
                      className="rounded text-[#4e86fd] mr-2"
                    />
                    <span className="text-sm">Can Manage Settings</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canDeleteRecords}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        permissions: { ...selectedUser.permissions, canDeleteRecords: e.target.checked }
                      })}
                      className="rounded text-[#4e86fd] mr-2"
                    />
                    <span className="text-sm">Can Delete Records</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateUser(selectedUser)}
                className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {renderMessageModal()}
    </div>
  );
}

export default App;