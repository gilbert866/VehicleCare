import { Message } from '@/types';

class ChatService {
    private defaultBotMessage = "Thanks! We'll get back to you soon.";

    generateBotResponse(userMessage: string): Message {
        // This is a simple bot response generator
        // In a real application, this would integrate with an AI service
        const responses = [
            "I understand your concern. Let me help you with that.",
            "That's a great question! Here's what I can tell you...",
            "I'm processing your request. Please wait a moment.",
            "Thanks for reaching out! I'll assist you with this.",
            this.defaultBotMessage,
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            id: Date.now().toString() + '_bot',
            sender: 'bot',
            text: randomResponse,
        };
    }

    createUserMessage(text: string): Message {
        return {
            id: Date.now().toString(),
            sender: 'user',
            text: text.trim(),
        };
    }

    async sendMessage(message: string): Promise<{ userMessage: Message; botResponse: Message }> {
        const userMessage = this.createUserMessage(message);
        const botResponse = this.generateBotResponse(message);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return { userMessage, botResponse };
    }

    getInitialMessage(): Message {
        return {
            id: '1',
            sender: 'bot',
            text: 'Hi! How can I help you with your battery health today?',
        };
    }
}

export const chatService = new ChatService(); 