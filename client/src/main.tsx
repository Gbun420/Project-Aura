import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { AuraErrorBoundary } from './components/AuraErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuraErrorBoundary>
        <App />
      </AuraErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
