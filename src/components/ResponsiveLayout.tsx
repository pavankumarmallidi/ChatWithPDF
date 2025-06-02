import React from 'react';
import { useDeviceDetection, DeviceType } from '@/hooks/useDeviceDetection';

interface ResponsiveLayoutProps {
  children?: React.ReactNode;
  mobileComponent?: React.ComponentType<any>;
  tabletComponent?: React.ComponentType<any>;
  desktopComponent?: React.ComponentType<any>;
  mobileChildren?: React.ReactNode;
  tabletChildren?: React.ReactNode;
  desktopChildren?: React.ReactNode;
  fallbackComponent?: React.ComponentType<any>;
  className?: string;
  [key: string]: any; // for passing props to child components
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  mobileComponent: MobileComponent,
  tabletComponent: TabletComponent,
  desktopComponent: DesktopComponent,
  mobileChildren,
  tabletChildren,
  desktopChildren,
  fallbackComponent: FallbackComponent,
  className = '',
  ...props
}) => {
  const { type, isMobile, isTablet, isDesktop } = useDeviceDetection();

  // If specific components are provided, render them
  if (type === 'mobile' && MobileComponent) {
    return <MobileComponent className={className} {...props} />;
  }
  
  if (type === 'tablet' && TabletComponent) {
    return <TabletComponent className={className} {...props} />;
  }
  
  if (type === 'desktop' && DesktopComponent) {
    return <DesktopComponent className={className} {...props} />;
  }

  // If specific children are provided, render them
  if (type === 'mobile' && mobileChildren) {
    return <div className={`mobile-layout ${className}`}>{mobileChildren}</div>;
  }
  
  if (type === 'tablet' && tabletChildren) {
    return <div className={`tablet-layout ${className}`}>{tabletChildren}</div>;
  }
  
  if (type === 'desktop' && desktopChildren) {
    return <div className={`desktop-layout ${className}`}>{desktopChildren}</div>;
  }

  // Fallback to a single component if provided
  if (FallbackComponent) {
    return <FallbackComponent className={className} {...props} />;
  }

  // Default responsive wrapper with CSS classes
  return (
    <div 
      className={`
        responsive-layout 
        ${isMobile ? 'mobile-layout' : ''} 
        ${isTablet ? 'tablet-layout' : ''} 
        ${isDesktop ? 'desktop-layout' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Higher-order component for device-specific rendering
export function withResponsive<P extends object>(
  MobileComponent?: React.ComponentType<P>,
  TabletComponent?: React.ComponentType<P>,
  DesktopComponent?: React.ComponentType<P>
) {
  return function ResponsiveWrapper(props: P) {
    const { type } = useDeviceDetection();
    
    switch (type) {
      case 'mobile':
        return MobileComponent ? <MobileComponent {...props} /> : null;
      case 'tablet':
        return TabletComponent ? <TabletComponent {...props} /> : null;
      case 'desktop':
        return DesktopComponent ? <DesktopComponent {...props} /> : null;
      default:
        return DesktopComponent ? <DesktopComponent {...props} /> : null;
    }
  };
}

// Device-specific conditional rendering hooks
export function useMobileOnly<T>(value: T): T | null {
  const { isMobile } = useDeviceDetection();
  return isMobile ? value : null;
}

export function useTabletOnly<T>(value: T): T | null {
  const { isTablet } = useDeviceDetection();
  return isTablet ? value : null;
}

export function useDesktopOnly<T>(value: T): T | null {
  const { isDesktop } = useDeviceDetection();
  return isDesktop ? value : null;
}

// Responsive conditional component
interface ResponsiveShowProps {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  children: React.ReactNode;
}

export const ResponsiveShow: React.FC<ResponsiveShowProps> = ({
  mobile = false,
  tablet = false,
  desktop = false,
  children
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  const shouldShow = (
    (mobile && isMobile) ||
    (tablet && isTablet) ||
    (desktop && isDesktop)
  );
  
  return shouldShow ? <>{children}</> : null;
}; 