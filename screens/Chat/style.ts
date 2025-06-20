import { Colors } from "@/constants/Colors";
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.PRIMARY,
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 16,
    },
    back: {
        fontSize: 24,
        color: Colors.light.WHITE,
        marginRight: 12,
    },
    headerTitle: {
        color: Colors.light.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    messages: {
        padding: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        marginBottom: 10,
        borderRadius: 12,
    },
    userBubble: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    botBubble: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: Colors.light.TEXT,
    },
    inputBar: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: Colors.light.WHITE,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: Colors.light.PRIMARY,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    sendText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inner: {
        flex: 1,
    },
});

export default styles;
