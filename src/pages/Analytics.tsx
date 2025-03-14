import React, { useState, useEffect } from 'react';
import {
  BarChart2, PieChart, TrendingUp, Users, Ticket, CheckSquare,
  Plus, Settings, Trash2, Save, X, Edit2, Eye, Download, Filter,
  Calendar, DollarSign, Clock, Star, AlertCircle, HelpCircle,
  Sliders, Share2, FileText, Grid
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  AreaChart, Area, ResponsiveContainer, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';

interface DashboardWidget {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'stats' | 'table' | 'scatter' | 'radar' | 'heatmap' | 'gauge' | 'composed' | 'radialBar';
  title: string;
  size: 'small' | 'medium' | 'large';
  dataSource: string;
  config: {
    metrics?: string[];
    dimensions?: string[];
    filters?: any[];
    colors?: string[];
    showLegend?: boolean;
    customFormulas?: string[];
    drilldownEnabled?: boolean;
    conditionalFormatting?: {
      field: string;
      condition: 'equals' | 'greater' | 'less' | 'between';
      value: any;
      color: string;
    }[];
    [key: string]: any;
  };
  sharedWith?: string[];
  lastModified?: string;
  creator?: string;
  notes?: string[];
}

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

// Sample data for charts
const monthlyContactsData = [
  { month: 'Jan', newContacts: 65, activeContacts: 120, meetings: 30 },
  { month: 'Feb', newContacts: 78, activeContacts: 150, meetings: 45 },
  { month: 'Mar', newContacts: 90, activeContacts: 180, meetings: 50 },
  { month: 'Apr', newContacts: 81, activeContacts: 200, meetings: 40 },
  { month: 'May', newContacts: 95, activeContacts: 220, meetings: 55 },
  { month: 'Jun', newContacts: 110, activeContacts: 250, meetings: 65 },
];

const ticketDistributionData = [
  { name: 'Open', value: 30, color: '#4e86fd' },
  { name: 'In Progress', value: 45, color: '#f59e0b' },
  { name: 'Resolved', value: 85, color: '#10b981' },
  { name: 'Closed', value: 40, color: '#6b7280' },
];

const taskCompletionData = [
  { date: '2024-01', completed: 45, total: 60 },
  { date: '2024-02', completed: 52, total: 65 },
  { date: '2024-03', completed: 58, total: 70 },
  { date: '2024-04', completed: 63, total: 75 },
  { date: '2024-05', completed: 70, total: 80 },
  { date: '2024-06', completed: 75, total: 85 },
];

const revenueData = [
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 35000 },
  { month: 'Mar', revenue: 32000 },
  { month: 'Apr', revenue: 45000 },
  { month: 'May', revenue: 47000 },
  { month: 'Jun', revenue: 52000 },
];

const scatterData = [
  { x: 10, y: 30, z: 200, name: 'Product A' },
  { x: 30, y: 50, z: 400, name: 'Product B' },
  { x: 45, y: 70, z: 300, name: 'Product C' },
  { x: 60, y: 40, z: 600, name: 'Product D' },
  { x: 75, y: 85, z: 500, name: 'Product E' }
];

