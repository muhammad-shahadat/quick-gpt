import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/ContextProvider.jsx'




const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // retry one time when error
            refetchOnWindowFocus: false, // would not refetch data or api  when user back previous tab from another tab
        },
    },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </BrowserRouter>
        {import.meta.env.MODE === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  </StrictMode>,
)
