import { chatService } from '@/services/chatService';
import { ChatState, Message } from '@/types/chat';
import { useCallback, useState } from 'react';

export interface UseChatReturn {
    messages: Message[];
    loading: boolean;
    error: string | null;
    isTyping: boolean;
    sendMessage: (text: string) => Promise<void>;
    clearMessages: () => void;
    clearError: () => void;
}

export const useChat = (): UseChatReturn => {
    const [state, setState] = useState<ChatState>({
        messages: [],
        loading: false,
        error: null,
        isTyping: false,
    });

    const updateState = useCallback((updates: Partial<ChatState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: text.trim(),
            timestamp: Date.now(),
        };

        // Add user message immediately
        updateState({
            messages: [...state.messages, userMessage],
            isTyping: true,
            error: null,
        });

        try {
            const response = await chatService.sendMessage(text.trim());
            
            // Add bot response
            updateState({
                messages: [...state.messages, userMessage, response.botResponse],
                isTyping: false,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            updateState({
                error: errorMessage,
                isTyping: false,
            });
        }
    }, [state.messages, updateState]);

    const clearMessages = useCallback(() => {
        updateState({ messages: [] });
    }, [updateState]);

    const clearError = useCallback(() => {
        updateState({ error: null });
    }, [updateState]);

    return {
        messages: state.messages,
        loading: state.loading,
        error: state.error,
        isTyping: state.isTyping,
        sendMessage,
        clearMessages,
        clearError,
    };
}; 