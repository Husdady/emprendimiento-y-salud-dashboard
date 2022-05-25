// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { showConfirmModal } from "@utils/Helper";

export default function deleteRole({ role, types }) {
  // Ejecutar callback
  return async (dispatch, getState) => {
    // Obtener estado
    const { theme } = getState()

    // Obtener sesión de usuario
    const session = await getSession()

    // Obtener token de usuario
    const token = session.user.access_token;

    showConfirmModal({
      theme: theme,
      title: `¿Estás seguro o segura que deseas eliminar el rol '${role.name}'?`,
      description: `Al borrar un rol, todos los usuarios que tengan ese rol, actualizarán su actual rol por el rol de 'Usuario', antes de eliminar el rol '${role.name}', asegúrate que usuarios tienen establecido ese rol.`,
      confirmButtonIcon: "trash-alt",
      confirmButtonTitle: "Eliminar rol",
      onSuccess: function (hideConfirmModal) {
        onDeleteRole({
          role: role,
          token: token,
          types: types,
          dispatch: dispatch,
          hideConfirmModal: hideConfirmModal,
        })
      },
    });
  };
}

async function onDeleteRole({ role, token, types, dispatch, hideConfirmModal }) {
  try {
    // Ocultar modal de confirmación
    hideConfirmModal();

    // Mostrar cargando
    message.loading("Eliminando rol...", 999);

    await axios({
      method: "DELETE",
      url: `${API_URL}/api/roles/${role._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Ocultar cargando
    message.destroy();

    // Eliminar usuario
    dispatch({ type: types.deleteRole, roleId: role._id });

    // Mostrar mensaje existoso
    message.success(`Se eliminó exitosamente el rol '${role.name}'`);
  } catch(err) {
    // Ocultar cargando
    message.destroy();
    
    // Si no hay una respuesta del servidor
    if (!err.response) {
      const txt = `Ha ocurrido un error al eliminar el rol ${role.name}`
      return message.warn(txt, 7);
    }

    return message.warn(err.response.data?.error, 7);
  }
}
