// React
import { Component, Fragment } from "react";

// Components
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";
import ActionButtons from "@layouts/dashboard/common/Dashboard.ActionButtons";
import ProductCategories from "@layouts/dashboard/product/Product.Categories";

// Librarys
import { message } from "antd";
import { connect } from "react-redux";

// Actions
import getProductsActions from "@redux/actions/products";

// Utils
import { isEmptyArray } from "@utils/Validations";
import { createState, createDispatch } from "@utils/Helper";

const emptyOmnilifeCategories = require("@assets/img/categories/empty-omnilife-categories.webp").default.src
const emptySeytuCategories = require("@assets/img/categories/empty-omnilife-categories.webp").default.src

class ProductsCategories extends Component {
  constructor(props) {
    super(props);
    this.empty = {
      width: 300,
      height: 300,
      image: this.props.company === 'seytu' ? emptySeytuCategories : emptyOmnilifeCategories,
    };

    this.itemsStyles = {
      icons: {
        edit: { color: this.props.defaultColor },
      },
    };

    this.actionButtons = [
      {
        icon: "plus",
        title: "Nueva categoría",
        color: "var(--bg-dark-modal)",
        onAction: this.onAddCategory,
      },
      {
        icon: "redo-alt",
        title: "Actualizar datos",
        color: "var(--bg-blue)",
        onAction: this.onRefreshCategories,
        loading: {
          style: { width: 118, color: "var(--bg-white)" },
        },
      },
    ];
  }

  shouldComponentUpdate() {
    return false;
  }

  // Agregar nueva categoría
  onAddCategory = () => {
    const { company, dispatch } = this.props;
    dispatch[company].createCategory()
  }

  // Refrescar categorías
  onRefreshCategories = async ({ showLoading, hideLoading }) => {
  	const { company, dispatch } = this.props;
    const { categories } = this.props[company]

    const emptyCategories = isEmptyArray(categories)

    // Categorías vacías
    if (emptyCategories) {
      const txt = "No existen categorías de los productos para actualizar";
      await message.warning(txt, 9);
      return null;
    }

    try {
      showLoading();
      await dispatch[company].getCategories();
      message.info("Se han actualizado los datos", 4);
    } catch (err) {
      message.error("A ocurrido un error al actualizar los datos");
    }

    hideLoading();
  }

  render() {
    return (
      <Fragment>
        {/* Acerca de las categorías */}
        <WrapTitle
          icon="tags"
          title="Categorías"
          helpTitle="A continuación se mostrarán las categorías de los productos, podrás crear, actualizar y eliminar categorías mientras tengas los permisos necesarios"
        />

        {/* Botones de acción */}
        <ActionButtons
          title="Categorías"
          wrapTitleIcon="user-tag"
          buttons={this.actionButtons}
          helpTitle="En esta sección podrás crear nuevas categorías para los productos. Recuerda crear categorías, de acuerdo al tipo de producto que estás creando, debes hacer una relación categoría-producto."
          containerStyle={{ justifyContent: "flex-end", margin: "24px 0px" }}
        />

        {/* Categorías */}
        <ProductCategories
          empty={this.empty}
          styles={this.itemsStyles}
          company={this.props.company}
          avatarColor={this.props.defaultColor}
        />
      </Fragment>
    );
  }
}

// Obtener estado de categorías
function mapStateToProps({ manageProducts }) {
  const { seytu, omnilife } = manageProducts;

  return createState({
    objects: [
      { name: "seytu", value: seytu },
      { name: "omnilife", value: omnilife }
    ],
    state: (obj) => ({
      categories: obj.categories,
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
        createCategory: actions[obj].createCategory,
      })
    })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsCategories);
