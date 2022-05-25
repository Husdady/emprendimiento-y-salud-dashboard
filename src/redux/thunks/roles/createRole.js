// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { isFunction } from '@utils/Validations'

export default function createRole({ role, types, hideModal }) {
  return async (dispatch) => {
    // Obtener sesión de usuario
    const session = await getSession()

    // Obtener token de usuario
    const token = session.user.access_token;

    // Ocultar modal
    isFunction(hideModal) && hideModal()

    // Mostrar mensaje
    message.loading(`Creando nuevo rol de usuario '${role.roleName}'`, 999)

    try {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/roles/add`,
        data: role,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ocultar mensaje
      message.destroy()

      if (data.newRole) {
        // Setear nuevo rol
        dispatch({
          type: types.addRole,
          newRole: data.newRole
        })
      }

      // Mostrar mensaje exitoso
      message.success(data?.message, 5)
    } catch (err) {
      // Ocultar mensaje
      message.destroy()
      
      if (!err.response) {
        const txt = `A ocurrido un error al crear el rol '${role.roleName}'`
        return message.error(txt, 7)
      }

      return  message.error(err.response.data?.error, 5)
    }
  };
}
