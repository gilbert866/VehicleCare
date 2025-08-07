import { Colors } from "@/constants/Colors";
import {
    BORDER_RADIUS,
    FONT_SIZES,
    PADDING,
    SPACING,
    getResponsiveButtonStyle,
    getResponsiveContainerStyle,
    getResponsiveInputStyle,
    getResponsiveTextStyle
} from '@/utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        ...getResponsiveContainerStyle({
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
            paddingVertical: SPACING.XXL,
        }),
    },
    title: {
        ...getResponsiveTextStyle('TITLE', {
            fontWeight: 'bold',
            marginBottom: SPACING.L,
            textAlign: 'center',
            color: Colors.light.TEXT,
        }),
    },
    subtitle: {
        ...getResponsiveTextStyle('L', {
            color: '#666',
            textAlign: 'center',
            marginBottom: SPACING.L,
            paddingHorizontal: PADDING.SCREEN,
            lineHeight: FONT_SIZES.L * 1.4,
        }),
    },
    input: {
        ...getResponsiveInputStyle('M', {
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: SPACING.M,
            backgroundColor: '#fff',
            color: Colors.light.TEXT,
        }),
    },
    inputError: {
        borderColor: '#ff6b6b',
        borderWidth: 2,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: FONT_SIZES.S,
        marginBottom: SPACING.S,
        marginLeft: SPACING.XS,
        fontWeight: '500',
    },
    button: {
        ...getResponsiveButtonStyle('M', {
            backgroundColor: '#6e6e6e',
            marginVertical: SPACING.M,
            minWidth: 200,
        }),
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.L,
    },
    link: {
        color: '#007bff',
        textAlign: 'center',
        marginTop: SPACING.M,
        fontSize: FONT_SIZES.M,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: PADDING.SCREEN,
        marginTop: SPACING.L,
    },
    bodyText: {
        textAlign: 'center',
        fontSize: FONT_SIZES.L,
        marginTop: SPACING.L,
        color: Colors.light.TEXT,
        lineHeight: FONT_SIZES.L * 1.4,
        paddingHorizontal: PADDING.SCREEN,
    },
    image: {
        height: 150,
        width: '100%',
        resizeMode: 'contain',
        marginVertical: SPACING.L,
    },
    description: {
        fontSize: FONT_SIZES.L,
        color: Colors.light.TEXT,
        textAlign: 'center',
        lineHeight: FONT_SIZES.L * 1.4,
        paddingHorizontal: PADDING.SCREEN,
    },
    // Additional responsive components
    card: {
        backgroundColor: '#fff',
        borderRadius: BORDER_RADIUS.L,
        padding: PADDING.CARD,
        marginVertical: SPACING.S,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.M,
        paddingHorizontal: PADDING.SCREEN,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    spaceAround: {
        justifyContent: 'space-around',
    },
    flex1: {
        flex: 1,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    // Responsive text variants
    textSmall: {
        ...getResponsiveTextStyle('S', {
            color: Colors.light.TEXT,
        }),
    },
    textMedium: {
        ...getResponsiveTextStyle('M', {
            color: Colors.light.TEXT,
        }),
    },
    textLarge: {
        ...getResponsiveTextStyle('L', {
            color: Colors.light.TEXT,
        }),
    },
    textTitle: {
        ...getResponsiveTextStyle('TITLE', {
            color: Colors.light.TEXT,
            fontWeight: 'bold',
        }),
    },
    // Responsive spacing utilities
    marginTop: {
        marginTop: SPACING.M,
    },
    marginBottom: {
        marginBottom: SPACING.M,
    },
    marginLeft: {
        marginLeft: SPACING.M,
    },
    marginRight: {
        marginRight: SPACING.M,
    },
    padding: {
        padding: PADDING.SCREEN,
    },
    paddingHorizontal: {
        paddingHorizontal: PADDING.SCREEN,
    },
    paddingVertical: {
        paddingVertical: SPACING.M,
    },
});
