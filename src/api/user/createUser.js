// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Crear un nuevo usuario
 * @param {user: Object, extraData: Object}
 * @returns
 */
 export default async function createUser(user, extraData) {
  try {
    // Crear Form Data
    const userFormData = new FormData();

    // Setear campos a Form Data
    const keys = Object.keys(user);

    for (const key of keys) {
      userFormData.append(key, user[key])
    }

    // Mostrar loading
    extraData.showLoading();

    const res = await axios({
      method: "POST",
      url: `${API_URL}/api/auth/signup/user`,
      data: userFormData,
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

    // Mostrar mensaje exitoso
    await message.success(res.data.message, 6);

    // Mostrar mensaje de envio de verificación
    const txt = `Se ha enviado una verificación al correo electrónico: ${user.email}`
    message.info(txt, 6);
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    // Si el servidor no envia una respuesta
    const errorMessage = "A ocurrido un error al crear un usuario. Inténtalo más tarde";

    if (!err.response) {
      return message.error(errorMessage, 8);
    }

    return message.error(err.response.data.error);
  }
}
