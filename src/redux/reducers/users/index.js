// Types
import * as types from '@redux/types'

// Thunks
import {
  // Roles
  createRole,
  updateRole,
  deleteRole,
  getRoles,

  // Users
  deleteUser,
  getPaginatedUsers,

  // Deleted users
  restoreUser,
  getPaginatedDeletedUsers,
  deleteUserAccount,
} from '@redux/thunks'

// Utils
import { removeArrayItem } from '@utils/Helper'

const initialState = {
  users: [],
  roles: [],
  deletedUsers: [],
  totalRoles: 0,
  totalUsers: 0,
  totalDeletedUsers: 0,
  loadingRoles: null,
  loadingUsers: null,
  loadingDeletedUsers: null,
}

const manageUsers = (state = initialState, action) => {
  const { roles, users, deletedUsers } = state
  const totalDeletedUsers = state.deletedUsers.length

  switch (action.type) {
    // Mostrar cargando en la sección de roles
    case types.SHOW_LOADING_ROLES:
      return { ...state, loadingRoles: true }

    // Ocultar cargando en la sección de roles
    case types.HIDE_LOADING_ROLES:
      return { ...state, loadingRoles: false }

    // Mostrar cargando en tabla de usuarios
    case types.SHOW_LOADING_USERS:
      return { ...state, loadingUsers: true }

    // Ocultar cargando en tabla de usuarios
    case types.HIDE_LOADING_USERS:
      return { ...state, loadingUsers: false }

    // Mostrar cargando en tabla de usuarios eliminados
    case types.SHOW_LOADING_DELETED_USERS:
      return { ...state, loadingDeletedUsers: true }

    // Ocultar cargando en tabla de usuarios eliminados
    case types.HIDE_LOADING_DELETED_USERS:
      return { ...state, loadingDeletedUsers: false }

    // Setear roles de usuario
    case types.SET_ROLES:
      return {
        ...state,
        roles: action.roles,
        totalRoles: action.roles.length,
      }

    // Agregar nuevo rol
    case types.ADD_ROLE:
      return { ...state, roles: [...roles, action.newRole] }

    // Editar rol de usuario
    case types.EDIT_ROLE:
      return { ...state, roles: action.rolesUpdated }

    // Eliminar rol de usuario
    case types.DELETE_ROLE:
      return {
        ...state,
        roles: removeArrayItem(roles, {
          _id: action.roleId,
        }),
      }

    // Seter usuarios
    case types.SET_USERS:
      return {
        ...state,
        users: action.users,
        totalUsers: action.totalUsers,
      }

    // Setear usuarios eliminados
    case types.SET_DELETED_USERS:
      return {
        ...state,
        deletedUsers: action.deletedUsers,
        totalDeletedUsers: action.totalDeletedUsers,
      }

    // Eliminar usuario
    case types.DELETE_USER:
      // Si el tipo de usuario es "eliminado", eliminar cuenta permanentemente
      if (action.userType === 'deleted') {
        return {
          ...state,
          deletedUsers: removeArrayItem(deletedUsers, {
            _id: action.userId,
          }),
        }
      }

      // Si el tipo de usuario es "creado", convertir este usuario a "usuario eliminado"
      if (action.userType === 'created') {
        return {
          ...state,
          users: removeArrayItem(users, {
            _id: action.userId,
          }),
        }
      }

    // Añadir usuario
    case types.ADD_USER:
      // Comprobar si existen usuarios duplicados
      const existDuplicateUser = users.some((user) => user._id === action.user._id)

      // Si no existe usuarios duplicados
      if (!existDuplicateUser) {
        return {
          ...state,
          users: [...users, action.user],
          totalUsers: users.length + 1,
        }
      }
      break

    // Añadir usuario eliminado
    case types.ADD_DELETED_USER:
      return {
        ...state,
        deletedUsers: [...deletedUsers, action.user],
        totalDeletedUsers: totalDeletedUsers + 1,
      }
    default:
      return state
  }
}

// Obtener el estado del reducer
export const getState = ({ manageUsers }) => ({ ...manageUsers })
export default manageUsers
