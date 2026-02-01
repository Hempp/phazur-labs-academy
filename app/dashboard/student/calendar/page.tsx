'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Video, FileText, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CalendarEvent {
  id: string
  title: string
  type: 'lesson' | 'assignment' | 'quiz' | 'live'
  date: string
  time?: string
  courseTitle: string
}

const eventTypeConfig = {
  lesson: { icon: Video, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  assignment: { icon: FileText, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  quiz: { icon: Target, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  live: { icon: Video, color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
}

export default function CalendarPage() {
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'AI Fundamentals Quiz',
      type: 'quiz',
      date: new Date(Date.now() + 86400000).toISOString(),
      courseTitle: 'AI Foundations & Tool Mastery',
    },
    {
      id: '2',
      title: 'Agent Architecture Assignment Due',
      type: 'assignment',
      date: new Date(Date.now() + 172800000).toISOString(),
      courseTitle: 'Building AI Agents',
    },
    {
      id: '3',
      title: 'Live Q&A Session',
      type: 'live',
      date: new Date(Date.now() + 259200000).toISOString(),
      time: '2:00 PM EST',
      courseTitle: 'MCP Development',
    },
  ])

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Track your learning schedule and deadlines</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isToday = day === today.getDate()
                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm
                      ${isToday ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted cursor-pointer'}`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming events</p>
            ) : (
              events.map(event => {
                const config = eventTypeConfig[event.type]
                const Icon = config.icon
                const eventDate = new Date(event.date)
                return (
                  <div key={event.id} className="flex gap-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.courseTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Badge>
                        {event.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
