// Authentication
import signIn from './auth/signIn'
import signOut from './auth/signOut'
import updateMyPersonalInformation from "./auth/updateMyPersonalInformation";

// Testimonials
import getTestimonials from './testimonials/getTestimonials'
import deleteTestimony from './testimonials/deleteTestimony'

// Roles
import updateRole from "./roles/updateRole";
import createRole from "./roles/createRole";
import deleteRole from "./roles/deleteRole";
import getRoles from "./roles/getRoles";

// Users
import deleteUser from "./users/deleteUser";
import searchUsers from "./users/searchUsers";
import sortUsersBy from "./users/sortUsersBy";
import getPaginatedUsers from "./users/getPaginatedUsers";

// Deleted Users
import restoreUser from "./deletedUsers/restoreUser";
import deleteUserAccount from "./deletedUsers/deleteUserAccount";
import searchDeletedUsers from "./deletedUsers/searchDeletedUsers";
import sortDeletedUsersBy from "./deletedUsers/sortDeletedUsersBy";
import getPaginatedDeletedUsers from "./deletedUsers/getPaginatedDeletedUsers";

// Products
import deleteProduct from "./products/deleteProduct";
import sortProductsBy from "./products/sortProductsBy";
import searchProducts from "./products/searchProducts";
import getPaginatedProducts from "./products/getPaginatedProducts";

// Product Categories
import createCategory from "./categories/createCategory";
import editCategory from "./categories/editCategory";
import deleteCategory from "./categories/deleteCategory";
import getCategories from "./categories/getCategories";

export {
  // Authentication
  signIn,
  signOut,
  updateMyPersonalInformation,

  // Testimonials
  getTestimonials,
  deleteTestimony, 

  // Roles
  createRole,
  updateRole,
  deleteRole,
  getRoles,

  // Users
  deleteUser,
  searchUsers,
  sortUsersBy,
  getPaginatedUsers,

  // Deleted Users
  restoreUser,
  deleteUserAccount,
  searchDeletedUsers,
  sortDeletedUsersBy,
  getPaginatedDeletedUsers,
  
  // Products
  deleteProduct,
  sortProductsBy,
  searchProducts,
  getPaginatedProducts,

  // Product Categories
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
};
