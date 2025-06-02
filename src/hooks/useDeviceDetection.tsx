import { useState, useEffect } from "react";

// Define breakpoints for different device types
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  pixelRatio: number;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        width: 1920,
        height: 1080,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
        isIOS: false,
        isAndroid: false,
        pixelRatio: 1,
      };
    }

    return getDeviceInfo();
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo());
    };

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Initial detection
    updateDeviceInfo();

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

function getDeviceInfo(): DeviceInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Detect device type based on width
  let type: DeviceType = 'desktop';
  if (width < BREAKPOINTS.mobile) {
    type = 'mobile';
  } else if (width < BREAKPOINTS.tablet) {
    type = 'tablet';
  }

  // Enhanced mobile detection using user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  
  // Override type if user agent suggests mobile/tablet
  if (isMobileUA && !isTabletUA && width < BREAKPOINTS.tablet) {
    type = 'mobile';
  } else if (isTabletUA || (isMobileUA && width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop)) {
    type = 'tablet';
  }

  // Touch device detection
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // OS detection
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);

  // Orientation detection
  const isPortrait = height > width;
  const isLandscape = width > height;

  return {
    type,
    width,
    height,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    isPortrait,
    isLandscape,
    isTouchDevice,
    isIOS,
    isAndroid,
    pixelRatio,
  };
}

// Hook for specific device type checks
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}

export function useIsTablet(): boolean {
  const { isTablet } = useDeviceDetection();
  return isTablet;
}

export function useIsDesktop(): boolean {
  const { isDesktop } = useDeviceDetection();
  return isDesktop;
}

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  mobile: T;
  tablet: T;
  desktop: T;
}): T {
  const { type } = useDeviceDetection();
  return values[type];
} 