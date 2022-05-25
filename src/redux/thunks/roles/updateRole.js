// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { isFunction } from '@utils/Validations'

export default function updateRole({ role, types, hideModal, formHasBeenEdited }) {
  return async (dispatch, getState) => {
    // Obtener sesión de usuario
    const session = await getSession()

    // Obtener token de usuario
    const token = session.user.access_token;

    // Obtener roles actuales
    const { manageUsers } = getState()

    // Ocultar modal
    isFunction(hideModal) && hideModal()

    // Mostrar mensaje
    message.loading(`Actualizando el rol '${role.previousName}'`, 999)

    // Información del rol
    const roleData = { ...role, formHasBeenEdited }

    try {
      await axios({
        method: "PUT",
        url: `${API_URL}/api/roles/${role._id}`,
        data: roleData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ocultar cargando
      message.destroy()

      // Retornar roles actualizados
      const roles = manageUsers.roles.reduce((acc, item) => {
        if (item._id === role._id) {
          return acc.concat({
            _id: role._id,
            name: role.roleName,
            permissions: role.permissions
          })
        }

        acc.push(item)
        return acc
      }, [])

      // Setear rol actualizado
      dispatch({
        type: types.editRole,
        rolesUpdated: roles
      })

      // Mostrar mensaje exitoso
      message.success(`Se ha actualizado exitosamente el rol '${role.previousName}'`, 4)
    } catch (err) {console.log('[asdas]', err)
      // Ocultar mensaje
      message.destroy()

      if (!err.response) {
        const txt = `A ocurrido un error al actualizar el rol '${role.roleName}'`
        return message.error(txt, 7)
      }

      return message.warning(err.response.data?.error, 6)
    }
  };
}
