// React
import { Component, Fragment } from "react";

// Components
import { Search, Select } from "@common";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

export default class Filters extends Component {
  static defaultProps = {
    data: [],
    icon: 'random',
    selectItems: [],
    onChangeOption: function () {},
    searchOptions: {},
    selectOptions: {
      sortByDate: {},
      sortDefault: {}
    },
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { icon, title, helpTitle, searchOptions, selectOptions } = this.props;

    return (
      <Fragment>
        <WrapTitle icon={icon} title={title} helpTitle={helpTitle} />

        {this.props.children}

        <div className="d-flex flex-wrap flex-md-nowrap justify-content-around" style={this.props.containerStyle}>
          {/* Buscador */}
          <Search
            defaultValue={this.props.searchOptions.value}
            onSearch={this.props.searchOptions.onSearch}
            placeholder={this.props.searchOptions.placeholder}
          />

          <div
            style={{ width: "40%" }}
            className='d-flex justify-content-between align-items-center container-orders-by'
          >
            {/* Ordenar por fecha */}
            <Select
              placeholder="Ordenar por fecha"
              className="d-flex align-items-center"
              onChange={selectOptions.onChange}
              items={selectOptions.sortByDate.items}
              defaultValue={selectOptions.sortByDate.defaultValue}
            />

            {/* Ordenar por otras opciones */}
            <Select
              className="d-flex align-items-center"
              onChange={selectOptions.onChange}
              items={selectOptions.sortDefault.items}
              placeholder={selectOptions.sortDefault.placeholder}
              defaultValue={selectOptions.sortDefault.defaultValue}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
