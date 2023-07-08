import React from 'react';
import './index.css';
import App from './App';
import { server } from '_tosslib/server/browser';
import { createRoot } from 'react-dom/client';

server.start({ onUnhandledRequest: 'bypass' });

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
