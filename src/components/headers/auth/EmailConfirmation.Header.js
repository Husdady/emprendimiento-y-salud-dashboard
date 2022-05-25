// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class EmailConfirmationHeader extends Component {
	shouldComponenteUpdate() {
		return false
	}
	
  render() {
    return (
      <Head>
        <title>Confirmación de correo electrónico | {APP_NAME}</title>
      </Head>
    )
  }
}
