// Librarys
import axios from "@api/axios";
import { message } from 'antd'

// API
import { API_URL } from "@api/credentials";

/**
 * Comprobar si aún es válido el código de confirmación cuando se crea una cuenta
 * @param {token: String, redirectToLogin: Function}
 * @returns
 */
export default async function verifyConfirmationCode({ token, redirectToLogin }) {
  try {
    const res = await axios({
      url: `${API_URL}/api/auth/email/verifyConfirmationCode`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res
  } catch (err) {
    // Mostrar error por consola
    console.error('[verifyConfirmationCode.error]', err)

    if (!err.response) return err
    
    const { token } = err.response.data;

    const errorsTypes = {
      "JsonWebTokenError": "Tu código de confirmación está corrompido, por lo que te pedimos que envíes una nueva verificación",
      "TokenExpiredError": "Tu código de confirmación ha expirado",
      "TokenError": "Algo a fallado al confirmar tu cuenta, estamos solucionando el problema.",
    }

    // Si existe un error en el token
    const type = !token.type ? "TokenError" : token.type

    // Mostrar mensaje de error
    await message.error(errorsTypes[type], 5)

    // Si el token ha expirado
    if (type === 'TokenExpiredError') {
    	await message.loading('Redireccionando al Inicio de sesión', 2)

    	return redirectToLogin();
    }
  }
}
