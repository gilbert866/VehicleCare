import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    inner: {
        flex: 1,
        position: 'relative',
    },
    
    // Modern Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    backIcon: {
        fontSize: 18,
        color: '#495057',
        fontWeight: '600',
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 2,
    },
    headerSubtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#28a745',
        marginRight: 6,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    clearButtonText: {
        fontSize: 13,
        color: '#dc3545',
        fontWeight: '600',
    },

    // Quick Prompts
    quickPromptsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    quickPromptsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 4,
        textAlign: 'center',
    },
    quickPromptsSubtitle: {
        fontSize: 13,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 16,
    },
    quickPrompts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    quickPrompt: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        maxWidth: screenWidth * 0.42,
    },
    quickPromptText: {
        fontSize: 12,
        color: '#495057',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 16,
    },

    // Messages
    messages: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    botMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        marginRight: 6,
        marginBottom: 2,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    avatarText: {
        fontSize: 14,
    },
    messageBubble: {
        maxWidth: screenWidth * 0.72,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
    userBubble: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        borderBottomRightRadius: 6,
    },
    botBubble: {
        backgroundColor: '#ffffff',
        borderColor: '#e9ecef',
        borderBottomLeftRadius: 6,
    },
    lastUserMessage: {
        borderBottomRightRadius: 16,
    },
    lastBotMessage: {
        borderBottomLeftRadius: 16,
    },
    botLabel: {
        fontSize: 11,
        color: '#6c757d',
        fontWeight: '600',
        marginBottom: 3,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
    },
    userText: {
        color: '#ffffff',
    },
    botText: {
        color: '#212529',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 3,
        fontWeight: '400',
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    botTimestamp: {
        color: '#6c757d',
        textAlign: 'left',
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },

    // Typing Indicator
    typingIndicator: {
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        maxWidth: screenWidth * 0.35,
    },
    typingText: {
        fontSize: 13,
        color: '#6c757d',
        marginLeft: 6,
        fontWeight: '500',
    },

    // Error Display
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginVertical: 6,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#721c24',
        fontWeight: '500',
    },
    errorDismiss: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#dc3545',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    errorDismissText: {
        fontSize: 10,
        color: '#ffffff',
        fontWeight: '700',
    },

    // Modern Input Bar
    inputBar: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#212529',
        maxHeight: 80,
        paddingVertical: 6,
        paddingRight: 6,
        fontWeight: '400',
    },
    sendButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    sendButtonDisabled: {
        backgroundColor: '#6c757d',
        borderColor: '#6c757d',
    },
    sendIcon: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '700',
    },
});
