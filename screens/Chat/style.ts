import {
    BORDER_RADIUS,
    FONT_SIZES,
    isMediumScreen,
    isSmallScreen,
    PADDING,
    SPACING
} from '@/utils/responsive';
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
        paddingTop: isSmallScreen ? 40 : isMediumScreen ? 50 : 60,
        paddingBottom: SPACING.L,
        paddingHorizontal: PADDING.SCREEN,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        width: isSmallScreen ? 32 : 36,
        height: isSmallScreen ? 32 : 36,
        borderRadius: isSmallScreen ? 16 : 18,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    backIcon: {
        fontSize: isSmallScreen ? 16 : 18,
        color: '#495057',
        fontWeight: '600',
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: SPACING.L,
    },
    headerTitle: {
        fontSize: FONT_SIZES.XL,
        fontWeight: '700',
        color: '#212529',
        marginBottom: SPACING.XS,
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
        marginRight: SPACING.XS,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.S,
        color: '#6c757d',
        fontWeight: '500',
    },
    clearButton: {
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.XS,
        borderRadius: 14,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    clearButtonText: {
        fontSize: FONT_SIZES.S,
        color: '#dc3545',
        fontWeight: '600',
    },

    // Quick Prompts
    quickPromptsContainer: {
        paddingHorizontal: PADDING.SCREEN,
        paddingVertical: SPACING.L,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    quickPromptsTitle: {
        fontSize: FONT_SIZES.XL,
        fontWeight: '700',
        color: '#212529',
        marginBottom: SPACING.XS,
        textAlign: 'center',
    },
    quickPromptsSubtitle: {
        fontSize: FONT_SIZES.S,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: SPACING.L,
    },
    quickPrompts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: SPACING.S,
    },
    quickPrompt: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.S,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        maxWidth: screenWidth * 0.42,
        minWidth: isSmallScreen ? 120 : 140,
    },
    quickPromptText: {
        fontSize: FONT_SIZES.S,
        color: '#495057',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: FONT_SIZES.S * 1.3,
    },

    // Messages
    messages: {
        flexGrow: 1,
        paddingHorizontal: SPACING.L,
        paddingTop: SPACING.M,
        paddingBottom: SPACING.M,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.M,
        alignItems: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    botMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        marginRight: SPACING.XS,
        marginBottom: SPACING.XS,
    },
    avatar: {
        width: isSmallScreen ? 24 : 28,
        height: isSmallScreen ? 24 : 28,
        borderRadius: isSmallScreen ? 12 : 14,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    avatarText: {
        fontSize: isSmallScreen ? 12 : 14,
    },
    messageBubble: {
        maxWidth: screenWidth * 0.72,
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.S,
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
        fontSize: FONT_SIZES.XS,
        color: '#6c757d',
        fontWeight: '600',
        marginBottom: SPACING.XS,
    },
    messageText: {
        fontSize: FONT_SIZES.M,
        lineHeight: FONT_SIZES.M * 1.3,
        fontWeight: '400',
    },
    userText: {
        color: '#ffffff',
    },
    botText: {
        color: '#212529',
    },
    timestamp: {
        fontSize: FONT_SIZES.XS,
        marginTop: SPACING.XS,
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
        paddingVertical: SPACING.XL,
    },
    emptyStateText: {
        fontSize: FONT_SIZES.M,
        color: '#6c757d',
        textAlign: 'center',
        fontWeight: '500',
    },

    // Typing Indicator
    typingIndicator: {
        paddingHorizontal: SPACING.L,
        paddingVertical: SPACING.XS,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.S,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        maxWidth: screenWidth * 0.35,
    },
    typingText: {
        fontSize: FONT_SIZES.S,
        color: '#6c757d',
        marginLeft: SPACING.XS,
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
        borderRadius: BORDER_RADIUS.M,
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.S,
        marginHorizontal: SPACING.L,
        marginVertical: SPACING.XS,
    },
    errorText: {
        flex: 1,
        fontSize: FONT_SIZES.S,
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
        marginLeft: SPACING.S,
    },
    errorDismissText: {
        fontSize: FONT_SIZES.XS,
        color: '#ffffff',
        fontWeight: '700',
    },

    // Modern Input Bar
    inputBar: {
        backgroundColor: '#ffffff',
        paddingHorizontal: SPACING.L,
        paddingVertical: SPACING.S,
        paddingBottom: SPACING.M,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.XS,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZES.M,
        color: '#212529',
        maxHeight: 80,
        paddingVertical: SPACING.XS,
        paddingRight: SPACING.XS,
        fontWeight: '400',
    },
    sendButton: {
        width: isSmallScreen ? 24 : 28,
        height: isSmallScreen ? 24 : 28,
        borderRadius: isSmallScreen ? 12 : 14,
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
        fontSize: isSmallScreen ? 12 : 14,
        color: '#ffffff',
        fontWeight: '700',
    },
});
