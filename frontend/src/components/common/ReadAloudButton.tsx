// =============================================================================
// Read Aloud Button
// =============================================================================
// Reusable audio-friendly content control. Uses the browser's built-in
// speech synthesis (no external service) to read a block of text aloud,
// per the accessibility pilot's audio-first content requirement.
// =============================================================================

import { useEffect, useState } from 'react';

interface ReadAloudButtonProps {
  /** The text to read aloud. */
  text: string;
  /** Accessible label describing what will be read (e.g., "safety plan instructions"). */
  label?: string;
}

/**
 * ReadAloudButton — toggles speech synthesis playback of the given text.
 *
 * @returns {JSX.Element | null} The button, or null if speech synthesis is unsupported
 */
export default function ReadAloudButton({ text, label = 'this content' }: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  if (!isSupported) return null;

  const handleToggle = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="read-aloud-button"
      aria-pressed={isSpeaking}
      aria-label={isSpeaking ? `Stop reading ${label}` : `Read ${label} aloud`}
    >
      {isSpeaking ? '⏹ Stop Reading' : '🔊 Read Aloud'}
    </button>
  );
}
