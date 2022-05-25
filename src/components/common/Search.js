// React
import { Component } from "react";

// Librarys
import { Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Search extends Component {
  static defaultProps = {
    defaultValue: "",
    onSearch: function () {},
    placeholder: "Busca algo...",
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue
    }

    this.styles = {
      container: {
        width: '59%',
        ...this.props.containerStyle,
      },
    };
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.value !== nextState.value;
  }

  // Setear valor de input
  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  // Evento que se dispara cuando se presiona la tecla "Enter"
  onPressEnter(e) {
    if (e.key !== "Enter") return;

    this.props.onSearch(this.state.value);
  }

  render() {
    return (
      <div style={this.styles.container} className='d-flex align-items-center search'>
        <Input
          allowClear
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.onPressEnter.bind(this)}
          placeholder={this.props.placeholder}
          addonBefore={
            <FontAwesomeIcon
              icon="search"
              className="pointer scale-button"
              onClick={() => this.props.onSearch(this.state.value)}
            />
          }
        />
      </div>
    );
  }
}
