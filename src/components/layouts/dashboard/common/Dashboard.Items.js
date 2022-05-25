// React
import { Component } from "react";

// Components
import { Icon, Empty } from "@common";
import Skeleton from "@layouts/skeletons/Skeleton.Items";
import Wrapper from "@layouts/dashboard/common/Dashboard.Wrapper";

// Librarys
import { Row, Col, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { isEmptyArray } from "@utils/Validations";
import { getPropertyFromObject } from "@utils/Helper";

export default class DashboardItems extends Component {
  static defaultProps = {
    data: [],
    empty: {},
    styles: {}
  };

  shouldComponentUpdate(nextProps) {
    return (
      this.props.data !== nextProps.data ||
      this.props.loading !== nextProps.loading
    );
  }

  // Renderizar roles
  renderItems = () => {
    const { title, image } = this.props.customFields;
    const { data, styles, customAvatar, onEdit, onDelete } = this.props;

    return data.map((item, i) => (
      <Item
        key={item.id || i}
        titleStyle={styles.title}
        iconStyles={styles.icons}
        userIcon={styles.userIcon}
        onEdit={() => onEdit(item, i)}
        onDelete={() => onDelete(item, i)}
        title={getPropertyFromObject(item, title)}
        image={getPropertyFromObject(item, image)}
        customAvatar={customAvatar}
      />
    ));
  }

  // Renderizar contenido
  renderContent = () => {
    const emptyData = isEmptyArray(this.props.data)

    // Si 'items' es un Array vacío
    if (emptyData) {
      return (
        <Wrapper className="pb-5">
          <Empty
            image={this.props.empty.image}
            title={this.props.empty.title}
            width={this.props.empty.width}
            height={this.props.empty.height}
          />
        </Wrapper>
      );
    }

    // Los 'items' están cargando
    if (this.props.loading) { 
      return <Skeleton totalItems={this.props.totalItems} />;
    }

    return (
      <Row
        justify="center"
        gutter={[0, 15]}
        className='container-items'
        style={this.props.containerStyle}
      >
        {this.renderItems()}
      </Row>
    );
  }

  render() {
    return this.renderContent()
  }
}

// <------------------------ Extra Components ------------------------>
export class Item extends Component {
  static defaultProps = {
    iconStyles: {},
    userIcon: {
      size: "2x",
      color: "var(--bg-purple)",
    },
  };

  shouldComponentUpdate(nextProps) {
    return this.props.title !== nextProps.title;
  }

  // Renderizar imagen de elemento
  renderImage = () => {
    if (this.props.customAvatar) {
      return this.props.customAvatar
    }

    if (!this.props.image) {
      return (
        <FontAwesomeIcon
          icon="user-circle"
          title={this.props.title}
          size={this.props.userIcon.size}
          color={this.props.userIcon.color}
        />
      );
    }

    return (
      <Avatar
        className="pointer"
        src={this.props.image}
        onClick={this.props.onClick}
      />
    );
  }

  render() {
    return (
      <Col
        xxl={{ span: 6 }}
        xl={{ span: 7 }}
        md={{ span: 7 }}
        sm={{ span: 11 }}
        xs={{ span: 22 }}
        className="item d-flex align-items-center justify-content-between py-3 ps-3 pe-2"
      >
        <div className="d-flex align-items-center">
          {/* Imagen de elemento */}
          {this.renderImage()}

          {/* Título de elemento */}
          <span className="title ms-2 fw-bold text-break" style={this.props.titleStyle}>
            {this.props.title}
          </span>
        </div>

        {/* Iconos */}
        <div className="d-flex align-items-center">
          {/* Icono de editar */}
          <Icon
            width={35}
            height={35}
            name="edit"
            onClick={this.props.onEdit}
            className="edit-item position-relative smooth full-rounded d-flex align-items-center"
            {...this.props.iconStyles.edit}
          />

          {/* Icono de eliminar */}
          <Icon
            width={35}
            height={35}
            name="trash-alt"
            color="var(--bg-red)"
            onClick={this.props.onDelete}
            className="delete-item smooth full-rounded d-flex align-items-center"
            {...this.props.iconStyles.delete}
          />
        </div>
      </Col>
    );
  }
}