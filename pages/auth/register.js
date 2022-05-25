// React
import { Component, createRef, Fragment } from "react";

// Components
import { Form, Email, Password } from "@common";
import AuthContainer, { Submit } from "@layouts/auth/Auth.Container";

// Librarys
import Link from "next/link";
import { withRouter } from 'next/router'
import { connect } from "react-redux";
import { Input } from "antd";

// Headers
import { RegisterHeader } from '@headers'

// API
import { createAccount } from "@api/auth";
import { APP_NAME } from '@api/credentials'

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// Redirects
import { getServerSideProps } from '@redirects/auth'

class Register extends Component {
  constructor(props) {
    super(props);
    this.submit = createRef();
    this.onCreateAccount = this.onCreateAccount.bind(this);
    this.runMatchPasswords = this.runMatchPasswords.bind(this)
    this.title = `Regístrate en ${APP_NAME}`

    this.styles = {
      wrapper: {
        padding: "2em 1.5em 0px",
      },
      goToLogin: {
        text: {
          padding: "15px 0 25px",
        },
        link: {
          color: "var(--bg-darkrose)",
        },
      },
    };

    this.defaultLoginValues = {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    };

    this.registerSchema = {
      fullname: {
        min: 2,
        max: 48,
        required: "Por favor ingresa tu nombre y apellidos",
      },
      email: {
        isEmail: true,
        min: 6,
        max: 36,
      },
      password: {
        min: 8,
        max: 20,
        required: "Por favor ingresa tu contraseña",
      },
      confirmPassword: {
        isMatchPassword: true,
        relateWithField: "password",
      },
    };

    this.authSettings = {
      help: {
        placement: "left",
        title: `Registrate en ${APP_NAME}, rellena los campos que se muestran en la parte inferior.`,
      },
      arrow: {
        title: "Ir a Inicio de sesión",
        link: "/auth/login",
        placement: "right",
      },
    }
  }

  shouldComponentUpdate() {
    return false
  }

  // Comprobar si las contraseñas son iguales
  runMatchPasswords({ callback, password, matchPassword }) {
    return callback({
      password: {
        value: password.value,
        field: password.field,
      },
      matchPassword: {
        value: matchPassword.value,
        field: matchPassword.field,
      },
    });
  }

  // Ir a la sección de verificación de correo electrónico
  goToEmailConfirmation({ query }) {
    this.props.router.push({
      query: query,
      pathname: '/auth/email/confirmation',
    })
  }

  // Crear nueva cuenta
  onCreateAccount({ values, extraData, resetForm }) {
    const accountType = !this.props.existUserAdmin ? 'admin' : 'user'

    // Setear datos a 'extraData'
    Object.assign(extraData, {
      resetForm: resetForm,
      accountType: accountType,
      showLoading: this.submit.current?.showLoading,
      hideLoading: this.submit.current?.hideLoading,
      goToEmailConfirmation: this.goToEmailConfirmation.bind(this),
    })

    // Crear usuario administrador
    createAccount(values, extraData);
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <RegisterHeader />

        <AuthContainer
          title={this.title}
          titleClasses="pt-2 mb-3 text-muted"
          settings={this.authSettings}
          wrapperStyle={this.styles.wrapper}
        >
          <Form
            onSubmit={this.onCreateAccount}
            initialValues={this.defaultLoginValues}
            validationSchema={this.registerSchema}
          >
            {({ values, setFieldValue, errors, runMatchPasswords }) => {
              return (
                <Fragment>
                  {/* Nombre de usuario */}
                  <Form.Title iconName="user-alt">Nombre y apellidos</Form.Title>
                  <Input
                    value={values.fullname}
                    className="form-control noto-sans"
                    placeholder="Ingresa tu nombre y apellidos"
                    onChange={(e) => setFieldValue("fullname", e.target.value)}
                  />

                  {/* Error en campo 'fullname' del formulario */}
                  {Form.renderError(errors.fullname)}

                  {/* Email */}
                  <div className="mt-3">
                    <Form.Title iconName="envelope">Correo electrónico</Form.Title>
                    <Email
                      value={values.email}
                      className="form-control noto-sans"
                      onChange={(e) => setFieldValue("email", e.target.value)}
                    />
                  </div>

                  {/* Error en campo 'email' del formulario */}
                  {Form.renderError(errors.email)}

                  {/* Contraseña */}
                  <div className="mt-3">
                    <Form.Title iconName="unlock-alt">Contraseña</Form.Title>
                    <Password
                      value={values.password}
                      matchPassword={values.confirmPassword}
                      className="form-control noto-sans"
                      onChange={(e) => {
                        this.runMatchPasswords({
                          callback: runMatchPasswords,
                          password: {
                            value: e.target.value,
                            field: "password"
                          },
                          matchPassword: {
                            value: values.confirmPassword,
                            field: "confirmPassword"
                          },
                        });
                      }}
                    />
                  </div>

                  {/* Error en campo 'password' del formulario */}
                  {Form.renderError(errors.password)}

                  {/* Confirmar contraseña */}
                  <div className="mt-3">
                    <Form.Title iconName="user-lock">Confirmar contraseña</Form.Title>
                    <Password
                      value={values.confirmPassword}
                      matchPassword={values.password}
                      className="form-control noto-sans "
                      onChange={(e) => {
                        this.runMatchPasswords({
                          callback: runMatchPasswords,
                          password: {
                            value: e.target.value,
                            field: "confirmPassword"
                          },
                          matchPassword: {
                            value: values.password,
                            field: "password"
                          },
                        });
                      }}
                    />
                  </div>

                  {/* Error en campo 'confirmPassword' del formulario */}
                  {Form.renderError(errors.confirmPassword)}

                  {/* Botón de entrega */}
                  <Submit
                    ref={this.submit}
                    title="Crear cuenta"
                    style={this.styles.submit}
                  />

                  {/* Enlace para iniciar sesión */}
                  <div className="pb-4 text-center" style={{ paddingTop: "1.25em" }}>
                    <span style={this.styles.goToLogin.text} className="text-center text-muted">¿Ya tienes una cuenta?,</span>
                    <Link href="/auth/login" style={this.styles.goToLogin.link}>
                      <a className="ms-1 opacity">Inicia sesión</a>
                    </Link>
                  </div>
                </Fragment>
              );
            }}
          </Form>
        </AuthContainer>
      </Fragment>
    );
  }
}

const RegisterWithRouter = withRouter(Register)

export { getServerSideProps }
export default RegisterWithRouter;
