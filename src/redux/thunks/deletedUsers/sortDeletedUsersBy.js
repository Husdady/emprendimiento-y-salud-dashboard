// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'
import { setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Ordenar usuarios eliminados
export default function sortDeletedUsersBy({ option, types }) {
  return async (dispatch, getReduxStore) => {
    try {
      // Obtener estado
      const { manageUsersFilters } = getReduxStore();

      // Obtener filtros de usuarios;
      const { skip, limit, searchValue } = manageUsersFilters.deletedUsers;
      const username = JSON.stringify(searchValue);

      // Obtener el tipo de orden
      const sortBy = getSortByQuery({
        key: option.key,
        types: types,
      });

      // Mostrar loading
      dispatch({ type: types.showLoading });

      // Graphql query
      const query = JSON.stringify({
        query: `query {
          users(pagination: true, skip: ${skip}, limit: ${limit},
            filters: {
              deleted: true
              searchValue: ${username}
              sortBy: ${stringifyWithoutDoubleQuotes(sortBy)}
          }) {
            count
            items {
              ...UserFragment
            }
          }}

        ${fragments.users}`,
      });

      // Petición para ordenar usuarios
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const { users } = data["data"];
      
      // Si hay un error al obtener a los usuarios eliminados ordenados
      if (!users) {
        // Ocultar loading
        dispatch({ type: types.hideLoading });

        // Mostrar mensaje de error
        return message.warn("A ocurrido un error inesperado al ordenar los usuarios que han sido eliminados");
      };

      // Obtener usuarios filtrados por nombre y correo electrónico de la API
      const APIDeletedUsers = users.items;
      const APITotalDeletedUsers = users.count;

      // Setear usuarios eliminados
      dispatch({
        type: types.setDeletedUsers,
        totalDeletedUsers: APITotalDeletedUsers,
        deletedUsers: setIndexToTable({
          skip: skip + 1,
          limit: limit,
          data: APIDeletedUsers,
        }),
      });

      // Ocultar loading
      dispatch({ type: types.hideLoading });

      // Guardar tipo de orden
      dispatch({
        type: types.saveDeletedUsersFilters,
        filters: {
          sortKey: option.key,
          sortBy: sortBy,
        },
      });
    } catch(err) {
      // Ocultar loading
      dispatch({ type: types.hideLoading });

      // statements
      console.log("[sortDeletedUsersBy]", err.response);
    }
  };
}

// Obtener query de orden de usuarios
function getSortByQuery({ key, types }) {
   switch (key) {
    // Ordenar a los usuarios eliminados por defecto y fecha de creación
    case types.sortByDefect:
    case types.sortByMostRecentDeletedAt:
      return { deletedAt: -1 }

    // Ordenar a los usuarios eliminados por fecha de creación más antigua
    case types.sortByOldestDeletedAt:
      return { deletedAt: 1 }
      
    // Ordenar a los usuarios eliminados por nombre ascendente
    case types.sortByAscName:
      return { fullname: 1 }
      
    // Ordenar a los usuarios eliminados por nombre descendente
    case types.sortByDescName:
      return { fullname: -1 }

    // Ordenar a los usuarios eliminados por correo electrónico ascendente
    case types.sortByAscEmail:
      return { email: 1 }

    // Ordenar a los usuarios eliminados por correo electrónico descendente
    case types.sortByDescEmail:
      return { email: -1 }

    default:
      break;
  }
}