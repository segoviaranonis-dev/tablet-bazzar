import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tablet Bazzar - Sistema POS',
    short_name: 'Tablet Bazzar',
    description: 'Sistema punto de venta para vendedores de tiendas Bazzar',
    start_url: '/cadena',
    display: 'standalone',
    background_color: '#f1f5f9',
    theme_color: '#002B4E',
    orientation: 'landscape-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'es-PY',
    dir: 'ltr',
  }
}
