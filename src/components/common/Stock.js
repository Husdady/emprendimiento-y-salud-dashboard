// React
import { Component } from "react";

// Components
import { Help, Button } from "@common";

// Utils
import { isFunction } from "@utils/Validations";

class Stock extends Component {
  static defaultProps = {
    limit: null,
    defaultValue: 0,
  }

  constructor(props) {
    super(props);
    this.increaseStock = this.increaseStock.bind(this);
    this.decreaseStock = this.decreaseStock.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.disabled) return false;

    return this.props.defaultValue !== nextProps.defaultValue
  }

  // Aumentar stock
  increaseStock() {
    const { limit, defaultValue, onIncrease } = this.props;

    if (!limit) return;

    if (defaultValue < limit) {
      isFunction(onIncrease) && onIncrease();
    }
  }

  // Decrementar stock
  decreaseStock() {
    const { defaultValue, onDecrease } = this.props;

    if (defaultValue > 0) {
      isFunction(onDecrease) && onDecrease();
    }
  }

  render() {
    return (
      <div className="flex j-center align-items-center">
        {/* Botón incrementar stock */}
        <Button
          icon="plus"
          className="increase"
          onClick={this.increaseStock}
          attributes={{ type: "button" }}
        />

        {/* Stock */}
        <div className="stock">{this.props.defaultValue}</div>

        {/* Botón decrementar stock */}
        <Button
          icon="minus"
          className="decrease"
          onClick={this.decreaseStock}
          attributes={{ type: "button" }}
        />
      </div>
    );
  }
}

export default Stock;
