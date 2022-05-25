// React
import React, { Component } from "react";

// Components
import Wrapper from "./Dashboard.Wrapper";

// Librarys
import Link from "next/link";
import { Breadcrumb } from "antd";

// Utils
import { isArray } from "@utils/Validations"

export default class BreadCrumbs extends Component {
  static defaultProps = {
    items: [],
  };

  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this)
    this.renderBreadcrumbItem = this.renderBreadcrumbItem.bind(this)
  }

  shouldComponentUpdate() {
    return false
  }

  // Renderizar breadcrumb
  renderBreadcrumbItem(item) {
    if (item.path) {
      return (
        <Link href={item.path}>{item.title}</Link>
      )
    }

    return item.title
  }

  // Renderizar todos los breadcrumbs
  renderItems(items) {
    return isArray(items) && items.map((item, i) => (
      <Breadcrumb.Item key={i}>
        {this.renderBreadcrumbItem(item)}
      </Breadcrumb.Item>
    ));
  }

  render() {
    const items = this.renderItems(this.props.items)
    return (
      <Wrapper className="container-breadcrumb noto-sans">
        <Breadcrumb>{items}</Breadcrumb>
      </Wrapper>
    );
  }
}
