// React
import { Component, Fragment } from "react";

// Components
import Container from "@layouts/dashboard/common/Dashboard.Container";
import ProductsTableFilters from "@layouts/dashboard/products/Products.TableFilters";
import ProductsCategories from "@layouts/dashboard/products/Products.Categories";

// Headers
import { ProductsHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

const breadcrumbItems = [
  { path: "/dashboard", title: "Dashboard" },
  { title: "Administrar los productos Omnilife" }
];

export { getServerSideProps }
export default class OmnilifeProductsPage extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <ProductsHeader />

        <Container breadcrumbItems={breadcrumbItems}>
          {/* Categorías de productos */}
          <ProductsCategories company="omnilife" defaultColor="var(--bg-darkpurple)" />

          {/* Tabla de productos */}
          <ProductsTableFilters  company="omnilife" />
        </Container>
      </Fragment>
    );
  }
}
