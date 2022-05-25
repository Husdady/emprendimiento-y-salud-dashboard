// React
import { Component, Fragment } from 'react';

// Components
import ProductForm from "@layouts/form/Product.Form";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Headers
import { CreateProductHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

// API
import { createNewProduct } from "@api/products";

export { getServerSideProps }
export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        path: "/dashboard/products/omnilife",
        title: "Administrar los productos Omnilife",
      },
      {
        title: "Crear nuevo producto",
      },
    ];
  }

  // Crear nuevo producto Omnilife
  onCreateNewOmnilifeProduct({ values, resetForm, extraData }) {
    Object.assign(extraData, {
      company: "omnilife",
      resetForm: resetForm
    })

    createNewProduct(values, extraData);
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <CreateProductHeader />
      
        <Container breadcrumbItems={this.breadcrumbItems}>
          {/* Información del producto */}
          <WrapTitle
            icon="apple-alt"
            title="Información del nuevo producto"
            helpTitle="En esta sección podrás crear un nuevo producto. Necesitas proveer un título, descripción, sus beneficios y una imagen, para que así los clientes tengan una clara información del producto que estás creando."
          />

          {/* Formulario para crear un producto */}
          <ProductForm
            company="omnilife"
            saveButtonTitle="Guardar producto"
            onSubmit={this.onCreateNewOmnilifeProduct}
          />
        </Container>
      </Fragment>
    );
  }
}
