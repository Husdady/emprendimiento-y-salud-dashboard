// Thunks
  import {
    // Roles
    getRoles,
    createRole,
    updateRole,
    deleteRole,

    // Users
    deleteUser,
    getPaginatedUsers,

    // Deleted users
    restoreUser,
    deleteUserAccount,
    getPaginatedDeletedUsers
  } from "@redux/thunks";

// Types
import * as types from "@redux/types";

// Settings
const config = {
  roles: {
    types: {
      setRoles: types.SET_ROLES,
      addRole: types.ADD_ROLE,
      editRole: types.EDIT_ROLE,
      deleteRole: types.DELETE_ROLE,
      showLoading: types.SHOW_LOADING_ROLES,
      hideLoading: types.HIDE_LOADING_ROLES,
    }
  },
  users: {
    types: {
      setUsers: types.SET_USERS,
      saveUsersFilters: types.SAVE_USERS_FILTERS,
      showLoading: types.SHOW_LOADING_USERS,
      hideLoading: types.HIDE_LOADING_USERS,
    }
  },
  deletedUsers: {
    types: {
      setDeletedUsers: types.SET_DELETED_USERS,
      saveDeletedUsersFilters: types.SAVE_DELETED_USERS_FILTERS,
      showLoading: types.SHOW_LOADING_DELETED_USERS,
      hideLoading: types.HIDE_LOADING_DELETED_USERS,
    }
  }
}

export { config }
export default function(dispatch) {
  return {
    // Obtener roles de usuario
    getRoles: () => dispatch(getRoles(config.roles)),
    
    // Crear rol
    createRole: function(role, extraData) {
      return dispatch(createRole({ role, ...extraData, ...config.roles }))
    },
    
    // Actualizar rol
    updateRole: function(role, extraData) {
      return dispatch(updateRole({ role, ...extraData, ...config.roles }))
    },
    
    // Eliminar rol
    deleteRole: (role) => dispatch(deleteRole({ role, ...config.roles })),

    // Obtener usuarios paginados
    getPaginatedUsers: function(extraData) {
      return dispatch(getPaginatedUsers({ ...extraData, ...config.users }));
    },

    // Eliminar usuario
    deleteUser: (user, extraData) => dispatch(deleteUser({ user, ...extraData })),

    // Obtener usuarios eliminados paginados
    getPaginatedDeletedUsers: function(extraData) {
      return dispatch(getPaginatedDeletedUsers({ ...extraData, ...config.deletedUsers }));
    },

    // Restaurar usuario
    restoreUser: (user, extraData) => dispatch(restoreUser({ user, ...extraData })),

    // Eliminar cuenta de usuario
    deleteUserAccount: function(user, extraData) {
      return dispatch(deleteUserAccount({ user, ...extraData }));
    },
  };
}