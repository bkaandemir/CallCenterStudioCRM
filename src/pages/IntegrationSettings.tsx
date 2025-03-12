import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Save, RefreshCw, Copy } from 'lucide-react';

interface APIConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: { [key: string]: string };
  body?: string;
}

interface WorkflowStep {
  id: string;
  triggerType: 'api_response' | 'event' | 'schedule';
  triggerValue: string;
  action: 'update_field' | 'create_record' | 'send_notification';
  targetField?: string;
  targetValue?: string;
  condition?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  steps: WorkflowStep[];
}

interface AvailableField {
  name: string;
  type: string;
  path: string;
  description?: string;
}

interface CustomField {
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

const availableFields: AvailableField[] = [
  { name: 'Contact Name', type: 'string', path: 'contact.name', description: 'Full name of the contact' },
  { name: 'Contact Email', type: 'string', path: 'contact.email', description: 'Email address' },
  { name: 'Contact Phone', type: 'string', path: 'contact.phone', description: 'Phone number' },
  { name: 'Contact Company', type: 'string', path: 'contact.company', description: 'Company name' },
  { name: 'Contact Status', type: 'string', path: 'contact.status', description: 'Current status' },
  { name: 'Ticket Title', type: 'string', path: 'ticket.title', description: 'Ticket title' },
  { name: 'Ticket Status', type: 'string', path: 'ticket.status', description: 'Ticket status' },
  { name: 'Ticket Priority', type: 'string', path: 'ticket.priority', description: 'Ticket priority level' },
  { name: 'Task Title', type: 'string', path: 'task.title', description: 'Task title' },
  { name: 'Task Status', type: 'string', path: 'task.status', description: 'Task status' },
  { name: 'Task Progress', type: 'number', path: 'task.progress', description: 'Task completion percentage' },
  { name: 'Custom Field 1', type: 'string', path: 'custom.field1', description: 'Custom field example 1' },
  { name: 'Custom Field 2', type: 'number', path: 'custom.field2', description: 'Custom field example 2' },
];

const defaultAPIs: APIConfig[] = [
  {
    id: 'api-1',
    name: 'Get Customer Data',
    endpoint: 'https://api.example.com/customers/${customerId}',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${TOKEN}'
    }
  },
  {
    id: 'api-2',
    name: 'Create Ticket',
    endpoint: 'https://api.example.com/tickets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${TOKEN}'
    },
    body: '{\n  "title": "",\n  "description": "",\n  "priority": "",\n  "customerId": ""\n}'
  }
];

const defaultWorkflows: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'New Customer Workflow',
    description: 'Automatically create tasks when a new customer is added',
    enabled: true,
    steps: [
      {
        id: 'step-1',
        triggerType: 'api_response',
        triggerValue: 'api-1',
        action: 'create_record',
        targetField: 'tasks',
        targetValue: '{"title": "Follow up with ${customer.name}", "priority": "High"}'
      }
    ]
  }
];

