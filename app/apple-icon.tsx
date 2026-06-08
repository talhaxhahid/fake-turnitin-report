import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #0EA5E9 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: -4,
          borderRadius: 38,
        }}
      >
        TR
      </div>
    ),
    { ...size }
  );
}
