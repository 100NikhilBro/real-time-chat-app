import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './context/socketContext'; // ✅ import this

const myclient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={myclient}>
      <BrowserRouter>
        <SocketProvider>
          <App />
          <Toaster richColors position="top-right" />
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
);
