import { Colors } from "@/constants/Colors";
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff6b6b',
        borderWidth: 2,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
    },
    button: {
        backgroundColor: '#6e6e6e',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        color: '#007bff',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    bodyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    image: {
        height: 150,
        width: '100%',
        resizeMode: 'contain',
        marginVertical: 20,
    },
    description: {
        fontSize: 16,
        color: Colors.light.TEXT,
        textAlign: 'center',
    },


});
