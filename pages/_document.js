// Librarys
import { Html, Head, Main, NextScript } from 'next/document';

// Headers
import { FaviconHeader } from "@headers";

// Package
const pk = require("@root/package.json");

const fontawesome = "https://pro.fontawesome.com/releases/v5.10.0/css/all.css";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta name="author" content={pk.author} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/img/multiservicios-espay.webp" />
        <link rel="stylesheet preload" as="style" href={fontawesome} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans&family=Archivo+Narrow&family=Dosis&family=Lato&family=Maven+Pro:wght@900&family=Fjalla+One&family=Open+Sans&family=Ubuntu&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&amp;display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <FaviconHeader />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}