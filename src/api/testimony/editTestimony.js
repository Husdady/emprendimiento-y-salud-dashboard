// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Editar la información de un usuario
 * @param {values: Object, extraData: Object}
 * @returns
 */
 export default async function editTestimony(values, extraData) {
  // Crear Form Data
  const testimonyFormData = new FormData();

  // Setear datos que se van a agregar al 'formData'
  const fields = {
    ...values,
    formHasBeenEdited: extraData.formHasBeenEdited,
    existAuthorPhoto: JSON.stringify(values.authorPhoto),
  }

  // Setear campos a Form Data
  const keys = Object.keys(fields)

  for (const key of keys) {
    testimonyFormData.append(key, fields[key])
  }

  try {
    // Mostrar loading
    extraData.showLoading();

    const res = await axios({
      method: "PUT",
      url: `${API_URL}/api/testimonials/${extraData.testimonyId}`,
      data: testimonyFormData,
      headers: {
        Authorization: `Bearer ${extraData.token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Mostrar mensajes
    message.success(res.data.message, 4);
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    const errorMessage = `A ocurrido un error al editar la información de ${values.author}`;

    // Si no hay respuesta de la API
    if (!err.response) {
      return message.error(errorMessage, 7);
    }
    
    return message.warn(err.response.data.error, 5);
  }
}
