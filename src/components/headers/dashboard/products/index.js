// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class ProductsHeader extends Component {
	shouldComponenteUpdate() {
		return false
	}
	
  render() {
    return (
      <Head>
        <title>Mis productos | {APP_NAME}</title>
      </Head>
    )
  }
}
