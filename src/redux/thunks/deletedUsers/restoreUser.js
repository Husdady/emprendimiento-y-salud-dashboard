// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Types
import { ADD_USER, DELETE_USER } from "@redux/types";

// Utils
import { isEmptyArray } from "@utils/Validations";

let timesClicked = 0;

export default function restoreUser({ user, token, modal }) {
  // Ejecutar callback
  return async (dispatch, getState) => {
    if (timesClicked !== 0) {
      timesClicked = 0
      return false
    }

    // Mostrar cargando
    message.loading("Restaurando usuario...", 999);

    try {
      await axios({
        method: "POST",
        url: `${API_URL}/api/users/${user._id}/restore`,
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
        // Eliminar item de modal si hay más de un item
        modal.deleteItemFromModal(user._id);
      }

      // Mover usuario eliminado a la tabla de usuarios
      dispatch({
        type: DELETE_USER,
        userId: user._id,
        userType: "deleted",
      });

      // Obtener estado de redux
      const { manageUsers } = getState();

      // Setear key de usuario
      user.key = isEmptyArray(manageUsers.users)
        ? 1
        : manageUsers.users[manageUsers.users.length - 1].key + 1;

      // Añadir usuario a tabla de usuarios
      dispatch({
        type: ADD_USER,
        user: user,
      });

      // Mostrar mensaje exitoso
      message.success("Cuenta de usuario restaurado con éxito!", 4);

      timesClicked !== 1 && (timesClicked = 1);
    } catch(err) {
      // Ocultar cargando
      message.destroy();

      // Si no hay respuesta del servidor
      if (!err.response) {
        const txt = `A ocurrido un error al restaurar la cuenta de ${user.fullname}`
        return message.error(txt, 4);
      }

      // Mostrar mensaje de error
      message.error(err.response.data.error, 7);
    }
  };
}
