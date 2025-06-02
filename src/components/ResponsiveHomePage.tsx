import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import MobileHomePage from '@/components/mobile/MobileHomePage';
import TabletHomePage from '@/components/tablet/TabletHomePage';
import HomePage from '@/components/HomePage';

interface ResponsiveHomePageProps {
  onGetStarted: () => void;
}

const ResponsiveHomePage: React.FC<ResponsiveHomePageProps> = ({ onGetStarted }) => {
  const { type, isMobile, isTablet, isDesktop, width, height, isTouchDevice } = useDeviceDetection();

  // Add device info to console for debugging (remove in production)
  React.useEffect(() => {
    console.log('Device Detection:', {
      type,
      isMobile,
      isTablet,
      isDesktop,
      width,
      height,
      isTouchDevice
    });
  }, [type, isMobile, isTablet, isDesktop, width, height, isTouchDevice]);

  // Render device-specific components
  if (type === 'mobile') {
    return <MobileHomePage />;
  }

  if (type === 'tablet') {
    return <TabletHomePage />;
  }

  // Desktop version (default HomePage)
  return <HomePage onGetStarted={onGetStarted} />;
};

export default ResponsiveHomePage; 