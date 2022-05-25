// React
import { Component } from "react";

// Librarys
import { Select } from "antd";
import { connect } from "react-redux";

// Actions
import getProductsActions from "@redux/actions/products";

// Utils
import { isArray } from '@utils/Validations'
import { createState, createDispatch } from '@utils/Helper'

const { Option } = Select;

class SelectCategory extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value
  }

  componentDidMount() {
    this.onMount()
  }

  onMount = () => {
    const { company, dispatch } = this.props
    dispatch[company].getCategories()
  }

  // Renderizar categorías
  renderCategories = () => {
    const { company } = this.props
    const { categories } = this.props[company]

    const invalidCategories = !isArray(categories)

    // Comprobar si las categorías no son un arreglo, finalizar función
    if (invalidCategories) return;

    return categories.map((category) => (
      <Option value={category._id} key={category._id}>{category.name}</Option>
    ));
  }

  render() {
    return (
      <Select
        showArrow
        size="middle"
        mode="multiple"
        value={this.props.value}
        onChange={this.props.onChange}
        className="product-categories w-100"
        placeholder="Selecciona una categoría"
      >
        {this.renderCategories()}
      </Select>
    );
  }
}

// Obtener estado de las categorías
function mapStateToProps({ manageProducts }) {
  return createState({
    objects: [
      { name: "seytu", value: manageProducts.seytu },
      { name: "omnilife", value: manageProducts.omnilife }
    ],
    state: (obj) => ({
      categories: obj.categories,
    })
  });
}

// Obtener acción para obtener las categorías disponibles
function mapDispatchToProps(dispatch) {
  const actions = getProductsActions(dispatch)

  return {
    dispatch: createDispatch({
      objects: ["seytu", "omnilife"],
      methods: (obj) => ({
        getCategories: actions[obj].getCategories,
      })
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);
