import type { Language } from '@/types';

/**
 * Get Web Speech API language code
 */
function getSpeechLangCode(lang: Language): string {
  const codes: Record<Language, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
  };
  return codes[lang];
}

/**
 * Check if Web Speech API is supported
 */
export function isVoiceSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
}

/**
 * Check if speech synthesis is supported
 */
export function isTTSSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

interface ISpeechEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal?: boolean;
      length: number;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: ISpeechEvent) => void) | null;
  onerror: ((event: ISpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface WindowWithSpeech {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

// Store recognition instance for stop control
let recognitionInstance: ISpeechRecognition | null = null;

/**
 * Start listening for speech input
 */
export function startListening(
  language: Language,
  onResult: (text: string) => void,
  onError: (error: string) => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined') return;

  const SpeechRecognition =
    (window as unknown as WindowWithSpeech).SpeechRecognition ||
    (window as unknown as WindowWithSpeech).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in your browser');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = getSpeechLangCode(language);
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: ISpeechEvent) => {
    const last = event.results.length - 1;
    const transcript = event.results[last][0].transcript;
    
    if (event.results[last].isFinal) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event: ISpeechErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    const errorMessages: Record<string, Record<Language, string>> = {
      'not-allowed': {
        en: 'Microphone access denied. Please allow microphone permission.',
        hi: 'माइक्रोफ़ोन एक्सेस नहीं मिला। कृपया अनुमति दें।',
        kn: 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ.',
      },
      'no-speech': {
        en: 'No speech detected. Please try again.',
        hi: 'कोई आवाज़ नहीं मिली। पुनः प्रयास करें।',
        kn: 'ಧ್ವನಿ ಕಂಡುಬಂದಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      },
    };
    const msg = errorMessages[event.error]?.[language] || `Speech error: ${event.error}`;
    onError(msg);
  };

  recognition.onend = () => {
    recognitionInstance = null;
    onEnd?.();
  };

  recognitionInstance = recognition;
  recognition.start();
}

/**
 * Stop listening
 */
export function stopListening(): void {
  if (recognitionInstance) {
    recognitionInstance.stop();
    recognitionInstance = null;
  }
}

/**
 * Speak text using Text-to-Speech
 */
export function speak(text: string, language: Language): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getSpeechLangCode(language);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const langCode = getSpeechLangCode(language);
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
}
