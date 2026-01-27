'use client'

import {
  Play,
  GraduationCap,
  Monitor,
  Mic,
  Route,
  ListChecks,
  Sparkles,
  RotateCcw,
  Clock,
  Calendar,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type VideoType = 'lecture' | 'demonstration' | 'interview' | 'walkthrough' | 'summary' | 'introduction' | 'recap'
export type VideoStatus = 'in_production' | 'scheduled' | 'coming_soon' | 'placeholder'

interface VideoPlaceholderProps {
  lessonTitle: string
  moduleTitle?: string
  videoType?: VideoType
  status?: VideoStatus
  estimatedDuration?: number // seconds
  description?: string
  expectedReadyDate?: string
  className?: string
}

const VIDEO_TYPE_CONFIG: Record<VideoType, { icon: typeof GraduationCap; label: string }> = {
  lecture: { icon: GraduationCap, label: 'Lecture' },
  demonstration: { icon: Monitor, label: 'Demonstration' },
  interview: { icon: Mic, label: 'Interview' },
  walkthrough: { icon: Route, label: 'Walkthrough' },
  summary: { icon: ListChecks, label: 'Summary' },
  introduction: { icon: Sparkles, label: 'Introduction' },
  recap: { icon: RotateCcw, label: 'Recap' },
}

const STATUS_CONFIG: Record<VideoStatus, { color: string; bgColor: string; label: string }> = {
  in_production: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'In Production',
  },
  scheduled: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Scheduled',
  },
  coming_soon: {
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Coming Soon',
  },
  placeholder: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    label: 'Planned',
  },
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `~${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `~${hours} hr`
  }
  return `~${hours} hr ${remainingMinutes} min`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function VideoPlaceholder({
  lessonTitle,
  moduleTitle,
  videoType = 'lecture',
  status = 'coming_soon',
  estimatedDuration,
  description,
  expectedReadyDate,
  className,
}: VideoPlaceholderProps) {
  const typeConfig = VIDEO_TYPE_CONFIG[videoType]
  const statusConfig = STATUS_CONFIG[status]
  const TypeIcon = typeConfig.icon

  return (
    <div className={cn('w-full', className)}>
      {/* Video area with gradient background */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-t-xl relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Play button (non-interactive) */}
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Play className="w-8 h-8 text-white/80 ml-1" />
          </div>

          {/* Video icon badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <Video className="w-4 h-4 text-white/70" />
            <span className="text-sm font-medium text-white/80">Video Content</span>
          </div>
        </div>

        {/* Module badge (top-left) */}
        {moduleTitle && (
          <div className="absolute top-4 left-4">
            <span className="text-xs text-white/60 bg-black/30 px-2 py-1 rounded">
              {moduleTitle}
            </span>
          </div>
        )}

        {/* Branding (bottom-left) */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-white/60 text-sm font-medium">Phazur Labs</span>
        </div>
      </div>

      {/* Info panel */}
      <div className="bg-white dark:bg-slate-900 border border-t-0 border-border rounded-b-xl p-5">
        {/* Top row: Type, Status, Duration */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          {/* Video type */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <TypeIcon className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">{typeConfig.label}</span>
          </div>

          {/* Status and duration */}
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                statusConfig.bgColor,
                statusConfig.color
              )}
            >
              {statusConfig.label}
            </span>

            {/* Duration */}
            {estimatedDuration && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatDuration(estimatedDuration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{lessonTitle}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        )}

        {/* Expected date */}
        {expectedReadyDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
            <Calendar className="w-4 h-4" />
            <span>Expected: {formatDate(expectedReadyDate)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlaceholder
