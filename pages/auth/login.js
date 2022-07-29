// React
import { Component, Fragment, createRef } from 'react'

// Components
import { Form, Email, Password, Checkbox } from '@common'
import AuthContainer, { Submit } from "@containers/AuthContainer";

// Librarys
import Link from 'next/link'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

// Headers
import { LoginHeader } from '@headers'

// Actions
import setAuthentication from '@redux/actions/auth'

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// API
import { APP_NAME } from '@api/credentials'

// Redirects
import { getServerSideProps } from '@redirects/auth'

class Login extends Component {
  constructor(props) {
    super(props)
    this.submit = createRef()
    this.goToDashboard = this.goToDashboard.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.rememberUser = this.rememberUser.bind(this)
    this.renderCheckbox = this.renderCheckbox.bind(this)
    this.renderAuthLinks = this.renderAuthLinks.bind(this)

    this.loginSchema = {
      email: {
        required: 'Por favor ingresa tu correo electrónico',
        min: 6,
        max: 36,
        isEmail: true,
      },
      password: {
        required: 'Por favor ingresa tu contraseña',
      },
    }

    this.defaultLoginValues = {
      email: '',
      password: '',
      rememberUser: false,
    }

    this.authLinks = [
        {
          id: 'k129ua',
          path: '/auth/forgot-password',
          title: '¿Olvidaste tu contraseña?',
        },
        {
          id: 'xgj0pe',
          path: '/auth/forgot-email',
          title: '¿Olvidaste tu correo electrónico?',
        },
        {
          id: 'd3gfh2',
          path: '/auth/register',
          title: '¿Aún no tienes una cuenta?',
        },
      ]

    this.authSettings = {
      help: {
        title: `Inicia sesión en ${APP_NAME}, cuando logres iniciar sesión, serás redireccionado al Dashboard, dónde podrás administrar la información de la página.`,
        placement: 'right',
      },
      arrow: {
        title: 'Ir al registro de cuenta',
        link: '/auth/register',
        placement: 'left',
      },
    }
  }

  shouldComponentUpdate() {
    return false
  }

  // Ir al Dashboard cuando se inicia sesión
  goToDashboard() {
    this.props.router.replace('/dashboard')
  }

  // Recordar datos del usuario
  rememberUser({ status, email, password }) {
    const statusType = {
      unchecked: this.props.forgetUser,
      checked: () => {
        this.props.rememberUser({
          userEmail: email,
          userPassword: password,
        })
      },
    }

    const callback = statusType[status]
    return callback()
  }

  // Evento 'submit' de formulario
  handleSubmit({ values }) {
    this.props.signIn(values, {
      goToDashboard: this.goToDashboard,
      showLoading: this.submit.current?.showLoading,
      hideLoading: this.submit.current?.hideLoading,
    })
  }

  // Renderizar casilla de verificación
  renderCheckbox({ values, setFieldValue, isValidForm }) {
    return (
      <Checkbox
        checked={values.rememberUser}
        needRenderAgain={isValidForm}
        title="Recordar datos de inicio de sesión"
        onCheck={() => {
          if (isValidForm) {
            this.rememberUser({
              email: values.email,
              password: values.password,
              status: !values.rememberUser ? 'checked' : 'unchecked',
            })
          }

          // Setear campo
          setFieldValue('rememberUser', !values.rememberUser)
        }}
      />
    )
  }

  // Renderizar enlaces de autenticación
  renderAuthLinks() {
    return this.authLinks.map((link) => (
      <Link key={link.id} href={link.path}>
        <a className="link p-0 opacity d-block">
          <u>{link.title}</u>
        </a>
      </Link>
    ))
  }

  render() {
    const { userSavedInLogin, isUserRememberedAtLogin } = this.props

    // Si se recuerdan los datos del usuario en el inicio de sesión
    if (isUserRememberedAtLogin) {
      this.defaultLoginValues = {
        email: userSavedInLogin.email,
        password: userSavedInLogin.password,
        rememberUser: true,
      }
    }

    return (
      <Fragment>
        {/* Head */}
        <LoginHeader />

        {/* Formulario para iniciar sesión */}
        <AuthContainer settings={this.authSettings} className="d-flex j-center align-items-center" title={`Inicia de sesión en ${APP_NAME}`}>
          <Form className="mt-3 mb-2" validateOnChange={false} onSubmit={this.handleSubmit} validationSchema={this.loginSchema} initialValues={this.defaultLoginValues}>
            {({ values, setFieldValue, errors, isValidForm }) => {
              return (
                <Fragment>
                  {/* Correo electrónico del usuario */}
                  <Form.Title iconName="envelope">Correo electrónico</Form.Title>
                  <Email value={values.email} className="form-control noto-sans" onChange={(e) => setFieldValue('email', e.target.value)} />

                  {/* Error en campo 'email' del formulario */}
                  {Form.renderError(errors.email)}

                  {/* Contraseña del usuario */}
                  <Form.Title iconName="unlock-alt" className="mt-3">
                    Contraseña
                  </Form.Title>
                  <Password value={values.password} className="form-control noto-sans" onChange={(e) => setFieldValue('password', e.target.value)} />

                  {/* Error en campo 'password' del formulario */}
                  {Form.renderError(errors.password)}

                  {/* Botón 'submit' */}
                  <Submit ref={this.submit} title="Entrar" className="mt-4 mb-3" />

                  {/* Casilla de verificación */}
                  {this.renderCheckbox({ values, setFieldValue, isValidForm })}
                </Fragment>
              )
            }}
          </Form>

          {/* Enlaces */}
          <div className='links text-center'>
            {this.renderAuthLinks()}
          </div>
        </AuthContainer>
      </Fragment>
    )
  }
}

// Definir que states se van a usar
const mapStateToProps = ({ authentication }) => {
  const {
    userSavedInLogin,
    isUserRememberedAtLogin
  } = getAuthenticationState({ authentication })
  
  return {
    userSavedInLogin: userSavedInLogin,
    isUserRememberedAtLogin: isUserRememberedAtLogin
  }
}

// Definir que actions se van a usar
const mapDispatchToProps = (dispatch) => {
  const { rememberUser, forgetUser, signIn } = dispatch(setAuthentication)
  return { rememberUser, forgetUser, signIn }
}

export { getServerSideProps }
const LoginWithRouter = withRouter(Login)
export default connect(mapStateToProps, mapDispatchToProps)(LoginWithRouter)
