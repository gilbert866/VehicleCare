import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        color: Colors.light.PRIMARY,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: Colors.light.WHITE,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderColor: Colors.light.PRIMARY,
        borderWidth: 1,
    },
    button: {
        backgroundColor: Colors.light.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.light.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
