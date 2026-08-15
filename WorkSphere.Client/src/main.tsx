import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap global styles
import 'bootstrap/dist/css/bootstrap.min.css'
// Global app styles (overrides + utilities)
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store'

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
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
