import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router';
import { AuthProvider } from '@providers/AuthProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@providers/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)