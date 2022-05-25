// React
import { Component, Fragment } from "react";

// Librarys
import Image from 'next/image'
import { withRouter } from 'next/router'
import { Result, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Headers
import { SuccessEmailConfirmationHeader } from '@headers'

// API
import { verifyConfirmationCode } from '@api/auth'

// Redirects
import { getServerSideProps } from '@redirects/auth/email/success'

const thumbnail02 = require('@assets/img/email-confirmation/thumbnail-02.webp').default.src

class SuccessEmailConfirmation extends Component {
  constructor(props) {
    super(props)
    this.goToLogin = this.goToLogin.bind(this)

    this.buttons = [
      <Button type="primary" key="login" className="scale" onClick={this.goToLogin}>Volver al inicio de sesión</Button>,
    ]
  }

  componentDidMount() {
    verifyConfirmationCode({
      redirectToLogin: this.goToLogin,
      token: this.props.router.query.confirmationCode,
    })
  }

  // Ir al inicio de sesión
  goToLogin() {
    this.props.router.replace('/auth/login')
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <SuccessEmailConfirmationHeader />

        <div id="email-confirmation">
          <div className="wrapper mx-auto">
            <Result
              extra={this.buttons}
              icon={<CustomImage />}
              title={<Title email={this.props.userEmail} />}
              subTitle='¡Genial!, has verificado exitosamente tu cuenta, ahora podrás iniciar sesión sin problemas, además que tu cuenta se encuentra más protegida. A continuación debes dar click en el botón de la parte inferior que te redireccionará a la pantalla de inicio de sesión.'
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export { getServerSideProps }
export default withRouter(SuccessEmailConfirmation)

// <------------------------ Extra Components ------------------------>
class CustomImage extends Component {
  render() {
    return (
      <figure className="mb-0">
        <Image src={thumbnail02} objectFit='cover' width={680} height={367} />
      </figure>
    );
  }
}

class Title extends Component {
  constructor(props) {
    super(props)
    this.titleStyle = {
      marginBottom: 15,
      lineHeight: 1.25,
    }
  }

  render() {
    return (
      <div className="d-flex align-items-center justify-content-center mb-2">
        <FontAwesomeIcon size="lg" icon="check-circle" color="var(--bg-green-100)" />
        <h4 style={this.titleStyle} className="fw-bold ms-2 mb-0">
          ¡Felicidades, tu cuenta ha sido verificada!
        </h4>
      </div>
    );
  }
}
