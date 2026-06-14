import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage } from '@/lib/gemini';
import type { ChatMessage, Language } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userMessage, language } = body as {
      messages: ChatMessage[];
      userMessage: string;
      language: Language;
    };

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'userMessage is required' },
        { status: 400 }
      );
    }

    const reply = await sendChatMessage(
      messages || [],
      userMessage,
      language || 'en'
    );

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
