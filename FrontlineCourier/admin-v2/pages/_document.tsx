import Document, { Html, Head, Main, NextScript } from 'next/document'

class AppDocument extends Document {

  render() {
    return (
      <Html data-theme="fantasy">
        <Head>
          <title>Frontline - Admin</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument