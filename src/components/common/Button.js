// React
import { Component, Fragment } from "react";

// Components
import Loading from "@layouts/loaders/Loading.Default";

// Librarys
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { classnames } from '@utils/Helper'
import { isFunction } from "@utils/Validations";

export default class Button extends Component {
  static defaultProps = {
    icon: false,
    loading: false,
    attributes: {},
  };

  constructor(props) {
    super(props);
    this.showLoading = this.showLoading.bind(this);
    this.hideLoading = this.hideLoading.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this.state = {
      isLoading: false,
    };

    this.styles = {
      button: {
        ...this.props.style,
        color: this.props.textColor,
        backgroundColor: this.props.backgroundColor,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isLoading !== nextState.isLoading ||
      this.props.icon.color !== nextProps.icon.color
    );
  }

  // Mostrar loading
  showLoading() {
    this.setState({ isLoading: true });
  }

  // Ocultar loading
  hideLoading() {
    this.setState({ isLoading: false });
  }

  // Evento click en el botón
  handleClick(e) {
    isFunction(this.props.onClick) && this.props.onClick({
      event: e,
      showLoading: this.showLoading,
      hideLoading: this.hideLoading,
    });
  }

  // Renderizar 'loading'
  renderLoading() {
    if (!this.state.isLoading) return;

    return (
      <Loading
        style={this.props.loading?.style}
        containerStyle={this.props.loading?.containerStyle}
      />
    );
  }

  // Renderizar icon del boton
  renderIcon() {
    if (!this.props.icon) return;

    return (
      <FontAwesomeIcon
        size={this.props.icon.size}
        style={this.props.icon.style}
        color={this.props.icon.color}
        icon={this.props.icon.name || this.props.icon}
      />
    );
  }

  // Renderizar titulo del boton
  renderTitle() {
    if (!this.props.title) return;
    const titleClasses = classnames([
      this.props.icon ? "ms-2" : null,
      this.props.titleClasses,
    ])

    return (
      <span className={titleClasses} style={this.props.titleStyle}>
        {this.props.title}
      </span>
    );
  }

  // Renderizar contenido del botón
  renderContent() {
    if (this.state.isLoading) return;

    return (
      <Fragment>
        {this.renderIcon()}
        {this.renderTitle()}
      </Fragment>
    );
  }

  render() {
    const buttonClasses = classnames(["border-0 scale", this.props.className])

    return (
      <button
        type="button"
        className={buttonClasses}
        onClick={this.handleClick}
        style={this.styles.button}
        disabled={this.state.isLoading}
        {...this.props.attributes}
      >
        {/* Renderizar un 'loader' */}
        {this.renderLoading()}

        {/* Renderizar contenido del botón */}
        {this.renderContent()}
      </button>
    );
  }
}
