// Draft Video Configuration - Client-safe constants
// These can be imported in both client and server components

export interface DraftAvatar {
  id: string
  name: string
  voiceId: string
  gender: 'male' | 'female'
  color: string
}

// Default avatar placeholders (gradient backgrounds with initials)
export const draftAvatars: DraftAvatar[] = [
  {
    id: 'avatar-aria',
    name: 'Aria',
    voiceId: 'en-US-AriaNeural',
    gender: 'female',
    color: '#6366f1', // Indigo
  },
  {
    id: 'avatar-guy',
    name: 'Guy',
    voiceId: 'en-US-GuyNeural',
    gender: 'male',
    color: '#0891b2', // Cyan
  },
  {
    id: 'avatar-jenny',
    name: 'Jenny',
    voiceId: 'en-US-JennyNeural',
    gender: 'female',
    color: '#db2777', // Pink
  },
  {
    id: 'avatar-davis',
    name: 'Davis',
    voiceId: 'en-US-DavisNeural',
    gender: 'male',
    color: '#059669', // Emerald
  },
  {
    id: 'avatar-sonia',
    name: 'Sonia (UK)',
    voiceId: 'en-GB-SoniaNeural',
    gender: 'female',
    color: '#7c3aed', // Violet
  },
  {
    id: 'avatar-ryan',
    name: 'Ryan (UK)',
    voiceId: 'en-GB-RyanNeural',
    gender: 'male',
    color: '#ea580c', // Orange
  },
]
