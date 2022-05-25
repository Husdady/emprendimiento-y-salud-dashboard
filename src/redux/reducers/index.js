// Librarys
import { combineReducers } from "redux";

// Reducers
import theme from "./theme";
import authentication from "./auth"
import manageTestimonials from './testimonials'
import manageUsers from "./users";
import manageUsersFilters from "./filters/users";
import manageProducts from "./products";
import manageProductsFilters from "./filters/products";

// Exportar reducers
export default combineReducers({
  theme: theme,
  authentication: authentication,
  manageTestimonials: manageTestimonials,
  manageUsers: manageUsers,
  manageProducts: manageProducts,
  manageUsersFilters: manageUsersFilters,
  manageProductsFilters: manageProductsFilters,
});
