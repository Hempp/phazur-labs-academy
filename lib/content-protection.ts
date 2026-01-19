// Content Protection Utilities
// Prevents unauthorized downloading, screen recording, and content theft

export interface ContentProtectionConfig {
  disableRightClick: boolean;
  disableKeyboardShortcuts: boolean;
  disableTextSelection: boolean;
  enableWatermark: boolean;
  detectScreenRecording: boolean;
  trackViewingSessions: boolean;
  watermarkText?: string;
}

export const defaultProtectionConfig: ContentProtectionConfig = {
  disableRightClick: true,
  disableKeyboardShortcuts: true,
  disableTextSelection: true,
  enableWatermark: true,
  detectScreenRecording: true,
  trackViewingSessions: true,
};

// Keyboard shortcuts that could be used for downloading/recording
const BLOCKED_KEY_COMBOS = [
  { key: 's', ctrl: true }, // Ctrl+S (Save)
  { key: 's', meta: true }, // Cmd+S (Save on Mac)
  { key: 'p', ctrl: true }, // Ctrl+P (Print)
  { key: 'p', meta: true }, // Cmd+P (Print on Mac)
  { key: 'u', ctrl: true }, // Ctrl+U (View Source)
  { key: 'u', meta: true }, // Cmd+U (View Source on Mac)
  { key: 'i', ctrl: true, shift: true }, // Ctrl+Shift+I (Dev Tools)
  { key: 'i', meta: true, alt: true }, // Cmd+Option+I (Dev Tools on Mac)
  { key: 'j', ctrl: true, shift: true }, // Ctrl+Shift+J (Console)
  { key: 'c', ctrl: true, shift: true }, // Ctrl+Shift+C (Inspect)
  { key: 'F12', ctrl: false }, // F12 (Dev Tools)
  { key: 'PrintScreen', ctrl: false }, // Print Screen
];

export function initializeContentProtection(
  config: ContentProtectionConfig = defaultProtectionConfig
): () => void {
  const cleanupFunctions: (() => void)[] = [];

  // Disable right-click context menu
  if (config.disableRightClick) {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', handleContextMenu);
    cleanupFunctions.push(() => document.removeEventListener('contextmenu', handleContextMenu));
  }

  // Block keyboard shortcuts
  if (config.disableKeyboardShortcuts) {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const combo of BLOCKED_KEY_COMBOS) {
        const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const metaMatch = combo.meta ? e.metaKey : true;
        const shiftMatch = combo.shift ? e.shiftKey : true;
        const altMatch = combo.alt ? e.altKey : true;

        if (
          e.key.toLowerCase() === combo.key.toLowerCase() &&
          ctrlMatch && metaMatch && shiftMatch && altMatch
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    cleanupFunctions.push(() => document.removeEventListener('keydown', handleKeyDown));
  }

  // Disable text selection on protected content
  if (config.disableTextSelection) {
    const style = document.createElement('style');
    style.id = 'content-protection-styles';
    style.textContent = `
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      .protected-content img,
      .protected-content video {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    cleanupFunctions.push(() => {
      const el = document.getElementById('content-protection-styles');
      if (el) el.remove();
    });
  }

  // Detect screen recording (limited browser support)
  if (config.detectScreenRecording) {
    const checkDisplayCapture = async () => {
      try {
        // Check if screen capture API is being used
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasScreenCapture = devices.some(
          device => device.kind === 'videoinput' && device.label.toLowerCase().includes('screen')
        );
        if (hasScreenCapture) {
          console.warn('Screen capture detected');
          // Could trigger warning or pause content
        }
      } catch {
        // API not available or permission denied
      }
    };

    // Check periodically
    const interval = setInterval(checkDisplayCapture, 5000);
    cleanupFunctions.push(() => clearInterval(interval));
  }

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach(fn => fn());
  };
}

// Generate a unique watermark based on user info
export function generateWatermark(userId: string, email: string): string {
  const timestamp = new Date().toISOString();
  return `${email.split('@')[0]} • ${timestamp.split('T')[0]}`;
}

// Obfuscate video source URLs
export function obfuscateVideoUrl(url: string, token: string): string {
  // In production, this would generate a signed URL with expiration
  const encodedUrl = btoa(url);
  const timestamp = Date.now();
  return `${encodedUrl}?token=${token}&ts=${timestamp}`;
}

// Check if video playback is authorized
export function isPlaybackAuthorized(
  userId: string,
  contentId: string,
  sessionToken: string
): boolean {
  // In production, this would verify against server
  // For now, return true if all params present
  return !!(userId && contentId && sessionToken);
}

// Track viewing session
export interface ViewingSession {
  userId: string;
  contentId: string;
  startTime: Date;
  duration: number;
  completed: boolean;
  lastPosition: number;
}

export function createViewingSession(userId: string, contentId: string): ViewingSession {
  return {
    userId,
    contentId,
    startTime: new Date(),
    duration: 0,
    completed: false,
    lastPosition: 0,
  };
}

export function updateViewingSession(
  session: ViewingSession,
  currentPosition: number,
  totalDuration: number
): ViewingSession {
  const now = new Date();
  return {
    ...session,
    duration: now.getTime() - session.startTime.getTime(),
    lastPosition: currentPosition,
    completed: currentPosition >= totalDuration * 0.9, // 90% watched = complete
  };
}
