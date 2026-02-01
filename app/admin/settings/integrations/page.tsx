'use client'

import { useState } from 'react'
import {
  Globe,
  CreditCard,
  Mail,
  BarChart3,
  Video,
  MessageSquare,
  Webhook,
  Plus,
  Settings,
  Shield,
  Award,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Save,
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock integrations data
const integrations = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscriptions',
    icon: CreditCard,
    category: 'payments',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    connected: true,
    lastSync: '2 min ago',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Alternative payment method',
    icon: CreditCard,
    category: 'payments',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    connected: false,
    lastSync: null,
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Transactional and marketing emails',
    icon: Mail,
    category: 'email',
    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    connected: true,
    lastSync: '5 min ago',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing automation',
    icon: Mail,
    category: 'email',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    connected: false,
    lastSync: null,
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Website traffic and user behavior',
    icon: BarChart3,
    category: 'analytics',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    connected: true,
    lastSync: '1 hour ago',
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Product analytics and event tracking',
    icon: BarChart3,
    category: 'analytics',
    color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    connected: false,
    lastSync: null,
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Live video sessions and webinars',
    icon: Video,
    category: 'video',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    connected: true,
    lastSync: '30 min ago',
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    description: 'Video hosting and streaming',
    icon: Video,
    category: 'video',
    color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    connected: false,
    lastSync: null,
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Customer messaging and support',
    icon: MessageSquare,
    category: 'support',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    connected: false,
    lastSync: null,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team notifications and alerts',
    icon: MessageSquare,
    category: 'communication',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    connected: true,
    lastSync: '10 min ago',
  },
]

// Mock webhooks
const mockWebhooks = [
  { id: '1', name: 'New Enrollment', url: 'https://api.example.com/webhooks/enrollment', events: ['student.enrolled'], active: true },
  { id: '2', name: 'Course Completion', url: 'https://api.example.com/webhooks/completion', events: ['course.completed'], active: true },
  { id: '3', name: 'Payment Received', url: 'https://api.example.com/webhooks/payment', events: ['payment.received'], active: false },
]

export default function IntegrationsPage() {
  const [integrationList, setIntegrationList] = useState(integrations)
  const [webhooks, setWebhooks] = useState(mockWebhooks)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [filter, setFilter] = useState('all')
  const [configuring, setConfiguring] = useState<string | null>(null)

  const apiKey = 'sk_live_phazur_1234567890abcdefghijklmnop'

  const handleConnect = (integrationId: string) => {
    setConfiguring(integrationId)
    setTimeout(() => {
      setIntegrationList(prev =>
        prev.map(i =>
          i.id === integrationId
            ? { ...i, connected: true, lastSync: 'Just now' }
            : i
        )
      )
      setConfiguring(null)
      toast.success(`Connected to ${integrationList.find(i => i.id === integrationId)?.name}`)
    }, 1500)
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrationList(prev =>
      prev.map(i =>
        i.id === integrationId
          ? { ...i, connected: false, lastSync: null }
          : i
      )
    )
    toast.success('Integration disconnected')
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast.success('API key copied to clipboard')
  }

  const handleRegenerateKey = () => {
    toast.success('API key regenerated')
  }

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev =>
      prev.map(w =>
        w.id === webhookId ? { ...w, active: !w.active } : w
      )
    )
  }

  const deleteWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== webhookId))
    toast.success('Webhook deleted')
  }

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'payments', label: 'Payments' },
    { id: 'email', label: 'Email' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'video', label: 'Video' },
    { id: 'communication', label: 'Communication' },
    { id: 'support', label: 'Support' },
  ]

  const filteredIntegrations = filter === 'all'
    ? integrationList
    : integrationList.filter(i => i.category === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect third-party services to extend functionality</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {integrationList.filter(i => i.connected).length} of {integrationList.length} connected
          </span>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <a
          href="/admin/settings"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          General
        </a>
        <a
          href="/admin/settings/security"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Shield className="h-4 w-4" />
          Security
        </a>
        <a
          href="/admin/settings/protection"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Award className="h-4 w-4" />
          Content Protection
        </a>
        <a
          href="/admin/settings/integrations"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Globe className="h-4 w-4" />
          Integrations
        </a>
      </div>

      {/* API Key Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Webhook className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="font-semibold">API Key</h2>
              <p className="text-sm text-muted-foreground">Use this key to access the Course Training API</p>
            </div>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View Documentation
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              readOnly
              className="w-full px-4 py-2.5 pr-20 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono outline-none"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={handleCopyApiKey}
            className="flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button
            onClick={handleRegenerateKey}
            className="flex items-center gap-2 px-4 py-2.5 border border-amber-300 text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon
          return (
            <div
              key={integration.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${integration.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  integration.connected
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {integration.connected ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Not Connected
                    </>
                  )}
                </span>
              </div>

              {integration.connected ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Last synced: {integration.lastSync}
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Configure
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-3 py-2 text-sm text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={configuring === integration.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {configuring === integration.id ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Connect
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Webhooks Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Webhook className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold">Webhooks</h2>
              <p className="text-sm text-muted-foreground">Receive real-time event notifications</p>
            </div>
          </div>
          <button
            onClick={() => setShowWebhookModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-sm">{webhook.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    webhook.active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                  }`}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">{webhook.url}</p>
                <div className="flex gap-2 mt-2">
                  {webhook.events.map((event) => (
                    <span key={event} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWebhook(webhook.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    webhook.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      webhook.active ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {webhooks.length === 0 && (
            <div className="text-center py-8">
              <Webhook className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-muted-foreground">No webhooks configured</p>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Add your first webhook
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWebhookModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Add Webhook</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  placeholder="My Webhook"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                <input
                  type="url"
                  placeholder="https://api.example.com/webhook"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Events</label>
                <div className="space-y-2">
                  {['student.enrolled', 'student.completed', 'payment.received', 'course.published'].map((event) => (
                    <label key={event} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowWebhookModal(false)
                  toast.success('Webhook created')
                }}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Create Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
