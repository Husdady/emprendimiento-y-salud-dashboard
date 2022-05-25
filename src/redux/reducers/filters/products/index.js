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
import { createState, createDispatch } from "@utils/Helper";

// Crear filtros por defecto
function createDefaultFilters({ limit, sortBy }) {
  return {
    skip: 0,
    limit: limit,
    searchValue: "",
    sortKey: {
      date: null,
      default: null,
    },
    sortBy: sortBy,
  }
}

// Actualizar estado de filtros
function updateFilters({ key, state, company, newFilters }) {
  return {
    ...state,
    [company]: {
      ...state[company],
      [key]: {
        ...state[company][key],
        ...newFilters,
      }
    }
  }
}

// Estado inicial
const initialState = createState({
  objects: ["seytu", "omnilife"],
  state: () => ({
    orders: createDefaultFilters({
      limit: 5,
      sortBy: {
        "clientProduct.creationDate": -1
      },
    }),
    products: createDefaultFilters({
      limit: 10,
      sortBy: {
        createdAt: -1
      }
    }),
  })
});

const manageProductsFilters = (state = initialState, action) => {
  const { key, filters } = action;
  
  switch (action.type) {
    // Guardar filtros extras en productos Seytú
    case types.SAVE_SEYTU_EXTRA_FILTERS:
      // Si la clave es "products", actualizar los filtros de los pedidos de productos Seytú 
      if (key === "orders") {
        return updateFilters({
          state: state,
          key: "orders",
          company: "seytu",
          newFilters: filters,
        });
      }

      // Si la clave es "products", actualizar los filtros de los productos Seytú 
      if (key === "products") {
        return updateFilters({
          state: state,
          key: "products",
          company: "seytu",
          newFilters: filters,
        });
      } 
      
      break;

    // Guardar filtros extras en productos Omnilife
    case types.SAVE_OMNILIFE_EXTRA_FILTERS:
      // Si la clave es "products", actualizar los filtros de los pedidos de productos Omnilife 
      if (key === "orders") {
        return updateFilters({
          key: key,
          state: state,
          company: "omnilife",
          newFilters: filters,
        });
      }

      // Si la clave es "products", actualizar los filtros de los productos Seytú 
      if (key === "products") {
        return updateFilters({
          key: key,
          state: state,
          company: "omnilife",
          newFilters: filters,
        });
      } 

      break;

    default:
      return state;
  }
}

export default manageProductsFilters;

// Obtener el estado del reducer
export const getProductsFiltersState = ({ manageProductsFilters }) => ({ ...manageProductsFilters });
