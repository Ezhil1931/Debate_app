import React from 'react';
import { BlurView } from 'expo-blur';

// Frosted-glass surface: blur + translucent tint + hairline highlight border.
// Use tint="dark" on top of video/dark areas, "light" elsewhere.
export default function Glass({ children, style, intensity = 40, tint = 'light', radius = 999 }) {
  const dark = tint === 'dark';
  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[
        {
          overflow: 'hidden',
          borderRadius: radius,
          borderWidth: 1,
          borderColor: dark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.75)',
          backgroundColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)',
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}
