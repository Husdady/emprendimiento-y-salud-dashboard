// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Actualizar información de contacto
 * @param {contact: Object, extraData: Object}
 * @returns
 */
 export default async function updateContactInformation(contact, extraData) {
  try {
    // Crear Form Data
    const contactFormData = new FormData();

    // Setear campos para agregar al 'formData'
    const fields = {
      ...contact,
      facebookPage: JSON.stringify(contact.facebookPage),
      existContactPhoto: JSON.stringify(contact.contactPhoto),
      formHasBeenEdited: extraData.formHasBeenEdited,
    }

    // Obtener campos del producto
    const keys = Object.keys(fields);

    for (const key of keys) {
      contactFormData.append(key, fields[key]);
    }

    // Mostrar loading
    extraData.showLoading();

    const res = await axios({
      method: "POST",
      url: `${API_URL}/api/contact/update`,
      data: contactFormData,
      headers: {
        Accept: "*",
        Authorization: `Bearer ${extraData.token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Mostrar mensajes
    return message.success(res.data.message, 6);
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    const errorMessage = "A ocurrido un error al actualizar la información de contacto";

    /// Si no hay una respuesta del servidor
    if (!err.response) {
      return message.error(errorMessage, 7);
    }
    
    return message.warn(err.response.data.error, 5);
  }
}
