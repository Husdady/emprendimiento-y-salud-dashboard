// React
import { Component } from 'react'

// Components
import { Help } from '@common'
import Wrapper from './Dashboard.Wrapper'

// Librarys
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Utils
import { classnames } from '@utils/Helper'

export default class WrapTitle extends Component {
  static defaultProps = {
    className: '',
    renderHelpIcon: true,
    paddingY: 'py-1',
  }

  shouldComponentUpdate() {
    return false
  }

  // Renderizar icono de ayuda
  renderHelpIcon = () => {
    if (this.props.children) return this.props.children

    if (!this.props.renderHelpIcon) return

    return <Help title={this.props.helpTitle} style={{ left: '1%' }} />
  }

  render() {
    const { icon, style, title, paddingY } = this.props

    const classes = classnames([
      'wrap-title d-flex align-items-center justify-content-between',
      this.props.className
    ])

    return (
      <Wrapper style={style} className={classes} paddingY={paddingY}>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={icon} size="lg" />
          <h3 className="title ms-2 mb-0 titillium-web">
            {title}
          </h3>
        </div>

        {/* Icono de Ayuda */}
        {this.renderHelpIcon()}
      </Wrapper>
    )
  }
}
