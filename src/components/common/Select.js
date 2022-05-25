// React
import { Component, Fragment } from "react";

// Librarys
import { Select, Modal, Radio, Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { isArray, isFunction } from "@utils/Validations";

const { Option } = Select;

export default class SelectItems extends Component {
  static defaultProps = {
    style: {},
    items: [],
    defaultValue: null,
    placeholder: "Selecciona una opción",
    onChange: function () {},
  };

  constructor(props) {
    super(props);
    this.mq = window.innerWidth <= 768;
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderDivider = this.renderDivider.bind(this);
    this.renderModalItem = this.renderModalItem.bind(this);
    this.renderModalItems = this.renderModalItems.bind(this);

    this.state = {
      isModalVisible: false,
      value: this.props.defaultValue,
    };
  }

  shouldComponentUpdate(_, nextState) {
    return (
      this.state.value !== nextState ||
      this.state.isModalVisible !== nextState.isModalVisible
    );
  }

  // Ocultar modal
  showModal() {
    this.mq && this.setState({ isModalVisible: true });
  }

  // Ocultar modal
  hideModal() {
    this.setState({ isModalVisible: false });
  }

  // Cambiar opción de Select
  handleChange(_, option) {
    const { onChange } = this.props;

    // Setear valor
    this.setState({ value: option.value });

    // Si la pantalla es menor a 768px
    if (this.mq) {
      isFunction(onChange) && onChange(option);
      setTimeout(this.hideModal, 200);
      return null;
    }

    // Ejecutar función 'onChange'
    isFunction(onChange) && onChange({
      key: option.key,
      value: option.value,
    });
  }

  // Renderizar elementos
  renderItems() {
    if (this.mq) return;

    return this.props.items.map((item, i) => {
      const itemKey = item.key || i;
      return <Option {...item} key={itemKey}>{item.value}</Option>
    })
  }

  // Renderizar borde abajo
  renderDivider(position, total) {
    if (position === total) return;

    return <Divider className="m-0" />
  }

  // Renderizar elemento de Modal
  renderModalItem(item, i, total) {
    return (
      <Fragment key={i}>
        <Radio  value={i} onClick={() => this.handleChange(null, item)}>
          {item.value}
        </Radio>
       {this.renderDivider(i, total.length - 1)}
      </Fragment>
    );
  }

  // Renderizar elementos de Modal
  renderModalItems() {
    const { items } = this.props;

    if (!isArray(items)) return;

    const i = items.findIndex(item => item.value === this.state.value)

    return (
      <Radio.Group className="w-100" defaultValue={i}>
        {items.map(this.renderModalItem)}
      </Radio.Group>
    );
  }

  render() {
    return (
      <Fragment>
        {/* Selecciona una opción */}
        <Select
          value={this.state.value}
          style={this.props.style}
          placeholder={this.props.placeholder}
          className="rounded-3"
          onClick={this.showModal}
          onChange={this.handleChange}
          notFoundContent={this.mq && null}
          suffixIcon={<FontAwesomeIcon icon='sort' />}
        >
          {this.renderItems()}
        </Select>

        {/* Modal */}
        <Modal
          centered
          footer={null}
          closable={false}
          onCancel={this.hideModal}
          visible={this.state.isModalVisible}
          className='radio-group-modal'
          maskStyle={{ backgroundColor: "rgba(0,0,0, .85)" }}
        >
          {this.renderModalItems()}
        </Modal>
      </Fragment>
    );
  }
}
