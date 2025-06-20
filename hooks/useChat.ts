import { chatService } from '@/services/chatService';
import { Message } from '@/types';
import { useEffect, useState } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize with welcome message
        const initialMessage = chatService.getInitialMessage();
        setMessages([initialMessage]);
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        try {
            setLoading(true);
            const { userMessage, botResponse } = await chatService.sendMessage(input);
            
            setMessages(prev => [...prev, userMessage, botResponse]);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message to chat
            const errorMessage: Message = {
                id: Date.now().toString() + '_error',
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        const initialMessage = chatService.getInitialMessage();
        setMessages([initialMessage]);
        setInput('');
    };

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

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