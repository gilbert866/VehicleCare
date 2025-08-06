import { useChat } from '@/hooks/useChat';
import styles from '@/screens/Chat/style';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export default function ChatScreen() {
    const router = useRouter();
    const { messages, loading, error, isTyping, sendMessage, clearMessages, clearError } = useChat();
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Quick suggestion prompts for common vehicle issues
    const quickPrompts = [
        "🚗 My car is overheating, what should I do?",
        "⛽ How often should I change my oil?",
        "🔋 My battery seems weak, any advice?",
        "🛑 Strange noise when braking, help!",
        "⚠️ Check engine light is on"
    ];

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;
        
        const messageText = input.trim();
        setInput(''); // Clear input immediately
        Keyboard.dismiss(); // Dismiss keyboard
        
        await sendMessage(messageText);
    };

    const handleQuickPrompt = async (prompt: string) => {
        if (loading) return;
        
        // Remove emoji for actual message
        const cleanPrompt = prompt.replace(/^[^\s]*\s/, '');
        setInput(cleanPrompt);
        
        // Auto-send the quick prompt
        setTimeout(async () => {
            setInput('');
            await sendMessage(cleanPrompt);
        }, 100);
    };

    const handleClearChat = () => {
        Alert.alert(
            'Clear Conversation',
            'Are you sure you want to clear all messages? This will remove your conversation history with the AI assistant.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: clearMessages,
                },
            ]
        );
    };

    // Animate in on mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    // Clear any errors when component mounts
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, []);

    const renderMessage = ({ item, index }: { item: any; index: number }) => {
        const isUser = item.sender === 'user';
        const showAvatar = !isUser;
        const isLastMessage = index === messages.length - 1;

        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessageContainer : styles.botMessageContainer,
                ]}
            >
                {showAvatar && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>🤖</Text>
                        </View>
                    </View>
                )}
                
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.botBubble,
                    isLastMessage && isUser && styles.lastUserMessage,
                    isLastMessage && !isUser && styles.lastBotMessage,
                ]}>
                    {!isUser && (
                        <Text style={styles.botLabel}>AI Assistant</Text>
                    )}
                    
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userText : styles.botText
                    ]}>
                        {item.text}
                    </Text>
                    
                    {item.timestamp && (
                        <Text style={[
                            styles.timestamp,
                            isUser ? styles.userTimestamp : styles.botTimestamp
                        ]}>
                            {new Date(item.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        {/* Modern Header */}
                        <Animated.View 
                            style={[
                                styles.header,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            <TouchableOpacity 
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Text style={styles.backIcon}>←</Text>
                            </TouchableOpacity>
                            
                            <View style={styles.headerContent}>
                                <Text style={styles.headerTitle}>AI Assistant</Text>
                                <View style={styles.headerSubtitleContainer}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.headerSubtitle}>Powered by Google Gemini</Text>
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                onPress={handleClearChat}
                                style={styles.clearButton}
                            >
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Quick Prompts - Show only when no messages */}
                        {messages.length <= 1 && (
                            <Animated.View 
                                style={[
                                    styles.quickPromptsContainer,
                                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                                ]}
                            >
                                <Text style={styles.quickPromptsTitle}>Quick Help</Text>
                                <Text style={styles.quickPromptsSubtitle}>Tap any question to get started</Text>
                                <View style={styles.quickPrompts}>
                                    {quickPrompts.map((prompt, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.quickPrompt}
                                            onPress={() => handleQuickPrompt(prompt)}
                                            disabled={loading}
                                        >
                                            <Text style={styles.quickPromptText}>{prompt}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Animated.View>
                        )}

                        {/* Messages */}
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.messages}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                            renderItem={renderMessage}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateText}>
                                        Start a conversation with your AI assistant
                                    </Text>
                                </View>
                            }
                        />

                        {/* Typing Indicator */}
                        {isTyping && (
                            <View style={styles.typingIndicator}>
                                <View style={styles.typingBubble}>
                                    <ActivityIndicator size="small" color="#007AFF" />
                                    <Text style={styles.typingText}>AI is thinking...</Text>
                                </View>
                            </View>
                        )}

                        {/* Error Display */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity onPress={clearError} style={styles.errorDismiss}>
                                    <Text style={styles.errorDismissText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Modern Input Bar */}
                        <View style={styles.inputBar}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ask me anything about your vehicle..."
                                    placeholderTextColor="#999"
                                    value={input}
                                    onChangeText={setInput}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendMessage}
                                    editable={!loading}
                                    multiline
                                    maxLength={500}
                                />
                                <TouchableOpacity 
                                    onPress={handleSendMessage} 
                                    style={[
                                        styles.sendButton, 
                                        (loading || !input.trim()) && styles.sendButtonDisabled
                                    ]}
                                    disabled={loading || !input.trim()}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Text style={styles.sendIcon}>→</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
}
