// Edge TTS Configuration - Client-safe constants
// These can be imported in both client and server components

export interface EdgeVoice {
  id: string
  name: string
  shortName: string
  gender: 'Male' | 'Female'
  locale: string
}

// High-quality English voices available in Edge TTS
export const edgeVoices: EdgeVoice[] = [
  // US English
  { id: 'en-US-AriaNeural', name: 'Aria (US)', shortName: 'Aria', gender: 'Female', locale: 'en-US' },
  { id: 'en-US-JennyNeural', name: 'Jenny (US)', shortName: 'Jenny', gender: 'Female', locale: 'en-US' },
  { id: 'en-US-GuyNeural', name: 'Guy (US)', shortName: 'Guy', gender: 'Male', locale: 'en-US' },
  { id: 'en-US-DavisNeural', name: 'Davis (US)', shortName: 'Davis', gender: 'Male', locale: 'en-US' },
  { id: 'en-US-TonyNeural', name: 'Tony (US)', shortName: 'Tony', gender: 'Male', locale: 'en-US' },
  { id: 'en-US-SaraNeural', name: 'Sara (US)', shortName: 'Sara', gender: 'Female', locale: 'en-US' },
  // UK English
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK)', shortName: 'Sonia', gender: 'Female', locale: 'en-GB' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK)', shortName: 'Ryan', gender: 'Male', locale: 'en-GB' },
  // Australian English
  { id: 'en-AU-NatashaNeural', name: 'Natasha (AU)', shortName: 'Natasha', gender: 'Female', locale: 'en-AU' },
  { id: 'en-AU-WilliamNeural', name: 'William (AU)', shortName: 'William', gender: 'Male', locale: 'en-AU' },
]
