// React
import { Component } from 'react'

// Librarys
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export default class Default extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return <Spin style={this.props.containerStyle} indicator={<LoadingOutlined style={this.props.style} spin />} />
  }
}
