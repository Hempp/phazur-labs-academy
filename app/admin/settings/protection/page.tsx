'use client'

import { useState } from 'react'
import {
  Shield,
  Video,
  Lock,
  Eye,
  Download,
  Monitor,
  Fingerprint,
  Globe,
  AlertTriangle,
  CheckCircle,
  Settings,
  Award,
  Save,
  Info,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContentProtectionPage() {
  const [isSaving, setIsSaving] = useState(false)

  const [protection, setProtection] = useState({
    // DRM Settings
    drmEnabled: true,
    drmProvider: 'widevine',
    encryptionLevel: 'high',

    // Watermarking
    watermarkEnabled: true,
    watermarkType: 'dynamic',
    watermarkPosition: 'center',
    watermarkOpacity: 30,
    includeUserId: true,
    includeTimestamp: true,

    // Download Restrictions
    downloadEnabled: false,
    offlineViewingEnabled: false,
    downloadExpiry: 30,
    maxDownloads: 2,

    // Screen Recording Prevention
    screenRecordingPrevention: true,
    screenshotPrevention: true,
    hdcpRequired: true,

    // Access Controls
    deviceLimit: 3,
    concurrentStreams: 2,
    geoRestriction: false,
    allowedCountries: ['US', 'CA', 'GB', 'AU'],
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Content protection settings saved!')
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content Protection</h1>
          <p className="text-muted-foreground">Secure your video content and intellectual property</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
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
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Award className="h-4 w-4" />
          Content Protection
        </a>
        <a
          href="/admin/settings/integrations"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Globe className="h-4 w-4" />
          Integrations
        </a>
      </div>

      {/* Protection Status Banner */}
      <div className={`p-4 rounded-xl flex items-start gap-4 ${
        protection.drmEnabled && protection.watermarkEnabled
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
      }`}>
        {protection.drmEnabled && protection.watermarkEnabled ? (
          <>
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">Content Protection Active</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                DRM encryption and watermarking are enabled. Your content is protected against piracy.
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">Protection Incomplete</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Some protection features are disabled. Enable DRM and watermarking for full content security.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DRM Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold">DRM Encryption</h2>
              <p className="text-sm text-muted-foreground">Digital Rights Management settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable DRM</p>
                <p className="text-xs text-muted-foreground">Encrypt video content with DRM</p>
              </div>
              <button
                onClick={() => setProtection(prev => ({ ...prev, drmEnabled: !prev.drmEnabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  protection.drmEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    protection.drmEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {protection.drmEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">DRM Provider</label>
                  <select
                    value={protection.drmProvider}
                    onChange={(e) => setProtection(prev => ({ ...prev, drmProvider: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="widevine">Google Widevine</option>
                    <option value="fairplay">Apple FairPlay</option>
                    <option value="playready">Microsoft PlayReady</option>
                    <option value="multi">Multi-DRM (All)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Encryption Level</label>
                  <select
                    value={protection.encryptionLevel}
                    onChange={(e) => setProtection(prev => ({ ...prev, encryptionLevel: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="standard">Standard (AES-128)</option>
                    <option value="high">High (AES-256)</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Watermarking */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold">Video Watermarking</h2>
              <p className="text-sm text-muted-foreground">Identify leaked content sources</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Watermarks</p>
                <p className="text-xs text-muted-foreground">Add visible watermarks to videos</p>
              </div>
              <button
                onClick={() => setProtection(prev => ({ ...prev, watermarkEnabled: !prev.watermarkEnabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  protection.watermarkEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    protection.watermarkEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {protection.watermarkEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Watermark Type</label>
                  <select
                    value={protection.watermarkType}
                    onChange={(e) => setProtection(prev => ({ ...prev, watermarkType: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="dynamic">Dynamic (User-specific)</option>
                    <option value="static">Static (Site branding)</option>
                    <option value="forensic">Forensic (Invisible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setProtection(prev => ({ ...prev, watermarkPosition: pos }))}
                        className={`p-2 text-xs rounded-lg border transition-colors ${
                          protection.watermarkPosition === pos
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pos.split('-').map(w => w.charAt(0).toUpperCase()).join('')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Opacity: {protection.watermarkOpacity}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={protection.watermarkOpacity}
                    onChange={(e) => setProtection(prev => ({ ...prev, watermarkOpacity: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={protection.includeUserId}
                      onChange={(e) => setProtection(prev => ({ ...prev, includeUserId: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Include User ID</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={protection.includeTimestamp}
                      onChange={(e) => setProtection(prev => ({ ...prev, includeTimestamp: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Include Timestamp</span>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Download Restrictions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Download className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold">Download Restrictions</h2>
              <p className="text-sm text-muted-foreground">Control offline access</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Allow Downloads</p>
                <p className="text-xs text-muted-foreground">Let users download for offline viewing</p>
              </div>
              <button
                onClick={() => setProtection(prev => ({ ...prev, downloadEnabled: !prev.downloadEnabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  protection.downloadEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    protection.downloadEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {protection.downloadEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Download Expiry (days)</label>
                  <select
                    value={protection.downloadExpiry}
                    onChange={(e) => setProtection(prev => ({ ...prev, downloadExpiry: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="0">Never expire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Downloads per Video</label>
                  <select
                    value={protection.maxDownloads}
                    onChange={(e) => setProtection(prev => ({ ...prev, maxDownloads: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1">1 device</option>
                    <option value="2">2 devices</option>
                    <option value="3">3 devices</option>
                    <option value="5">5 devices</option>
                    <option value="0">Unlimited</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Screen Recording Prevention */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold">Screen Recording Prevention</h2>
              <p className="text-sm text-muted-foreground">Block capture attempts</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Block Screen Recording</p>
                <p className="text-xs text-muted-foreground">Prevent screen capture software</p>
              </div>
              <button
                onClick={() => setProtection(prev => ({ ...prev, screenRecordingPrevention: !prev.screenRecordingPrevention }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  protection.screenRecordingPrevention ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    protection.screenRecordingPrevention ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Block Screenshots</p>
                <p className="text-xs text-muted-foreground">Prevent screenshot capture</p>
              </div>
              <button
                onClick={() => setProtection(prev => ({ ...prev, screenshotPrevention: !prev.screenshotPrevention }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  protection.screenshotPrevention ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    protection.screenshotPrevention ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Require HDCP</p>
                <p className="text-xs text-muted-foreground">Enforce hardware copy protection</p>
              </div>
              <button
                onClick={() => setProtection(prev => ({ ...prev, hdcpRequired: !prev.hdcpRequired }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  protection.hdcpRequired ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    protection.hdcpRequired ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Screen recording prevention uses browser APIs and DRM. Effectiveness varies by browser and device.
            </p>
          </div>
        </div>

        {/* Access Controls */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold">Access Controls</h2>
              <p className="text-sm text-muted-foreground">Device and streaming limits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Device Limit per User</label>
              <select
                value={protection.deviceLimit}
                onChange={(e) => setProtection(prev => ({ ...prev, deviceLimit: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">1 device</option>
                <option value="2">2 devices</option>
                <option value="3">3 devices</option>
                <option value="5">5 devices</option>
                <option value="0">Unlimited</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Concurrent Streams</label>
              <select
                value={protection.concurrentStreams}
                onChange={(e) => setProtection(prev => ({ ...prev, concurrentStreams: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">1 stream</option>
                <option value="2">2 streams</option>
                <option value="3">3 streams</option>
                <option value="0">Unlimited</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Geographic Restrictions</p>
                  <p className="text-xs text-muted-foreground">Limit access to specific countries</p>
                </div>
                <button
                  onClick={() => setProtection(prev => ({ ...prev, geoRestriction: !prev.geoRestriction }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    protection.geoRestriction ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      protection.geoRestriction ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {protection.geoRestriction && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {protection.allowedCountries.map((country) => (
                    <span key={country} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {country}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                    + Add Country
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
