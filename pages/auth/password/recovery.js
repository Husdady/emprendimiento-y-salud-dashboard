// React
import { Component, Fragment, createRef } from 'react'

// Components
import { Form, Password } from '@common'
import AuthContainer, { Submit } from '@layouts/auth/Auth.Container'

// Librarys
import { withRouter } from 'next/router'

// Headers
import { UpdateUserPasswordHeader } from '@headers'

// API
import { updateForgotPassword } from '@api/auth'

// Redirects
import { getServerSideProps } from '@redirects/auth/password/recovery'

class UpdateUserPassword extends Component {
  constructor(props) {
    super(props)
    this.submit = createRef()
    this.goToLogin = this.goToLogin.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.validationSchema = {
      newPassword: {
        min: 8,
        max: 20,
        required: "Por favor ingresa una nueva contraseña",
      },
      confirmNewPassword: {
        isMatchPassword: true,
        relateWithField: "newPassword",
      },
    }

    this.defaultLoginValues = {
      newPassword: '',
      confirmNewPassword: '',
    }

    this.authSettings = {
      help: {
        title: `¿Haz olvidado tu contraseña? No te preocupes, rellena el formulario de abajo, crea una nueva contraseña, confírmala, y haz click en el botón 'Actualizar contraseña' para actualizar tu actual contraseña.`,
        placement: 'right',
      },
    }
  }

  shouldComponentUpdate() {
    return false
  }

  // Ir al Inicio de sesión
  goToLogin() {
    this.props.router.replace('/auth/login')
  }

  // Evento 'submit' de formulario
  handleSubmit({ values }) {
  	const { query } = this.props.router

    updateForgotPassword(values.newPassword, {
      query: query,
      goToLogin: this.goToLogin,
      showLoading: this.submit.current?.showLoading,
      hideLoading: this.submit.current?.hideLoading,
    })
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <UpdateUserPasswordHeader />

        {/* Formulario para iniciar sesión */}
        <AuthContainer settings={this.authSettings} showArrow={false} className="d-flex j-center align-items-center" title='Actualizar contraseña olvidada' titleClasses='pt-2 fw-bold titillium-web'>
          <Form className="mt-3 mb-2" onSubmit={this.handleSubmit} validationSchema={this.validationSchema} initialValues={this.defaultLoginValues}>
            {({ values, setFieldValue, errors, isValidForm }) => {
              return (
                <Fragment>
                  {/* Correo electrónico del usuario */}
                  <Form.Title iconName="key">Nueva contraseña</Form.Title>
                  <Password value={values.newPassword} className="form-control noto-sans" onChange={(e) => setFieldValue('newPassword', e.target.value)} autocomplete='off' />

                  {/* Error en campo 'newPassword' del formulario */}
                  {Form.renderError(errors.newPassword)}

                  {/* Contraseña del usuario */}
                  <Form.Title iconName="unlock-alt" className="mt-3">
                    Confirmar nueva contraseña
                  </Form.Title>
                  <Password value={values.confirmNewPassword} className="form-control noto-sans" onChange={(e) => setFieldValue('confirmNewPassword', e.target.value)} autocomplete='off' />

                  {/* Error en campo 'confirmNewPassword' del formulario */}
                  {Form.renderError(errors.confirmNewPassword)}

                  {/* Botón 'submit' */}
                  <Submit ref={this.submit} title="Actualizar contraseña" className="mt-4 mb-0" />
                </Fragment>
              )
            }}
          </Form>
        </AuthContainer>
      </Fragment>
    )
  }
}

export { getServerSideProps }
export default withRouter(UpdateUserPassword)
