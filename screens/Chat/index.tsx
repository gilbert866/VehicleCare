import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from 'expo-router';
import styles from '@/screens/Chat/style';

type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
};

export default function ChatScreen() {
    const navigation = useNavigation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'Hi! How can I help you with your battery health today?',
        },
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input.trim(),
        };

        const botResponse: Message = {
            id: Date.now().toString() + '_bot',
            sender: 'bot',
            text: "Thanks! We'll get back to you soon.",
        };

        setMessages([...messages, userMessage, botResponse]);
        setInput('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.back}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Chat Assistant</Text>
                    </View>

                    {/* Messages */}
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messages}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.messageBubble,
                                    item.sender === 'user'
                                        ? styles.userBubble
                                        : styles.botBubble,
                                ]}
                            >
                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                        )}
                    />

                    {/* Input */}
                    <View style={styles.inputBar}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={input}
                            onChangeText={setInput}
                            returnKeyType="send"
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Text style={styles.sendText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
