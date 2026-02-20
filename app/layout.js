import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import { CartProvider } from '@/context/CartContext'
// In app/layout.js
import ScrollToTop from '@/components/ScrollToTop'

// Inside the body tag:
<ScrollToTop />

export const metadata = {
  title: 'Jix Accessories - Premium Tech for Students',
  description: 'Best phones, laptops & accessories in UI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter - Professional, clean, modern */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50" style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-8">
            {children}
          </main>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  )
}