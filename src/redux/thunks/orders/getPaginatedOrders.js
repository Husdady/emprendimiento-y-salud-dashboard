// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import { isFunction, isEmptyArray } from "@utils/Validations";
import { onGetItems, setIndexToTable, formatOrders } from "@utils/Helper";

 // Obtener los pedidos de los clientes paginados
export default function getPaginatedOrders({ skip, types, company, graphqlQuery, setCurrentPage, resetTableIndex }) {
  return async (dispatch, getReduxStore) => {
    // Obtener estado
    const { manageProducts, manageProductsFilters } = getReduxStore();

    // Obtener pedidos
    const { orders } = manageProducts[company];

    // Obtener filtros de pedidos de los clientes
    const {
      limit,
      searchValue,
      sortBy,
      setDefaultPageToTable,
    } = manageProductsFilters[company].orders;

    // Setear a stringify el nombre del producto
    const value = JSON.stringify(searchValue);

    // Setear valor de "skip"
    const i = skip > 0 ? (skip - 1) * limit : 0;

    // Graphql query
    const query = JSON.stringify({
      query: `query {
      ${graphqlQuery} (pagination: true, skip: ${i}, limit: ${limit},
        filters: {
          clientName: ${value}
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
      // Si ya se han cargado los pedidos, mostrar loading
      if (!isEmptyArray(orders)) {
        dispatch({ type: types.showLoading });
      }

      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
        params: {
          sortBy: sortBy
        },
      });

      const result = data["data"][graphqlQuery];

      // Si no existen pedidos de clientes, finalizar función
      if (!result) return;

      const APIClientOrders = result.items;
      const APITotalClientOrders = result.count;

      onGetItems({
        items: orders,
        apiItems: APIClientOrders,
        onExistApiItems: function() {
          const field = company + "Orders";

          // Pedidos con datos formateados
          const formatedOrders = formatOrders(APIClientOrders);
            
          // Setear pedidos de clientes
          return dispatch({
            type: types.setOrders,
            totalOrders: APITotalClientOrders,
            [field]: setIndexToTable({
              skip: skip,
              limit: limit,
              data: formatedOrders,
            }),
          });
        },
        showLoading: () => dispatch({ type: types.showLoading }),
        hideLoading: function() {
          // Ocultar loading
          dispatch({ type: types.hideLoading });

          // Setear "skip" a filtros de pedidos de clientes
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

          // Guardar "skip" a filtros de pedidos de clientes
          dispatch({
            type: types.saveExtraFilters,
            key: "orders",
            filters: filters,
          });

          // Si debe resetear la tabla de pedidos de los clientes
          if (resetTableIndex && isFunction(setDefaultPageToTable)) {
            return setDefaultPageToTable();
          }
        },
      });
    } catch (err) {
      const txt = "A ocurrido un error obtener los pedidos de los clientes, inténtalo más tarde"
      return message.error(txt, 7);
    }
  };
}
