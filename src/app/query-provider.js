'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import  { Toaster } from 'react-hot-toast';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '@/utils/authConfig';
import 'react-toastify/dist/ReactToastify.css';
const msalInstance = new PublicClientApplication(msalConfig);
const QueryProvider = ({ children }) => {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <Toaster/>
      <ToastContainer/>
      {children}
    </QueryClientProvider>
    </MsalProvider>
  )
}

export default QueryProvider
