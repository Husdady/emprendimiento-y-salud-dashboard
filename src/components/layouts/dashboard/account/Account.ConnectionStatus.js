// React
import { Component } from "react";

// Components
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

export default class ConnectionStatus extends Component {
  render() {
    return (
      <WrapTitle
        icon='signal'
        paddingY={null}
        title="Estado actual de conexión"
        className="d-flex align-items-center connection-status"
      >
        <button className="border-0 rounded-3 pe-none py-2 px-3">
          <span className="circle d-inline-block me-2 rounded-circle" />
          <span className="text">En línea</span>
        </button>
      </WrapTitle>
    );
  }
}