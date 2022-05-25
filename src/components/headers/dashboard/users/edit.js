// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class EditUserHeader extends Component {
  render() {
    return (
      <Head>
        <title>Editar usuario | {APP_NAME}</title>
      </Head>
    )
  }
}
