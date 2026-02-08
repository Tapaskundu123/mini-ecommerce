'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import './globals.css';
import { useEffect } from 'react';
import { initializeSession } from '@/store/slices/cartSlice';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Provider store={store}>
                    <SessionInitializer />
                    {children}
                </Provider>
            </body>
        </html>
    );
}

function SessionInitializer() {
    useEffect(() => {
        store.dispatch(initializeSession());
    }, []);

    return null;
}
