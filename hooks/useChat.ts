import { chatService } from '@/services/chatService';
import { Message } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize with welcome message
        const initialMessage = chatService.getInitialMessage();
        setMessages([initialMessage]);
    }, []);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || loading) return;

        const messageText = input.trim();
        setInput(''); // Clear input immediately for better UX

        try {
            setLoading(true);
            
            // Add user message immediately
            const userMessage = chatService.createUserMessage(messageText);
            setMessages(prev => [...prev, userMessage]);
            
            // Send to backend and get response
            const { botResponse } = await chatService.sendMessage(messageText);
            
            // Add bot response
            setMessages(prev => [...prev, botResponse]);
        } catch (error: any) {
            console.error('Error sending message:', error);
            
            // Add error message to chat
            const errorMessage: Message = {
                id: Date.now().toString() + '_error',
                sender: 'bot',
                text: error.message || 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }, [input, loading]);

    const clearChat = useCallback(() => {
        const initialMessage = chatService.getInitialMessage();
        setMessages([initialMessage]);
        setInput('');
    }, []);

    const addMessage = useCallback((message: Message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    return {
        messages,
        input,
        setInput,
        loading,
        sendMessage,
        clearChat,
        addMessage,
    };
}; 