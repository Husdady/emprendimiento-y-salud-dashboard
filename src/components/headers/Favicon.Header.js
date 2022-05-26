// React
import { Component, Fragment } from 'react'

// API
import { APP_NAME } from '@api/credentials'

// Favicons
const faviconAndroid192x192 = require('@public/android-chrome-192x192.png').default.src
const faviconAndroid512x512 = require('@public/android-chrome-512x512.png').default.src
const faviconAppleTouch = require('@public/apple-touch-icon.png').default.src
const favicon16x16 = require('@public/favicon-16x16.png').default.src
const favicon32x32 = require('@public/favicon-32x32.png').default.src
const faviconIco = require('@public/favicon.ico').default.src

export default class FaviconHeader extends Component {
  render() {
    return (
      <Fragment>
        <link rel="android-chrome" sizes="192x192" href={faviconAndroid192x192} />
        <link rel="android-chrome" sizes="512x512" href={faviconAndroid512x512} />
        <link rel="apple-touch-icon" sizes="180x180" href={faviconAppleTouch} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16x16} />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32x32} />
        <link rel="shortcut icon" href={faviconIco} />
        <title>{APP_NAME}</title>
      </Fragment>
    )
  }
}
