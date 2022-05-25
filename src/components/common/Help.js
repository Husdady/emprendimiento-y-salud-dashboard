// React
import { Component } from "react";

// Common
import { Icon } from "@common";

// Librarys
import { Tooltip } from "antd";

// Utils
import { classnames } from '@utils/Helper'

export default class Help extends Component {
  static defaultProps = {
    style: {},
    size: "lg",
    title: "Ingresa un titulo",
    tooltipSettings: {
      placement: "left",
    },
  };

  constructor(props) {
    super(props)
    this.helpClasses = classnames(['user-select-none', this.props.className])

    this.state = {
      visible: false,
    };
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.visible !== nextState.visible
  }

  showTooltip() {
    this.setState(({ visible }) => ({ visible: !visible }));
  }

  render() {
    // Color de fondo de Tooltip
    const tooltipBackgroundColor = this.props.backgroundColor
    
    // Color de texto de Tooltip
    const tooltipColor = {
      color: this.props.textColor,
    };

    return (
      <Tooltip
        {...this.props.tooltipSettings}
        title={this.props.title}
        visible={this.state.visible}
        color={tooltipBackgroundColor}
        overlayInnerStyle={tooltipColor}
      >
        <Icon
          name="question-circle"
          size={this.props.size}
          color={this.props.color}
          className={this.helpClasses}
          containerStyle={this.props.style}
          onClick={this.showTooltip.bind(this)}
        />
      </Tooltip>
    );
  }
}
