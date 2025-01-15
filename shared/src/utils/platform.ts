export const Platform = {
  isWeb: typeof window !== 'undefined' && !('expo' in window),
  isNative: typeof window === 'undefined' || 'expo' in window,
  isIOS: typeof window !== 'undefined' && 'expo' in window && window.navigator.platform === 'iPhone',
  isAndroid: typeof window !== 'undefined' && 'expo' in window && /android/i.test(window.navigator.userAgent),
};
