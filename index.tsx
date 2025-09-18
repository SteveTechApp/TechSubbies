import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './context/AppProviders';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element to mount the application.');
}
