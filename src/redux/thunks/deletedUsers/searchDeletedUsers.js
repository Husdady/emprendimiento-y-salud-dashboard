// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'
import { setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Buscar usuarios
export default function searchUsers({ value, types }) {
  return async (dispatch, getReduxStore) => {
    try {
      // Obtener estado
      const { manageUsersFilters } = getReduxStore();

      // Obtener filtros de usuarios eliminados;
      const { skip, limit, sortBy } = manageUsersFilters.deletedUsers;
      const username = JSON.stringify(value);

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

      // Petición para buscar usuarios
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const { users } = data["data"]

      if (!users) {
        message.warn(`No se han encontrado usuarios eliminados con el valor de búsqueda: "${value}"`);
        return dispatch({ type: types.hideLoading });
      };

      // Obtener usuarios eliminados filtrados por nombre y correo electrónico de la API
      const APIDeletedUsers = users.items;
      const APITotalDeletedUsers = users.count;

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

      // Guardar valor de búsqueda
      dispatch({
        type: types.saveDeletedUsersFilters,
        filters: {
          searchValue: value,
        },
      });
    } catch(err) {
      console.log("[searchDeletedUsers.error]", err.response);
    }
  }
}
