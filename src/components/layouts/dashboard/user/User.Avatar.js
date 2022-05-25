// React
import { Component } from 'react'

// Librarys
import { Avatar } from 'antd'

const userAvatar = require('@assets/img/user-avatar.webp').default.src

export default class UserAvatar extends Component {
  static defaultProps = {
    hideGreenCircle: false
  }

  constructor(props) {
    super(props)
    this.mq = window.innerWidth < 1081
    this.styles = {
      avatar: {
        backgroundColor: 'var(--bg-darkrose)',
      },
      status: {
        width: 15,
        height: 15,
        right: '-2px',
        backgroundColor: 'var(--bg-green-200)',
      },
    }
  }

  shouldComponentUpdate(nextProps){
    return (
      this.props.src !== nextProps.src ||
      this.props.status !== nextProps.status
    )
  }

  render() {
    const { src, onClick, hideGreenCircle } = this.props

    return (
      <div role="button" className="position-relative">
        <Avatar size="large" alt="user-logo" style={this.styles.avatar} onClick={onClick} src={src ?? userAvatar} />

        {/* Círculo de conexión */}
        {!hideGreenCircle && <span
          style={this.styles.status}
          className="connection-status position-absolute bottom-0 rounded-pill"
        />}
      </div>
    )
  }
}
