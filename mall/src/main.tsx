import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/authContext.tsx'
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from '@/components/ReactQueryProvider.tsx'
import ShoppingCartProvider from './context/cartContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster richColors position="bottom-right" />
    <BrowserRouter>
      <ReactQueryProvider>
        <AuthProvider>
          <ShoppingCartProvider>
            <App />
          </ShoppingCartProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
