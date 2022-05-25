// React
import { Component } from "react";

// Librarys
import { Input } from "antd";

export default class Email extends Component {
  static defaultProps = {
    placeholder: "Ingresa tu correo electrónico...",
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    return (
      <Input
        type="email"
        placeholder={this.props.placeholder}
        {...this.props}
      />
    );
  }
}
