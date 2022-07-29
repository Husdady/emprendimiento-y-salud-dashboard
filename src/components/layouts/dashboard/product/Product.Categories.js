// React
import { Component } from "react";

// Components
import DashboardItems from "@layouts/dashboard/common/Dashboard.Items";

// Librarys
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import getProductsActions from "@redux/actions/products"; 

// Reducers
import { getProductsState } from "@redux/reducers/products";

// Utils
import { createState, createDispatch } from '@utils/Helper'

class Categories extends Component {
  constructor(props) {
    super(props);
    this.customAvatar = (
      <FontAwesomeIcon
        size="lg"
        icon="tag"
        color={this.props.avatarColor}
      />
    )

    this.emptyProps = {
      ...this.props.empty,
      title: "No hay categorías para mostrar...",
    };
  }

  shouldComponentUpdate(nextProps) {
    const { company } = this.props
    const prevData = this.props[company]
    const nextData = nextProps[company]

    return (
      prevData.categories !== nextData.categories ||
      prevData.loadingCategories !== nextData.loadingCategories
    );
  }

  componentDidMount() {
    this.onMount()
  }

  onMount = () => {
    const { company, dispatch } = this.props
    dispatch[company].getCategories()
  }  

  render() {
    const { company, dispatch } = this.props
    const { editCategory, deleteCategory } = dispatch[company]
    const { categories, totalCategories, loadingCategories } = this.props[company];

    return (
      <DashboardItems
        data={categories}
        loading={loadingCategories}
        totalItems={totalCategories}
        empty={this.emptyProps}
        styles={this.props.styles}
        customAvatar={this.customAvatar}
        onEdit={editCategory}
        onDelete={deleteCategory}
        customFields={{ title: "name" }}
        containerStyle={{ marginBottom: "2.5em" }}
      />
    );
  }
}

// Obtener estado de categorías
function mapStateToProps({ manageProducts }) {
  const { seytu, omnilife } = getProductsState({ manageProducts });

  return createState({
    objects: [
      { name: "seytu", value: seytu },
      { name: "omnilife", value: omnilife }
    ],
    state: (obj) => ({
      categories: obj.categories,
      loadingCategories: obj.loadingCategories,
      totalCategories: obj.totalCategories,
    })
  });
}

// Obtener acciones de categorías
function mapDispatchToProps(dispatch) {
  const actions = getProductsActions(dispatch);

  return {
    dispatch: createDispatch({
      objects: ["seytu", "omnilife"],
      methods: (obj) => ({
        getCategories: actions[obj].getCategories,
        editCategory: actions[obj].editCategory,
        deleteCategory: actions[obj].deleteCategory,
      })
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
