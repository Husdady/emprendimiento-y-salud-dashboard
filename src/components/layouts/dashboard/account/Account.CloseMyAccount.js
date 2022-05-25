// React
import { Component } from "react";

// Components
import { Button } from "@common";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// API
import { closeMyAccount } from "@api/auth";

export default class CloseMyAccount extends Component {
  constructor(props) {
    super(props)
    this.handleCloseAccount = this.handleCloseAccount.bind(this)

    this.extraData = {
      token: this.props.user.token,
    }
  }

  shouldComponentUpdate() {
    return false
  }

  // Cerrar cuenta
  handleCloseAccount() {
    closeMyAccount(this.props.user, this.extraData)
  }

  render() {
    return (
      <WrapTitle
        icon='ban'
        paddingY={null}
        title="Cerrar mi cuenta personal"
        className="close-my-account"
      >
        <Button
          icon="trash-alt"
          title="Eliminar mi cuenta"
          textColor="var(--bg-white)"
          backgroundColor="var(--bg-red)"
          className="scale rounded py-2 px-4"
          onClick={this.handleCloseAccount}
        />
      </WrapTitle>
    );
  }
}
