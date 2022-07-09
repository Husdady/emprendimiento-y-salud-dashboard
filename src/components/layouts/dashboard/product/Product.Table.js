// React
import { Component, Fragment } from "react";

// Components
import Skeleton from "@layouts/skeletons/Skeleton.Table";
import Table, { ActionButton } from "@layouts/dashboard/common/Dashboard.Table";

// Librarys
import { Tag } from "antd";
import Image from 'next/image'
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import getProductsActions from "@redux/actions/products";

// Utils
import { truncate, formatDate, createState, createDispatch } from "@utils/Helper";

class ProductsTable extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      columns: {
        date: {
          width: 280,
        },
      },
    };

    this.editButton = {
      name: "edit",
      color: "var(--bg-blue)",
      title: "Editar producto",
    }

    this.deleteButton = {
      name: "trash-alt",
      color: "var(--bg-red)",
      title: "Borrar producto",
    }

    this.fields = [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        render: this.renderIndex,
      },
      {
        title: "Nombre del producto",
        dataIndex: "name",
        key: "name",
        render: this.renderProductName.bind(this),
      },
      {
        title: "Descripción del Producto",
        dataIndex: "description",
        key: "description",
        render: this.renderProductDescription,
      },
      {
        title: "Categorías",
        dataIndex: "categories",
        key: "categories",
        render: this.renderProductCategories,
      },
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
        render: this.renderProductStock,
      },
      {
        title: "Fecha de creación",
        dataIndex: "createdAt",
        key: "createdAt",
        render: this.renderDate.bind(this),
      },
      {
        title: "Fecha de actualización",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: this.renderDate.bind(this),
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        key: "actions",
        render: this.renderActionButtons.bind(this),
      },
    ];
    this.getPaginatedProducts = this.getPaginatedProducts.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { company } = this.props
    const prevData = this.props[company]
    const nextData = nextProps[company]

    return (
      prevData.products !== nextData.products ||
      prevData.loadingProducts !== nextData.loadingProducts
    );
  }

  componentDidMount() {
    this.getPaginatedProducts()
  }

  // Obtener usuarios paginados
  getPaginatedProducts(i, setCurrentPage) {
    const { company, dispatch } = this.props
    const config = {
      skip: 0,
    }

    if (i) {
      Object.assign(config, {
        skip: i,
        setCurrentPage: setCurrentPage,
      });
    }

    dispatch[company].getPaginatedProducts(config);
  }

  // Renderizar índice de tabla
  renderIndex(i) {
    return <b>#{i}</b>
  }

  // Renderizar nombre del producto
  renderProductName(name, product) {
    return (
      <div className="field-product-name d-flex align-items-center">
        {/* Imagen del producto */}
        <figure style={{ backgroundColor: "var(--theme-opacity-100)" }}>
          <Image
            width="80"
            height="80"
            title={name}
            role="button"
            objectFit="contain"
            alt="product-image"
            src={product?.defaultImage?.url}
            blurDataURL={product?.defaultImage?.url}
            onClick={() => this.props.onEdit(product._id)}
          />
        </figure>

        {/* Nombre del producto */}
        <span className="title text-break">{name}</span>
      </div>
    );
  }

  // Renderizar descripción del producto
  renderProductDescription(description) {
    return <i className="description">{truncate(description)}</i>
  }

  // Renderizar categorías del producto
  renderProductCategories(categories) {
    return (
      <div className="container-categories">
        {categories.map((category) => (
          <Tag key={category._id} color="var(--bg-orange)">
            {/* Ícono de categoría */}
            <FontAwesomeIcon icon="tag" color="var(--bg-dark)" style={{ marginRight: 4 }} /> 

            {/* Nombre de categoría */}
            <b>{category.name}</b>
          </Tag>
        ))}
      </div>
    );
  }

  // Renderizar stock del producto
  renderProductStock(stock) {
    return (
      <Fragment>
        <b>{stock}</b>
        <span>&nbsp;unidades</span>
      </Fragment>
    )
  }

  // Renderizar fecha
  renderDate(date) {
    return <i style={this.styles.columns.date} className="d-block">{formatDate(date)}</i>;
  }

  // Renderizar botones de acción
  renderActionButtons(_, product) {
    return (
      <div className="d-flex flex-wrap justify-content-between">
        {/* Botón 'editar' */}
        <ActionButton
          icon={this.editButton}
          onAction={() => this.props.onEdit(product._id)}
        />

        {/* Botón 'borrar' */}
        <ActionButton
          icon={this.deleteButton}
          onAction={() => this.props.deleteProduct(product)}
        />
      </div>
    );
  }

  render() {
    const { company } = this.props
    const { limit, products, loadingProducts, totalProducts } = this.props[company];

    return (
      <Table
        fields={this.fields}
        data={products}
        loading={loadingProducts}
        emptyMessage={this.props.emptyMessage}
        skeletonFields={[25, 180, 240, 160, 140, 200, 200, 60]}
        skeletonItems={[18, 160, 200, 110, 100, 150, 150, 30]}
        pagination={{
          pageSize: limit,
          totalSize: totalProducts,
          onPaginate: this.getPaginatedProducts,
        }}
      />
    );
  }
}

// Obtener estado de productos y sus filtros
function mapStateToProps({ manageProducts, manageProductsFilters }) {
  return createState({
    objects: [
      { name: "seytu", value: manageProducts.seytu },
      { name: "omnilife", value: manageProducts.omnilife }
    ],
    state: (value, name) => ({
      products: value.products,
      totalProducts: value.totalProducts,
      loadingProducts: value.loadingProducts,
      limit: manageProductsFilters[name].products.limit,
    })
  });
}

// Obtener acciones de productos y sus filtros
function mapDispatchToProps(dispatch) {
  const actions = getProductsActions(dispatch);

  return {
    dispatch: createDispatch({
      objects: ["seytu", "omnilife"],
      methods: (obj) => ({
        deleteProduct: actions[obj].deleteProduct,
        getPaginatedProducts: actions[obj].getPaginatedProducts,
      })
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTable);
