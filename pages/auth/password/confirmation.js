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
import { sendPasswordConfirmation } from '@api/auth'

const thumbnail01 = require('@assets/img/password-confirmation/thumbnail-01.webp').default.src

class PasswordConfirmation extends Component {
  constructor(props) {
    super(props)
    this.buttons = [
      <Button type="primary" key="login" className="scale" onClick={this.goToLogin.bind(this)}>Volver al inicio de sesión</Button>,
      <Button key="buy" className="scale" onClick={this.sendEmailVerification.bind(this)}>Enviar de nuevo la verificación</Button>,
    ]
  }

  // Ir al inicio de sesión
  goToLogin() {
    this.props.router.replace('/auth/login')
  }

  // Enviar verificación a correo electrónico
  sendEmailVerification(){
    sendPasswordConfirmation(this.props.email)
  }

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
              subTitle="¿Has olvidado tu contraseña? No te preocupes, esto se resuelve facilmente. A continuación, debes ingresar a la bandeja de tu correo e ingresar al enlace que te permitirá actualizar tu contraseña. En caso no se haya enviado la verificación, hacer click en el segundo botón. Te recomendamos que uses servicios como Keeper o LastPass para generar contraseñas seguras, no olvides guardar tu contraseña en un lugar seguro."
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export { getServerSideProps }
export default withRouter(PasswordConfirmation)

// <------------------------ Extra Components ------------------------>
class CustomImage extends Component {
  render() {
    return (
      <figure>
        <Image src={thumbnail01} objectFit='cover' width={507} height={342} />
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
      <Fragment>
        <FontAwesomeIcon size="2x" icon="check-circle" color="var(--bg-green-100)" />
        <h4 style={this.titleStyle} className="fw-bold w-100">
          Se envió un correo de confirmación a "{this.props.email}".
        </h4>
      </Fragment>
    );
  }
}
