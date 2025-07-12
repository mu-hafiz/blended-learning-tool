import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router';
import { AuthProvider } from '@providers/AuthProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@providers/ThemeProvider';
import { NotifProvider } from '@providers/NotifProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <NotifProvider>
          <RouterProvider router={router} />
          <Toaster richColors position='top-center' />
        </NotifProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)