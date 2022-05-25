// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class UpdateUserPasswordHeader extends Component {
	shouldComponenteUpdate() {
		return false
	}
	
  render() {
    return (
      <Head>
        <title>Actualizar contraseña olvidada | {APP_NAME}</title>
      </Head>
    )
  }
}
