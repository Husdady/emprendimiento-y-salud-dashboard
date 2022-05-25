// Types
import { SAVE_USERS_FILTERS, SAVE_DELETED_USERS_FILTERS } from '@redux/types'

// Utils
import { createState } from '@utils/Helper'

const initialState = createState({
  objects: ['users', 'deletedUsers'],
  state: () => ({
    skip: 0,
    limit: 5,
    searchValue: '',
    sortKey: {
      date: null,
      default: null,
    },
    sortBy: {
      createdAt: -1,
    },
  }),
})

const manageUsersFilters = (state = initialState, action) => {
  switch (action.type) {
    // Guardar filtros extras en tabla de usuarios
    case SAVE_USERS_FILTERS:
      return {
        ...state,
        users: {
          ...state.users,
          ...action.filters,
        },
      }

    // Guardar filtros extras en tabla de usuarios eliminados
    case SAVE_DELETED_USERS_FILTERS:
      return {
        ...state,
        deletedUsers: {
          ...state.deletedUsers,
          ...action.filters,
        },
      }

    default:
      return state
  }
}

export default manageUsersFilters

// Obtener el estado del reducer
export const getState = ({ manageUsersFilters }) => ({ ...manageUsersFilters })