const radarData = [
  { subject: 'Sales', A: 120, B: 110, fullMark: 150 },
  { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
  { subject: 'Support', A: 86, B: 130, fullMark: 150 },
  { subject: 'Development', A: 99, B: 100, fullMark: 150 },
  { subject: 'Admin', A: 85, B: 90, fullMark: 150 }
];

const radialData = [
  { name: 'Q1', value: 78, fill: '#4e86fd' },
  { name: 'Q2', value: 65, fill: '#10b981' },
  { name: 'Q3', value: 92, fill: '#f59e0b' },
  { name: 'Q4', value: 85, fill: '#6366f1' }
];

const defaultDashboards: Dashboard[] = [
  {
    id: 'sales-dashboard',
    name: 'Sales Overview',
    description: 'Key sales metrics and performance indicators',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: 'sales-stats',
        type: 'stats',
        title: 'Sales Statistics',
        size: 'small',
        dataSource: 'sales',
        config: {
          metrics: ['totalRevenue', 'averageDealSize', 'conversionRate', 'activeDeals']
        }
      },
      {
        id: 'revenue-trend',
        type: 'line',
        title: 'Revenue Trend',
        size: 'medium',
        dataSource: 'revenue',
        config: {
          metrics: ['revenue'],
          dimensions: ['month'],
          colors: ['#4e86fd']
        }
      },
      {
        id: 'deals-pipeline',
        type: 'bar',
        title: 'Deals Pipeline',
        size: 'medium',
        dataSource: 'deals',
        config: {
          metrics: ['value'],
          dimensions: ['stage'],
          colors: ['#10b981']
        }
      }
    ]
  },
  {
    id: 'customer-dashboard',
    name: 'Customer Insights',
    description: 'Customer engagement and satisfaction metrics',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: 'customer-growth',
        type: 'area',
        title: 'Customer Growth',
        size: 'large',
        dataSource: 'contacts',
        config: {
          metrics: ['newContacts', 'activeContacts'],
          dimensions: ['month'],
          colors: ['#4e86fd', '#10b981']
        }
      },
      {
        id: 'engagement-metrics',
        type: 'stats',
        title: 'Engagement Metrics',
        size: 'small',
        dataSource: 'engagement',
        config: {
          metrics: ['meetings', 'emails', 'calls', 'satisfaction']
        }
      }
    ]
  },
  {
    id: 'support-dashboard',
    name: 'Support Performance',
    description: 'Support team metrics and ticket analytics',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: 'ticket-distribution',
        type: 'pie',
        title: 'Ticket Distribution',
        size: 'medium',
        dataSource: 'tickets',
        config: {
          metrics: ['count'],
          dimensions: ['status'],
          colors: ['#4e86fd', '#f59e0b', '#10b981', '#6b7280']
        }
      },
      {
        id: 'response-times',
        type: 'bar',
        title: 'Response Times',
        size: 'medium',
        dataSource: 'tickets',
        config: {
          metrics: ['averageResponseTime'],
          dimensions: ['priority'],
          colors: ['#4e86fd']
        }
      }
    ]
  },
  {
    id: 'analytics-dashboard',
    name: 'Advanced Analytics',
    description: 'Comprehensive business metrics and KPIs',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: 'performance-scatter',
        type: 'scatter',
        title: 'Performance Analysis',
        size: 'medium',
        dataSource: 'performance',
        config: {
          metrics: ['x', 'y', 'z'],
          dimensions: ['name'],
          colors: ['#4e86fd']
        }
      },
      {
        id: 'department-radar',
        type: 'radar',
        title: 'Department Performance',
        size: 'medium',
        dataSource: 'departments',
        config: {
          metrics: ['A', 'B'],
          dimensions: ['subject'],
          colors: ['#10b981', '#f59e0b']
        }
      },
      {
        id: 'quarterly-radial',
        type: 'radialBar',
        title: 'Quarterly Progress',
        size: 'medium',
        dataSource: 'quarterly',
        config: {
          metrics: ['value'],
          dimensions: ['name'],
          colors: ['#4e86fd', '#10b981', '#f59e0b', '#6366f1']
        }
      }
    ]
  }
];

