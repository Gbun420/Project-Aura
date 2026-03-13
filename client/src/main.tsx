import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuraErrorBoundary } from './components/AuraErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuraErrorBoundary>
      <App />
    </AuraErrorBoundary>
  </StrictMode>,
)
