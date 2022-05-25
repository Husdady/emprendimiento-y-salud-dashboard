// React
import { Component } from "react";

// Librarys
import { Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { classnames } from '@utils/Helper'
import { isEmptyString } from '@utils/Validations'

export default class Password extends Component {
  static defaultProps = {
    eyeStyles: {},
    eyeColor: "inherit",
    matchPassword: null,
    placeholder: "Ingresa tu contraseña",
  };

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    };

    this.containerClasses = classnames([
      'password w-100 d-block position-relative',
      this.props.containerClasses
    ])

    this.eyeStyles = {
      top: "50%",
      zIndex: 99999999999,
      color: this.props.eyeColor,
      transform: "translate(-50%, -50%)",
      ...this.props.eyeStyles,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.value !== nextProps.value ||
      this.state.showPassword !== nextState.showPassword ||
      this.props.matchPassword !== nextProps.matchPassword
    );
  }

  // Mostrar contraseña
  showPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  // Renderizar icono de un ojo
  renderEye(showPassword) {
    if (isEmptyString(this.props.value)) return;

    return (
      <span role="button" className="user-select-none position-absolute end-0" style={this.eyeStyles} onClick={this.showPassword.bind(this)}>
        <FontAwesomeIcon icon={showPassword ? "eye" : "eye-slash"} />
      </span>
    )
  }

  render() {
    const { showPassword } = this.state;

    return (
      <span className={this.containerClasses}>
        <Input
          type={showPassword ? "text" : "password"}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          className={this.props.className}
          style={this.props.style}
        />
        
        {this.renderEye(showPassword)}
      </span>
    );
  }
}
