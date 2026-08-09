import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { hydrateEffectiveRoleCatalogue } from './services/effectiveRoleCatalogue';

async function bootstrap() {
  await hydrateEffectiveRoleCatalogue();

  // Load the application only after the effective role catalogue is ready.
  // Several existing role consumers derive module-level constants from the
  // canonical registry, so this guarantees they see approved published
  // taxonomy snapshots rather than stale baseline content.
  const [{ AppProviders }, { default: App }] = await Promise.all([
    import('./context/AppProviders'),
    import('./App'),
  ]);

  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AppProviders>
            <App />
          </AppProviders>
        </BrowserRouter>
      </React.StrictMode>
    );
  } else {
    console.error('Failed to find the root element to mount the application.');
  }
}

void bootstrap();
