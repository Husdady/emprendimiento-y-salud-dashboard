// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { updateArrayItem } from "@utils/Helper";
import { validateCategory } from "@utils/Validations";

export default function editCategory({ category, types, company }) {
  return (dispatch, getState) => {
    // Obtener productos
    const { manageProducts } = getState();

    // Obtener categorías
    const { categories } = manageProducts[company]

    const newCategoryName = window.prompt(
      "Ingresa el nuevo nombre de la categoría",
      category.name
    );

    // Validar categoría
    validateCategory({
      value: newCategoryName,
      onValidCategory: async function () {
        // Obtener sesión de usuario
        const session = await getSession()

        // Obtener token de usuario
        const token = session.user.access_token;

        try {
          // Mostrar mensaje
          message.loading(`Actualizando categoría '${category.name}'`, 999);

          const res = await axios({
            method: "PUT",
            url: `${API_URL}/api/products/${company}/categories/${category._id}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              lastCategoryName: category.name,
              newCategoryName: newCategoryName,
              categoryHasBeenEdited: newCategoryName !== category.name,
            },
          });

          // Ocultar mensaje
          message.destroy();

          // Retornar roles actualizados
          const categoriesUpdated = updateArrayItem(categories, {
            filter: { _id: category._id },
            newData: (currentCategory) => ({
              ...currentCategory, name: newCategoryName
            })
          });

          const field = company + 'CategoriesUpdated'

          // Setear nueva categoría
          dispatch({
            type: types.editCategory,
            [field]: categoriesUpdated,
          });

          // Mostrar mensajes
          return message.success(res.data.message, 6);
        } catch (err) {
          // Ocultar mensaje
          message.destroy();

          // Mostrar error por consola
          console.error(`[editCategory.${company}]`, err)

          // Si no hay respuesta de la api
          if (!err.response) {
            const txt = `A ocurrido un error al actualizar la categoría "${category.name}"`
            return message.error(txt, 7);
          }

          const existError = err.response.data;

          // Si existe un error, mostrarlo en pantalla
          if (existError) {
            return message.error(existError.error, 5);
          }
        }
      },
    });
  };
}
