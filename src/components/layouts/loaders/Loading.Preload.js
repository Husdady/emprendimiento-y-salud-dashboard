// React
import { Component } from 'react'

// Components
import Wrapper from '@layouts/dashboard/common/Dashboard.Wrapper'

// Librarys
import Head from 'next/head'

// Utils
import { classnames } from '@utils/Helper'

export default class Loading extends Component {
  static defaultProps = {
    containerStyle: { height: 500 },
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const loadingClasses = classnames([
      'd-flex align-items-center justify-content-center',
      this.props.className,
    ])

    return (
      <div className={loadingClasses} style={this.props.containerStyle}>
        <Head>
          <title>Cargando...</title>
        </Head>
        <div className="container-cubes mx-auto position-relative">
          <div className="cube1 position-absolute top-0 start-0"></div>
          <div className="cube2 position-absolute top-0 start-0"></div>
        </div>
      </div>
    )
  }
}
