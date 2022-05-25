// React
import { Component } from "react";

// Components
import Skeleton from "@layouts/skeletons/Skeleton.Table";

// Librarys
import { Table, Empty } from "antd";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { isFunction, isEmptyArray } from "@utils/Validations";

export { ActionButton };
export default class ContainerTable extends Component {
  static defaultProps = {
    data: [],
    pagination: {},
    emptyMessage: "Sin datos...",
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    }
    this.styles = {
      containerTable: {
        marginBottom: "1rem",
      },
    };
    this.emptyTableItems = {
      emptyText: (
        <Empty
          style={{ paddingBottom: ".5em" }}
          description={this.props.emptyMessage}
        />
      ),
    };
    this.onPaginate = this.onPaginate.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.data !== nextProps.data ||
      this.props.loading !== nextProps.loading ||
      this.state.currentPage !== nextState.currentPage
    )
  }

  // Setear página actual de la tabla
  setCurrentPage(i) {
    if (i === this.state.currentPage) return;

    this.setState({ currentPage: i });
  }

  // Cuando se actualiza la página actual de la tabla
  onPaginate(i) {
    const { onPaginate } = this.props.pagination;

    if (!isFunction(onPaginate)) {
      this.setCurrentPage(this.state.currentPage + 1);
    }

    onPaginate(i, this.setCurrentPage);
  }

  // Renderizar tabla
  renderTable() {
    const { data, pagination } = this.props;
    const style = isEmptyArray(data) ? this.styles.containerTable : null

    return (
      <div className='container-table' style={style}>
        <Table
          bordered
          dataSource={data}
          columns={this.props.fields}
          locale={this.emptyTableItems}
          pagination={{
            total: pagination.totalSize,
            pageSize: pagination.pageSize,
            current: this.state.currentPage,
            onChange: this.onPaginate,
          }}
        />
      </div>
    )
  }

  render() {
    return (
      <Skeleton
        loading={this.props.loading}
        items={this.props.skeletonItems}
        fields={this.props.skeletonFields}
        totalItems={this.props.pagination.pageSize}
      >
        {this.renderTable()}
      </Skeleton>
    );
  }
}

// <------------------------ Extra Components ------------------------>
class ActionButton extends Component {
  static defaultProps = {
    icon: {},
    onAction: function () {},
  };

  constructor(props) {
    super(props);
    this.buttonStyle = {
      padding: 5,
      borderRadius: 3,
      ...this.props.style,
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { icon, onAction } = this.props;
    
    return (
      <button
        onClick={onAction}
        style={this.buttonStyle}
        className="border-0 scale"
      >
        <FontAwesomeIcon icon={icon.name} color={icon.color} title={icon.title} />
      </button>
    );
  }
}
