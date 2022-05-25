// React
import { Component, Fragment } from "react";

// Librarys
import { Modal } from "antd";
import { connect } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Reducers
import { getThemeState } from '@redux/reducers/theme'

// Utils
import { classnames } from "@utils/Helper";
import { isObject, isFunction } from '@utils/Validations'

class CustomModal extends Component {
  static defaultProps = {
    isDashboardModal: true,
    cancelButtonColor: 'var(--theme-opacity-200)',
    attributes: {
      footer: null,
    },
  };

  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.renderContent = this.renderContent.bind(this)
    this.isLightTheme = this.props.theme === 'light'

    this.state = {
      extraData: {},
      isModalVisible: false,
    };

    this.styles = {
      maskStyle: {
        backgroundColor: this.isLightTheme ? "var(--theme-opacity-400)" : "var(--theme-opacity-200)",
      },
      modalContent: {
        maxHeight: 400,
        overflowX: "auto",
      },
    };

    this.closeIcon = <FontAwesomeIcon icon="times-circle" />

    this.modalClasses = classnames([
      this.props.className,
      this.props.isDashboardModal ? "dashboard-modal" : null,
    ])

    this.okButtonProps = {
      className: "border-0 opacity",
      style: {
        ...this.props.okButtonStyle,
        backgroundColor: this.props.okButtonColor,
      }
    }

    this.cancelButtonProps = {
      className: "border-0 text-muted",
      style: {
        ...this.props.cancelButtonStyle,
        backgroundColor: this.props.cancelButtonColor,
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.extraData !== nextState.extraData ||
      this.state.isModalVisible !== nextState.isModalVisible ||
      this.props.needRenderAgain !== nextProps.needRenderAgain
    )
  }

  // Mostrar modal
  show(extraData) {
    this.setState({
      isModalVisible: true,
      extraData: isObject(extraData) ? extraData : {}
    });
  }

  // Ocultar modal
  hide() {
    this.setState((currentState) => ({ ...currentState, isModalVisible: false }));
  }

  // Renderizar contenido de modal
  renderContent() {
    const { children } = this.props;

    if (isFunction(children)) {
      return children({ extraData: this.state.extraData })
    }

    return children
  }

  render() {
    return (
      <Modal
        onCancel={this.hide}
        title={this.props.title}
        closeIcon={this.closeIcon}
        className={this.modalClasses}
        visible={this.state.isModalVisible}
        maskStyle={this.styles.maskStyle}
        bodyStyle={this.styles.modalContent}
        okButtonProps={this.okButtonProps}
        cancelButtonProps={this.cancelButtonProps}
        {...this.props.attributes}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default connect(getThemeState, null, null, {
  forwardRef: true
})(CustomModal)

// <------------------------ Extra Components ------------------------>
export class OkButtonModal extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.title !== nextProps.title;
  }

  render() {
    const { color } = this.props

    return (
      <Fragment>
        <FontAwesomeIcon icon={this.props.icon} className="me-2" style={{ color }} />
        <span className={this.props.titleClasses} style={{ color }}>{this.props.title}</span>
      </Fragment>
    );
  }
}

export class CancelButtonModal extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Fragment>
        <FontAwesomeIcon icon="times" className="me-1" />
        <span className="pe-none">Cancelar</span>
      </Fragment>
    );
  }
}
