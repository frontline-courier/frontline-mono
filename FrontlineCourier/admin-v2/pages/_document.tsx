import Document, { Html, Head, Main, NextScript } from 'next/document'

class AppDocument extends Document {

  render() {
    return (
      <Html data-theme="fantasy">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument