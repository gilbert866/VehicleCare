import { API_CONFIG, ENDPOINTS } from '@/constants/api';
import { ChatbotRequest, ChatbotResponse, Message } from '@/types/chat';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

class ChatService {
    private baseURL = API_CONFIG.BACKEND_BASE_URL;

    /**
     * Send a message to the AI chatbot assistant
     */
    async sendMessage(message: string): Promise<{ userMessage: Message; botResponse: Message }> {
        try {
            const url = `${this.baseURL}${ENDPOINTS.CHAT}`;
            console.log('ChatService - Sending message to AI assistant:', url);

            const requestData: ChatbotRequest = {
                prompt: message.trim(),
            };

            console.log('ChatService - Request data:', requestData);

            const response = await fetchWithTimeout(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(requestData),
            }, 15000); // 15 second timeout for AI processing

            console.log(`ChatService - Response status: ${response.status}`);

            if (!response.ok) {
                let errorMessage = `Request failed with status ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.log('ChatService - Error response:', errorData);
                    errorMessage = errorData || errorMessage;
                } catch (parseError) {
                    console.log('ChatService - Could not parse error response');
                }
                throw new Error(errorMessage);
            }

            const responseText = await response.text();
            console.log('ChatService - Raw response:', responseText);
            
            const data: ChatbotResponse = JSON.parse(responseText);
            console.log('ChatService - Parsed response:', data);

            // Create user message
            const userMessage = this.createUserMessage(message);
            
            // Create bot response message - use formatted_response for better display
            const botResponse = this.createBotMessage(
                data.response?.formatted_response || data.response?.raw_response || 'I apologize, but I couldn\'t process your request. Please try again.'
            );

            return { userMessage, botResponse };

        } catch (error: any) {
            console.error('ChatService - Error:', error);
            
            // Create user message
            const userMessage = this.createUserMessage(message);
            
            // Create error response
            const botResponse = this.createBotMessage(
                'I\'m sorry, I\'m having trouble connecting to the AI assistant right now. Please check your internet connection and try again.'
            );

            return { userMessage, botResponse };
        }
    }

    /**
     * Create a user message object
     */
    createUserMessage(text: string): Message {
        return {
            id: Date.now().toString(),
            sender: 'user',
            text,
            timestamp: Date.now(),
        };
    }

    /**
     * Create a bot message object
     */
    createBotMessage(text: string): Message {
        // Remove asterisks from the response text
        const cleanedText = text.replace(/\*/g, '');
        
        return {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: cleanedText,
            timestamp: Date.now(),
        };
    }

    /**
     * Get initial welcome message
     */
    getInitialMessage(): Message {
        return this.createBotMessage(
            'Hello! I\'m your VehicleCare AI Assistant powered by Google Gemini. I can help you with:\n\n🚗 Vehicle troubleshooting and diagnostics\n🔧 Maintenance advice and tips\n⚠️ Emergency situations (like overheating)\n🔋 Battery and electrical issues\n🛠️ General automotive questions\n\nHow can I assist you today?'
        );
    }
}

export const chatService = new ChatService(); 