const Analytics: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>(defaultDashboards);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard>(defaultDashboards[0]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [newDashboard, setNewDashboard] = useState<Partial<Dashboard>>({
    name: '',
    description: '',
    isDefault: false,
    widgets: []
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleCreateDashboard = () => {
    const dashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name: newDashboard.name || 'New Dashboard',
      description: newDashboard.description,
      isDefault: false,
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDashboards([...dashboards, dashboard]);
    setSelectedDashboard(dashboard);
    setIsCreateMode(false);
    setNewDashboard({
      name: '',
      description: '',
      isDefault: false,
      widgets: []
    });
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (selectedDashboard.isDefault) {
      alert('Cannot delete default dashboards');
      return;
    }
    const updatedDashboards = dashboards.filter(d => d.id !== dashboardId);
    setDashboards(updatedDashboards);
    setSelectedDashboard(updatedDashboards[0]);
  };

  const renderWidget = (widget: DashboardWidget) => {
    const widgetClass = `
      bg-white rounded-xl shadow-sm p-6
      ${widget.size === 'small' ? 'col-span-1' : 
        widget.size === 'medium' ? 'col-span-2' : 
        'col-span-3'}
    `;

    switch (widget.type) {
      case 'stats':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <DollarSign className="text-[#4e86fd]" />
                  <span className="text-sm text-gray-500">Revenue</span>
                </div>
                <p className="text-2xl font-bold mt-2">$52,000</p>
                <span className="text-sm text-green-500">+12.5%</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Users className="text-[#10b981]" />
                  <span className="text-sm text-gray-500">Customers</span>
                </div>
                <p className="text-2xl font-bold mt-2">1,250</p>
                <span className="text-sm text-green-500">+8.3%</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Ticket className="text-[#f59e0b]" />
                  <span className="text-sm text-gray-500">Tickets</span>
                </div>
                <p className="text-2xl font-bold mt-2">45</p>
                <span className="text-sm text-red-500">-2.8%</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Star className="text-[#6366f1]" />
                  <span className="text-sm text-gray-500">Satisfaction</span>
                </div>
                <p className="text-2xl font-bold mt-2">4.8</p>
                <span className="text-sm text-green-500">+0.2</span>
              </div>
            </div>
          </div>
        );

      case 'bar':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyContactsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newContacts" fill="#4e86fd" name="New Contacts" />
                <Bar dataKey="activeContacts" fill="#10b981" name="Active Contacts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4e86fd" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={ticketDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {ticketDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#4e86fd"
                  fill="#4e86fd"
                  name="Completed Tasks"
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="Total Tasks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis dataKey="y" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Products" data={scatterData} fill="#4e86fd" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 'radar':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Team A" dataKey="A" stroke="#4e86fd" fill="#4e86fd" fillOpacity={0.6} />
                <Radar name="Team B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'radialBar':
        return (
          <div className={widgetClass}>
            <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart innerRadius="10%" outerRadius="80%" data={radialData}>
                <RadialBar
                  label={{ fill: '#666', position: 'insideStart' }}
                  background
                  dataKey="value"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  const renderShareModal = () => {
    if (!isShareModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Share Dashboard</h3>
            <button onClick={() => setIsShareModalOpen(false)} className="text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share with Users
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Select users...</option>
                <option value="team-a">Team A</option>
                <option value="team-b">Team B</option>
                <option value="all">All Users</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permissions
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-[#4e86fd] mr-2" />
                  <span className="text-sm">View Only</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-[#4e86fd] mr-2" />
                  <span className="text-sm">Edit</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-[#4e86fd] mr-2" />
                  <span className="text-sm">Share</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle share logic
                setIsShareModalOpen(false);
              }}
              className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1c]">Analytics</h2>
          <p className="text-gray-500">Track and analyze your business metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateMode(true)}
            className="bg-[#4e86fd] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Dashboard</span>
          </button>
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Grid size={20} />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
          <button className="border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
        {dashboards.map((dashboard) => (
          <button
            key={dashboard.id}
            onClick={() => setSelectedDashboard(dashboard)}
            className={`px-4 py-2 rounded-lg ${
              selectedDashboard.id === dashboard.id
                ? 'bg-[#4e86fd] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {dashboard.name}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Dashboard Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold">{selectedDashboard.name}</h3>
            {selectedDashboard.description && (
              <p className="text-gray-500">{selectedDashboard.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {!selectedDashboard.isDefault && (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteDashboard(selectedDashboard.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 size={20} className="text-gray-600" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowWidgetModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-3 gap-6">
          {selectedDashboard.widgets.map((widget) => (
            <div key={widget.id}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </div>

      {/* Create Dashboard Modal */}
      {isCreateMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Dashboard</h3>
              <button
                onClick={() => setIsCreateMode(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dashboard Name
                </label>
                <input
                  type="text"
                  value={newDashboard.name}
                  onChange={(e) =>
                    setNewDashboard({ ...newDashboard, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Enter dashboard name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDashboard.description}
                  onChange={(e) =>
                    setNewDashboard({ ...newDashboard, description: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 h-24"
                  placeholder="Enter dashboard description"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateMode(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDashboard}
                className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                Create Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render modals */}
      {renderShareModal()}
    </div>
  );
};

export default Analytics; 