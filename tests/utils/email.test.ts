// Tests for email utility functions
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Note: Resend is initialized at module load time based on env variable
// In dev/test without RESEND_API_KEY, it gracefully falls back to mock mode
import { sendEmail, isEmailConfigured, type EmailType } from '@/lib/email'

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isEmailConfigured', () => {
    it('returns false when RESEND_API_KEY is not set (dev mode)', () => {
      // In test environment without real API key, should return false
      // This is expected behavior - email service gracefully degrades
      expect(isEmailConfigured()).toBe(false)
    })
  })

  describe('sendEmail', () => {
    it('sends welcome email with mock in dev mode', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        type: 'welcome',
        data: { name: 'John Doe' },
      })

      // In dev mode, returns success with mock ID
      expect(result.success).toBe(true)
      expect(result.messageId).toMatch(/^mock-\d+$/)
    })

    it('sends team invitation email with correct data', async () => {
      const result = await sendEmail({
        to: 'invitee@example.com',
        type: 'team_invitation',
        data: {
          teamName: 'Test Team',
          inviterName: 'Jane Doe',
          inviteUrl: 'https://test.phazuracademy.com/teams/join?token=abc123',
        },
      })

      expect(result.success).toBe(true)
    })

    it('sends password reset email with correct data', async () => {
      const result = await sendEmail({
        to: 'user@example.com',
        type: 'password_reset',
        data: {
          name: 'John Doe',
          resetUrl: 'https://test.phazuracademy.com/auth/reset-password?token=xyz789',
        },
      })

      expect(result.success).toBe(true)
    })

    it('sends course enrolled email with correct data', async () => {
      const result = await sendEmail({
        to: 'student@example.com',
        type: 'course_enrolled',
        data: {
          name: 'Student Name',
          courseTitle: 'Introduction to TypeScript',
          courseSlug: 'intro-typescript',
        },
      })

      expect(result.success).toBe(true)
    })

    it('sends achievement unlocked email with points', async () => {
      const result = await sendEmail({
        to: 'achiever@example.com',
        type: 'achievement_unlocked',
        data: {
          name: 'High Achiever',
          achievementName: 'First Steps',
          achievementDescription: 'Complete your first lesson',
          pointsReward: 50,
        },
      })

      expect(result.success).toBe(true)
    })

    it('sends streak milestone email', async () => {
      const result = await sendEmail({
        to: 'learner@example.com',
        type: 'streak_milestone',
        data: {
          name: 'Dedicated Learner',
          streakDays: 30,
          bonusPoints: 100,
        },
      })

      expect(result.success).toBe(true)
    })

    it('handles multiple recipients', async () => {
      const result = await sendEmail({
        to: ['user1@example.com', 'user2@example.com'],
        type: 'welcome',
        data: { name: 'Team' },
      })

      expect(result.success).toBe(true)
    })

    it('uses custom subject when provided', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        type: 'welcome',
        data: { name: 'Test User' },
        subject: 'Custom Welcome Subject',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Email types coverage', () => {
    const emailTypes: EmailType[] = [
      'welcome',
      'course_enrolled',
      'course_completed',
      'certificate_earned',
      'achievement_unlocked',
      'streak_at_risk',
      'streak_milestone',
      'team_invitation',
      'password_reset',
      'discussion_reply',
      'live_training_reminder',
    ]

    emailTypes.forEach((type) => {
      it(`handles ${type} email type`, async () => {
        const result = await sendEmail({
          to: 'test@example.com',
          type,
          data: {
            name: 'Test User',
            // Add common data fields that templates might need
            courseTitle: 'Test Course',
            courseSlug: 'test-course',
            certificateNumber: 'CERT-001',
            achievementName: 'Test Achievement',
            achievementDescription: 'Test description',
            currentStreak: 7,
            streakDays: 30,
            bonusPoints: 100,
            teamName: 'Test Team',
            inviterName: 'Inviter',
            inviteUrl: 'https://example.com/invite',
            resetUrl: 'https://example.com/reset',
            replierName: 'Replier',
            discussionTitle: 'Test Discussion',
            discussionId: 'disc-123',
            replyPreview: 'Preview text',
            trainingTitle: 'Test Training',
            startsIn: '1 hour',
            startTime: '3:00 PM EST',
            instructorName: 'Instructor',
            joinUrl: 'https://example.com/join',
          },
        })

        expect(result.success).toBe(true)
      })
    })
  })
})
