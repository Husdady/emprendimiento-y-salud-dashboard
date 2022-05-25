// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { validateCategory } from "@utils/Validations";

export default function createCategory({ types, company }) {
  return (dispatch) => {
    const categoryName = window.prompt(
      "Ingresa el nombre de la nueva categoría"
    );

    // Validar categoría
    validateCategory({
      value: categoryName,
      onValidCategory: async function () {
        try {
          // Mostrar mensaje
          message.loading(`Creando categoría '${categoryName}'`, 999);

          // Obtener sesión de usuario
          const session = await getSession()

          // Obtener token de usuario
          const token = session.user.access_token;

          const res = await axios({
            method: "POST",
            url: `${API_URL}/api/products/${company}/categories/add`,
            data: { name: categoryName },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Ocultar mensaje
          message.destroy();

          // Setear nueva categoría
          dispatch({
            type: types.createCategory,
            category: res.data.newCategory,
          });

          // Mostrar mensajes
          message.success(res.data.message, 6);
        } catch (err) {
          // Ocultar mensaje
          message.destroy();

          // Si el servidor no devuelve una respuesta
          if (!err.response) {
            const txt = `A ocurrido un error al crear la categoría '${categoryName}'`
            return message.error(txt, 7);
          }

          return message.error(err.response.data?.error, 5);
        }
      },
    });
  };
}
