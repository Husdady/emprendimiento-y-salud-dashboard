// React
import { Component, Fragment } from "react";

// Components
import Empty from "./Empty"

// Librarys
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Developing extends Component {
  static defaultProps = {
    width: 400,
    height: 400,
    titleStyle: { fontSize: '1.25em' }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <Empty
        {...this.props}
        withCustomMargin
        image={this.props.image}
        titleStyle={this.props.titleStyle}
        title={
          <Fragment>
            <FontAwesomeIcon icon="tools" className="me-2" />
            <span>Actualmente esta sección se encuentra bajo desarrollo...</span>
          </Fragment>
        }
      />
    );
  }
}
