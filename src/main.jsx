import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function init() {
  console.log('[GHAYM] Initializing Ghaym Space React App...');
  const rootElement = document.getElementById('root')
  console.log('[GHAYM] rootElement found:', !!rootElement);
  
  if (rootElement) {
    try {
      const root = createRoot(rootElement)
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      )
      console.log('[GHAYM] React render() dispatched successfully!');
    } catch (err) {
      console.error('[GHAYM FATAL RENDER ERROR]:', err);
    }
    return
  }

  // Fallback if not yet in DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    setTimeout(init, 50)
  }
}

// Execute immediately!
init()
