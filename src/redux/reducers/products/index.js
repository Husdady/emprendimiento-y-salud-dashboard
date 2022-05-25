// Types
import * as types from "@redux/types";

// Thunks
import {
  // Pedidos
  getPaginatedOrders,
  confirmOrder,

  // Productos
  deleteProduct,
  getPaginatedProducts,

  // Categorías
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
} from "@redux/thunks";

// Utils
import {
  createState,
  createDispatch,
  updateArrayItem,
  removeArrayItem,
} from "@utils/Helper";

const initialState = createState({
  objects: ["seytu", "omnilife"],
  state: () => ({
    orders: [],
    products: [],
    categories: [],
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    loadingOrders: null,
    loadingProducts: null,
    loadingCategories: null,
  })
});

// Actualizar estado de un pedido a "confirmado" | "cancelado"
function updateOrderStatus({ state, company, action }) {
  return {
    ...state,
    [company]: {
    ...state[company],
    orders: updateArrayItem(state[company].orders, {
      filter: { clientId: action.clientId, index: action.index },
      newData: (currentOrder) => ({
        ...currentOrder,
        status: action.status,
      })
    })
  }
  }
}

const manageProducts = (state = initialState, action) => {
  switch (action.type) {
    // Mostrar cargando historial de pedidos Seytú
    case types.SHOW_LOADING_SEYTU_ORDERS:
      return { ...state, seytu: { ...state.seytu, loadingOrders: true } };

    // Ocultar cargando en la tabla de productos Seytú
    case types.HIDE_LOADING_SEYTU_ORDERS:
      return { ...state, seytu: { ...state.seytu, loadingOrders: false } };

    // Mostrar cargando en la tabla de productos Seytú
    case types.SHOW_LOADING_SEYTU_PRODUCTS:
      return { ...state, seytu: { ...state.seytu, loadingProducts: true } };

    // Ocultar cargando en la tabla de productos Seytú
    case types.HIDE_LOADING_SEYTU_PRODUCTS:
      return { ...state, seytu: { ...state.seytu, loadingProducts: false } };

    // Mostrar cargando en categorías Seytú
    case types.SHOW_LOADING_SEYTU_CATEGORIES:
      return { ...state, seytu: { ...state.seytu, loadingCategories: true } };

    // Ocultar cargando en categorías Seytú
    case types.HIDE_LOADING_SEYTU_CATEGORIES:
      return { ...state, seytu: { ...state.seytu, loadingCategories: false } };

    // Mostrar cargando historial de pedidos Omnilife
    case types.SHOW_LOADING_OMNILIFE_ORDERS:
      return { ...state, omnilife: { ...state.omnilife, loadingOrders: true } };

    // Ocultar cargando historial de pedidos Omnilife
    case types.HIDE_LOADING_OMNILIFE_ORDERS:
      return {
        ...state,
        omnilife: { ...state.omnilife, loadingOrders: false },
      };

    // Mostrar cargando en la tabla de productos Omnilife
    case types.SHOW_LOADING_OMNILIFE_PRODUCTS:
      return {
        ...state,
        omnilife: { ...state.omnilife, loadingProducts: true },
      };

    // Ocultar cargando en la tabla de productos Omnilife
    case types.HIDE_LOADING_OMNILIFE_PRODUCTS:
      return {
        ...state,
        omnilife: { ...state.omnilife, loadingProducts: false },
      };

    // Mostrar cargando en categorías Omnilife
    case types.SHOW_LOADING_OMNILIFE_CATEGORIES:
      return {
        ...state,
        omnilife: { ...state.omnilife, loadingCategories: true },
      };

    // Ocultar cargando en categorías Omnilife
    case types.HIDE_LOADING_OMNILIFE_CATEGORIES:
      return {
        ...state,
        omnilife: { ...state.omnilife, loadingCategories: false },
      };

    // Setear productos Seytú
    case types.SET_SEYTU_PRODUCTS:
      return {
        ...state,
        seytu: {
          ...state.seytu,
          products: action.seytuProducts,
          totalProducts: action.totalProducts,
        },
      };

    // Setear pedidos de productos Seytú
    case types.SET_SEYTU_ORDERS:
      return {
        ...state,
        seytu: {
          ...state.seytu,
          orders: action.seytuOrders,
          totalOrders: action.totalOrders,
        },
      };

    // Actualizar estado de un pedido de un producto Seytú
    case types.CHANGE_SEYTU_ORDER_STATUS:
      return updateOrderStatus({
        state: state,
        company: "seytu",
        action: action
      });

    // Setear categorías de productos Seytú
    case types.SET_SEYTU_CATEGORIES:
      return {
        ...state,
        seytu: {
          ...state.seytu,
          categories: action.seytuCategories,
          totalCategories: action.seytuCategories.length,
        },
      };

    // Setear productos Omnilife
    case types.SET_OMNILIFE_PRODUCTS:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          products: action.omnilifeProducts,
          totalProducts: action.totalProducts,
        },
      };

    // Setear pedidos de productos Omnilife
    case types.SET_OMNILIFE_ORDERS:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          orders: action.omnilifeOrders,
          totalOrders: action.totalOrders,
        },
      };

    // Actualizar estado de un pedido de un producto Omnilife
    case types.CHANGE_OMNILIFE_ORDER_STATUS:
      return updateOrderStatus({
        state: state,
        company: "omnilife",
        action: action
      });

    // Setear categorías de productos Omnilife
    case types.SET_OMNILIFE_CATEGORIES:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          categories: action.omnilifeCategories,
          totalCategories: action.omnilifeCategories.length,
        },
      };

    // Setear nueva categoría de productos Seytú
    case types.ADD_SEYTU_CATEGORY:
      return {
        ...state,
        seytu: {
          ...state.seytu,
          categories: [...state.seytu.categories, action.category],
          totalCategories: state.seytu.categories.length + 1,
        },
      };

    // Editar una categoría de productos Seytú
    case types.EDIT_SEYTU_CATEGORY:
      return {
        ...state,
        seytu: {
          ...state.seytu,
          categories: action.seytuCategoriesUpdated,
        },
      };

    // Eliminar rol de usuario
    case types.DELETE_SEYTU_CATEGORY:
      return {
        ...state,
        seytu: {
          categories: removeArrayItem(state.seytu.categories, {
            _id: action.categoryId
          }),
          totalCategories: state.seytu.categories.length - 1,
        },
      };
    
    // Eliminar producto Seytú
    case types.DELETE_SEYTU_PRODUCT:
      return {
        ...state,
        seytu: {
          ...state.seytu,
          products: removeArrayItem(state.seytu.products, {
            _id: action.productId
          }),
          totalProducts: state.seytu.products.length - 1,
        },
      };

    // Setear nueva categoría de productos Omnilife
    case types.ADD_OMNILIFE_CATEGORY:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          categories: [...state.omnilife.categories, action.category],
          totalCategories: state.omnilife.categories.length + 1,
        },
      };

    // Editar una categoría de productos omnilife
    case types.EDIT_OMNILIFE_CATEGORY:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          categories: action.omnilifeCategoriesUpdated,
        },
      };

    // Eliminar categoría Omnilife
    case types.DELETE_OMNILIFE_CATEGORY:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          categories: removeArrayItem(state.omnilife.categories, {
            _id: action.categoryId
          }),
          totalCategories: state.omnilife.categories.length - 1,
        },
      };

    // Eliminar producto Omnilife
    case types.DELETE_OMNILIFE_PRODUCT:
      return {
        ...state,
        omnilife: {
          ...state.omnilife,
          products: removeArrayItem(state.omnilife.products, {
            _id: action.productId
          }),
          totalProducts: state.omnilife.products.length - 1,
        },
      };

    default:
      return state;
  }
};

export default manageProducts;

// Obtener el estado del reducer
export const getProductsState = ({ manageProducts }) => ({ ...manageProducts });
