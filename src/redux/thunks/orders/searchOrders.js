// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import { isFunction } from "@utils/Validations";
import { setIndexToTable, formatOrders } from "@utils/Helper";

// Buscar pedidos de clientes
export default function searchOrders({ value, types, company, graphqlQuery }) {
  return async (dispatch, getReduxStore) => {
    // Obtener estado
    const { manageProductsFilters } = getReduxStore();

    // Obtener filtros de pedidos de los clientes;
    const {
      limit,
      sortBy,
      setDefaultPageToTable
    } = manageProductsFilters[company].orders;
    const searchValue = JSON.stringify(value);

    // Graphql query
    const query = JSON.stringify({
      query: `query {
      ${graphqlQuery} (pagination: true, skip: 0, limit: ${limit},
        filters: {
          clientName: ${searchValue}
      }) {
        count
        items {
          clientId
          clientName
          clientPhone
          clientProduct {
            status
            totalUnits
            creationDate
            product {
              _id
              name
              price
              defaultImage {
                url
                width
                height
              }
            }
          }
        }
      }}`,
    });

    try {
      // Mostrar loading
      dispatch({ type: types.showLoading });

      // Petición para obtener productos
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
        params: {
          sortBy: sortBy
        },
      });

      const orders = data["data"][graphqlQuery];

      // Si no existen pedidos filtrados por nombre de cliente o producto
      if (!orders) {
        // Ocultar loading
        dispatch({ type: types.hideLoading });

        const txt = `No se han encontrado pedidos con el valor de búsqueda: "${value}"`

        // Mostrar mensaje de error
        return message.warn(txt, 7);
      };

      // Obtener pedidos filtrados por nombre de la API
      const APIClientOrders = orders.items;
      const APITotalClientOrders = orders.count;

      const field = company + "Orders";

      // Pedidos con datos formateados
      const formatedOrders = formatOrders(APIClientOrders);

      // Setear pedidos de los clientes
      dispatch({
        type: types.setOrders,
        totalOrders: APITotalClientOrders,
        [field]: setIndexToTable({
          skip: 0,
          limit: limit,
          data: formatedOrders,
        }),
      });

      // Ocultar loading
      dispatch({ type: types.hideLoading });

      // Guardar valor de búsqueda
      dispatch({
        type: types.saveExtraFilters,
        key: "orders",
        filters: {
          searchValue: value,
        },
      });

      // Setear página inicial a la tabla de usuarios
      isFunction(setDefaultPageToTable) && setDefaultPageToTable();
    } catch(e) {console.log(e.response)
      const txt = "A ocurrido un error al buscar los pedidos de los clientes, inténtalo más tarde";
      return message.error(txt, 7);
    }
  };
}
