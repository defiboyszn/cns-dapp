import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="PNS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PNS" />
        <meta
          name="description"
          content="Unlock the power of Web3 with your mobile phone"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FF1F6E" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FF1F6E" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {/* eslint-disable-next-line @next/next/no-title-in-document-head*/}
        <title>Card Name Service</title>
        <link rel="manifest" href="/manifest/manifest.json" />
        <link rel="apple-touch-icon" href="/manifest/icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
