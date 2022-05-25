// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from "@utils/fragments";
import { isFunction, isEmptyArray } from "@utils/Validations";
import { onGetItems, setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Paginar productos
export default function getPaginatedProducts({ skip, types, company, graphqlQuery, setCurrentPage, resetTableIndex }) {
  return async (dispatch, getState) => {
    // Obtener estado
    const { manageProducts, manageProductsFilters } = getState();

    // Obtener productos
    const { products } = manageProducts[company];

    // Obtener filtros de productos
    const {
      limit,
      searchValue,
      sortBy,
      setDefaultPageToTable,
    } = manageProductsFilters[company].products;

    // Setear a stringify el nombre del producto
    const productName = JSON.stringify(searchValue);

    // Setear valor de "skip"
    const i = skip > 0 ? (skip - 1) * limit : 0;

    // Graphql query
    const query = JSON.stringify({
      query: `query {
      ${graphqlQuery} (pagination: true, skip: ${i}, limit: ${limit},
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
      // Si ya se han cargado las productos en la tabla, mostrar loading
      if (!isEmptyArray(products)) {
        dispatch({ type: types.showLoading });
      }

      // Petición para obtener productos paginados
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const result = data["data"][graphqlQuery];

      // Si no existen productos, finalizar función
      if (!result) return;

      const APIProducts = result.items;
      const APITotalProducts = result.count;

      onGetItems({
        items: products,
        apiItems: APIProducts,
        onExistApiItems: function() {
          const field = company + "Products";
          console.log('[skip]', skip)
          // Setear productos
          return dispatch({
            type: types.setProducts,
            totalProducts: APITotalProducts,
            [field]: setIndexToTable({
              skip: skip,
              limit: limit,
              data: APIProducts,
            }),
          });
        },
        showLoading: () => dispatch({ type: types.showLoading }),
        hideLoading: function() {
          // Ocultar loading
          dispatch({ type: types.hideLoading });

          // Setear "skip" a filtros de usuarios
          const filters = {
            skip: skip,
          }

          // Setear página actual de la tabla
          if (isFunction(setCurrentPage)) {
            setCurrentPage(skip);

            // Asignar una función a filtros para definir la página por defecto de la tabla
            Object.assign(filters, {
              setDefaultPageToTable: function() {
                return setCurrentPage(1);
              }
            });
          }

          // Guardar "skip" a filtros de productos
          dispatch({
            type: types.saveExtraFilters,
            key: "products",
            filters: filters,
          });

          // Si debe resetear la tabla de pedidos de los clientes
          if (resetTableIndex && isFunction(setDefaultPageToTable)) {
            return setDefaultPageToTable()
          };
        },
      });
    } catch (err) {
      const txt = "A ocurrido un error obtener los productos, inténtalo más tarde"
      return message.error(txt, 7);
    }
  };
}
