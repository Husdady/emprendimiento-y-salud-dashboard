// React
import { Component } from "react";

// Librarys
import { Skeleton } from "antd";

export default class SkeletonTable extends Component {
  static defaultProps = {
    items: [],
    fields: [],
    totalItems: 0,
  };

  constructor(props) {
    super(props);
    this.mq = window.innerWidth <= 900;
    this.renderItem = this.renderItem.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderBodyContent = this.renderBodyContent.bind(this);
    this.renderSkeleton = this.renderSkeleton.bind(this);

    this.styles = {
      containerSkeleton: {
        maxWidth: "100%",
        marginBottom: "2em",
      },
      table: {
        tableLayout: "auto",
      },
    };
  }

  // Renderizar campo de cabezera
  renderField(width, i) {
    // Estilos del campo
    const fieldStyle = {
      height: 10,
      width: width,
    };

    return (
      <th key={i} className="ant-table-cell">
        <Skeleton.Button block active className="d-block" style={fieldStyle} />
      </th>
    );
  }

  // Renderizar cabezera de la tabla
  renderHeader() {
    return this.props.fields.map(this.renderField);
  }

  // Renderizar un elemento del contenido de la tabla
  renderItem(width, i) {
    // Estilos del campo
    const fieldStyle = {
      height: 10,
      width: width,
    };

    return (
      <td key={i} className="ant-table-cell">
        <Skeleton.Button block active className="d-block" style={fieldStyle} />
      </td>
    );
  }

  // Renderizar contenido de la tabla
  renderBodyContent() {
    return Array.from(Array(this.props.totalItems).keys()).map((_, k) => (
      <tr key={k} className="ant-table-row ant-table-row-level-0">
        {this.props.items.map(this.renderItem)}
      </tr>
    ));
  }

  renderSkeleton() {
    return (
      <div className="container-table" style={this.styles.containerSkeleton}>
        <div className="ant-table-wrapper">
          <div className="ant-spin-nested-loading">
            <div className="ant-table ant-table-bordered">
              <div className="ant-table-content">
                <table style={this.styles.table}>
                  <thead className="ant-table-thead">
                    <tr>{this.renderHeader()}</tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {this.renderBodyContent()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // Si está cargando mostrar skeleton
    if (this.props.loading) {
      return this.renderSkeleton();
    }

    return this.props.children;
  }
}