const templateWorkflows: Workflow[] = [
  {
    id: 'template-1',
    name: 'Çağrı Kaydı Eşleştirme',
    description: 'Gelen çağrı kayıtlarını otomatik olarak müşteri journey\'sine ekler',
    enabled: false,
    steps: [
      {
        id: 'step-1',
        triggerType: 'api_response',
        triggerValue: 'api-call-recording',
        action: 'update_field',
        targetField: 'contact.customerJourney',
        targetValue: `{
  "type": "Call",
  "date": "\${timestamp}",
  "summary": "Çağrı kaydı alındı",
  "recordingUrl": "\${recording.url}",
  "duration": "\${call.duration}",
  "sentiment": "\${call.sentiment}",
  "agentId": "\${agent.id}"
}`
      }
    ]
  },
  {
    id: 'template-2',
    name: 'VIP Müşteri Takibi',
    description: 'VIP müşterilerle ilgili özel takip ve bildirim süreci',
    enabled: false,
    steps: [
      {
        id: 'step-1',
        triggerType: 'event',
        triggerValue: 'customer.status.changed',
        action: 'create_record',
        targetField: 'tasks',
        targetValue: `{
  "title": "VIP Müşteri Takibi - \${customer.name}",
  "description": "Müşteri VIP statüsüne yükseltildi. Özel ilgi gerekiyor.",
  "priority": "High",
  "category": "Follow Up",
  "assignedTo": "\${account.manager.id}"
}`
      },
      {
        id: 'step-2',
        triggerType: 'schedule',
        triggerValue: '0 9 * * 1',  // Her Pazartesi 09:00
        action: 'send_notification',
        targetField: 'email',
        targetValue: `{
  "to": "\${account.manager.email}",
  "subject": "VIP Müşteri Haftalık Raporu - \${customer.name}",
  "template": "vip-weekly-report",
  "data": {
    "customerName": "\${customer.name}",
    "lastInteraction": "\${customer.lastInteraction}",
    "openTickets": "\${customer.tickets.open}",
    "satisfaction": "\${customer.satisfaction}"
  }
}`
      }
    ]
  },
  {
    id: 'template-3',
    name: 'Müşteri Memnuniyet Takibi',
    description: 'Ticket çözümü sonrası otomatik memnuniyet anketi ve takibi',
    enabled: false,
    steps: [
      {
        id: 'step-1',
        triggerType: 'event',
        triggerValue: 'ticket.status.resolved',
        action: 'send_notification',
        targetField: 'email',
        targetValue: `{
  "to": "\${ticket.contact.email}",
  "subject": "Nasıl yardımcı olabildik?",
  "template": "satisfaction-survey",
  "data": {
    "ticketId": "\${ticket.id}",
    "summary": "\${ticket.summary}",
    "resolution": "\${ticket.resolution}"
  }
}`
      },
      {
        id: 'step-2',
        triggerType: 'api_response',
        triggerValue: 'api-survey-response',
        action: 'update_field',
        targetField: 'contact.satisfaction',
        targetValue: '${survey.score}'
      },
      {
        id: 'step-3',
        triggerType: 'event',
        triggerValue: 'satisfaction.score.low',
        action: 'create_record',
        targetField: 'tasks',
        targetValue: `{
  "title": "Düşük Memnuniyet Takibi",
  "description": "Müşteri memnuniyet anketi düşük puan aldı. İletişime geçilmesi gerekiyor.",
  "priority": "Urgent",
  "category": "Follow Up",
  "assignedTo": "\${ticket.assignee.id}"
}`
      }
    ]
  },
  {
    id: 'template-4',
    name: 'Otomatik Görev Atama',
    description: 'Gelen ticketları öncelik ve kategoriye göre otomatik görev ataması yapar',
    enabled: false,
    steps: [
      {
        id: 'step-1',
        triggerType: 'event',
        triggerValue: 'ticket.created',
        action: 'create_record',
        targetField: 'tasks',
        targetValue: `{
  "title": "\${ticket.type} - \${ticket.title}",
  "description": "\${ticket.description}\\n\\nÖncelik: \${ticket.priority}\\nMüşteri: \${ticket.contact.name}",
  "priority": "\${ticket.priority}",
  "category": "\${ticket.type}",
  "assignedTo": "\${department.available.agent.id}"
}`
      }
    ]
  },
  {
    id: 'template-5',
    name: 'Periyodik Müşteri İletişimi',
    description: 'Düzenli müşteri iletişimi için otomatik hatırlatma ve görev oluşturma',
    enabled: false,
    steps: [
      {
        id: 'step-1',
        triggerType: 'schedule',
        triggerValue: '0 9 1 * *',  // Her ayın 1'i saat 09:00
        action: 'create_record',
        targetField: 'tasks',
        targetValue: `{
  "title": "Aylık Müşteri Görüşmesi - \${contact.name}",
  "description": "Düzenli aylık görüşme\\n\\nSon Görüşme: \${contact.lastInteraction}\\nÖnemli Notlar: \${contact.notes}",
  "priority": "Medium",
  "category": "Call",
  "dueDate": "\${date.endOfMonth}",
  "assignedTo": "\${contact.accountManager.id}"
}`
      },
      {
        id: 'step-2',
        triggerType: 'event',
        triggerValue: 'task.completed',
        action: 'update_field',
        targetField: 'contact.lastInteraction',
        targetValue: '${now}'
      }
    ]
  }
];

const defaultCustomFields: CustomField[] = [
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
];

