// React
import { Component, Fragment } from 'react'

// Components
import { Button } from '@common'
import MenuLeft from '@layouts/dashboard/common/Dashboard.MenuLeft'
import Breadcrumb from '@layouts/dashboard/common/Dashboard.Breadcrumb'

// Librarys
import { message } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { signOut, getSession } from 'next-auth/react'

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// API
import { verifyToken } from '@api/auth' 

// Utils
import { classnames } from '@utils/Helper'
import { isEmptyArray, isEmptyObject } from '@utils/Validations'

class Container extends Component {
  static defaultProps = {
    breadcrumbItems: [],
  }

  constructor(props) {
    super(props)
    this.breadcrumbItems = this.props.breadcrumbItems
    this.prevPage = this.breadcrumbItems[this.breadcrumbItems?.length - 2]
    this.goToPreviousRoute = this.goToPreviousRoute.bind(this)

    this.extraData = {
      prevPage: this.prevPage,
      goToPreviousRoute: this.goToPreviousRoute,
      breadcrumbItems: this.breadcrumbItems,
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this.onMount()
  }

  async onMount() {
    const emptyUser = isEmptyObject(this.props.user)

    if (emptyUser) {
      await message.warn('A ocurrido un error en tu inicio de sesión. Debes volver a iniciar sesión', 4)

      return signOut({
        callbackUrl: '/auth/login'
      })
    };

    // Obtener sesión
    const session = await getSession()
    
    // Obtener token de usuario
    const token = session.user.access_token
    await verifyToken(token);
  }

  // Volver a una ruta anterior
  goToPreviousRoute() {
    this.props.router.push(this.prevPage.path)
  }

  render() {
    return (
      <div id="dashboard" className="d-flex flex-wrap justify-content-end h-100vh">
        <MenuLeft />
        <Box extraData={this.extraData} content={this.props.children} withPaddingY={this.props.boxWithPaddingY} />
      </div>
    )
  }
}

function mapStateToProps({ authentication }) {
  const { session } = getAuthenticationState({ authentication })

  return {
    user: session.user,
  }
}

const ContainerWithRouter = withRouter(Container)
export default connect(mapStateToProps)(ContainerWithRouter)

// <------------------------ Extra Components ------------------------>
class Box extends Component {
  static defaultProps = {
    withPaddingY: true
  }

  constructor(props) {
    super(props)
    this.boxClasses = classnames([
      'px-4',
      this.props.withPaddingY ? 'py-3' : null,
    ])
  }

  shouldComponentUpdate() {
    return false
  }

  renderBreadcrumbItems = () => {
    if (isEmptyArray(this.props.extraData.breadcrumbItems)) return

    const { prevPage, breadcrumbItems, goToPreviousRoute } = this.props.extraData

    const title = breadcrumbItems.length > 1 ? `Volver a ${prevPage.title}` : 'Volver atrás'

    return (
      <Fragment>
        {/* Botón que vuelve a una ruta anterior */}
        <Button
          title={title}
          onClick={goToPreviousRoute}
          attributes={{ id: "go-back" }}
          icon={{ size: '2x', name: 'arrow-circle-left' }}
          className='d-flex align-items-center fw-bold opacity'
        />

        {/* Enlaces */}
        <Breadcrumb items={breadcrumbItems} />
      </Fragment>
    )
  }

  render() {
    return (
      <section id="box" className={this.boxClasses}>
        {this.renderBreadcrumbItems()}
        {this.props.content}
      </section>
    )
  }
}
