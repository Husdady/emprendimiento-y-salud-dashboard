// Types
import * as types from "@redux/types";

// Thunks
import {
  searchOrders,
  searchProducts,
  sortOrdersBy,
  sortProductsBy,
} from "@redux/thunks";

// Utils
import { createDispatch } from '@utils/Helper'

// Settings
export const config = {
  seytu: {
    orders: {
      company: "seytu",
      graphqlQuery: "seytu_orders",
      types: {
        setOrders: types.SET_SEYTU_ORDERS,
        saveExtraFilters: types.SAVE_SEYTU_EXTRA_FILTERS,
        sortByAscClientName: types.SORT_SEYTU_ORDERS_BY_ASC_CLIENT_NAME,
        sortByDescClientName: types.SORT_SEYTU_ORDERS_BY_DESC_CLIENT_NAME,
        sortByAscProductName: types.SORT_SEYTU_ORDERS_BY_ASC_PRODUCT_NAME,
        sortByDescProductName: types.SORT_SEYTU_ORDERS_BY_DESC_PRODUCT_NAME,
        sortByHighestQuantity: types.SORT_SEYTU_ORDERS_BY_HIGHEST_QUANTITY,
        sortByMinorQuantity: types.SORT_SEYTU_ORDERS_BY_MINOR_QUANTITY,
        sortByMostRecentCreatedAt: types.SORT_SEYTU_ORDERS_BY_MOST_RECENT_CREATED_AT,
        sortByOldestCreatedAt: types.SORT_SEYTU_ORDERS_BY_OLDEST_CREATED_AT,
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
        sortByAscName: types.SORT_SEYTU_PRODUCTS_BY_ASC_NAME,
        sortByDescName: types.SORT_SEYTU_PRODUCTS_BY_DESC_NAME,
        sortByHighestStock: types.SORT_SEYTU_PRODUCTS_BY_HIGHEST_STOCK,
        sortByMinorStock: types.SORT_SEYTU_PRODUCTS_BY_MINOR_STOCK,
        sortByMostRecentCreatedAt: types.SORT_SEYTU_PRODUCTS_BY_MOST_RECENT_CREATED_AT,
        sortByOldestCreatedAt: types.SORT_SEYTU_PRODUCTS_BY_OLDEST_CREATED_AT,
        sortByMostRecentUpdatedAt: types.SORT_SEYTU_PRODUCTS_BY_MOST_RECENT_UPDATED_AT,
        sortByOldestUpdatedAt: types.SORT_SEYTU_PRODUCTS_BY_OLDEST_UPDATED_AT,
        showLoading: types.SHOW_LOADING_SEYTU_PRODUCTS,
        hideLoading: types.HIDE_LOADING_SEYTU_PRODUCTS,
      }
    }
  },
  omnilife: {
    orders: {
      company: "omnilife",
      graphqlQuery: "omnilife_orders",
      types: {
        setOrders: types.SET_OMNILIFE_ORDERS,
        saveExtraFilters: types.SAVE_OMNILIFE_EXTRA_FILTERS,
        sortByAscClientName: types.SORT_OMNILIFE_ORDERS_BY_ASC_CLIENT_NAME,
        sortByDescClientName: types.SORT_OMNILIFE_ORDERS_BY_DESC_CLIENT_NAME,
        sortByAscProductName: types.SORT_OMNILIFE_ORDERS_BY_ASC_PRODUCT_NAME,
        sortByDescProductName: types.SORT_OMNILIFE_ORDERS_BY_DESC_PRODUCT_NAME,
        sortByMinorQuantity: types.SORT_OMNILIFE_ORDERS_BY_MINOR_QUANTITY,
        sortByHighestQuantity: types.SORT_OMNILIFE_ORDERS_BY_HIGHEST_QUANTITY,
        sortByMostRecentCreatedAt: types.SORT_OMNILIFE_ORDERS_BY_MOST_RECENT_CREATED_AT,
        sortByOldestCreatedAt: types.SORT_OMNILIFE_ORDERS_BY_OLDEST_CREATED_AT,
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
        sortByAscName: types.SORT_OMNILIFE_PRODUCTS_BY_ASC_NAME,
        sortByDescName: types.SORT_OMNILIFE_PRODUCTS_BY_DESC_NAME,
        sortByHighestStock: types.SORT_OMNILIFE_PRODUCTS_BY_HIGHEST_STOCK,
        sortByMinorStock: types.SORT_OMNILIFE_PRODUCTS_BY_MINOR_STOCK,
        sortByMostRecentCreatedAt: types.SORT_OMNILIFE_PRODUCTS_BY_MOST_RECENT_CREATED_AT,
        sortByOldestCreatedAt: types.SORT_OMNILIFE_PRODUCTS_BY_OLDEST_CREATED_AT,
        sortByMostRecentUpdatedAt: types.SORT_OMNILIFE_PRODUCTS_BY_MOST_RECENT_UPDATED_AT,
        sortByOldestUpdatedAt: types.SORT_OMNILIFE_PRODUCTS_BY_OLDEST_UPDATED_AT,
        showLoading: types.SHOW_LOADING_OMNILIFE_PRODUCTS,
        hideLoading: types.HIDE_LOADING_OMNILIFE_PRODUCTS,
      }
    },
  }
}

export default function(dispatch) {
  return createDispatch({
    objects: ["seytu", "omnilife"],
    methods: (obj) => ({
      // Buscar productos de los pedidos del cliente por nombre
      searchOrders: function(value) {
        return dispatch(searchOrders({ ...config[obj].orders, value }));
      },

      // Buscar productos por nombre
      searchProducts: function(value) {
        return dispatch(searchProducts({ ...config[obj].products, value }));
      },

      // Buscar productos de los pedidos del cliente por nombre
      sortOrdersBy: function(option) {
        return dispatch(sortOrdersBy({ ...config[obj].orders, option }));
      },

      // Buscar productos por nombre
      sortProductsBy: function(option) {
        return dispatch(sortProductsBy({ ...config[obj].products, option }));
      },
    })
  })
};