import { API_CONFIG, ENDPOINTS } from '@/constants/api';
import { Message } from '@/types/chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatRequest {
    message: string;
    user_id?: string;
}

interface ChatResponse {
    response: string;
    user_id?: string;
    timestamp?: string;
}

interface ChatError {
    message: string;
    status?: number;
}

class ChatService {
    private baseURL = API_CONFIG.BACKEND_BASE_URL;

    /**
     * Send a message to the chat assistant
     */
    async sendMessage(message: string): Promise<{ userMessage: Message; botResponse: Message }> {
        try {
            // Get authentication token
            const token = await this.getAuthToken();
            console.log('Chat service - Token found:', !!token, 'Token length:', token?.length);
            
            if (!token) {
                throw new Error('Authentication required. Please log in.');
            }

            const url = `${this.baseURL}${ENDPOINTS.CHAT}`;
            
            console.log('Sending chat message:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: message.trim(),
                } as ChatRequest),
            });

            const data = await response.json();

            if (!response.ok) {
                throw this.handleError(response.status, data);
            }

            console.log('Chat response:', data);

            // Handle nested response structure if needed
            const responseData = data.data || data;
            const botResponseText = responseData.response || responseData.message || this.getFallbackResponse(message);

            const userMessage = this.createUserMessage(message);
            const botResponse = this.createBotMessage(botResponseText);

            return { userMessage, botResponse };
        } catch (error: any) {
            console.error('Error sending chat message:', error);
            
            // Return fallback response on error
            const userMessage = this.createUserMessage(message);
            const botResponse = this.createBotMessage(
                error.message || 'Sorry, I encountered an error. Please try again.'
            );

            return { userMessage, botResponse };
        }
    }

    /**
     * Get authentication token from storage
     */
    private async getAuthToken(): Promise<string | null> {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            console.log('Chat service - Retrieved token:', token ? 'Token exists' : 'No token found');
            if (token) {
                console.log('Chat service - Token preview:', token.substring(0, 20) + '...');
            }
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    /**
     * Create a user message object
     */
    createUserMessage(text: string): Message {
        return {
            id: Date.now().toString(),
            sender: 'user',
            text: text.trim(),
            timestamp: Date.now(),
        };
    }

    /**
     * Create a bot message object
     */
    createBotMessage(text: string): Message {
        return {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: text.trim(),
            timestamp: Date.now(),
        };
    }

    /**
     * Get initial welcome message
     */
    getInitialMessage(): Message {
        return this.createBotMessage(
            'Hello! I\'m your VehicleCare assistant. I can help you find nearby mechanics, answer questions about your vehicle, and provide maintenance tips. How can I help you today?'
        );
    }

    /**
     * Get fallback response when API fails
     */
    private getFallbackResponse(userMessage: string): string {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('mechanic') || lowerMessage.includes('repair') || lowerMessage.includes('service')) {
            return 'I can help you find nearby mechanics! Use the map to see mechanic shops in your area, or ask me about specific services you need.';
        }
        
        if (lowerMessage.includes('battery') || lowerMessage.includes('charge')) {
            return 'I can help you monitor your device battery. Check the battery monitoring section to see your current battery status and get tips for battery optimization.';
        }
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! I\'m here to help with your vehicle care needs. You can ask me about mechanics, battery monitoring, or general vehicle questions.';
        }
        
        return 'I\'m here to help with your vehicle care needs. You can ask me about finding mechanics, battery monitoring, or general vehicle questions.';
    }

    /**
     * Handle API errors
     */
    private handleError(status: number, data: any): ChatError {
        let message = 'An error occurred while processing your message';

        if (data.responseMessage) {
            message = data.responseMessage;
        } else if (data.message) {
            message = data.message;
        } else if (data.detail) {
            message = data.detail;
        } else {
            switch (status) {
                case 400:
                    message = 'Invalid message format';
                    break;
                case 401:
                    message = 'Authentication required. Please log in.';
                    break;
                case 403:
                    message = 'Access denied';
                    break;
                case 404:
                    message = 'Chat service not found';
                    break;
                case 500:
                    message = 'Server error. Please try again later';
                    break;
                default:
                    message = 'Failed to process message';
            }
        }

        return {
            message,
            status
        };
    }
}

export const chatService = new ChatService(); 