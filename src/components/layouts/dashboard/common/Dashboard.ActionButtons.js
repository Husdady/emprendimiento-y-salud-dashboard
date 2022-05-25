// React
import { Component } from "react";

// Components
import { Button } from "@common";

// Librarys
import { connect } from "react-redux";

// Reducers
import { getThemeState } from "@redux/reducers/theme";

// Utils
import { classnames } from "@utils/Helper";
import { isObject, isArray, isFunction } from "@utils/Validations";

class ActionButtons extends Component {
  static defaultProps = {
    buttons: [],
  };

  shouldComponentUpdate() {
    return false;
  }

  renderButtons() {
    const { buttons } = this.props;
    if (!buttons || !isArray(buttons)) return;

    return buttons.map((button, i) => (
      <Button
        key={i}
        icon={button.icon}
        title={button.title}
        style={button.style}
        className="action-button ms-2 rounded-3"
        titleStyle={{ marginLeft: 10 }}
        textColor={button.style?.color}
        backgroundColor={button.color}
        onClick={button?.onAction}
        loading={button.loading}
      />
    ));
  }

  render() {
    const classes = classnames([
      'd-flex container-action-buttons justify-content-end my-3',
      this.props.className
    ])

    return (
      <div style={this.props.containerStyle} className={classes}>
        {this.renderButtons.bind(this)()}
      </div>
    );
  }
}

export default connect(getThemeState)(ActionButtons);
