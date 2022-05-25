// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { showConfirmModal } from "@utils/Helper";

// Eliminar categoría de productos
export default function deleteCategory({ types, company, category }) {
  return async (dispatch, getState) => {
    // Obtener estado
    const { theme } = getState()

    // Mostrar modal de confirmación
    showConfirmModal({
      theme: theme,
      title: `¿Estás seguro o segura que deseas eliminar la categoría '${category.name}'?`,
      description: `Al eliminar una categoría, todos los productos que tengan esa categoría, se procederá a eliminar dicha categoría de todas de las que tienen establecidas.`,
      confirmButtonIcon: "trash-alt",
      confirmButtonTitle: "Eliminar categoría",
      onSuccess: function (hideConfirmModal) {
        onDeleteCategory({
          types: types,
          company: company,
          dispatch: dispatch,
          category: category,
          hideConfirmModal: hideConfirmModal,
        })
      },
    });
  };
}

async function onDeleteCategory({ token, types, company, dispatch, category, hideConfirmModal }) {
  try {
    // Obtener sesión de usuario
    const session = await getSession()

    // Obtener token de usuario
    const token = session.user.access_token;

    // Ocultar modal de confirmación
    hideConfirmModal();

    // Mostrar cargando
    message.loading("Eliminando categoría...", 999);

    await axios({
      method: "DELETE",
      url: `${API_URL}/api/products/${company}/categories/${category._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Ocultar cargando
    message.destroy();

    // Eliminar categoría
    dispatch({
      type: types.deleteCategory,
      categoryId: category._id
    });

    // Mostrar mensaje existoso
    message.success(`Se eliminó exitosamente la categoría '${category.name}'`);
  } catch(err) {
    // Ocultar cargando
    message.destroy();

    // Mostrar error por consola
    console.log(`[deleteCategory.${company}.err]`, err)

    if (!err.response) {
      const txt = "Ha ocurrido un error al eliminar la categoría " + category.name;
      return message.warn(txt, 7);
    }

    return message.warn(err.response.data?.error, 7);
  }
}
