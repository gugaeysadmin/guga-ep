'use client'
import React , { Suspense } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import {QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import LoadingPage from './loading';
import store from './reducer/store';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const queryClient = new QueryClient()
  return (
    <html lang="es" style={{
      //backgroundColor: "#F1F3F9",
     // margin: 0,
     // height: "100%"
    }}>
      <body 
        suppressHydrationWarning={true} 
        style={{
        //  margin: 0,
        //  height: "100%"
        }}
      >
        <Suspense fallback={<LoadingPage/>}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>  
              <Provider store={store}>
                {children}
              </Provider>  
            </QueryClientProvider>
          </Provider>
        </Suspense>
          
      </body>
    </html>
  )
}
