// React
import { Component, Fragment } from "react";

// Components
import EditProductForm from "@layouts/form/EditProduct.Form"
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Headers
import { EditProductHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

export { getServerSideProps }
export default class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        path: "/dashboard/products",
        title: "Administrar productos",
      },
      {
        title: "Editar producto",
      },
    ];
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <EditProductHeader />
      
        <Container breadcrumbItems={this.breadcrumbItems}>
          {/* Editar la información del producto */}
          <WrapTitle
            icon="user-edit"
            title="Editar la información del producto"
            helpTitle="En esta sección podrás editar la información de un producto. Debes tener en cuenta, que la nueva información que vas a establecer, debe ser válida, evita rellenar información falsa"
          />

          {/* Formulario para editar un producto */}
          <EditProductForm company="omnilife" />
        </Container>
      </Fragment>
    );
  }
}
