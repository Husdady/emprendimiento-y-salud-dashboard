// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// Utils
import fragments from '@utils/fragments'
import { isFunction } from "@utils/Validations";
import { setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Buscar usuarios
export default function searchUsers({ value, types }) {
  return async (dispatch, getState) => {
    // Obtener estado
    const { authentication, manageUsersFilters } = getState();

    // Obtener la sesión
    const { session } = getAuthenticationState({ authentication });

    // Obtener filtros de usuarios;
    const { limit, sortBy, setDefaultPageToTable } = manageUsersFilters.users;
    const username = JSON.stringify(value);

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

      // Petición para buscar usuarios
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const { users } = data["data"];

      // Si no existen usuarios filtrados por nombre o correo electrónico
      if (!users) {
        // Ocultar loading
        dispatch({ type: types.hideLoading });

        const txt = `No se han encontrado usuarios con el valor de búsqueda: "${value}"`

        // Mostrar mensaje de error
        return message.warn(txt, 7);
      };

      // Obtener usuarios filtrados por nombre y correo electrónico de la API
      const APIUsers = users.items;
      const APITotalUsers = users.count;

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

      // Guardar valor de búsqueda
      dispatch({
        type: types.saveUsersFilters,
        filters: {
          searchValue: value,
        },
      });

      // Setear página inicial a la tabla de usuarios
      isFunction(setDefaultPageToTable) && setDefaultPageToTable();
    } catch(e) {console.log(e)
      return message.error("A ocurrido un error al buscar usuarios, inténtalo más tarde", 7);
    }
  }
}