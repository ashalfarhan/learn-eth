import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3ContextProvider } from './context';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('No element with id #root');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Web3ContextProvider>
      <App />
    </Web3ContextProvider>
  </React.StrictMode>
);
