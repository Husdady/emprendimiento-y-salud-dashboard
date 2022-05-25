// React
import { Component } from 'react'

// Librarys
import Head from 'next/head'

// API
import { APP_NAME } from '@api/credentials'

export default class TestimonialsHeader extends Component {
	shouldComponenteUpdate() {
		return false
	}

  render() {
    return (
      <Head>
        <title>Testimonios Omnilife | {APP_NAME}</title>
      </Head>
    )
  }
}
