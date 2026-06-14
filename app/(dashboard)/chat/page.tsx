'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import type { ChatMessage, Language } from '@/types';
import { isVoiceSupported, startListening, stopListening, speak } from '@/lib/voice';
import { Send, Mic, MicOff, Volume2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const suggestions: Record<Language, string[]> = {
  en: ['Disease help 🌿', 'Check weather 🌦️', 'Mandi price 📊', 'Irrigation advice 💧', 'PM-KISAN info 📋', 'Ragi farming tips 🌾'],
  hi: ['बीमारी की पहचान 🌿', 'मौसम देखें 🌦️', 'मंडी भाव 📊', 'सिंचाई सलाह 💧', 'PM-KISAN जानकारी 📋', 'रागी की खेती 🌾'],
  kn: ['ರೋಗ ಗುರುತಿಸಿ 🌿', 'ಹವಾಮಾನ ನೋಡಿ 🌦️', 'ಮಂಡಿ ಬೆಲೆ 📊', 'ನೀರಾವರಿ ಸಲಹೆ 💧', 'PM-KISAN ಮಾಹಿತಿ 📋', 'ರಾಗಿ ಕೃಷಿ 🌾'],
};

export default function ChatPage() {
  const { language } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard-aware layout for mobile
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handler = () => {
      const kbHeight = window.innerHeight - (viewport?.height ?? window.innerHeight);
      setKeyboardHeight(kbHeight > 0 ? kbHeight : 0);
    };

    viewport.addEventListener('resize', handler);
    viewport.addEventListener('scroll', handler);
    return () => {
      viewport.removeEventListener('resize', handler);
      viewport.removeEventListener('scroll', handler);
    };
  }, []);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // Haptic feedback
    if ('vibrate' in navigator) navigator.vibrate(20);

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(-10),
          userMessage: messageText,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: '⚠️ ' + (data.error || 'Server error. Please make sure your GEMINI_API_KEY is set correctly in your .env.local file and restart the server.'),
          timestamp: new Date().toISOString(),
          language,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process that. Please check your GEMINI_API_KEY.',
        timestamp: new Date().toISOString(),
        language,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '⚠️ Could not connect to the AI service. Please ensure your GEMINI_API_KEY is configured in .env.local and restart the dev server.',
        timestamp: new Date().toISOString(),
        language,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!isVoiceSupported()) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
      startListening(
        language,
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
        },
        (error) => {
          toast.error(error);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
    }
  };

  const handleSpeak = (text: string) => {
    speak(text, language);
  };

  const clearChat = () => {
    setMessages([]);
    toast.success(language === 'hi' ? 'चैट साफ़ हो गई' : language === 'kn' ? 'ಚಾಟ್ ತೆರವುಗೊಂಡಿದೆ' : 'Chat cleared');
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto" style={{ height: 'calc(100dvh - 120px)' }}>
      {/* Header — compact on mobile */}
      <div className="flex items-center justify-between pb-2 md:pb-3 border-b border-krishisetu-border mb-2 md:mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h1 className="font-heading text-base md:text-lg font-bold text-krishisetu-text-primary leading-tight">
              {language === 'hi' ? 'किसान सारथी' : language === 'kn' ? 'ಕಿಸಾನ್ ಸಾರಥಿ' : 'KisanSarthi'}
            </h1>
            <p className="text-[10px] text-krishisetu-text-muted">AI Agricultural Assistant</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 rounded-lg hover:bg-gray-100 text-krishisetu-text-muted">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area — flex-1 to fill space */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl gradient-primary flex items-center justify-center mb-3 md:mb-4">
              <span className="text-2xl md:text-3xl">🌾</span>
            </div>
            <h2 className="font-heading text-base md:text-lg font-semibold text-krishisetu-text-primary mb-1">
              {language === 'hi' ? 'नमस्ते! मैं किसान सारथी हूँ' : language === 'kn' ? 'ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್ ಸಾರಥಿ' : 'Namaste! I\'m KisanSarthi'}
            </h2>
            <p className="text-sm text-krishisetu-text-muted mb-4 md:mb-6">
              {language === 'hi'
                ? 'हिंदी, अंग्रेजी या कन्नड में पूछें'
                : language === 'kn'
                  ? 'ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ'
                  : 'Ask in Hindi, English, or Kannada'}
            </p>
            {/* Suggestion chips — horizontal scroll on mobile */}
            <div className="flex flex-wrap md:flex-wrap gap-2 justify-center overflow-x-auto no-scrollbar max-w-full pb-2">
              {suggestions[language].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-2.5 rounded-full bg-[#f0fdf4] text-[#166534] text-sm font-medium hover:bg-[#dcfce7] transition-colors whitespace-nowrap press-effect border border-[#d1fae5]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3.5 md:px-4 py-2.5 md:py-3 ${
                msg.role === 'user'
                  ? 'max-w-[80%] text-white rounded-[18px_18px_4px_18px]'
                  : 'max-w-[85%] text-krishisetu-text-body rounded-[4px_18px_18px_18px] border border-krishisetu-border bg-white shadow-sm'
              }`}
              style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #166534, #16a34a)' } : {}}
            >
              <p className="text-[0.9375rem] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleSpeak(msg.content)}
                  className="mt-2 flex items-center gap-1 text-xs text-krishisetu-text-muted hover:text-primary transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सुनें' : language === 'kn' ? 'ಆಲಿಸಿ' : 'Listen'}
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-krishisetu-border rounded-[4px_18px_18px_18px] px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area — fixed bottom style on mobile */}
      <div
        className="border-t border-krishisetu-border pt-2.5 md:pt-3 flex-shrink-0 bg-white"
        style={{ paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined }}
      >
        <div className="flex items-center gap-2">
          {/* Voice button — 48px touch target */}
          <button
            onClick={toggleVoice}
            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all relative ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
            }`}
          >
            {isListening && (
              <span className="pulse-ring w-full h-full bg-red-400 -inset-0" />
            )}
            {isListening ? <MicOff className="w-5 h-5 relative z-10" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Input — 44px height, 16px font, pill shape */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={
              language === 'hi'
                ? 'हिंदी में टाइप करें...'
                : language === 'kn'
                  ? 'ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                  : 'Type your question...'
            }
            className="flex-1 h-11 rounded-full border border-krishisetu-border bg-[#f9fafb] px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />

          {/* Send button — 44px green circle */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition-all press-effect"
            style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
