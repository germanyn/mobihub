import * as React from 'react';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createAppTheme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import mediaQuery from 'css-mediaquery';
import AppQueryProvider from '../components/AppQueryProvider';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  deviceType?: 'mobile' | 'desktop' | string
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const ssrMatchMedia = (query: string) => ({
    matches: mediaQuery.match(query, {
      width: (!pageProps.deviceType || pageProps.deviceType === 'mobile') ? '0px' : '1024px',
    }),
  });
  const theme = createAppTheme({
    components: {
      // Modifica as opções padrão de useMediaQuery
      MuiUseMediaQuery: {
        defaultProps: {
          ssrMatchMedia,
        },
      },
    },
  });
  return (
    <CacheProvider value={emotionCache}>
      <AppQueryProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </AppQueryProvider>
    </CacheProvider>
  );
}
