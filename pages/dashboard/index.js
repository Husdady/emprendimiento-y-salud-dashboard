// React
import { Component } from 'react'

// Components
import { Button, Developing } from '@common'
import Wrapper from '@layouts/dashboard/common/Dashboard.Wrapper'
import WrapTitle from '@layouts/dashboard/common/Dashboard.WrapTitle'
import Container from '@layouts/dashboard/common/Dashboard.Container'

// Librarys
import { connect } from 'react-redux'

// API
import { PRODUCTION_URL } from '@api/credentials'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

// Headers
import { DashboardHeader } from '@headers'

// Utils
import { APP_NAME } from "@api/credentials"

const developing = require('@assets/img/developing/developing-03.webp').default.src
const developingStyle = { marginTop: '4em' , marginBottom: '4em' }

export { getServerSideProps }
export default class Dashboard extends Component {
  // Ir a la página principal
  redirecToMainPage() {
    window.open(PRODUCTION_URL, '_blank')
  }

  render() {
    return (
      <Container breadcrumbItems={this.breadcrumbItems} boxWithPaddingY={false}>
        <DashboardHeader />

        <WrapTitle icon="columns" title="Dashboard" className="py-2">
          <Button
            icon="external-link-alt"
            textColor="var(--bg-yellow)"
            backgroundColor="var(--bg-darkrose)"
            titleClasses="ms-2"
            title={`Ir a ${APP_NAME}`}
            onClick={this.redirecToMainPage.bind(this)}
            className="rounded py-1 px-4"
          />
        </WrapTitle>

        {/* Estadísticas de la página */}
        <WrapTitle
          icon="chart-bar"
          title={`Estadísticas de ${APP_NAME}`}
          helpTitle={`En esta sección podrás visualizar las estadísticas de ${APP_NAME}, como el total de visitas, el total de productos, los productos más visitados, etc.`}
        />

        <Wrapper>
          <Developing
            width={350}
            height={250}
            image={developing}
            style={developingStyle}
          />
        </Wrapper>
      </Container>
    )
  }
}
