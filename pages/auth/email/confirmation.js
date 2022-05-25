// React
import { Component, Fragment } from "react";

// Librarys
import Image from 'next/image'
import { withRouter } from 'next/router'
import { Result, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Headers
import { EmailConfirmationHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/auth/email/confirmation'

// API
import { sendEmailConfirmation } from '@api/auth'

const thumbnail01 = require('@assets/img/email-confirmation/thumbnail-01.webp').default.src

class EmailConfirmation extends Component {
  constructor(props) {
    super(props)
    this.buttons = [
      <Button type="primary" key="login" className="scale" onClick={this.goToLogin}>Volver al inicio de sesión</Button>,
      <Button key="buy" className="scale" onClick={this.onSendAgainEmailVerification}>Enviar de nuevo la verificación</Button>,
    ]
  }

  // Ir al inicio de sesión
  goToLogin = () => this.props.router.replace('/auth/login')

  // Enviar verificación a correo electrónico
  onSendAgainEmailVerification = () => sendEmailConfirmation(this.props.email)

  render() {
    return (
      <Fragment>
        {/* Head */}
        <EmailConfirmationHeader />

        <div id="email-confirmation">
          <div className="wrapper mx-auto">
            <Result
              extra={this.buttons}
              icon={<CustomImage />}
              title={<Title email={this.props.email} />}
              subTitle="La confirmación de un correo electrónico es importante para la validez de un usuario. Validar tu correo hace a tu cuenta más segura y permite que puedas recuperarla en caso de que pierdas tu teléfono o cambies de número. A continuación, debes ingresar a la bandeja de tu correo y verificar la validación. En caso no se haya enviado la verificación, hacer click en el segundo botón."
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export { getServerSideProps }
export default withRouter(EmailConfirmation)

// <------------------------ Extra Components ------------------------>
export class CustomImage extends Component {
  render() {
    return (
      <figure className="mb-0">
        <Image src={thumbnail01} objectFit='cover' width={507} height={342} />
      </figure>
    );
  }
}

export class Title extends Component {
  constructor(props) {
    super(props)
    this.titleStyle = {
      marginBottom: 15,
      lineHeight: 1.25,
    }
  }

  render() {
    return (
      <Fragment>
        <FontAwesomeIcon size="2x" icon="check-circle" color="var(--bg-green-100)" />
        <h4 style={this.titleStyle} className="fw-bold w-100">
          Se envió un correo de confirmación a "{this.props.email}".
        </h4>
      </Fragment>
    );
  }
}
