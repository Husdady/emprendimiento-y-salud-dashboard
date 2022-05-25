// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import { showConfirmModal } from "@utils/Helper";
import { isEmptyArray } from "@utils/Validations";

let timesClicked = 0;

export default function deleteProduct({ product, token, modal, types, company }) {
  // Ejecutar callback
  return (dispatch, getState) => {
    if (timesClicked !== 0) return;

    // Obtener estado de redux
    const { theme, manageProduct } = getState();

    // Mostrar modal de confirmación
    showConfirmModal({
      theme: theme,
      title: `¿Estás seguro o segura que deseas eliminar el producto '${product.name}'?`,
      description:
        "Al eliminar un producto, se eliminará toda su información de nuestros registros, antes de eliminar un producto, por favor realiza una copia de seguridad de su información.",
      confirmButtonIcon: "trash-alt",
      confirmButtonTitle: "Borrar producto",
      onCancel: function() { timesClicked = 0 },
      onSuccess: function (hideConfirmModal) {
        // Ocultar modal de confirmación
        hideConfirmModal();

        // Mostrar "Borrando producto"
        message.loading("Borrando producto...", 999);

        axios({
          method: "DELETE",
          url: `${API_URL}/api/products/${company}/${product._id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(function () {
            // Ocultar "Borrando producto"
            message.destroy();

            // Resetear intentos de click
            timesClicked = 0;

            // Si existe un dato extra que haga referencia al modal
            if (modal) {
              const totalModalItems = modal.state.items.length;
              // Ocultar modal si hay un sólo item
              totalModalItems <= 1 && modal.hide();
              // Eliminar item de modal si hay más de un item
              totalModalItems > 1 && modal.deleteItemFromModal(product._id);
            }

            // Eliminar usuario
            dispatch({
              type: types.deleteProduct,
              productId: product._id,
            });

            // Mostrar mensaje existoso
            message.success("Producto borrado exitosamente");
          })
          .catch(function (err) {console.log(err)
            // Ocultar "Borrando producto"
            message.destroy();

            // Si no hay una respuesta del servidor
            if (!err.response) {
              return message.warn(`Ha ocurrido un error al eliminar el producto '${product.name}`, 7);
            }

            const existResponse = err.response.data;

            // Si hay respuesta del servidor
            if (existResponse) {
              return messag.warn(existResponse.error, 7);
            }

            // Resetear intentos de click
            timesClicked = 0;
          });
      },
    });
  }

  timesClicked !== 1 && (timesClicked = 1);
}
