import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { UserProvider } from './components/context/UserContext';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <UserProvider>
        <App />
        </UserProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)
