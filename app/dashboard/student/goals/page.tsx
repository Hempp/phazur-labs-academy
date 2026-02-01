'use client'

import { useState } from 'react'
import { Target, Plus, Clock, CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  status: 'active' | 'completed' | 'overdue'
  milestones: { id: string; title: string; completed: boolean }[]
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete AI Foundations Course',
      description: 'Master the fundamentals of AI and prompt engineering',
      targetDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      progress: 75,
      status: 'active',
      milestones: [
        { id: 'm1', title: 'Complete Module 1', completed: true },
        { id: 'm2', title: 'Complete Module 2', completed: true },
        { id: 'm3', title: 'Pass Quiz 1', completed: true },
        { id: 'm4', title: 'Complete Final Project', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Build First AI Agent',
      description: 'Create a working AI agent using Claude Agent SDK',
      targetDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      progress: 30,
      status: 'active',
      milestones: [
        { id: 'm1', title: 'Understand agent architecture', completed: true },
        { id: 'm2', title: 'Set up development environment', completed: true },
        { id: 'm3', title: 'Build basic agent', completed: false },
        { id: 'm4', title: 'Add tool capabilities', completed: false },
        { id: 'm5', title: 'Deploy to production', completed: false },
      ],
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal
      const milestones = goal.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
      const completedCount = milestones.filter(m => m.completed).length
      const progress = Math.round((completedCount / milestones.length) * 100)
      return { ...goal, milestones, progress }
    }))
  }

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const statusColors = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Learning Goals</h1>
          <p className="text-muted-foreground">Set and track your learning objectives</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{goals.length}</p>
            <p className="text-sm text-muted-foreground">Total Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{goals.filter(g => g.status === 'active').length}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{goals.filter(g => g.status === 'completed').length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No goals yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Set learning goals to stay motivated and track your progress
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus className="h-4 w-4" />
                Create Your First Goal
              </button>
            </CardContent>
          </Card>
        ) : (
          goals.map(goal => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{goal.title}</CardTitle>
                      <Badge className={statusColors[goal.status]}>
                        {goal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Due {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                  <span className="font-medium">{goal.progress}% complete</span>
                </div>
                <Progress value={goal.progress} className="h-2" />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Milestones</p>
                  {goal.milestones.map(milestone => (
                    <button
                      key={milestone.id}
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                      className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                        {milestone.title}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
