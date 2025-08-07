import {
    BORDER_RADIUS,
    BUTTON_HEIGHT,
    FONT_SIZES,
    getResponsiveValues,
    getSafeAreaInsets,
    ICON_SIZES,
    INPUT_HEIGHT,
    isAndroid,
    isIOS,
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
    isXLargeScreen,
    moderateScale,
    PADDING,
    scale,
    SPACING,
    verticalScale
} from '@/utils/responsive';
import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
    const { width, height } = useWindowDimensions();
    
    return {
        // Screen dimensions
        screenWidth: width,
        screenHeight: height,
        
        // Device type detection
        isSmallScreen,
        isMediumScreen,
        isLargeScreen,
        isXLargeScreen,
        
        // Platform detection
        isIOS,
        isAndroid,
        
        // Safe area
        safeAreaInsets: getSafeAreaInsets(),
        
        // Responsive values
        spacing: SPACING,
        fontSizes: FONT_SIZES,
        padding: PADDING,
        borderRadius: BORDER_RADIUS,
        buttonHeight: BUTTON_HEIGHT,
        inputHeight: INPUT_HEIGHT,
        iconSizes: ICON_SIZES,
        
        // Scaling functions
        scale,
        verticalScale,
        moderateScale,
        
        // Responsive helpers
        getResponsiveValues,
        
        // Common responsive patterns
        isLandscape: width > height,
        isPortrait: height > width,
        
        // Responsive breakpoints
        breakpoints: {
            phone: width < 768,
            tablet: width >= 768,
            desktop: width >= 1024,
        },
        
        // Responsive spacing helpers
        getSpacing: (size: keyof typeof SPACING) => SPACING[size],
        getFontSize: (size: keyof typeof FONT_SIZES) => FONT_SIZES[size],
        getPadding: (size: keyof typeof PADDING) => PADDING[size],
        getBorderRadius: (size: keyof typeof BORDER_RADIUS) => BORDER_RADIUS[size],
        getButtonHeight: (size: keyof typeof BUTTON_HEIGHT) => BUTTON_HEIGHT[size],
        getInputHeight: (size: keyof typeof INPUT_HEIGHT) => INPUT_HEIGHT[size],
        getIconSize: (size: keyof typeof ICON_SIZES) => ICON_SIZES[size],
    };
}; 