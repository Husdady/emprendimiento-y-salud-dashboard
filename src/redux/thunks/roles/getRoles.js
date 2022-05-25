// Librarys
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'
import { onGetItems } from "@utils/Helper";
import { isEmptyArray } from "@utils/Validations";

// Obtener roles de usuario
export default function getRoles({ types, withLoading }) {
  // Graphql query
  const query = JSON.stringify({
    query: `query {
      roles {
        ...UserRolesFragment
      }
    }

    ${fragments.roles}`
  });

  return async (dispatch, getState) => {
    // Obtener usuarios
    const { manageUsers } = getState();

    // Obtener los roles con skeleton de carga
    if (withLoading) {
      // Si ya se han cargado los usuarios, mostrar loading
      if (!isEmptyArray(manageUsers.roles)) {
        dispatch({ type: SHOW_LOADING_ROLES });
      }
    }

    try {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      // Obtener roles
      const APIRoles = data["data"].roles;

      // Obtener los roles con skeleton de carga
      if (withLoading) {
        return onGetItems({
          items: manageUsers.roles,
          apiItems: APIRoles,
          secondsToHideLoading: 2000,
          showLoading: () => dispatch({ type: types.showLoading }),
          hideLoading: () => dispatch({ type: types.hideLoading }),
          onExistApiItems: () => dispatch({ type: types.setRoles, roles: APIRoles }),
        });
      }

      // Si los roles actuales, son iguales a los roles traidos de la API, finalizar función
      if (manageUsers.roles === APIRoles) return;

      // Setear roles
      dispatch({
        type: types.setRoles,
        roles: APIRoles,
      });
    } catch (err) {
      message.error('A ocurrido un error al obtener los roles de los usuarios')
    }
  };
}
