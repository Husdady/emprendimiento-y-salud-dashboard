// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Types
import { DELETE_USER } from "@redux/types";

// Utils
import { showConfirmModal } from "@utils/Helper";

let timesClicked = 0;

export default function deleteUserAccount({ user, modal }) {
  // Ejecutar callback
  return async (dispatch, getState) => {
    if (timesClicked !== 0) {
      timesClicked = 0
      return false
    }

    // Obtener la sesión del usuario
    const session = await getSession()

    // Obtener token de usuario
    const token = session.user.access_token

    // Obtener estado de redux
    const { theme, manageUsers } = getState();

    if (timesClicked === 0) {
      showConfirmModal({
        theme: theme,
        title: `¿Estás seguro o segura que deseas eliminar definitivamente la cuenta de ${user.fullname}?`,
        description:
          "Al eliminar a un usuario de forma permanente, se eliminará su cuenta de nuestro registro, inhabilitando la posibilidad de recuperar la cuenta eliminada, antes de eliminar una cuenta definitivamente, piénsalo dos veces.",
        confirmButtonIcon: "trash-alt",
        confirmButtonTitle: "Eliminar cuenta de usuario",
        onCancel: function() { timesClicked = 0 },
        onSuccess: function (hideConfirmModal) {
          onRemoveUserAccount({
            user: user,
            modal: modal,
            dispatch: dispatch,
            token: token,
            hideConfirmModal: hideConfirmModal
          })
        },
      });
    }

    timesClicked !== 1 && (timesClicked = 1);
  };
}

async function onRemoveUserAccount({ user, token, modal, dispatch, hideConfirmModal }) {
  try {
    // Ocultar modal
    hideConfirmModal();

    // Mostrar cargando
    message.loading("Eliminando cuenta del usuario...", 999);

    await axios({
      method: "DELETE",
      url: `${API_URL}/api/users/${user._id}`,
      params: { status: "close account" },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    // Ocultar cargando
    message.destroy();

    // Resetear intentos de click
    timesClicked = 0;

    // Si existe un dato extra que haga referencia al modal
    if (modal) {
      const modal = modal;
      const totalModalItems = modal.state.items.length;
      // Ocultar modal si hay un sólo item
      totalModalItems <= 1 && modal.hide();
      // Eliminar item de modal si hay más de un item
      totalModalItems > 1 && modal.deleteItemFromModal(user._id);
    }

    // Eliminar usuario
    dispatch({
      type: DELETE_USER,
      userId: user._id,
      userType: "deleted",
    });

    // Mostrar mensaje existoso
    message.success("Cuenta de usuario eliminada exitosamente");
  } catch(err) {
    // Ocultar cargando
    message.destroy();
    
    // Si no hay una respuesta del servidor
    if (!err.response) {
      const txt = "Ha ocurrido un error al eliminar la cuenta de " + user.fullname
      return message.warn(txt, 7);
    }

    const { error } = err.response.data;
    message.warn(error, 7);

    // Resetear intentos de click
    timesClicked = 0;
  }
}
