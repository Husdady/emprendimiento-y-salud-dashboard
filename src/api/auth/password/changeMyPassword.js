// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Cambiar contraseña del usuario que ha iniciado sesión
 * @param {data: Object, extraData: Object}
 * @returns
 */
 export default async function changeMyPassword(data, extraData) {
  try {
    // Mostrar loading
    extraData.showLoading();

    // Verificar si es el admin
    const isAdmin = extraData.userRole === "Administrador";
    const URL = `${API_URL}/api/${
      isAdmin
        ? "admin/change-my-password"
        : `users/${extraData.userId}/change-my-password`
    }`;

    await axios({
      method: "POST",
      url: URL,
      data: data,
      headers: {
        Accept: "*",
        Authorization: `Bearer ${extraData.token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Resetear formulario
    extraData.resetForm();
    
    // Mostrar mensaje exitoso
    message.success("Se ha actualizado tu contraseña exitosamente", 5);
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    if (!err.response) {
      const txt = "Error de conexión con el servidor, inténtelo más tarde"
      return message.error(txt, 8);
    }

    return message.error(err.response.data?.error);
  }
}
