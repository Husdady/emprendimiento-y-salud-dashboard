// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import { isFunction } from "@utils/Validations";
import { setIndexToTable, formatOrders } from "@utils/Helper";

// Ordenar pedidos de clientes
export default function sortOrdersBy({ option, types, company, graphqlQuery }) {
  return async (dispatch, getReduxStore) => {
    // Obtener estado
    const { manageProducts, manageProductsFilters } = getReduxStore();
    const { orders, totalOrders } = manageProducts[company];

    // Obtener filtros de pedidos de clientes;
    const {
      skip,
      limit,
      searchValue,
      sortKey,
      setDefaultPageToTable,
    } = manageProductsFilters[company].orders;

    const value = JSON.stringify(searchValue);
    const isOnlyClientOrder = orders.length === 1;
    const isFirstPageInOrdersTable = totalOrders <= limit;

    // Si sólo hay un sólo pedido y una sola página en la tabla
    if (isOnlyClientOrder && isFirstPageInOrdersTable) {
      return message.warning("No puedes ordenar los pedidos de los clientes, cuando solamente hay uno");
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
    	// Mostrar loading
      dispatch({ type: types.showLoading });

      // Petición para ordenar los pedidos de los clientes
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
        params: {
          sortBy: sortBy
        },
      });

      const result = data["data"][graphqlQuery];

      // Si hay un error al obtener los pedidos de los clientes ordenados, finalizar función
      if (!result) return;

      const APIClientOrders = result.items;
      const APITotalClientOrders = result.count;

    	const field = company + "Orders";

    	// Pedidos con datos formateados
      const formatedOrders = formatOrders(APIClientOrders);

    	// Setear pedidos de clientes
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

    	// Guardar tipo de orden en filtros de productos
      dispatch({
        type: types.saveExtraFilters,
        key: "orders",
        filters: {
          sortKey: sortKey,
          sortBy: sortBy,
        },
      });

    	// Setear página inicial a la tabla de productos
      isFunction(setDefaultPageToTable) && setDefaultPageToTable();
    } catch(e) {console.log(e.response)
    	const txt = "A ocurrido un error al ordenar los pedidos de los clientes, inténtalo más tarde"
      return message.error(txt, 7);
    }
  };
}

// Obtener query de orden de los pedidos de los clientes
function getSortByQuery({ key, types }) {
   switch (key) {
    // Ordenar los pedidos de los clientes por fecha de creación más reciente
    case types.sortByMostRecentCreatedAt:
      return { "clientProduct.creationDate": -1, default: false }

    // Ordenar los pedidos de los clientes por fecha de creación más antigua
    case types.sortByOldestCreatedAt:
      return { "clientProduct.creationDate": 1, default: false }
      
    // Ordenar los pedidos de los clientes por nombre del cliente ascendentemente
    case types.sortByAscClientName:
      return { clientName: 1, default: true }
      
    // Ordenar los pedidos de los clientes por nombre del cliente descendentemente
    case types.sortByDescClientName:
      return { clientName: -1, default: true }

    // Ordenar los pedidos de los clientes por nombre del producto ascendentemente
    case types.sortByAscProductName:
      return { "clientProduct.product.name": 1, default: true }

    // Ordenar los pedidos de los clientes por nombre del producto descendentemente
    case types.sortByDescProductName:
      return { "clientProduct.product.name": -1, default: true }

    // Ordenar los pedidos de los clientes por menor cantidad
    case types.sortByMinorQuantity:
      return { "clientProduct.totalUnits": 1, default: true }

    // Ordenar los pedidos de los clientes por mayor cantidad
    case types.sortByHighestQuantity:
      // return { "clientProducts.totalUnits": 1, default: true }
      return { "clientProduct.totalUnits": -1, default: true }
    default:
      break;
  }
}