import React from 'react';

interface GlassmorphicOverlayProps {
  show: boolean;
}

export function GlassmorphicOverlay({ show }: GlassmorphicOverlayProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-white/80 rounded-lg flex items-center justify-center transition-all duration-300 z-10">
      <div className="bg-white/90 rounded-lg p-4 shadow-lg">
        <p className="text-gray-600">This feature is not available in the current mode</p>
      </div>
    </div>
  );
}