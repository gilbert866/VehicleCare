import { useChat } from '@/hooks/useChat';
import styles from '@/screens/Chat/style';
import { useNavigation } from 'expo-router';
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default function ChatScreen() {
    const navigation = useNavigation();
    const { messages, input, setInput, loading, sendMessage } = useChat();

    const handleSendMessage = () => {
        sendMessage();
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
                            onSubmitEditing={handleSendMessage}
                            editable={!loading}
                        />
                        <TouchableOpacity 
                            onPress={handleSendMessage} 
                            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                            disabled={loading}
                        >
                            <Text style={styles.sendText}>
                                {loading ? 'Sending...' : 'Send'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
