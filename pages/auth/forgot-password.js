// React
import { Component, Fragment, createRef } from 'react'

// Components
import { Form, Email } from '@common'
import AuthContainer, { Submit } from "@containers/AuthContainer";

// Librarys
import { withRouter } from 'next/router'

// Headers
import { ForgotPasswordHeader } from '@headers'

// API
import { APP_NAME } from '@api/credentials'
import { recoverUserPassword } from '@api/auth'

class ForgottenPassword extends Component {
  constructor(props) {
    super(props)
    this.submit = createRef()
    this.defaultValues = {
      email: '',
    }

    this.validationSchema = {
      email: {
        required: 'Por favor ingresa tu correo electrónico',
        min: 6,
        max: 36,
        isEmail: true,
      },
    }

    this.authSettings = {
      help: {
        title: `Actualiza tu contraseña si la has olvidado, debes ingresar tu correo electrónico en la parte inferior. Luego recibirás un mensaje en tu correo personal en el cuál podrás actualizar tu actual contraseña`,
        placement: 'right',
      },
      arrow: {
        title: 'Ir al inicio de sesión',
        link: '/auth/login',
        placement: 'left',
      },
    }
  }

  // Redireccionar
  goToPasswordConfirmation(query) {
    this.props.router.replace({
      query: query,
      pathname: '/auth/password/confirmation',
    })
  }

  handleSubmit({ values, resetForm }) {
    recoverUserPassword(values.email, {
      resetForm: resetForm,
      showLoading: this.submit.current?.showLoading,
      hideLoading: this.submit.current?.hideLoading,
      goToPasswordConfirmation: this.goToPasswordConfirmation.bind(this),
    })
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <ForgotPasswordHeader />

        {/* Formulario para recuperar contraseña */}
        <AuthContainer settings={this.authSettings} className="d-flex j-center align-items-center" title={`Recuperar contraseña | ${APP_NAME}`}>
          <Form onSubmit={this.handleSubmit.bind(this)} validationSchema={this.validationSchema} initialValues={this.defaultValues}>
            {({ values, setFieldValue, errors }) => (
              <Fragment>
                {/* Correo electrónico del usuario */}
                <div className="mt-3">
                  <Form.Title iconName="envelope">Correo electrónico</Form.Title>
                  <Email value={values.email} className="form-control noto-sans" onChange={(e) => setFieldValue('email', e.target.value)} />
                </div>

                {/* Error en campo 'email' del formulario */}
                {Form.renderError(errors.email)}

                <Submit ref={this.submit} title="Recuperar mi contraseña" className="mb-0" />
              </Fragment>
            )}
          </Form>
        </AuthContainer>
      </Fragment>
    )
  }
}

export default withRouter(ForgottenPassword)
