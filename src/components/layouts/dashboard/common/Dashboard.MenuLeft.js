// React
import { Component, Fragment } from 'react'

// Component
import { Icon, Button } from '@common'
import UserAvatar from '@layouts/dashboard/user/User.Avatar'

// Librarys
import Link from 'next/link'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { List, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Actions
import setAuthentication from '@redux/actions/auth'

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// Utils
import { isEmptyObject } from '@utils/Validations'

const navigation = require('@assets/json/navigation.json')

class MenuLeft extends Component {
  constructor(props) {
    super(props)
    this.showMenu = this.showMenu.bind(this)
    this.onLogout = this.onLogout.bind(this)
    this.navigateTo = this.navigateTo.bind(this)
    this.renderIcon = this.renderIcon.bind(this)
    this.renderNavigationTitle = this.renderNavigationTitle.bind(this)
    this.renderNavigation = this.renderNavigation.bind(this)

    this.mq = window.innerWidth <= 1080
    this.state = { menuIsVisible: false }

    this.styles = {
      icons: {
        cog: { left: '4%' },
        bars: {
          width: 40,
          height: 40,
          left: '1%',
          padding: 10,
          borderRadius: 8,
        },
      },
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.menuIsVisible !== nextState.menuIsVisible
  }

  // Mostrar menu
  showMenu() {
    this.setState({ menuIsVisible: !this.state.menuIsVisible })
  }

  // Navegar a una ruta
  navigateTo(path) {
    this.props.router.push(path)
  }

  // Cerrar sesión de usuario
  async onLogout({ showLoading, hideLoading }) {
    if (this.count >= 1) return
    
    this.count = 1

    this.props.signOut({
      showLoading: showLoading,
      hideLoading: hideLoading,
      count: this.count,
    })
  }

  // Renderizar icono
  renderIcon(item) {
    if (!this.mq) {
      return (
        <Link href='/dashboard/account'>
          <a>
            <Icon
              name={item.icon.name[0]}
              color={item.icon.color}
              size={this.mq ? '2x' : '1x'}
              className="smooth full-rounded"
              containerStyle={this.styles.icons.cog}
            />
          </a>
        </Link>
      )
    }

    return (
      <FontAwesomeIcon
        size="2x"
        className="icon scale"
        color={item.icon.color}
        onClick={this.showMenu}
        style={this.styles.icons.bars}
        icon={!this.state.menuIsVisible ? item.icon.name[1] : 'times'}
      />
    )
  }

  // Renderizar título en navegación
  renderNavigationTitle(navigationTitle) {
    if (!navigationTitle) return;

    return <h6 className="d-block navigation-title fw-bold text-uppercase">{navigationTitle}</h6>
  }

  // Renderizar elementos de navegación
  renderNavigation(item) {
    return (
      <Fragment>
        {this.renderNavigationTitle(item.navigationTitle)}

        <List.Item role="button" className="item" onClick={() => this.navigateTo(item.path)}>
          <List.Item.Meta
            title={item.title}
            avatar={<FontAwesomeIcon size="lg" icon={item.icon} />}
          />

          <Icon
            width={30}
            height={35}
            name="angle-right"
            containerStyle={{ right: '3%' }}
            className="rounded-top-right rounded-bottom-right position-absolute"
          />
        </List.Item>
      </Fragment>
    )
  }

  render() {
    const navigationClasses = `menu-left-content-lists ${this.state.menuIsVisible ? 'visible' : 'hidden'}`

    return (
      <section id="menu-left">
        <User showMenu={this.showMenu} renderIcon={this.renderIcon} />

        {/* Navegación */}
        <div className={navigationClasses}>
          <List className="wrapper-list scroller scrollbar-hidden" itemLayout="horizontal" dataSource={navigation} bordered={false} renderItem={this.renderNavigation} />

          {/* Parte Inferior */}
          <div className="menu-left-bottom">
            <Button icon="sign-out-alt" title="Cerrar sesión" onClick={this.onLogout} className="scale d-block my-2 mx-auto rounded-pill noto-sans" loading={{ style: { color: 'var(--bg-white)' } }} textColor="var(--bg-white)" backgroundColor="var(--bg-darkrose)" attributes={{ id: "sign-out" }} />
            <span id="author" className="electrolize d-block text-center text-muted">Powered by @Husdady 2021</span>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps({ authentication }) {
  const { session } = getAuthenticationState({ authentication })
  return { user: session.user }
}

function mapDispatchToProps(dispatch) {
  const { signOut } = setAuthentication(dispatch)
  return { signOut }
}

export default connect(null, mapDispatchToProps)(withRouter(MenuLeft))

// <------------------------ Extra Components ------------------------>
class UserConnect extends Component {
  constructor(props) {
    super(props)
    this.renderUser = this.renderUser.bind(this)

    this.user = [
      {
        path: '/dashboard/account',
        icon: {
          name: ['cog', 'bars'],
        },
      },
    ]
  }

  shouldComponentUpdate(nextProps) {
    if (isEmptyObject(nextProps.user)) {
      return false
    }

    return this.props.user !== nextProps.user
  }

  // Renderizar información del usuario
  renderUser(item) {
    const { user } = this.props

    const userAvatar = (
      <Link href="/dashboard/account">
        <a><UserAvatar src={user.profilePhoto} /></a>
      </Link>
    )

    return (
      <List.Item style={item.style}>
        {/* Renderizar la información del usuario */}
        <List.Item.Meta avatar={userAvatar} title={user.fullname} description={user.email} />

        {/* Renderizar iconos al lado de la información del usuario */}
        {this.props.renderIcon(item)}
      </List.Item>
    )
  }

  render() {
    return (
      <List className="wrapper-list" itemLayout="horizontal" dataSource={this.user} renderItem={this.renderUser} />
    )
  }
}

const User = connect(mapStateToProps)(UserConnect)
