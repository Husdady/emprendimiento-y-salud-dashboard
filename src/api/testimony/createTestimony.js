// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Crear un nuevo testimonio
 * @param {testimony: Object, extraData: Object}
 * @returns
 */
 export default async function createTestimony(testimony, extraData) {
  try {
    // Crear Form Data
    const testimonyFormData = new FormData();

    // Setear campos a Form Data
    const keys = Object.keys(testimony);

    for (const key of keys) {
      testimonyFormData.append(key, testimony[key])
    }

    // Mostrar loading
    extraData.showLoading();

    const res = await axios({
      method: "POST",
      url: `${API_URL}/api/testimonials/add`,
      data: testimonyFormData,
      headers: {
        Accept: "*",
        Authorization: `Bearer ${extraData.token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Resetear formulario
    extraData.resetForm();
    extraData.removePreviewImage();

    // Mostrar mensajes
    message.success(res.data.message, 6);
  } catch (err) {
    // Si el servidor no envia una respuesta
    const errorMessage = "A ocurrido un error al crear un testimonio. Inténtalo más tarde";

    // Si no hay respuesta del servidor
    if (!err.response) {
      message.error(errorMessage, 8);
    } else {
      message.error(err.response.data.error || errorMessage);
    }

    // Ocultar loading
    extraData.hideLoading();
  }
}
