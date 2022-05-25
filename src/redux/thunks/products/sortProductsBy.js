// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from "@utils/fragments";
import { isFunction } from "@utils/Validations";
import { setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Ordenar productos
export default function sortProductsBy({ option, types, company, graphqlQuery }) {
  return async (dispatch, getReduxStore) => {
    // Obtener estado
    const { manageProducts, manageProductsFilters } = getReduxStore();
    const { products, totalProducts } = manageProducts[company];

    // Obtener filtros de usuarios;
    const {
      skip,
      limit,
      searchValue,
      sortKey,
      setDefaultPageToTable,
    } = manageProductsFilters[company].products;

    const productName = JSON.stringify(searchValue);
    const isOnlyProduct = products.length === 1;
    const isFirstPageInProductsTable = totalProducts <= limit;

    // Si sólo hay un sólo producto y una sola página en la tabla
    if (isOnlyProduct && isFirstPageInProductsTable) {
      return message.warning("No puedes ordenar los productos, cuando solamente hay uno");
    }

    // Obtener el tipo de orden
    const sortBy = getSortByQuery({
      key: option.key,
      types: types,
    });

    // Setear "key" a "options" que ordenan por fecha
    if (!sortBy.default) {
      Object.assign(sortKey, {
        date: option.value,
      });
    } else {
      Object.assign(sortKey, {
        default: option.value,
      });
    }

    // Eliminar propiedad "default"
    delete sortBy.default;

    // Graphql query
    const query = JSON.stringify({
      query: `query {
      ${graphqlQuery} (pagination: true, skip: 0, limit: ${limit},
        filters: {
          name: ${productName}
          excludeFields: ["sortBy"]
          sortBy: ${stringifyWithoutDoubleQuotes(sortBy)}
      }) {
        count
        items {
          ...ProductsFragment
        }
      }}

      ${fragments.products}`,
    });

    try {
    	// Mostrar loading
      dispatch({ type: types.showLoading });

      // Petición para ordenar productos
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const result = data["data"][graphqlQuery];

      // Si hay un error al obtener los productos ordenados, finalizar función
      if (!result) return;

      // Obtener productos ordenados de la API
      const APIProducts = result.items;
      const APITotalProducts = result.count;

      const field = company + "Products";

      // Setear productos
      dispatch({
        type: types.setProducts,
        totalProducts: APITotalProducts,
        [field]: setIndexToTable({
          skip: 0,
          limit: limit,
          data: APIProducts,
        }),
      });

      // Ocultar loading
      dispatch({ type: types.hideLoading });

      // Guardar tipo de orden en filtros de productos
      dispatch({
        type: types.saveExtraFilters,
        key: "products",
        filters: {
          sortKey: sortKey,
          sortBy: sortBy,
        },
      });

      // Setear página inicial a la tabla de productos
      isFunction(setDefaultPageToTable) && setDefaultPageToTable();
    } catch(e) {console.log(e)
    	const txt = "A ocurrido un error al ordenar los productos, inténtalo más tarde"
      return message.error(txt, 7);
    }
  };
}

// Obtener query de orden de usuarios
function getSortByQuery({ key, types }) {
   switch (key) {
    // Ordenar los productos por fecha de creación más reciente
    case types.sortByMostRecentCreatedAt:
      return { createdAt: -1, default: false }

    // Ordenar los productos por fecha de creación más antigua
    case types.sortByOldestCreatedAt:
      return { createdAt: 1, default: false }

    // Ordenar los productos por fecha de actualización más antigua
    case types.sortByOldestUpdatedAt:
      return { updatedAt: 1, default: false }

    // Ordenar los productos por fecha de actualización más reciente
    case types.sortByMostRecentUpdatedAt:
      return { updatedAt: -1, default: true }
      
    // Ordenar los productos por nombre ascendente
    case types.sortByAscName:
      return { name: 1, default: true }
      
    // Ordenar los productos por nombre descendente
    case types.sortByDescName:
      return { name: -1, default: true }

    // Ordenar los productos por mayor stock
    case types.sortByHighestStock:
      return { stock: -1, default: true }

    // Ordenar los productos por menor stock
    case types.sortByMinorStock:
      return { stock: 1, default: true }

    default:
      break;
  }
}