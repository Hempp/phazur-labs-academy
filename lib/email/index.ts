// Email Service
// Handles transactional emails using Resend

import { Resend } from 'resend'

// Initialize Resend client if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Default from address
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Course Training <noreply@coursetraining.com>'

// Email types
export type EmailType =
  | 'welcome'
  | 'course_enrolled'
  | 'course_completed'
  | 'certificate_earned'
  | 'achievement_unlocked'
  | 'streak_at_risk'
  | 'streak_milestone'
  | 'team_invitation'
  | 'password_reset'
  | 'discussion_reply'
  | 'live_training_reminder'

export interface SendEmailOptions {
  to: string | string[]
  type: EmailType
  data: Record<string, unknown>
  subject?: string
  replyTo?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// Check if email service is configured
export function isEmailConfigured(): boolean {
  return !!resend
}

// Send an email
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  if (!resend) {
    console.log(`[Email] Service not configured, would send ${options.type} to:`, options.to)
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    }
  }

  try {
    const { html, text, subject: defaultSubject } = getEmailContent(options.type, options.data)
    const subject = options.subject || defaultSubject

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject,
      html,
      text,
      replyTo: options.replyTo,
    })

    if (error) {
      console.error(`[Email] Failed to send ${options.type}:`, error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log(`[Email] Sent ${options.type} to:`, options.to, 'ID:', data?.id)
    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error(`[Email] Exception sending ${options.type}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Batch send emails
export async function sendBatchEmails(
  emails: Array<Omit<SendEmailOptions, 'data'> & { data: Record<string, unknown> }>
): Promise<EmailResult[]> {
  if (!resend) {
    console.log(`[Email] Service not configured, would send ${emails.length} batch emails`)
    return emails.map(() => ({ success: true, messageId: `mock-${Date.now()}` }))
  }

  // Process in parallel with concurrency limit
  const results: EmailResult[] = []
  const batchSize = 10

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(email => sendEmail(email)))
    results.push(...batchResults)
  }

  return results
}

// Get email content based on type
function getEmailContent(type: EmailType, data: Record<string, unknown>): {
  html: string
  text: string
  subject: string
} {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://coursetraining.com'

  switch (type) {
    case 'welcome':
      return {
        subject: `Welcome to Course Training, ${data.name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">Welcome to Course Training!</h1>
            <p>Hi ${data.name},</p>
            <p>Thanks for joining Course Training. We're excited to have you on board!</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Browse our course catalog</li>
              <li>Set up your learning profile</li>
              <li>Start earning achievements</li>
            </ul>
            <p>
              <a href="${baseUrl}/courses" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Explore Courses
              </a>
            </p>
            <p>Happy learning!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
Welcome to Course Training!

Hi ${data.name},

Thanks for joining Course Training. We're excited to have you on board!

Here's what you can do next:
- Browse our course catalog
- Set up your learning profile
- Start earning achievements

Explore courses: ${baseUrl}/courses

Happy learning!
The Course Training Team
        `.trim(),
      }

    case 'course_enrolled':
      return {
        subject: `You're enrolled in ${data.courseTitle}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">You're In!</h1>
            <p>Hi ${data.name},</p>
            <p>Congratulations! You're now enrolled in <strong>${data.courseTitle}</strong>.</p>
            <p>Start learning today and track your progress towards completion.</p>
            <p>
              <a href="${baseUrl}/courses/${data.courseSlug}/learn" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Start Learning
              </a>
            </p>
            <p>Good luck!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
You're enrolled in ${data.courseTitle}!

Hi ${data.name},

Congratulations! You're now enrolled in ${data.courseTitle}.

Start learning: ${baseUrl}/courses/${data.courseSlug}/learn

Good luck!
The Course Training Team
        `.trim(),
      }

    case 'course_completed':
      return {
        subject: `Congratulations! You completed ${data.courseTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10b981;">🎉 Congratulations!</h1>
            <p>Hi ${data.name},</p>
            <p>You've successfully completed <strong>${data.courseTitle}</strong>!</p>
            <p>This is a huge achievement. You've earned:</p>
            <ul>
              <li><strong>100 points</strong> for course completion</li>
              <li>A <strong>certificate</strong> to showcase your skills</li>
            </ul>
            <p>
              <a href="${baseUrl}/dashboard/certificates" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Your Certificate
              </a>
            </p>
            <p>Keep up the great work!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
Congratulations! You completed ${data.courseTitle}

Hi ${data.name},

You've successfully completed ${data.courseTitle}!

You've earned:
- 100 points for course completion
- A certificate to showcase your skills

View your certificate: ${baseUrl}/dashboard/certificates

Keep up the great work!
The Course Training Team
        `.trim(),
      }

    case 'certificate_earned':
      return {
        subject: `Your certificate for ${data.courseTitle} is ready!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">🎓 Certificate Earned!</h1>
            <p>Hi ${data.name},</p>
            <p>Your certificate for <strong>${data.courseTitle}</strong> is ready!</p>
            <p>Certificate Number: <code>${data.certificateNumber}</code></p>
            <p>
              <a href="${baseUrl}/dashboard/certificates" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Download Certificate
              </a>
            </p>
            <p>Share your achievement on LinkedIn and other platforms!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
Your certificate for ${data.courseTitle} is ready!

Hi ${data.name},

Certificate Number: ${data.certificateNumber}

Download your certificate: ${baseUrl}/dashboard/certificates

Share your achievement!
The Course Training Team
        `.trim(),
      }

    case 'achievement_unlocked':
      return {
        subject: `🏆 Achievement Unlocked: ${data.achievementName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f59e0b;">🏆 Achievement Unlocked!</h1>
            <p>Hi ${data.name},</p>
            <p>Congratulations! You've unlocked a new achievement:</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="color: #d97706; margin: 0 0 10px;">${data.achievementName}</h2>
              <p style="color: #92400e; margin: 0;">${data.achievementDescription}</p>
              ${data.pointsReward ? `<p style="color: #d97706; font-weight: bold; margin: 10px 0 0;">+${data.pointsReward} points</p>` : ''}
            </div>
            <p>
              <a href="${baseUrl}/dashboard/student/achievements" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View All Achievements
              </a>
            </p>
            <p>Keep learning to unlock more!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
🏆 Achievement Unlocked: ${data.achievementName}

Hi ${data.name},

Congratulations! You've unlocked a new achievement:

${data.achievementName}
${data.achievementDescription}
${data.pointsReward ? `+${data.pointsReward} points` : ''}

View all achievements: ${baseUrl}/dashboard/student/achievements

Keep learning to unlock more!
The Course Training Team
        `.trim(),
      }

    case 'streak_at_risk':
      return {
        subject: `🔥 Your ${data.currentStreak}-day streak is at risk!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ef4444;">🔥 Don't Break Your Streak!</h1>
            <p>Hi ${data.name},</p>
            <p>Your <strong>${data.currentStreak}-day learning streak</strong> is at risk!</p>
            <p>Complete a lesson today to keep it going and earn your daily bonus points.</p>
            <p>
              <a href="${baseUrl}/dashboard/student/courses" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Continue Learning
              </a>
            </p>
            <p>Every day counts!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
🔥 Your ${data.currentStreak}-day streak is at risk!

Hi ${data.name},

Complete a lesson today to keep your streak going!

Continue learning: ${baseUrl}/dashboard/student/courses

Every day counts!
The Course Training Team
        `.trim(),
      }

    case 'streak_milestone':
      return {
        subject: `🔥 ${data.streakDays}-Day Streak Achievement!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f59e0b;">🔥 Incredible Streak!</h1>
            <p>Hi ${data.name},</p>
            <p>You've maintained a <strong>${data.streakDays}-day learning streak</strong>!</p>
            <p>This is an amazing achievement that shows your dedication to learning.</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 48px;">🔥</span>
              <h2 style="color: #d97706; margin: 10px 0;">${data.streakDays} Days</h2>
              <p style="color: #92400e; margin: 0;">+${data.bonusPoints} bonus points earned!</p>
            </div>
            <p>Keep the momentum going!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
🔥 ${data.streakDays}-Day Streak Achievement!

Hi ${data.name},

You've maintained a ${data.streakDays}-day learning streak!

+${data.bonusPoints} bonus points earned!

Keep the momentum going!
The Course Training Team
        `.trim(),
      }

    case 'team_invitation':
      return {
        subject: `You're invited to join ${data.teamName} on Course Training`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">Team Invitation</h1>
            <p>Hi,</p>
            <p><strong>${data.inviterName}</strong> has invited you to join <strong>${data.teamName}</strong> on Course Training.</p>
            <p>
              <a href="${data.inviteUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Accept Invitation
              </a>
            </p>
            <p>This invitation expires in 7 days.</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
You're invited to join ${data.teamName} on Course Training

${data.inviterName} has invited you to join ${data.teamName}.

Accept invitation: ${data.inviteUrl}

This invitation expires in 7 days.

The Course Training Team
        `.trim(),
      }

    case 'password_reset':
      return {
        subject: 'Reset your Course Training password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">Reset Your Password</h1>
            <p>Hi ${data.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p>
              <a href="${data.resetUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
Reset Your Password

Hi ${data.name},

Reset your password: ${data.resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

The Course Training Team
        `.trim(),
      }

    case 'discussion_reply':
      return {
        subject: `${data.replierName} replied to your discussion`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">New Reply</h1>
            <p>Hi ${data.name},</p>
            <p><strong>${data.replierName}</strong> replied to your discussion "<em>${data.discussionTitle}</em>":</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">${data.replyPreview}...</p>
            </div>
            <p>
              <a href="${baseUrl}/courses/${data.courseSlug}/discussions/${data.discussionId}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Discussion
              </a>
            </p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
${data.replierName} replied to your discussion

Hi ${data.name},

${data.replierName} replied to "${data.discussionTitle}":

"${data.replyPreview}..."

View discussion: ${baseUrl}/courses/${data.courseSlug}/discussions/${data.discussionId}

The Course Training Team
        `.trim(),
      }

    case 'live_training_reminder':
      return {
        subject: `Reminder: ${data.trainingTitle} starts ${data.startsIn}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">📅 Live Training Reminder</h1>
            <p>Hi ${data.name},</p>
            <p>Your registered live training session is starting soon:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin: 0 0 10px; color: #1f2937;">${data.trainingTitle}</h2>
              <p style="margin: 0; color: #6b7280;"><strong>Starts:</strong> ${data.startTime}</p>
              <p style="margin: 5px 0 0; color: #6b7280;"><strong>Instructor:</strong> ${data.instructorName}</p>
            </div>
            <p>
              <a href="${data.joinUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Join Session
              </a>
            </p>
            <p>Don't miss it!</p>
            <p>The Course Training Team</p>
          </div>
        `,
        text: `
📅 Live Training Reminder: ${data.trainingTitle}

Hi ${data.name},

Your live training is starting ${data.startsIn}!

${data.trainingTitle}
Starts: ${data.startTime}
Instructor: ${data.instructorName}

Join session: ${data.joinUrl}

Don't miss it!
The Course Training Team
        `.trim(),
      }

    default:
      return {
        subject: 'Notification from Course Training',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0070f3;">Course Training</h1>
            <p>${JSON.stringify(data)}</p>
          </div>
        `,
        text: JSON.stringify(data),
      }
  }
}

// Export helper for checking user email preferences
export async function shouldSendEmail(
  supabase: { from: (table: string) => { select: (fields: string) => { eq: (field: string, value: string) => { single: () => Promise<{ data: Record<string, boolean> | null }> } } } },
  userId: string,
  emailType: EmailType
): Promise<boolean> {
  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('email_enabled, email_achievements, email_course_updates, email_discussions, email_marketing')
    .eq('user_id', userId)
    .single()

  if (!prefs || !prefs.email_enabled) {
    return false
  }

  // Check specific preferences
  switch (emailType) {
    case 'achievement_unlocked':
    case 'streak_at_risk':
    case 'streak_milestone':
      return prefs.email_achievements !== false
    case 'course_enrolled':
    case 'course_completed':
    case 'certificate_earned':
    case 'live_training_reminder':
      return prefs.email_course_updates !== false
    case 'discussion_reply':
      return prefs.email_discussions !== false
    case 'welcome':
    case 'team_invitation':
    case 'password_reset':
      return true // Always send critical emails
    default:
      return true
  }
}
