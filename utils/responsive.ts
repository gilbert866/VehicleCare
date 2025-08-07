import { Dimensions, Platform, StatusBar, TextStyle, ViewStyle } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Screen size breakpoints
export const SCREEN_SIZES = {
  SMALL: 320,    // iPhone SE, small Android phones
  MEDIUM: 375,   // iPhone 12/13/14, most Android phones
  LARGE: 414,    // iPhone 12/13/14 Pro Max, large Android phones
  XLARGE: 480,   // Tablets and very large phones
} as const;

// Device type detection
export const isSmallScreen = screenWidth < SCREEN_SIZES.MEDIUM;
export const isMediumScreen = screenWidth >= SCREEN_SIZES.MEDIUM && screenWidth < SCREEN_SIZES.LARGE;
export const isLargeScreen = screenWidth >= SCREEN_SIZES.LARGE && screenWidth < SCREEN_SIZES.XLARGE;
export const isXLargeScreen = screenWidth >= SCREEN_SIZES.XLARGE;

// Platform detection
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Status bar height
export const statusBarHeight = StatusBar.currentHeight || 0;

// Safe area calculations
export const getSafeAreaInsets = () => {
  const topInset = isIOS ? 44 : statusBarHeight;
  const bottomInset = isIOS ? 34 : 0;
  
  return {
    top: topInset,
    bottom: bottomInset,
    left: 0,
    right: 0,
  };
};

// Responsive scaling functions
export const scale = (size: number): number => {
  const baseWidth = SCREEN_SIZES.MEDIUM; // Base width for scaling
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};

export const verticalScale = (size: number): number => {
  const baseHeight = 812; // iPhone X height as base
  const scaleFactor = screenHeight / baseHeight;
  return Math.round(size * scaleFactor);
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Responsive spacing
export const SPACING = {
  XS: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
  S: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
  M: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  L: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
  XL: isSmallScreen ? 20 : isMediumScreen ? 24 : 32,
  XXL: isSmallScreen ? 24 : isMediumScreen ? 32 : 40,
} as const;

// Responsive font sizes
export const FONT_SIZES = {
  XS: moderateScale(10),
  S: moderateScale(12),
  M: moderateScale(14),
  L: moderateScale(16),
  XL: moderateScale(18),
  XXL: moderateScale(20),
  XXXL: moderateScale(24),
  TITLE: moderateScale(28),
  LARGE_TITLE: moderateScale(32),
} as const;

// Responsive padding/margins
export const PADDING = {
  SCREEN: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
  CARD: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  BUTTON: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  INPUT: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
} as const;

// Responsive border radius
export const BORDER_RADIUS = {
  S: isSmallScreen ? 4 : 6,
  M: isSmallScreen ? 8 : 12,
  L: isSmallScreen ? 12 : 16,
  XL: isSmallScreen ? 16 : 20,
  ROUND: 50,
} as const;

// Responsive button heights
export const BUTTON_HEIGHT = {
  S: isSmallScreen ? 36 : 40,
  M: isSmallScreen ? 44 : 48,
  L: isSmallScreen ? 52 : 56,
} as const;

// Responsive input heights
export const INPUT_HEIGHT = {
  S: isSmallScreen ? 40 : 44,
  M: isSmallScreen ? 48 : 52,
  L: isSmallScreen ? 56 : 60,
} as const;

// Responsive icon sizes
export const ICON_SIZES = {
  S: moderateScale(16),
  M: moderateScale(20),
  L: moderateScale(24),
  XL: moderateScale(32),
  XXL: moderateScale(48),
} as const;

// Screen-specific responsive values
export const getResponsiveValues = () => ({
  screenWidth,
  screenHeight,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isXLargeScreen,
  isIOS,
  isAndroid,
  statusBarHeight,
  safeAreaInsets: getSafeAreaInsets(),
  spacing: SPACING,
  fontSizes: FONT_SIZES,
  padding: PADDING,
  borderRadius: BORDER_RADIUS,
  buttonHeight: BUTTON_HEIGHT,
  inputHeight: INPUT_HEIGHT,
  iconSizes: ICON_SIZES,
});

// Responsive style helper
export const createResponsiveStyle = (styleObject: any) => {
  return {
    ...styleObject,
    // Add any additional responsive transformations here
  };
};

// Responsive text style helper
export const getResponsiveTextStyle = (baseSize: keyof typeof FONT_SIZES, additionalStyles: TextStyle = {}): TextStyle => ({
  fontSize: FONT_SIZES[baseSize],
  ...additionalStyles,
});

// Responsive container style helper
export const getResponsiveContainerStyle = (additionalStyles: ViewStyle = {}): ViewStyle => ({
  flex: 1,
  paddingHorizontal: PADDING.SCREEN,
  ...additionalStyles,
});

// Responsive button style helper
export const getResponsiveButtonStyle = (size: keyof typeof BUTTON_HEIGHT = 'M', additionalStyles: ViewStyle = {}): ViewStyle => ({
  height: BUTTON_HEIGHT[size],
  paddingHorizontal: PADDING.BUTTON,
  borderRadius: BORDER_RADIUS.M,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  ...additionalStyles,
});

// Responsive input style helper
export const getResponsiveInputStyle = (size: keyof typeof INPUT_HEIGHT = 'M', additionalStyles: TextStyle = {}): TextStyle => ({
  height: INPUT_HEIGHT[size],
  paddingHorizontal: PADDING.INPUT,
  borderRadius: BORDER_RADIUS.M,
  fontSize: FONT_SIZES.M,
  ...additionalStyles,
}); 