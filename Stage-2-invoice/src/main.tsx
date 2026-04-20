import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { InvoiceProvider } from './context/InvoiceContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <InvoiceProvider>
          <App />
        </InvoiceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
