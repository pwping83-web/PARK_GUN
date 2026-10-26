import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Admin from './Admin'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {location.pathname.replace(/\/$/, '') === '/admin' ? <Admin /> : <App />}
  </React.StrictMode>,
)
