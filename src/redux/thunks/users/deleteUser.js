// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Types
import { ADD_DELETED_USER, DELETE_USER } from "@redux/types";

// Utils
import { showConfirmModal } from "@utils/Helper";
import { isEmptyArray } from "@utils/Validations";

let timesClicked = 0;

export default function deleteUser({ user, modal }) {
  // Ejecutar callback
  return async (dispatch, getState) => {
    if (timesClicked !== 0) {
      timesClicked = 0
      return false
    }

    // Obtener la sesión del usuario
    const session = await getSession()

    // Obtener estado de redux
    const { theme, manageUsers } = getState();

    // Mostrar modal de confirmación
    showConfirmModal({
      theme: theme,
      title: `¿Estás seguro o segura que deseas borrar temporalmente a ${user.fullname}?`,
      description:
        "Al borrar a un usuario, este ya no podrá iniciar sesión. Si deseas restaurar al usuario que has eliminado, ve a la siguiente tabla, encuentra al usuario que eliminaste y haga click en el botón 'Restaurar usuario'.",
      confirmButtonIcon: "eraser",
      confirmButtonTitle: "Borrar usuario",
      onCancel: function() { timesClicked = 0 },
      onSuccess: function(hideConfirmModal) {
        return onDeleteUser({
          user: user,
          modal: modal,
          dispatch: dispatch,
          manageUsers: manageUsers,
          token: session.user.access_token,
          hideConfirmModal: hideConfirmModal
        });
      },
    });
  }

  timesClicked !== 1 && (timesClicked = 1);
}

async function onDeleteUser({ user, manageUsers, token, modal, dispatch, hideConfirmModal }) {
  // Ocultar modal de confirmación
  hideConfirmModal();

  // Mostrar cargando
  message.loading("Borrando usuario...", 999);

  try {
    await axios({
      method: "DELETE",
      url: `${API_URL}/api/users/${user._id}`,
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
      userType: "created",
    });

    // Definir propiedades del usuario eliminado
    const deletedUser = {
      _id: user._id,
      key: isEmptyArray(manageUsers.deletedUsers)
        ? 1
        : manageUsers.deletedUsers[
            manageUsers.deletedUsers.length - 1
          ].key + 1,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profilePhoto: { url: user.profilePhoto?.url } ,
    };

    // Agregar usuario eliminado
    dispatch({
      type: ADD_DELETED_USER,
      user: deletedUser,
    });

    // Mostrar mensaje existoso
    message.success("Usuario borrado exitosamente");
  } catch(err) {
    // Ocultar cargando
    message.destroy();

    // Resetear intentos de click
    timesClicked = 0;

    // Si no hay una respuesta del servidor
    if (!err.response) {
      const txt = "Ha ocurrido un error al borrar a " + user.fullname
      return message.warn(txt, 7);
    }
    
    const { error } = err.response.data;
    message.warn(error, 7);
  }
}
