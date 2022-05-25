// React
import { Component } from "react";

// Librarys
import { Row, Skeleton } from "antd";

// Utils
import { generateArray } from '@utils/Helper'

const defaultClasses = "ant-col ant-col-xs-22 ant-col-sm-11 ant-col-md-7 ant-col-xl-7 ant-col-xxl-5"

export default class SkeletonItems extends Component {
  static defaultProps = {
    totalItems: 0
  }

  constructor(props) {
    super(props);
    this.onMount = this.onMount.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.onMount();
  }

  onMount() {
    const container = document.getElementsByClassName("container-items")[0];
    const skeletonElement = container.getElementsByClassName("ant-skeleton-element");

    for (let item of skeletonElement) {
      item.className += [item.className, defaultClasses].join(' ')

      const skeletonButton = item.getElementsByClassName("ant-skeleton-button")[0];
      skeletonButton.classList.add('w-100')
      skeletonButton.style = "height: 59px;border-radius:6px";
    }
  }

  // Renderizar testimonio
  renderItems(totalItems) {
    // Generar un array con 'totalItems' de elementos
    const items = generateArray(totalItems)

    return items.map((_, i) => <Skeleton.Button key={i} active />);
  }

  render() {
    return (
      <Row
        justify="center"
        gutter={[0, 15]}
        className='container-items'
      >
        {this.renderItems(this.props.totalItems)}
      </Row>
      )
  }
}
