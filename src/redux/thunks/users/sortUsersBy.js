// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'
import { isFunction } from "@utils/Validations";
import { setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Ordenar usuarios
export default function sortUsersBy({ option, types }) {
  return async (dispatch, getState) => {
    // Obtener estado
    const { authentication, manageUsers, manageUsersFilters } = getState();

    // Obtener la sesión
    const { session } = getAuthenticationState({ authentication });

    // Obtener usuarios
    const { users, totalUsers } = manageUsers;

    // Obtener filtros de usuarios;
    const {
      skip,
      limit,
      searchValue,
      sortKey,
      setDefaultPageToTable,
    } = manageUsersFilters.users;

    const username = JSON.stringify(searchValue);
    const isOnlyUser = users.length === 1;
    const isFirstPageInTable = totalUsers <= limit;

    // Si sólo hay un sólo producto y una sola página en la tabla
    if (isOnlyUser && isFirstPageInTable) {
      return message.warning("No puedes ordenar a los usuarios, cuando solamente hay uno");
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

    delete sortBy.default;

    // Graphql query
    const query = JSON.stringify({
      query: `query {
        users(pagination: true, skip: 0, limit: ${limit},
          filters: {
            deleted: false
            searchValue: ${username}
            excludeUserWithEmail: "${session.user.email}"
            excludeFields: ["sortBy", "excludeUserWithEmail"]
            sortBy: ${stringifyWithoutDoubleQuotes(sortBy)}
        }) {
          count
          items {
            ...UserFragment
          }
      }}

      ${fragments.users}`,
    });

    try {
      // Mostrar loading
      dispatch({ type: types.showLoading });

      // Petición para ordenar usuarios
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const result = data["data"].users;

      // Si hay un error al obtener a los usuarios ordenados
      if (!result) return;

      // Obtener usuarios ordenados de la API
      const APIUsers = result.items;
      const APITotalUsers = result.count;

      // Setear usuarios
      dispatch({
        type: types.setUsers,
        totalUsers: APITotalUsers,
        users: setIndexToTable({
          skip: 0,
          limit: limit,
          data: APIUsers,
        }),
      });

      // Ocultar loading
      dispatch({ type: types.hideLoading });

      // Guardar tipo de orden en filtros de usuarios
      dispatch({
        type: types.saveUsersFilters,
        filters: {
          sortKey: sortKey,
          sortBy: sortBy,
        },
      });

      // Setear página inicial a la tabla de usuarios
      isFunction(setDefaultPageToTable) && setDefaultPageToTable();
    } catch(e) {
      const txt = "A ocurrido un error al ordenar los usuarios, inténtalo más tarde"
      return message.error(txt, 7);
    }
  };
}

// Obtener query de orden de usuarios
function getSortByQuery({ key, types }) {
   switch (key) {
    // Ordenar a los usuarios por fecha de creación más reciente
    case types.sortByMostRecentCreatedAt:
      return { createdAt: -1, default: false }

    // Ordenar a los usuarios por fecha de creación más antigua
    case types.sortByOldestCreatedAt:
      return { createdAt: 1, default: false }

    // Ordenar a los usuarios por fecha de actualización más antigua
    case types.sortByOldestUpdatedAt:
      return { updatedAt: 1, default: false }

    // Ordenar a los usuarios por fecha de actualización más reciente
    case types.sortByMostRecentUpdatedAt:
      return { updatedAt: -1, default: false }
      
    // Ordenar a los usuarios por nombre ascendente
    case types.sortByAscName:
      return { fullname: 1, default: true }
      
    // Ordenar a los usuarios por nombre descendente
    case types.sortByDescName:
      return { fullname: -1, default: true }

    // Ordenar a los usuarios por correo electrónico ascendente
    case types.sortByAscEmail:
      return { email: 1, default: true }

    // Ordenar a los usuarios por correo electrónico descendente
    case types.sortByDescEmail:
      return { email: -1, default: true }

    default:
      break;
  }
}