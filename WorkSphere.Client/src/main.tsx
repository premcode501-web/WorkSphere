import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Development-only: dynamically import the employee service dev test so it
// runs only in dev and is not included in production builds. Remove the
// test file after verification.
if (import.meta.env.DEV) {
  import('./services/employeeService.devtest')
    .then(() => console.log('[DEV TEST] employeeService devtest loaded'))
    .catch((err) => console.error('[DEV TEST] failed to load devtest', err));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
