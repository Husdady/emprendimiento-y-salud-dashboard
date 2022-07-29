// React
import { Component, Fragment, createRef } from 'react'

// Components
import { Form, Modal } from '@common'
import RecoverEmailForm from '@layouts/form/RecoverEmail.Form'
import AuthContainer, { Submit } from "@containers/AuthContainer";

// Headers
import { ForgotEmailHeader } from '@headers'

// API
import { APP_NAME } from '@api/credentials'
import { verifyUserKey, recoverUserEmail } from '@api/auth'

// Themes
import lightTheme from '@themes/light-theme'

export default class ForgottenEmail extends Component {
  constructor(props) {
    super(props)
    this.submit = createRef()
    this.refForm = createRef()
    this.refModal = createRef()
    this.refRecoveryEmailForm = createRef()
    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.cleanRecoveryProccess = this.cleanRecoveryProccess.bind(this)

    this.initialValues = {
      secretKey: ''
    }

    this.validationSchema = {
      secretKey: {
        required: 'Por favor ingresa tu clave secreta',
      },
    }

    this.authSettings = {
      help: {
        title: `Recupera tu contraseña si la has olvidado, debes ingresar tu correo electrónico en la parte inferior. Luego recibirás un mensaje en tu correo personal en el cuál podrás actualizar tu actual contraseña`,
        placement: 'right',
      },
      arrow: {
        title: 'Ir al inicio de sesión',
        link: '/auth/login',
        placement: 'left',
      },
    }

    this.modalAttributes = {
      okText: 'Enviar',
      maskStyle: { backgroundColor: 'rgba(0, 0, 0, .75)' },
      onCancel: this.cleanRecoveryProccess.bind(this),
      onOk: () => this.refRecoveryEmailForm.current?.handleSubmit(),
    }
  }

  // Mostrar modal
  showModal() {
    this.refModal.current?.show()
  }

  // Ocultar modal
  hideModal() {
    this.refModal.current?.hide()
  }

  // Evento 'click' en tecla de retroceso
  onPressBackspace({ event, value, setFieldValue }) {
    const backspace = 8;

    if (event.keyCode !== backspace) return
    
    setFieldValue("secretKey", value.slice(0, -1))
  }

  // Evento 'paste' en campo 
  onPasteSecretKey({ event, setFieldValue }) {
    const isPasted = event.nativeEvent.inputType.startsWith("insertFromPaste");

    if (isPasted) {
      setFieldValue("secretKey", event.target.value);
    }
  }

  // Limpiar proceso para recuperar el correo electrónico
  cleanRecoveryProccess() {
    // Limpiar formulario que comprueba el nombre de un usuario
    this.refRecoveryEmailForm.current?.clean()

    // Limpiar formulario que comprueba la 'secretKey' de un usuario
    this.refForm.current?.resetForm()

    // Ocultar modal
    this.hideModal()
  }

  // Evento 'submit' en formulario
  handleSubmit({ values }) {
    verifyUserKey(values.secretKey, {
      showModal: this.showModal,
      showLoading: this.submit.current?.showLoading,
      hideLoading: this.submit.current?.hideLoading,
    })
  }

  handleRecoveryEmail({ values, resetForm }) {
    const user = {
      name: values.username,
      secretKey: this.refForm.current?.state?.values.secretKey,
    }

    recoverUserEmail(user, {
      resetForm: resetForm,
      resetKey: this.refForm.current?.resetForm,
      hideModal: this.hideModal,
    })
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <ForgotEmailHeader />

        {/* Formulario para recuperar contraseña */}
        <AuthContainer settings={this.authSettings} className="d-flex j-center align-items-center" title={`Recuperar correo electrónico | ${APP_NAME}`} titleClasses="mt-3 pt-4">
          <Form ref={this.refForm} onSubmit={this.handleSubmit.bind(this)} validationSchema={this.validationSchema} initialValues={this.initialValues}>
            {({ values, setFieldValue, errors }) => (
              <Fragment>
                {/* Clave secreta del usuario */}
                <div className="mt-3">
                  <Form.Title iconName="key">Mi clave secreta</Form.Title>
                  <input
                    type="text"
                    value={values.secretKey}
                    className="form-control noto-sans"
                    placeholder="Pegar clave secreta"
                    onKeyDown={(e) => this.onPressBackspace({
                      event: e,
                      value: values.secretKey,
                      setFieldValue: setFieldValue,
                    })}
                    onChange={(e) => this.onPasteSecretKey({
                      event: e,
                      setFieldValue: setFieldValue,
                    })}
                  />
                </div>

                {/* Error en campo 'secretKey' del formulario */}
                {Form.renderError(errors.secretKey)}

                <Submit ref={this.submit} title="Recuperar mi correo electrónico" className="mb-0" />
              </Fragment>
            )}
          </Form>
        </AuthContainer>

        <Modal ref={this.refModal} isDashboardModal={false} attributes={this.modalAttributes} cancelButtonColor={lightTheme.opacity['200']} okButtonColor="var(--bg-darkrose)" title="Proceso de recuperación de correo electrónico">
          <p>A continuación, debes ingresar tu nombre completo con el cuál te registraste, pedimos tu nombre para saber que usuario está solicitando un recambio de correo electrónico.</p>
          <RecoverEmailForm ref={this.refRecoveryEmailForm} onSubmit={this.handleRecoveryEmail.bind(this)} />
        </Modal>
      </Fragment>
    )
  }
}
