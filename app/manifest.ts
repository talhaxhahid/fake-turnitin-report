import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Turnitin Report Generator',
    short_name: 'TurnitinReport',
    description:
      'Free Turnitin report generator. Create custom AI detection and similarity reports as PDFs in seconds.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}
