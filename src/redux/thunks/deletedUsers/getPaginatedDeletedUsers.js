// Librarys
import axios from "@api/axios";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'
import { isFunction, isEmptyArray } from "@utils/Validations";
import { onGetItems, setIndexToTable, stringifyWithoutDoubleQuotes } from "@utils/Helper";

// Paginar usuarios
export default function getPaginatedDeletedUsers({ skip, types, setCurrentPage, resetTableIndex }) {
  return async (dispatch, getState) => {
    // Obtener estado
    const { manageUsers, manageUsersFilters } = getState();

    // Obtener el actual usuario que ha iniciado sesión
    const session = await getSession()
    const { user } = session

    // Obtener usuarios eliminados
    const { deletedUsers } = manageUsers;

    // Obtener filtros de usuarios eliminados
    const {
      limit,
      searchValue,
      sortBy,
      setDefaultPageToTable,
    } = manageUsersFilters.deletedUsers;

    // Setear a stringify el nombre de usuario eliminado
    const username = JSON.stringify(searchValue);

    // Setear valor de "skip"
    const i = skip > 0 ? (skip - 1) * limit : skip;

    // Graphql query
    const query = JSON.stringify({
      query: `query {
        users(pagination: true, skip: ${i}, limit: ${limit}, filters: {
          deleted: true
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

        ${fragments.users}`,
    });

    try {
      // Si ya se han cargado los usuarios eliminados en la tabla, mostrar loading
      if (!isEmptyArray(deletedUsers)) {
        dispatch({ type: types.showLoading });
      }

      // Petición para obtener usuarios
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      // Si no existen usuarios, finalizar función
      if (!data["data"].users) return;

      const APIDeletedUsers = data["data"].users.items;
      const APITotalDeletedUsers = data["data"].users.count;

      if (!APIDeletedUsers) return;

      onGetItems({
        items: deletedUsers,
        apiItems: APIDeletedUsers,
        onExistApiItems: function() {
          // Setear usuarios eliminados
          return dispatch({
            type: types.setDeletedUsers,
            totalDeletedUsers: APITotalDeletedUsers,
            deletedUsers: setIndexToTable({
              skip: skip,
              limit: limit,
              data: APIDeletedUsers,
            }),
          });
        },
        showLoading: () => dispatch({ type: types.showLoading }),
        hideLoading: function() {
          // Ocultar loading
          dispatch({ type: types.hideLoading })

          // Setear "skip" a filtros de usuarios eliminados
          dispatch({
            type: types.saveDeletedUsersFilters,
            filters: {
              skip: i,
            },
          })

          // Setear página actual de la tabla
          isFunction(setCurrentPage) && setCurrentPage(skip);

          // Si debe resetear la tabla de usuarios eliminados
          if (resetTableIndex && isFunction(setDefaultPageToTable)) {
            return setDefaultPageToTable();
          }
        },
      });
    } catch (err) {
      console.log("[getPaginatedDeletedUsers.error]", err.response);
    }
  };
}
