// Thunks
import { searchUsers, searchDeletedUsers, sortUsersBy, sortDeletedUsersBy } from '@redux/thunks'

// Types
import * as types from "@redux/types";

// Settings
const config = {
  users: {
    types: {
      setUsers: types.SET_USERS,
      saveUsersFilters: types.SAVE_USERS_FILTERS,
      sortByAscName: types.SORT_USERS_BY_ASC_NAME,
      sortByDescName: types.SORT_USERS_BY_DESC_NAME,
      sortByAscEmail: types.SORT_USERS_BY_ASC_EMAIL,
      sortByDescEmail: types.SORT_USERS_BY_DESC_EMAIL,
      sortByOldestCreatedAt: types.SORT_USERS_BY_OLDEST_CREATED_AT,
      sortByMostRecentCreatedAt: types.SORT_USERS_BY_MOST_RECENT_CREATED_AT,
      sortByOldestUpdatedAt: types.SORT_USERS_BY_OLDEST_UPDATED_AT,
      sortByMostRecentUpdatedAt: types.SORT_USERS_BY_MOST_RECENT_UPDATED_AT,
      showLoading: types.SHOW_LOADING_USERS,
      hideLoading: types.HIDE_LOADING_USERS,
    },
  },
  deletedUsers: {
    types: {
      setDeletedUsers: types.SET_DELETED_USERS,
      saveDeletedUsersFilters: types.SAVE_DELETED_USERS_FILTERS,
      sortByAscName: types.SORT_DELETED_USERS_BY_ASC_NAME,
      sortByDescName: types.SORT_DELETED_USERS_BY_DESC_NAME,
      sortByAscEmail: types.SORT_DELETED_USERS_BY_ASC_EMAIL,
      sortByDescEmail: types.SORT_DELETED_USERS_BY_DESC_EMAIL,
      sortByOldestDeletedAt: types.SORT_DELETED_USERS_BY_OLDEST_DELETED_AT,
      sortByMostRecentDeletedAt: types.SORT_DELETED_USERS_BY_MOST_RECENT_DELETED_AT,
      showLoading: types.SHOW_LOADING_DELETED_USERS,
      hideLoading: types.HIDE_LOADING_DELETED_USERS,
    },
  },
}

export { config }
export default function(dispatch) {
  return {
    // Buscar usuarios por nombre o correo electrónico
    searchUsers: function (value) {
      return dispatch(searchUsers({ ...config.users, value }))
    },

    // Buscar usuarios eliminados por nombre o correo electrónico
    searchDeletedUsers: function (value) {
      return dispatch(searchDeletedUsers({ ...config.deletedUsers, value }))
    },

    // Ordenar usuarios por ...
    sortUsersBy: (option) => dispatch(sortUsersBy({ option, ...config.users })),

    // Ordenar usuarios eliminados por ...
    sortDeletedUsersBy: function (option) {
      return dispatch(sortDeletedUsersBy({ option, ...config.deletedUsers }))
    },
  }
}