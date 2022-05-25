// React
import { Component } from "react";

// Utils
import { classnames } from '@utils/Helper'

export default class Checkbox extends Component {
  static defaultProps = {
    title: "",
    checked: true,
  };

  shouldComponentUpdate(nextProps) {
    return (
      this.props.checked !== nextProps.checked ||
      this.props.needRenderAgain !== nextProps.needRenderAgain
    );
  }

  render() {
    const { title, checked } = this.props;
    const checkboxIsActive = checked ? "active" : "";
    const checkboxClass = classnames([
      "checkbox d-table titillium-web", checkboxIsActive, this.props.className
    ])
      
    return (
      <span
        role="button"
        style={this.props.style}
        className={checkboxClass}
        onClick={this.props.onCheck}
      >
        <span className="title d-flex align-items-center user-select-none">{title}</span>
      </span>
    );
  }
}
