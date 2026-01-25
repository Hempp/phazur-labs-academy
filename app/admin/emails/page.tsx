'use client'

import { useState } from 'react'
import {
  Mail,
  Plus,
  Send,
  Clock,
  FileText,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Users,
  BarChart3,
  MousePointer,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock email campaign data
const statsCards = [
  { title: 'Total Campaigns', value: '156', icon: Mail, color: 'blue' },
  { title: 'Sent This Month', value: '24', icon: Send, color: 'green' },
  { title: 'Avg. Open Rate', value: '42.8%', icon: Eye, color: 'purple' },
  { title: 'Avg. Click Rate', value: '12.4%', icon: MousePointer, color: 'amber' }
]

const campaigns = [
  { id: 1, name: 'New Year Course Sale', subject: '🎉 50% Off All Courses - Limited Time!', status: 'sent', audience: 'All Students', recipients: 12450, openRate: 48.2, clickRate: 15.8, sentDate: '2024-01-01 09:00' },
  { id: 2, name: 'TypeScript Course Launch', subject: 'Master TypeScript - New Course Available', status: 'sent', audience: 'JavaScript Students', recipients: 5230, openRate: 52.1, clickRate: 18.4, sentDate: '2024-01-10 10:00' },
  { id: 3, name: 'Weekly Newsletter #45', subject: 'This Week in Tech: AI Updates & More', status: 'scheduled', audience: 'Newsletter Subscribers', recipients: 8920, openRate: null, clickRate: null, scheduledDate: '2024-01-20 08:00' },
  { id: 4, name: 'Course Completion Congrats', subject: 'Congratulations! You\'ve completed your course', status: 'draft', audience: 'Auto - Completed', recipients: null, openRate: null, clickRate: null, sentDate: null },
  { id: 5, name: 'February Promo Teaser', subject: 'Something Big is Coming...', status: 'draft', audience: 'VIP Students', recipients: null, openRate: null, clickRate: null, sentDate: null },
  { id: 6, name: 'React Patterns Upsell', subject: 'Ready for Advanced React?', status: 'sent', audience: 'React Beginners', recipients: 3450, openRate: 38.9, clickRate: 11.2, sentDate: '2024-01-05 14:00' }
]

const templates = [
  { id: 1, name: 'Welcome Email', description: 'Onboarding email for new students', lastUsed: '2 days ago' },
  { id: 2, name: 'Course Launch', description: 'Announcement template for new courses', lastUsed: '1 week ago' },
  { id: 3, name: 'Weekly Newsletter', description: 'Standard newsletter layout', lastUsed: 'Today' },
  { id: 4, name: 'Promotional Sale', description: 'Discount and offer template', lastUsed: '3 days ago' },
  { id: 5, name: 'Course Completion', description: 'Congratulations and certificate email', lastUsed: '1 day ago' }
]

const audiences = [
  { name: 'All Students', count: 12450 },
  { name: 'Active Students', count: 8920 },
  { name: 'Newsletter Subscribers', count: 10230 },
  { name: 'Premium Members', count: 2340 },
  { name: 'Trial Users', count: 1890 }
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  sent: { label: 'Sent', color: 'text-green-500 bg-green-500/10', icon: CheckCircle },
  scheduled: { label: 'Scheduled', color: 'text-blue-500 bg-blue-500/10', icon: Clock },
  draft: { label: 'Draft', color: 'text-gray-500 bg-gray-500/10', icon: FileText }
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' }
}

export default function EmailsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    audience: '',
    template: '',
    scheduleDate: '',
    scheduleTime: ''
  })

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Campaign created successfully')
    setShowCreateModal(false)
    setNewCampaign({ name: '', subject: '', audience: '', template: '', scheduleDate: '', scheduleTime: '' })
  }

  const handleDuplicate = (id: number) => {
    toast.success('Campaign duplicated')
    setOpenMenu(null)
  }

  const handleDelete = (id: number) => {
    toast.success('Campaign deleted')
    setOpenMenu(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Campaigns</h1>
          <p className="text-muted-foreground">Create and manage email marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          const colors = colorClasses[stat.color]
          return (
            <div key={stat.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Audience</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Recipients</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Performance</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Date</th>
                <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => {
                const status = statusConfig[campaign.status]
                const StatusIcon = status.icon
                return (
                  <tr key={campaign.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{campaign.subject}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-foreground">{campaign.audience}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-foreground">
                        {campaign.recipients ? campaign.recipients.toLocaleString() : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {campaign.status === 'sent' ? (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{campaign.openRate}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MousePointer className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{campaign.clickRate}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-muted-foreground">
                        {campaign.sentDate || campaign.scheduledDate || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === campaign.id ? null : campaign.id)}
                          className="p-2 hover:bg-accent rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {openMenu === campaign.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              {campaign.status === 'draft' && (
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                                  <Edit className="h-4 w-4" />
                                  Edit Campaign
                                </button>
                              )}
                              <button
                                onClick={() => handleDuplicate(campaign.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                              >
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </button>
                              {campaign.status === 'sent' && (
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                                  <BarChart3 className="h-4 w-4" />
                                  View Report
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(campaign.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-accent"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No campaigns found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new campaign</p>
          </div>
        )}
      </div>

      {/* Templates & Audiences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Email Templates</h2>
                <p className="text-sm text-muted-foreground">Reusable templates</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Manage</button>
          </div>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-foreground">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{template.lastUsed}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audiences */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Audience Segments</h2>
                <p className="text-sm text-muted-foreground">Target groups</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Manage</button>
          </div>
          <div className="space-y-3">
            {audiences.map((audience) => (
              <div
                key={audience.name}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{audience.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{audience.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Create Campaign</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g., February Newsletter"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  placeholder="e.g., Your weekly update is here!"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Template
                </label>
                <select
                  value={newCampaign.template}
                  onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Audience
                </label>
                <select
                  value={newCampaign.audience}
                  onChange={(e) => setNewCampaign({ ...newCampaign, audience: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an audience</option>
                  {audiences.map((a) => (
                    <option key={a.name} value={a.name}>{a.name} ({a.count.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign.scheduleDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, scheduleDate: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={newCampaign.scheduleTime}
                    onChange={(e) => setNewCampaign({ ...newCampaign, scheduleTime: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Leave schedule empty to save as draft
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
