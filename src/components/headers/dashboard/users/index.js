// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class UsersHeader extends Component {
  render() {
    return (
      <Head>
        <title>Usuarios | {APP_NAME}</title>
      </Head>
    )
  }
}
