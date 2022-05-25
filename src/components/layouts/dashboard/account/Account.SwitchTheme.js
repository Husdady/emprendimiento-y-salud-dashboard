// React
import { Component } from "react";

// Components
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Librarys
import { Switch } from "antd";
import { connect } from "react-redux";

// Actions
import setTheme from '@redux/actions/theme'

// Reducers
import { getThemeState } from '@redux/reducers/theme'

class SwitchTheme extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.theme !== nextProps.theme
  }

  // Cambiar de tema oscuro a claro y visceversa
  handleChangeTheme(isChecked) {
    if (isChecked) {
      return this.props.changeToDarkTheme();
    }

    return this.props.changeToLightTheme();
  }

  render() {
    const isChecked = this.props.theme === "dark"

    return (
      <WrapTitle
        icon='palette'
        paddingY="py-3"
        className="switch-theme"
        title="Elegir el tema actual"
      >
        <Switch onChange={this.handleChangeTheme.bind(this)} defaultChecked={isChecked} />
      </WrapTitle>
    );
  }
}

export default connect(getThemeState, setTheme)(SwitchTheme)
