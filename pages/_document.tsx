import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href="/fonts/inter-roman.var.woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href="/fonts/inter-italic.var.woff2"
            crossOrigin="anonymous"
          />
          <link rel="mask-icon" href="/favicon.svg" color="#ff455d" />
          <link
            rel="shortcut icon"
            href="/favicon.svg"
            sizes="any"
            type="image/svg+xml"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
