import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router';
import { AuthProvider } from '@providers/AuthProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@providers/ThemeProvider';
import { NotifProvider } from '@providers/NotifProvider';
import { LoadingProvider } from '@providers/LoadingProvider';
import { LoadingOverlay } from '@components/LoadingOverlay';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <NotifProvider>
          <LoadingProvider>
            <RouterProvider router={router} />
            <LoadingOverlay />
            <Toaster richColors position='top-center' />
          </LoadingProvider>
        </NotifProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)