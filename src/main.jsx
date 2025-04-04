import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalState from './index.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_CLIENT_ID;  

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
  <StrictMode>
    <GlobalState>
    <App />
    </GlobalState>

  </StrictMode>
  </GoogleOAuthProvider>
  ,
)