const IntegrationSettings: React.FC = () => {
  const [apis, setApis] = useState<APIConfig[]>(defaultAPIs);
  const [workflows, setWorkflows] = useState<Workflow[]>(defaultWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testResponse, setTestResponse] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiMethod, setApiMethod] = useState<string>('GET');
  const [apiHeaders, setApiHeaders] = useState<string>('');
  const [apiBody, setApiBody] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>(defaultCustomFields);
  const [newCustomField, setNewCustomField] = useState<Partial<CustomField>>({
    type: 'text',
    module: 'contact'
  });
  const [showNewFieldModal, setShowNewFieldModal] = useState(false);

  const addNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${workflows.length + 1}`,
      name: 'New Workflow',
      description: '',
      enabled: true,
      steps: []
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow.id);
  };

  const addWorkflowStep = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const newStep: WorkflowStep = {
      id: `step-${workflow.steps.length + 1}`,
      triggerType: 'api_response',
      triggerValue: '',
      action: 'update_field',
      targetField: '',
      targetValue: ''
    };

    const updatedWorkflows = workflows.map(w => 
      w.id === workflowId 
        ? { ...w, steps: [...w.steps, newStep] }
        : w
    );
    setWorkflows(updatedWorkflows);
  };

  const updateWorkflowStep = (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => {
    const updatedWorkflows = workflows.map(w => 
      w.id === workflowId
        ? {
            ...w,
            steps: w.steps.map(s =>
              s.id === stepId
                ? { ...s, ...updates }
                : s
            )
          }
        : w
    );
    setWorkflows(updatedWorkflows);
  };

  const deleteWorkflowStep = (workflowId: string, stepId: string) => {
    const updatedWorkflows = workflows.map(w =>
      w.id === workflowId
        ? { ...w, steps: w.steps.filter(s => s.id !== stepId) }
        : w
    );
    setWorkflows(updatedWorkflows);
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    const updatedWorkflows = workflows.map(w =>
      w.id === workflowId
        ? { ...w, enabled: !w.enabled }
        : w
    );
    setWorkflows(updatedWorkflows);
  };

  const formatJSON = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const testAPI = async (apiId: string) => {
    setIsTestModalOpen(true);
    setTestResponse('Testing API...');
    
    // Simulate API call with formatted response
    setTimeout(() => {
      const response = {
        status: 'success',
        data: {
          customerId: 'CUST123',
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Acme Inc',
          tickets: [
            {
              id: 'TKT456',
              title: 'Integration Issue',
              status: 'Open',
              priority: 'High'
            }
          ],
          tasks: [
            {
              id: 'TSK789',
              title: 'Follow-up Call',
              status: 'Pending',
              progress: 25
            }
          ],
          customFields: {
            lastContact: '2024-03-15',
            accountValue: 50000,
            preferredContact: 'email'
          }
        },
        timestamp: new Date().toISOString()
      };
      setTestResponse(formatJSON(JSON.stringify(response)));
    }, 1000);
  };

  const addTemplateWorkflow = (template: Workflow) => {
    const newWorkflow = {
      ...template,
      id: `workflow-${workflows.length + 1}`,
      enabled: false
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow.id);
    setShowTemplates(false);
  };

  const addCustomField = () => {
    const field: CustomField = {
      id: `cf-${customFields.length + 1}`,
      name: newCustomField.name || '',
      type: newCustomField.type as CustomField['type'],
      module: newCustomField.module as CustomField['module'],
      description: newCustomField.description,
      options: newCustomField.type === 'select' ? newCustomField.options : undefined,
      defaultValue: newCustomField.defaultValue,
      required: newCustomField.required,
      path: `${newCustomField.module}.${newCustomField.name?.toLowerCase().replace(/\s+/g, '_')}`
    };

    setCustomFields([...customFields, field]);
    setNewCustomField({
      type: 'text',
      module: 'contact'
    });
    setShowNewFieldModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#1c1c1c]">Integration Settings</h1>
          <button
            onClick={() => setShowCustomFields(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            <span>Özel Alan Ekle</span>
          </button>
        </div>

        {/* Custom Fields Modal */}
        {showCustomFields && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[800px] max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Özel Alan Yönetimi</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowNewFieldModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus size={20} />
                    <span>Yeni Alan</span>
                  </button>
                  <button
                    onClick={() => setShowCustomFields(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Field List */}
              <div className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-lg">{field.name}</h4>
                        <p className="text-sm text-gray-500">{field.description}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        field.module === 'contact' ? 'bg-blue-100 text-blue-700' :
                        field.module === 'ticket' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {field.module.charAt(0).toUpperCase() + field.module.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Tip</p>
                        <p className="text-sm font-medium">{field.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">API Path</p>
                        <p className="text-sm font-medium font-mono">{field.path}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Varsayılan Değer</p>
                        <p className="text-sm font-medium">
                          {field.defaultValue !== undefined ? String(field.defaultValue) : '-'}
                        </p>
                      </div>
                    </div>
                    {field.options && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Seçenekler</p>
                        <div className="flex flex-wrap gap-2">
                          {field.options.map((option, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* New Field Modal */}
        {showNewFieldModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Yeni Özel Alan</h3>
                <button
                  onClick={() => setShowNewFieldModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alan Adı
                  </label>
                  <input
                    type="text"
                    value={newCustomField.name || ''}
                    onChange={(e) => setNewCustomField({...newCustomField, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Örn: Müşteri Değeri"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modül
                  </label>
                  <select
                    value={newCustomField.module}
                    onChange={(e) => setNewCustomField({...newCustomField, module: e.target.value as CustomField['module']})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="contact">Müşteri</option>
                    <option value="ticket">Ticket</option>
                    <option value="task">Görev</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Veri Tipi
                  </label>
                  <select
                    value={newCustomField.type}
                    onChange={(e) => setNewCustomField({...newCustomField, type: e.target.value as CustomField['type']})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="text">Metin</option>
                    <option value="number">Sayı</option>
                    <option value="date">Tarih</option>
                    <option value="select">Seçim</option>
                    <option value="boolean">Evet/Hayır</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newCustomField.description || ''}
                    onChange={(e) => setNewCustomField({...newCustomField, description: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Alan hakkında açıklama"
                    rows={3}
                  />
                </div>

                {newCustomField.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seçenekler (Her satıra bir seçenek)
                    </label>
                    <textarea
                      value={newCustomField.options?.join('\n') || ''}
                      onChange={(e) => setNewCustomField({
                        ...newCustomField,
                        options: e.target.value.split('\n').filter(Boolean)
                      })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2"
                      placeholder="Seçenek 1&#10;Seçenek 2&#10;Seçenek 3"
                      rows={4}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Varsayılan Değer
                  </label>
                  <input
                    type={newCustomField.type === 'number' ? 'number' : 'text'}
                    value={newCustomField.defaultValue || ''}
                    onChange={(e) => setNewCustomField({...newCustomField, defaultValue: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Varsayılan değer"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newCustomField.required || false}
                    onChange={(e) => setNewCustomField({...newCustomField, required: e.target.checked})}
                    className="rounded text-[#4e86fd]"
                  />
                  <label className="text-sm text-gray-700">
                    Bu alan zorunlu
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewFieldModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={addCustomField}
                  className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
                >
                  Alan Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APIs Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Available APIs</h2>
          <div className="space-y-4">
            {apis.map(api => (
              <div key={api.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-[#1c1c1c]">{api.name}</h3>
                  <button
                    onClick={() => testAPI(api.id)}
                    className="px-3 py-1 text-sm bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
                  >
                    Test API
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Endpoint</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        api.method === 'GET' ? 'bg-green-100 text-green-700' :
                        api.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        api.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {api.method}
                      </span>
                      <p className="text-sm font-medium flex-1 font-mono bg-gray-50 p-2 rounded">{api.endpoint}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Headers</p>
                    <pre className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {formatJSON(JSON.stringify(api.headers))}
                    </pre>
                  </div>
                  {api.body && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Body</p>
                      <pre className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {formatJSON(api.body)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Workflows</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center space-x-2 px-4 py-2 text-[#4e86fd] border border-[#4e86fd] rounded-lg hover:bg-[#4e86fd]/10"
              >
                <Plus size={20} />
                <span>Template Ekle</span>
              </button>
              <button
                onClick={addNewWorkflow}
                className="flex items-center space-x-2 px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={20} />
                <span>Yeni Workflow</span>
              </button>
            </div>
          </div>

          {/* Template Modal */}
          {showTemplates && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[800px] max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Workflow Template'leri</h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  {templateWorkflows.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-lg">{template.name}</h4>
                        <button
                          onClick={() => addTemplateWorkflow(template)}
                          className="px-3 py-1 text-sm bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600"
                        >
                          Template'i Kullan
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      <div className="space-y-3">
                        {template.steps.map((step, index) => (
                          <div key={step.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="font-medium">Adım {index + 1}:</span>
                              <span>{step.triggerType === 'api_response' ? 'API Yanıtı' :
                                    step.triggerType === 'event' ? 'Olay' : 'Zamanlama'}</span>
                              <span>→</span>
                              <span>{step.action === 'update_field' ? 'Alan Güncelle' :
                                    step.action === 'create_record' ? 'Kayıt Oluştur' : 'Bildirim Gönder'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Workflow List */}
            <div className="col-span-4 border-r border-gray-200 pr-6">
              <div className="space-y-4">
                {workflows.map(workflow => (
                  <div
                    key={workflow.id}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                    className={`p-4 rounded-lg cursor-pointer ${
                      selectedWorkflow === workflow.id
                        ? 'bg-[#4e86fd]/10 border-[#4e86fd] border'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#1c1c1c]">{workflow.name}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWorkflowStatus(workflow.id);
                          }}
                          className={`px-2 py-1 text-xs rounded-full ${
                            workflow.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {workflow.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{workflow.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{workflow.steps.length} steps</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Detail */}
            <div className="col-span-8">
              {selectedWorkflow && (
                <div>
                  {workflows.find(w => w.id === selectedWorkflow)?.steps.map((step, index) => (
                    <div key={step.id} className="mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#4e86fd] text-white flex items-center justify-center">
                          {index + 1}
                        </div>
                        <h4 className="font-medium">Step {index + 1}</h4>
                        <button
                          onClick={() => deleteWorkflowStep(selectedWorkflow, step.id)}
                          className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trigger Type
                          </label>
                          <select
                            value={step.triggerType}
                            onChange={(e) => updateWorkflowStep(selectedWorkflow, step.id, {
                              triggerType: e.target.value as WorkflowStep['triggerType']
                            })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <option value="api_response">API Response</option>
                            <option value="event">Event</option>
                            <option value="schedule">Schedule</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trigger Value
                          </label>
                          {step.triggerType === 'api_response' ? (
                            <select
                              value={step.triggerValue}
                              onChange={(e) => updateWorkflowStep(selectedWorkflow, step.id, {
                                triggerValue: e.target.value
                              })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2"
                            >
                              <option value="">Select API</option>
                              {apis.map(api => (
                                <option key={api.id} value={api.id}>{api.name}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={step.triggerValue}
                              onChange={(e) => updateWorkflowStep(selectedWorkflow, step.id, {
                                triggerValue: e.target.value
                              })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2"
                              placeholder={step.triggerType === 'event' ? 'Event name' : 'Cron expression'}
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Action
                          </label>
                          <select
                            value={step.action}
                            onChange={(e) => updateWorkflowStep(selectedWorkflow, step.id, {
                              action: e.target.value as WorkflowStep['action']
                            })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <option value="update_field">Update Field</option>
                            <option value="create_record">Create Record</option>
                            <option value="send_notification">Send Notification</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Field
                          </label>
                          <select
                            value={step.targetField}
                            onChange={(e) => updateWorkflowStep(selectedWorkflow, step.id, {
                              targetField: e.target.value
                            })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <option value="">Select a field</option>
                            {availableFields.map((field) => (
                              <option key={field.path} value={field.path}>
                                {field.name} ({field.type})
                              </option>
                            ))}
                          </select>
                          {step.targetField && (
                            <p className="text-xs text-gray-500 mt-1">
                              {availableFields.find(f => f.path === step.targetField)?.description}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Value
                          </label>
                          <input
                            type="text"
                            value={step.targetValue}
                            onChange={(e) => updateWorkflowStep(selectedWorkflow, step.id, {
                              targetValue: e.target.value
                            })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                            placeholder="Value or template"
                          />
                        </div>
                      </div>

                      {index < workflows.find(w => w.id === selectedWorkflow)!.steps.length - 1 && (
                        <div className="flex items-center justify-center my-4">
                          <ArrowRight className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => addWorkflowStep(selectedWorkflow)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#4e86fd] border border-[#4e86fd] rounded-lg hover:bg-[#4e86fd]/10"
                    >
                      <Plus size={20} />
                      <span>Add Step</span>
                    </button>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-[#4e86fd] text-white rounded-lg hover:bg-blue-600">
                        Save Workflow
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test API Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">API Test Results</h3>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => copyToClipboard(testResponse)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Copy size={16} />
                  <span>{copiedToClipboard ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[500px] font-mono text-sm">
                {testResponse}
              </pre>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Available Variables</h4>
              <div className="grid grid-cols-2 gap-4">
                {testResponse && testResponse !== 'Testing API...' && (
                  Object.entries(JSON.parse(testResponse).data).map(([key, value]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">${key}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {typeof value === 'object' ? 'Object' : String(value)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationSettings; 