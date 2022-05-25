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
 export default async function editUser(values, extraData) {
  // Crear Form Data
  const userFormData = new FormData();

  // Setear datos que se van a agregar al 'formData'
  const fields = {
    ...values,
    formHasBeenEdited: extraData.formHasBeenEdited,
    existUserPhoto: JSON.stringify(values.profilePhoto),
  }

  // Setear campos a Form Data
  const keys = Object.keys(fields)

  for (const key of keys) {
    userFormData.append(key, fields[key])
  }

  try {
    // Mostrar loading
    extraData.showLoading();

    const res = await axios({
      method: "PUT",
      url: `${API_URL}/api/users/${extraData.userId}`,
      data: userFormData,
      headers: {
        Authorization: `Bearer ${extraData.token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Mostrar mensaje
    message.success(res.data.message, 4);
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    const errorMessage = `A ocurrido un error al editar la información de ${values.fullname}`;

    // Si no hay respuesta de la API
    if (!err.response) {
      return message.error(errorMessage, 7);
    }
    
    return message.warn(err.response.data.error, 5);
  }
}
