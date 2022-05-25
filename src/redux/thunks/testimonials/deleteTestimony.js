// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Types
import { DELETE_TESTIMONY } from "@redux/types";

// Utils
import { showConfirmModal } from "@utils/Helper";

function deleteTestimony(testimony, extraData) {
  // Ejecutar callback
  return (dispatch) => {
    try {
      showConfirmModal({
        theme: extraData.theme,
        title: `¿Estás seguro o segura que eliminar a ${testimony.author.name}?`,
        description:
          "Al borrar a un autor, perderás toda su información, antes de eliminar a un autor, asegúrate de realizar una copia de seguridad, ya que no podrás restaurar al autor que deseas eliminar.",
        confirmButtonIcon: "trash-alt",
        confirmButtonTitle: "Eliminar autor",
        onSuccess: async function (hideConfirmModal) {
          // Ocultar modal de confirmación
          hideConfirmModal();

          // Mostrar "Borrando autor"
          message.loading("Borrando autor...", 999);

          await axios({
            method: "DELETE",
            url: `${API_URL}/api/testimonials/${testimony._id}`,
            headers: {
              Authorization: `Bearer ${extraData.token}`,
            },
          });

          // Ocultar "Borrando autor"
          message.destroy();

          // Eliminar testimonio
          dispatch({
            type: DELETE_TESTIMONY,
            testimonyId: testimony._id,
          });

          // Mostrar mensaje existoso
          message.success(
            `Se ha eliminado a ${testimony.author.name} exitosamente`
          );
        },
      });
    } catch (err) {
      // Ocultar "Borrando autor"
      message.destroy();

      // Si no hay una respuesta del servidor
      if (!err.response) {
        return message.warn("Ha ocurrido un error al eliminar a " + testimony.author.name, 7);
      }

      const existResponse = err.response.data; 

      // Si existe respuesta del servidor, mostrar mensaje de advertencia
      if (existResponse) {
        return message.warn(existResponse.error, 7);
      }
      
    }
  };
}

export default deleteTestimony;
