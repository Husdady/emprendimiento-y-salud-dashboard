// React
import { Fragment, useEffect, useState, useCallback, useMemo } from 'react'

// Components
import Loading from '@root/src/components/layouts/loaders/Loading.Preload'

// Librarys
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { useStore, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

// Store
import { wrapper } from '@redux/store'

// Themes
import darkTheme from '@themes/dark-theme'
import lightTheme from '@themes/light-theme'

// Utils
import { isObject, isWindowAvailable } from '@utils/Validations'

// Library Styles
import 'antd/dist/antd.css'
import 'nprogress/nprogress.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Main styles
import '@assets/styles/fonts.css'
import '@assets/styles/global.css'
import '@assets/styles/custom-antd-styles.css'

// Loaders
import '@styles/loaders/loading.preload.css'

// Auth Styles
import "@styles/auth/auth.global.css";
import "@styles/auth/auth.emailConfirmation.css";

// Dashboard Account Styles
import "@styles/dashboard/account/index.css";

// Dashboard Contact Styles
import "@styles/dashboard/contact/index.css";

// Dashboard Styles
import "@styles/dashboard/dashboard.form.css";
import "@styles/dashboard/dashboard.modal.css";
import "@styles/dashboard/dashboard.items.css";
import "@styles/dashboard/dashboard.table.css";
import "@styles/dashboard/dashboard.global.css";
import "@styles/dashboard/dashboard.global.responsive.css";

// Dashboard Products Styles
import "@styles/dashboard/products/products.form.css";
import "@styles/dashboard/products/products.table.css";

library.add(far, fas, fab)

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp = ({ Component, pageProps }) => {
  const [isLoading, setLoading] = useState(true)
  const store = useStore((state) => state)
  const persitor = isWindowAvailable() ? store.__persistor : store

  useEffect(() => {
    let timeout = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(timeout)
  }, [])

  // Renderizar app
  const renderContent = useCallback(() => {
    if (isLoading) {
      return <Loading className="w-100 h-100vh" />
    }
    
    return (
      <Fragment>
        <UpdateTheme />
        <Component {...pageProps} />
      </Fragment>
    )
  }, [isLoading, pageProps])

  return (
    <PersistGate loading={null} persistor={persitor}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      {renderContent()}
    </PersistGate>
  )
}

export default wrapper.withRedux(MyApp)

// <------------------------ Extra Components ------------------------>
const UpdateTheme = () => {
  const theme = useSelector((state) => state.theme)
  const isDarkTheme = useMemo(() => theme === 'dark', [theme])

  useEffect(() => {
    const activeTheme = isDarkTheme ? 'dark-mode' : 'light-mode'
    document.body.className = activeTheme

    updateCssProperties(theme)
  }, [theme])

  const updateCssProperties = useCallback((activeTheme) => {
    const themes = {
      dark: darkTheme,
      light: lightTheme,
    }

    const currentTheme = themes[activeTheme]
    const currentThemeKeys = Object.keys(currentTheme)

    for (let key of currentThemeKeys) {
      if (key === 'name') continue;

      const prop = currentTheme[key]

      if (!isObject(prop)) {
        document.documentElement.style.setProperty(`--theme-${key}`, prop)
        continue;
      }

      const props = Object.keys(prop)

      for (let k of props) {
        document.documentElement.style.setProperty(`--theme-${key}-${k}`, prop[k])
      }
    }
  }, [])

  return <Fragment></Fragment>
}
