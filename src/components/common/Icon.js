// React
import { Component } from "react";

// Librarys
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { classnames } from '@utils/Helper'

export default class Icon extends Component {
  static defaultProps = {
    width: 40,
    height: 40,
    withTheme: true,
    containerStyle: {},
    className: "rounded-pill",
  }

  constructor(props) {
    super(props);
    this.iconClasses = classnames([
      'icon d-flex justify-content-center align-items-center position-relative full-rounded',
      this.props.className,
    ])

    this.containerStyle = {
      width: this.props.width,
      height: this.props.height,
      ...this.props.containerStyle
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div
        role="button"
        className={this.iconClasses}
        style={this.containerStyle}
        onClick={this.props.onClick}
        title={this.props.title}
      >
        <FontAwesomeIcon
          icon={this.props.name}
          color={this.props.color}
          size={this.props.size}
        />
      </div>
    );
  }
}
