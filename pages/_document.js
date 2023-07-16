import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import { Meta } from '../components';

class Page extends Document {
  render() {
    return (
      <html lang="id">
        <title>PHE UI</title>
        <Meta/>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default Page;
