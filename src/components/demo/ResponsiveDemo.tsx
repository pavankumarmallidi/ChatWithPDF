import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveLayout, ResponsiveShow } from '@/components/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Info } from 'lucide-react';

const ResponsiveDemo: React.FC = () => {
  const deviceInfo = useDeviceDetection();

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Device Info Panel */}
      <Card className="mobile-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Device Detection</h2>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Device Type:</span>
            <span className="text-white font-medium">{deviceInfo.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Screen Size:</span>
            <span className="text-white">{deviceInfo.width} × {deviceInfo.height}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Orientation:</span>
            <span className="text-white">{deviceInfo.isPortrait ? 'Portrait' : 'Landscape'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Touch Device:</span>
            <span className="text-white">{deviceInfo.isTouchDevice ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pixel Ratio:</span>
            <span className="text-white">{deviceInfo.pixelRatio}x</span>
          </div>
          {deviceInfo.isIOS && (
            <div className="flex justify-between">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white">iOS</span>
            </div>
          )}
          {deviceInfo.isAndroid && (
            <div className="flex justify-between">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white">Android</span>
            </div>
          )}
        </div>
      </Card>

      {/* Responsive Layout Examples */}
      <div className="space-y-6">
        {/* Example 1: Conditional Rendering */}
        <Card className="mobile-card">
          <h3 className="text-white font-semibold mb-4">Conditional Rendering Example</h3>
          
          <ResponsiveShow mobile>
            <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Mobile View</span>
              </div>
              <p className="text-gray-300 text-sm">
                This content is only visible on mobile devices. 
                The layout is optimized for touch interaction and small screens.
              </p>
            </div>
          </ResponsiveShow>

          <ResponsiveShow tablet>
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tablet className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Tablet View</span>
              </div>
              <p className="text-gray-300 text-sm">
                This content is only visible on tablet devices. 
                The layout takes advantage of the larger screen real estate.
              </p>
            </div>
          </ResponsiveShow>

          <ResponsiveShow desktop>
            <div className="bg-purple-900/20 border border-purple-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium">Desktop View</span>
              </div>
              <p className="text-gray-300 text-sm">
                This content is only visible on desktop devices. 
                The layout is optimized for mouse interaction and large screens.
              </p>
            </div>
          </ResponsiveShow>
        </Card>

        {/* Example 2: Responsive Grid */}
        <Card className="mobile-card">
          <h3 className="text-white font-semibold mb-4">Responsive Grid Example</h3>
          <div className="responsive-grid-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{item}</span>
                </div>
                <p className="text-gray-400 text-xs">Grid Item {item}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Example 3: Responsive Buttons */}
        <Card className="mobile-card">
          <h3 className="text-white font-semibold mb-4">Responsive Buttons Example</h3>
          <div className="space-y-3">
            <Button className="responsive-btn-primary w-full">
              Primary Button (Responsive)
            </Button>
            <Button className="responsive-btn-secondary w-full">
              Secondary Button (Responsive)
            </Button>
            <div className="flex gap-3">
              <Button className="responsive-btn flex-1">Flex Button 1</Button>
              <Button className="responsive-btn flex-1">Flex Button 2</Button>
            </div>
          </div>
        </Card>

        {/* Example 4: Responsive Text */}
        <Card className="mobile-card">
          <h3 className="text-white font-semibold mb-4">Responsive Typography Example</h3>
          <div className="space-y-3">
            <h1 className="responsive-text-3xl text-white">Responsive Heading 1</h1>
            <h2 className="responsive-text-2xl text-white">Responsive Heading 2</h2>
            <h3 className="responsive-text-xl text-white">Responsive Heading 3</h3>
            <p className="responsive-text-base text-gray-300">
              This is responsive body text that scales appropriately across different device sizes.
            </p>
            <p className="responsive-text-sm text-gray-400">
              This is responsive small text for captions and secondary information.
            </p>
          </div>
        </Card>

        {/* Example 5: Device-Specific Features */}
        <Card className="mobile-card">
          <h3 className="text-white font-semibold mb-4">Device-Specific Features</h3>
          
          {deviceInfo.isTouchDevice && (
            <div className="bg-orange-900/20 border border-orange-800/50 rounded-xl p-4 mb-3">
              <p className="text-orange-400 font-medium mb-1">Touch Device Detected</p>
              <p className="text-gray-300 text-sm">
                Touch-optimized interactions are enabled. All buttons have minimum 44px touch targets.
              </p>
            </div>
          )}

          {deviceInfo.isPortrait && (
            <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-4 mb-3">
              <p className="text-cyan-400 font-medium mb-1">Portrait Orientation</p>
              <p className="text-gray-300 text-sm">
                Layout is optimized for portrait viewing with vertical stacking.
              </p>
            </div>
          )}

          {deviceInfo.isLandscape && (
            <div className="bg-indigo-900/20 border border-indigo-800/50 rounded-xl p-4 mb-3">
              <p className="text-indigo-400 font-medium mb-1">Landscape Orientation</p>
              <p className="text-gray-300 text-sm">
                Layout is optimized for landscape viewing with horizontal arrangements.
              </p>
            </div>
          )}

          {deviceInfo.pixelRatio > 1 && (
            <div className="bg-pink-900/20 border border-pink-800/50 rounded-xl p-4">
              <p className="text-pink-400 font-medium mb-1">High DPI Display</p>
              <p className="text-gray-300 text-sm">
                High-resolution graphics and crisp text rendering enabled ({deviceInfo.pixelRatio}x pixel ratio).
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveDemo; 