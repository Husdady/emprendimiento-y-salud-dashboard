// React
import { Component, Fragment, createRef } from "react";

// Components
import { Modal } from '@common'

// Librarys
import { Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { truncate, classnames, removeArrayItem } from "@utils/Helper";
import { isArray, isEmptyArray, isObject, isFunction } from "@utils/Validations";

export default class DashboardModal extends Component {
  static defaultProps = {
    attributes: {
      footer: null,
    },
  };

  constructor(props) {
    super(props);
    this.refModal = createRef()
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.addItem = this.addItem.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.renderIconItem = this.renderIconItem.bind(this);
    this.renderModalContent = this.renderModalContent.bind(this);

    this.dashboardModalClasses = classnames(['modal-items', this.props.className]);

    this.state = {
      items: [],
      modalAttributes: {},
    };

    this.styles = {
      title: {
        fontSize: "1.25em",
      },
    };
  }

  shouldComponentUpdate(_, nextState) {
    return (
      this.state.items !== nextState.items ||
      this.state.modalAttributes || nextState.modalAttributes
    )
  }

  // Mostrar modal
  show({ items = [], modalAttributes = {} }) {
    const newState = {};

    // Comprobar si los 'items' son un arreglo
    if (isArray(items)) {
      newState.items = items
    }

    // Comprobar si 'modalAttributes' es un objeto
    if (isObject(modalAttributes)) {
      newState.modalAttributes = modalAttributes
    }

    // Setear estado
    this.setState((currentState) => ({
      ...currentState,
      ...newState,
    }));

    // Mostrar modal
    this.refModal.current?.show()
  }

  // Ocultar modal
  hide() {
    this.refModal.current?.hide()
  }

  // Agregar 'item' a modal
  addItem(item) {
    this.setState((currentState) => ({
      ...currentState,
      items: [...currentState.items, item]
    }))
  }

  // Eliminar un 'item' de modal
  deleteItem(itemId) {
    // Eliminar un item por id
    const items = removeArrayItem(this.state.items, {
      _id: itemId
    })

    // Setear nuevos items excluyendo el que ha sido eliminado
    this.setState((currentState) => ({
      ...currentState,
      items: items
    }));
  }

  // Renderizar uno o más íconos en un 'item'
  renderIconItem({ onlyIcon, multipleIcons }) {
    if (onlyIcon) {
      return this.renderIcon(onlyIcon)
    }

    if (!isArray(multipleIcons)) return;

    return (
      <div style={{ width: "20%" }} className="d-flex align-items-center justify-content-end">
        {multipleIcons.map(this.renderIcon)}
      </div>
    )
  }

  // Renderizar icono
  renderIcon(icon, i) {
    return (
      <FontAwesomeIcon
        size="lg"
        key={i || icon.name}
        className="pointer"
        icon={icon.name}
        {...icon}
      />
    );
  }

  // Renderizar items
  renderModalContent(items) {
    if (!isArray(items)) return;

    // Si no hay items
    if (isEmptyArray(items)) {
      return (
        <Empty
          className="pb-1"
          style={this.styles.emptyModalContent}
          description="No hay nada para mostrar..."
        />
      );
    }

    // Retonar items
    return items.map((item, i, total) => (
      <button
        key={i}
        className="modal-item d-flex align-items-center justify-content-between border-0 w-100 p-3"
        style={{
          ...item.containerStyle,
          marginBottom: i === total.length - 1 ? 0 : "1em",
        }}
      >
        {/* Información del Item */}
        <div style={item.containerTitleStyle} className="d-flex align-items-center">
          {item.image}
          <span style={this.styles.title} className="ms-2 rubik">{truncate(item.title, 25)}</span>
        </div>

        {/* Iconos */}
        {this.renderIconItem({ onlyIcon: item.icon, multipleIcons: item.icons })}
      </button>
    ));
  }

  render() {
    return (
      <Modal
        ref={this.refModal}
        title={this.props.title}
        okButtonColor={this.props.okButtonColor}
        className={this.dashboardModalClasses}
        attributes={this.props.attributes}
        needRenderAgain={this.state.items}
      >
        {this.renderModalContent(this.state.items)}
      </Modal>
    );
  }
}
