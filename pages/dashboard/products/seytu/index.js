// React
import { Component, Fragment } from "react";

// Components
import ProductsCategories from "@layouts/dashboard/products/Products.Categories";
import ProductsTableFilters from "@layouts/dashboard/products/Products.TableFilters";

// Containers
import DashboardContainer from "@containers/DashboardContainer";

// Headers
import { ProductsHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

const breadcrumbItems = [
  { path: "/dashboard", title: "Dashboard" },
  { title: "Administrar los productos Seytú" }
];

export { getServerSideProps }
export default class Products extends Component {
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
          <ProductsCategories company="seytu" defaultColor="var(--bg-darkred)" /> 

          {/* Tabla de productos */}
          <ProductsTableFilters company="seytu" />
        </DashboardContainer>
      </Fragment>
    );
  }
}
