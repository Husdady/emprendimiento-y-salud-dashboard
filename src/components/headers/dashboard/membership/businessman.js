// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class BusinessmanMembershipHeader extends Component {
	shouldComponenteUpdate() {
		return false
	}
	
  render() {
    return (
      <Head>
        <title>Afiliación de empresarios | {APP_NAME}</title>
      </Head>
    )
  }
}
