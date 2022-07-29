// React
import { Component, Fragment, createRef } from "react";

// Librarys
import { message } from "antd";
import { connect } from "react-redux";
import Image from 'next/image'
import { withRouter } from "next/router";

// Components
import Filters from "@layouts/dashboard/common/Dashboard.Filters";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";
import DashboardModal from "@layouts/dashboard/common/Dashboard.Modal";
import ActionButtons from "@layouts/dashboard/common/Dashboard.ActionButtons";
import ProductTable from "@layouts/dashboard/product/Product.Table";

// Actions
import getProductsActions from "@redux/actions/products";
import getProductsFiltersActions, { config } from "@redux/actions/filters/products";

// Utils
import { isEmptyArray } from "@utils/Validations";
import { getProductsSortOptions } from '@utils/Options'
import {
  onAction,
  createState,
  createDispatch,
  getSomeFieldsFromArrayObject
} from "@utils/Helper";

class TableFilters extends Component {
  constructor(props) {
    super(props);
    this.refModal = createRef();
    this.isSeytuCompany = this.props.company === 'seytu'
    this.types = config[this.props.company].products.types;

    this.actionButtons = [
      {
        icon: "plus",
        title: "Agregar producto",
        color: this.isSeytuCompany ? "var(--bg-darkred)" : "var(--bg-darkpurple)",
        onAction: () => {
          this.props.router.push(`/dashboard/products/${this.props.company}/add`);
        },
      },
      {
        icon: "edit",
        title: "Editar producto",
        color: this.isSeytuCompany ? "#e3b9b9" : "#dab9e3",
        style: { color: "var(--bg-dark)", fontWeight: "bold" },
        onAction: this.onEditProduct.bind(this),
      },
      {
        icon: "trash-alt",
        title: "Eliminar producto",
        color: "var(--bg-red)",
        onAction: this.onDeleteProduct.bind(this)
      },
      {
        icon: "redo-alt",
        title: "Actualizar datos",
        color: "var(--bg-blue)",
        onAction: this.onRefreshProducts.bind(this),
        loading: {
          style: { width: 118, color: "var(--bg-white)" },
        },
      },
    ];

    this.options = getProductsSortOptions({ types: this.types }) 

    this.searchOptions = {
      onSearch: this.onSearch,
      value: this.props[this.props.company].searchValue,
      placeholder: "Busca un producto...",
    }

    this.selectOptions = {
      onChange: this.onSortProducts,
      sortByDate: {
        items: this.options.date,
        defaultValue: this.props[this.props.company].sortKey.date,
      },
      sortDefault: {
        items: this.options.default,
        placeholder: "Ordenar productos por",
        defaultValue: this.props[this.props.company].sortKey.default,
      },
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  // Ir a la sección de editar producto
  goToEditProduct = (productId) => {
    const { company } = this.props
    return this.props.router.push(`/dashboard/products/${company}/edit/${productId}`)
  }

  // Evento buscar productos
  onSearch = (value) => {
    const { company, dispatch } = this.props
    dispatch[company].searchProducts(value)
  }

  // Evento ordenar productos
  onSortProducts = (sortBy) => {
    const { company, dispatch } = this.props
    dispatch[company].sortProductsBy(sortBy)
  }

  // Editar producto
  onEditProduct() {
    const { company } = this.props
    const { products } = this.props[company]

    return onAction({
      data: products,
      onDataItem: (item) => this.goToEditProduct(item._id),
      emptyMessage: "No hay productos disponibles para editar",
      onDataMultipleItems: (items) => {
        return this.onShowListProductsInModal({
          items: items,
          extraContent: this.renderEditIcon,
        });
      },
    });
  }

  // Eliminar un producto 
  onDeleteProduct() {
    const { company } = this.props
    const { products } = this.props[company]
    
    return onAction({
      data: products,
      emptyMessage: "No hay productos disponibles para eliminar",
      onDataItem: (item) => this.props.deleteProduct(item),
      onDataMultipleItems: (items) => {
        return this.onShowListProductsInModal({
          items: items,
          extraContent: this.renderTrashIcon
        });
      },
    });
  }

  // Refrescar productos 
  async onRefreshProducts({ showLoading, hideLoading }) {
    const { products, getPaginatedProducts } = this.props;

    const emptyProducts = isEmptyArray(products)

    // Los productos están vacíos
    if (emptyProducts) {
      await message.warning("No existen productos para actualizar sus datos", 6)
      return null;
    }

    try {
      showLoading(); // Mostrar loading en botón 'Actualizar datos'
      await getPaginatedProducts({ skip: 0, resetTableIndex: true });
      message.info("Se han actualizado los datos", 4)
    } catch (err) {
      message.error("A ocurrido un error al actualizar los datos");
    }

    hideLoading(); // Ocultar loading en botón 'Actualizar datos'
  }

  // Mostrar lista de productos en modal
  onShowListProductsInModal = ({ items, extraContent }) => {
    const products = getSomeFieldsFromArrayObject(items, (product) => ({
      _id: product._id,
      title: product.name,
      containerStyle: { padding: ".75em 1.5em" },
      image: <Image width="80" height="80" title={product.name} src={product?.defaultImage?.url}  />,
      ...extraContent(product),
    }));

    // Mostrar modal
    this.refModal.current?.show({ items: products });
  }

  // Renderizar icono 'editar' en modal que muestra la lista de productos
  renderEditIcon = (product) => {
    return {
      icon: {
        name: "edit",
        color: "var(--bg-darkpurple)",
        onClick: () => this.goToEditProduct(product._id),
      },
    };
  }

  // Renderizar icono 'eliminar' en modal que muestra la lista de productos
  renderTrashIcon = (product) => {
    return {
      icon: {
        name: "trash-alt",
        color: "var(--bg-red)",
        onClick: () => {
          return this.props.deleteProduct(product, {
            modal: this.refModal?.current,
          });
        },
      },
    };
  }

  // Renderizar texto en tooltip de filtros de productos 
  renderHelpTitle() {
    return (
      <Fragment>
        <span>Aquí podrás encontrar varios botones, a continuación una breve explicación sobre estos.</span>
        <br /><br />
        <span><b>Agregar producto:</b> para crear un nuevo producto .</span>
        <br /><span><b>Editar producto:</b> para editar la información de un producto .</span>
        <br /><span><b>Eliminar producto:</b> para eliminar definitivamente un producto .</span>
        <br /><span><b>Actualizar datos:</b> para actualizar los datos que se muestran en la tabla.</span>
        <br /><br /><span>Más abajo encontrarás un buscador con el cuál podrás buscar productos  por su nombre y a su costado "selectores", para poder ordernar los productos dependiendo de cada opción.</span>
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        {/* Filtros de productos  */}
        <Filters
          title="Filtrar productos por:"
          helpTitle={this.renderHelpTitle}
          searchOptions={this.searchOptions}
          selectOptions={this.selectOptions}
        >
          {/* Botones de acción en usuarios */}
          <ActionButtons
            buttons={this.actionButtons}
            title="Acciones principales:"
            wrapTitleIcon={["far", "hand-pointer"]}
          />
        </Filters>

        {/* Total de productos  */}
        <WrapTitle
          icon="apple-alt"
          className="mb-3"
          title="Total de productos"
          helpTitle="En la siguiente tabla aparecerán los productos que has creado, puedes administrar a los productos mientras tengas los permisos necesarios, de lo contrario se te negará el acceso."
        />

        {/* Tabla de productos  */}
        <ProductTable
          company={this.props.company}
          onEdit={this.goToEditProduct}
          emptyMessage="No existen productos..."
        />

        {/* Modal que muestra los productos */}
        <DashboardModal ref={this.refModal} title="Selecciona un producto" />
      </Fragment>
    );
  }
}

// Obtener estado de productos y sus filtros
function mapStateToProps({ manageProducts, manageProductsFilters }) {
  const { seytu, omnilife } = manageProductsFilters;

  // Añadir los productos a 'seytu'
  Object.assign(seytu.products, {
    items: manageProducts.seytu.products
  })

  // Añadir los productos a 'omnilife'
  Object.assign(omnilife.products, {
    items: manageProducts.omnilife.products
  })

  return createState({
    objects: [
      { name: "seytu", value: seytu.products },
      { name: "omnilife", value: omnilife.products }
    ],
    state: (obj) => ({
      products: obj.items,
      sortKey: obj.sortKey,
      searchValue: obj.searchValue,
    })
  });
}

// Obtener acciones de productos y sus filtros
function mapDispatchToProps(dispatch) {
  const productsActions = getProductsActions(dispatch);
  const productsFiltersActions = getProductsFiltersActions(dispatch);

  return {
    dispatch: createDispatch({
      objects: ["seytu", "omnilife"],
      methods: (obj) => ({
        searchProducts: productsFiltersActions[obj].searchProducts,
        sortProductsBy: productsFiltersActions[obj].sortProductsBy,
        deleteProduct: productsActions[obj].deleteProduct,
        getPaginatedProducts: productsActions[obj].getPaginatedProducts,
      })
    })
  }
}

const TableFiltersWithRouter = withRouter(TableFilters)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableFiltersWithRouter);
