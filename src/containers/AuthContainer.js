// React
import { Component, createRef } from 'react'

// Components
import { Icon, Help, Button } from '@common'

// Librarys
import Image from 'next/image'
import { withRouter } from 'next/router'

// Utils
import { classnames } from '@utils/Helper'

const userAvatar = require('@assets/img/user-avatar.webp').default.src

class AuthContainer extends Component {
  static defaultProps = {
    settings: {},
    wrapperStyle: {},
    containerStyle: {},
    showArrow: true,
  }

  constructor(props) {
    super(props)
    this.goToPath = this.goToPath.bind(this)
    this.createHelpStyles = this.createHelpStyles.bind(this)
    this.renderArrow = this.renderArrow.bind(this)
    this.renderHelpIcon = this.renderHelpIcon.bind(this)

    this.helpStyles = this.createHelpStyles({
      placement: this.props.settings.help.placement,
    })
  }

  shouldComponentUpdate() {
    return false
  }

  // Crear estilos de ícono de ayuda
  createHelpStyles({ placement }) {
    const helpStyles = {
      top: 20,
      color: '#000',
    }

    if (placement === 'left') helpStyles.left = 20
    else if (placement === 'right') helpStyles.right = 20

    return helpStyles
  }

  // Ir a una ruta
  goToPath() {
    const { settings } = this.props

    this.props.router.push(settings.arrow.link)
  }

  // Renderizar ícono de ayuda
  renderHelpIcon() {
    if (!this.props.settings?.help) return

    return <Help withTheme={false} className="position-absolute" style={this.helpStyles} title={this.props.settings.help?.title} textColor="var(--bg-white)" backgroundColor="var(--bg-dark)" tooltipSettings={{ placement: 'bottom' }} />
  }

  // Renderizar flecha
  renderArrow() {
    if (!this.props.showArrow) return;

    const toLeft = this.props.settings.arrow.placement === 'left'

    return (
      <Icon
        size="2x"
        width={50}
        height={50}
        withTheme={false}
        onClick={this.goToPath}
        color="var(--bg-darkrose)"
        title={this.props.settings?.arrow.title}
        name={toLeft ? 'arrow-circle-left' : 'arrow-circle-right'}
        className={`back-to-home position-absolute rounded-pill ${toLeft ? 'to-left' : 'to-right'}`}
      />
    )
  }

  render() {
    const { title, containerStyle, wrapperStyle } = this.props
    const authContainerClasses = classnames(['w-100 h-100vh d-flex align-items-center', this.props.className])
    const titleClasses = classnames([
      'title text-center noto-sans mx-auto', this.props.titleClasses
    ])

    return (
      <div id="auth-container" style={containerStyle} className={authContainerClasses}>
        <div style={wrapperStyle} className="wrapper animate__animated animate__bounceInUp mx-auto position-relative">
          {/* Icono de ayuda */}
          {this.renderHelpIcon()}

          {/* Icono de flecha */}
          {this.renderArrow()}

          {/* Logo */}
          <figure className="logo mb-0 d-block position-absolute top-0">
            <Image
              priority
              width={105}
              height={105}
              src={userAvatar}
              objectFit="cover"
            />
          </figure>

          {/* Título */}
          <h2 className={titleClasses}>{title}</h2>

          {this.props.children}
        </div>
      </div>
    )
  }
}

export default withRouter(AuthContainer)

// <------------------------ Extra Components ------------------------>
export class Submit extends Component {
  constructor(props) {
    super(props)
    this.submit = createRef()
    this.showLoading = this.showLoading.bind(this)
    this.hideLoading = this.hideLoading.bind(this)

    this.buttonStyle = {
      paddingTop: 10,
      paddingBottom: 10,
    }

    this.submitClasses = classnames([
      "submit w-100 rounded-pill mt-4",
      this.props.className
    ])
  }

  shouldComponentUpdate() {
    return false
  }

  // Mostrar loading
  showLoading() {
    this.submit.current.showLoading()
  }

  // Ocultar loading
  hideLoading() {
    this.submit.current.hideLoading()
  }

  render() {
    return (
      <Button ref={this.submit} {...this.props} textColor="var(--bg-white)" backgroundColor="var(--bg-darkrose)" style={this.buttonStyle} className={this.submitClasses} attributes={{ type: 'submit' }} loading={{ style: { color: 'var(--bg-white)' } }}>
        Entrar
      </Button>
    )
  }
}
