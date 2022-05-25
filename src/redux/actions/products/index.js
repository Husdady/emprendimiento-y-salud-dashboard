// Thunks
import {
  // Productos
  deleteProduct,
  getPaginatedProducts,

  // Categorías
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
} from "@redux/thunks";

// Types
import * as types from "@redux/types";

// Utils
import { createDispatch } from "@utils/Helper";

// Settings
const config = {
  seytu: {
    orders: {
      company: "seytu",
      graphqlQuery: "seytu_orders",
      types: {
        setOrders: types.SET_SEYTU_ORDERS,
        changeOrderStatus: types.CHANGE_SEYTU_ORDER_STATUS,
        saveExtraFilters: types.SAVE_SEYTU_EXTRA_FILTERS,
        showLoading: types.SHOW_LOADING_SEYTU_ORDERS,
        hideLoading: types.HIDE_LOADING_SEYTU_ORDERS,
      }
    },
    products: {
      company: "seytu",
      graphqlQuery: "seytu_products_in_table",
      types: {
        setProducts: types.SET_SEYTU_PRODUCTS,
        saveExtraFilters: types.SAVE_SEYTU_EXTRA_FILTERS,
        deleteProduct: types.DELETE_SEYTU_PRODUCT,
        showLoading: types.SHOW_LOADING_SEYTU_PRODUCTS,
        hideLoading: types.HIDE_LOADING_SEYTU_PRODUCTS,
      },
    },
    categories: {
      company: "seytu",
      graphqlQuery: "seytu_categories",
      types: {
        createCategory: types.ADD_SEYTU_CATEGORY,
        editCategory: types.EDIT_SEYTU_CATEGORY,
        deleteCategory: types.DELETE_SEYTU_CATEGORY,
        setCategories: types.SET_SEYTU_CATEGORIES,
        showLoading: types.SHOW_LOADING_SEYTU_CATEGORIES,
        hideLoading: types.HIDE_LOADING_SEYTU_CATEGORIES,
      },
    },
  },
  omnilife: {
    orders: {
      company: "omnilife",
      graphqlQuery: "omnilife_orders",
      types: {
        setOrders: types.SET_OMNILIFE_ORDERS,
        changeOrderStatus: types.CHANGE_OMNILIFE_ORDER_STATUS,
        saveExtraFilters: types.SAVE_OMNILIFE_EXTRA_FILTERS,
        showLoading: types.SHOW_LOADING_OMNILIFE_ORDERS,
        hideLoading: types.HIDE_LOADING_OMNILIFE_ORDERS,
      }
    },
    products: {
      company: "omnilife",
      graphqlQuery: "omnilife_products_in_table",
      types: {
        setProducts: types.SET_OMNILIFE_PRODUCTS,
        saveExtraFilters: types.SAVE_OMNILIFE_EXTRA_FILTERS,
        deleteProduct: types.DELETE_OMNILIFE_PRODUCT,
        showLoading: types.SHOW_LOADING_OMNILIFE_PRODUCTS,
        hideLoading: types.HIDE_LOADING_OMNILIFE_PRODUCTS,
      },
    },
    categories: {
      company: "omnilife",
      graphqlQuery: "omnilife_categories",
      types: {
        createCategory: types.ADD_OMNILIFE_CATEGORY,
        editCategory: types.EDIT_OMNILIFE_CATEGORY,
        deleteCategory: types.DELETE_OMNILIFE_CATEGORY,
        setCategories: types.SET_OMNILIFE_CATEGORIES,
        showLoading: types.SHOW_LOADING_OMNILIFE_CATEGORIES,
        hideLoading: types.HIDE_LOADING_OMNILIFE_CATEGORIES,
      },
    },
  },
};

export default function(dispatch) {
	return createDispatch({
    objects: ["seytu", "omnilife"],
    methods: (obj) => ({
      // Obtener pedidos realizados por el cliente
      getPaginatedOrders: function(extraData) {
        return dispatch(getPaginatedOrders({ ...extraData, ...config[obj].orders }));
      },

      // Confirmar un pedido de un producto
      confirmOrder: function(order, extraData) {
        return dispatch(confirmOrder({ order, ...extraData, ...config[obj].orders}));
      },

      // Obtener productos paginados
      getPaginatedProducts: function(extraData) {
        return dispatch(getPaginatedProducts({ ...extraData, ...config[obj].products }));
      },

      // Eliminar producto
      deleteProduct: function(product, extraData) {
        return dispatch(deleteProduct({
          product,
          ...extraData,
          ...config[obj].products
        }))
      },

      // Obtener categorías de los productos
      getCategories: () => dispatch(getCategories(config[obj].categories)),

      // Crear categoría
      createCategory: function(token) {
        return dispatch(createCategory({ token, ...config[obj].categories }));
      },

      // Editar categoría
      editCategory: function(category) {
        return dispatch(editCategory({ category, ...config[obj].categories }));
      },

      // Eliminar categoría
      deleteCategory: function(category) {
        return dispatch(deleteCategory({ category, ...config[obj].categories }));
      },
    })
  })
}