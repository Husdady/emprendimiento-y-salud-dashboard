// React
import { Component, Fragment } from "react";

// Containers
import DashboardContainer from "@containers/DashboardContainer";
import ProductsCategories from "@containers/products/Products.Categories";
import ProductsTableFilters from "@containers/products/Products.TableFilters";

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

        <DashboardContainer breadcrumbItems={breadcrumbItems}>
          {/* Categorías de productos */}
          <ProductsCategories company="omnilife" defaultColor="var(--bg-darkpurple)" />

          {/* Tabla de productos */}
          <ProductsTableFilters  company="omnilife" />
        </DashboardContainer>
      </Fragment>
    );
  }
}
