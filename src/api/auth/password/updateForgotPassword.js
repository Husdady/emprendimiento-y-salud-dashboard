// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Actualizar contraseña olvidada de usuario
 * @param {password: String, extraData: Object}
 * @returns
 */
 export default async function updateForgotPassword(password, extraData) {
  try {
    // Mostrar loading
    extraData.showLoading()

    await axios({
    	method: 'POST',
    	url: `${API_URL}/api/auth/recovery/password/update`,
    	data: {
    		...extraData.query,
    		password: password,
    	}
    }) 

    // Ocultar loading
    extraData.hideLoading()

    // Mostrar mensaje
    await message.success('Tu contraseña se ha actualizado', 3)

    // Redireccionar al Inicio de sesión
    await message.loading('Redireccionando al Inicio de sesión', 2)

    // Ir al login
    extraData.goToLogin()
  } catch (err) {
    // Mostrar loading
    extraData.hideLoading()

    if (!err.response) {
    	return message.error('A ocurrido un error al actualizar tu actual contraseña, inténtalo más tarde', 7)
    }

    return message.error(err.response.data?.error, 6)
  }
}
