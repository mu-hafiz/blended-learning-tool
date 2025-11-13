import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router';
import { AuthProvider } from '@providers/AuthProvider';
import { ThemeProvider } from '@providers/ThemeProvider';
import { LoadingProvider } from '@providers/LoadingProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LoadingProvider>
          <RouterProvider router={router} />
        </LoadingProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)