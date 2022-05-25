// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from "@utils/fragments";
import { isFunction } from "@utils/Validations";
import { setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Buscar productos en la tabla
export default function searchProducts({ value, types, company, graphqlQuery }) {
  return async (dispatch, getReduxStore) => {
    // Obtener estado
    const { manageProductsFilters } = getReduxStore();

    // Obtener filtros de productos;
    const {
      limit,
      sortBy,
      setDefaultPageToTable
    } = manageProductsFilters[company].products;
    const productName = JSON.stringify(value);

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

      // Petición para obtener productos
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const products = data["data"][graphqlQuery];

      // Si no existen productos filtrados por nombre
      if (!products) {
        // Ocultar loading
        dispatch({ type: types.hideLoading });

        const txt = `No se han encontrado productos con el valor de búsqueda: "${value}"`

        // Mostrar mensaje de error
        return message.warn(txt, 7);
      };

      // Obtener productos filtrados por nombre de la API
      const APIProducts = products.items;
      const APITotalProducts = products.count;

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

      // Guardar valor de búsqueda
      dispatch({
        type: types.saveExtraFilters,
        key: "products",
        filters: {
          searchValue: value,
        },
      });

      // Setear página inicial a la tabla de usuarios
      isFunction(setDefaultPageToTable) && setDefaultPageToTable();
    } catch(e) {
      const txt = "A ocurrido un error al buscar productos, inténtalo más tarde";
      return message.error(txt, 7);
    }
  };
}
