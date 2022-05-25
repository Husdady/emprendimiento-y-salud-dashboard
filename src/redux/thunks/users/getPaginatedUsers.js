// Librarys
import { getSession } from 'next-auth/react'

// API
import axios from "@api/axios";
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'
import { isFunction, isEmptyArray } from "@utils/Validations";
import { onGetItems, setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Paginar usuarios
export default function getPaginatedUsers({ skip, types, setCurrentPage, resetTableIndex }) {
  return async (dispatch, getState) => {
    // Obtener estado
    const { manageUsers, manageUsersFilters } = getState();

    // Obtener el actual usuario que ha iniciado sesión
    const session = await getSession()
    const { user } = session

    // Obtener usuarios
    const { users } = manageUsers;

    // Obtener filtros de usuarios
    const { limit, searchValue, sortBy, setDefaultPageToTable } = manageUsersFilters.users;

    // Setear a stringify el nombre de usuario
    const username = JSON.stringify(searchValue);

    // Setear valor de "skip"
    const i = skip > 0 ? (skip - 1) * limit : 0;

    // Graphql query 
    const query = JSON.stringify({
      query: `query {
        users(pagination: true, skip: ${i}, limit: ${limit}, filters: {
          deleted: false
          searchValue: ${username}
          excludeUserWithEmail: "${user.email}"
          excludeFields: ["sortBy", "excludeUserWithEmail"]
          sortBy: ${stringifyWithoutDoubleQuotes(sortBy)}
        }) {
          count
          items {
            ...UserFragment
          }
      }}

      ${fragments.users}`
    });

    try {
      // Si ya se han cargado los usuarios en la tabla, mostrar loading
      if (!isEmptyArray(users)) {
        dispatch({ type: types.showLoading });
      }

      // Petición para obtener usuarios paginados
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      const result = data["data"].users;

      // Si no existen usuarios, finalizar función
      if (!result) return;

      const APIUsers = result.items;
      const APITotalUsers = result.count;

      onGetItems({
        items: users,
        apiItems: APIUsers,
        onExistApiItems: function() {
          // Setear usuarios
          return dispatch({
            type: types.setUsers,
            totalUsers: APITotalUsers,
            users: setIndexToTable({
              skip: skip,
              limit: limit,
              data: APIUsers
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

          // Guardar "skip" a filtros de usuarios
          dispatch({
            type: types.saveUsersFilters,
            filters: filters
          });

          // Si debe resetear la tabla de usuarios
          if (resetTableIndex && isFunction(setDefaultPageToTable)) {
            return setDefaultPageToTable();
          }
        },
      });
    } catch (err) {
      console.log("[getPaginatedUsers.error]", err.response);
    }
  };
}
