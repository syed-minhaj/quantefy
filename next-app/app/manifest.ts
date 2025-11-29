import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Quantefy',
        short_name: 'Quantefy',
        description: 'Inventory management for modern brands',
        start_url: '/app',
        display: 'standalone',
        background_color: '#F4F6FA',
        theme_color: '#070707',
        icons: [
            {
                src: '/icon.png',
                sizes: '449x247',
                type: 'image/png',
            }
        ],
    }
}