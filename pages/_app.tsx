import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Analytics} from '@vercel/analytics/react';
import { MantineProvider } from '@mantine/core';

function MyApp({Component, pageProps}: AppProps) {
  return <MantineProvider withGlobalStyles withNormalizeCSS>
    <script src="/jswasm/sqlite3-worker1-promiser.js"></script>
    <Component {...pageProps} />
    <Analytics/>
  </MantineProvider>
}

export default MyApp
