// React
import { Component } from "react";

// Components
import ProductForm from "@layouts/form/Product.Form";
import Loading from "@layouts/loaders/Loading.Preload";
import Wrapper from '@layouts/dashboard/common/Dashboard.Wrapper'

// Librarys
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { getSession } from 'next-auth/react';

// API
import { updateProduct, getProductInformation } from "@api/products";

// Utils
import { isEmptyObject } from "@utils/Validations";

class EditProductForm extends Component {
  constructor(props) {
    super(props);
    this.onMount = this.onMount.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.setProductInformation = this.setProductInformation.bind(this);

    this.state = {
      product: {},
    };
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.product !== nextState.product;
  }

  componentDidMount() {
    this.onMount()
  }
  
   onMount() {
    const { company } = this.props
    const graphqlQuery = `${company}_product`

    // Obtener id del producto en los parámetros de la url
    const { productId } = this.props.router.query;

    // Obtener información del producto
    getProductInformation(productId, {
      graphqlQuery: graphqlQuery,
      setProductInformation: this.setProductInformation,
    });
  }

  // Setear información del producto
  setProductInformation(data) {
    this.setState({ product: data });
  }

  // Actualizar información del producto
  updateProduct({ values, extraData }) {
    updateProduct(values, extraData);
  }

  render() {
    const emptyProduct = isEmptyObject(this.state.product)

    // Si la información del producto se está cargando
    if (emptyProduct) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      )
    }

    return (
      <ProductForm
        company={this.props.company}
        onSubmit={this.updateProduct}
        defaultValues={this.state.product}
        saveButtonTitle="Actualizar producto"
      />
    );
  }
}

export default withRouter(EditProductForm);
