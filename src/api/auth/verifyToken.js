// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { signOut } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// JS
import { isFunction } from "@utils/Validations";

/**
 * Verificar token de usuario
 * @param {token: String, extraData: Object}
 * @returns
 */
export default async function verifyToken(token) {
  try {
    const res = await axios({
      url: `${API_URL}/api/auth/verifyToken`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res
  } catch (err) {
    if (!err.response) return err
    
    const { token } = err.response.data;

    const errorsTypes = {
      "JsonWebTokenError": "Ha ocurrido un error con tu inicio de sesión",
      "TokenExpiredError": "Tu sesión ha expirado. Debes de volver a iniciar sesión",
      "TokenError": "Algo a fallado en tu inicio de sesión, estamos solucionando el problema.",
    }

    // Si existe un error en el token
    const type = !token.type ? "TokenError" : token.type

    // Mostrar mensaje de error
    await message.error(errorsTypes[type], 7)

    // Mostrar mensaje cargando
    await message.loading("Redireccionando a Inicio de sesión...", 2);

    // Finalizar sesión de usuario 
    signOut({
      callbackUrl: '/auth/login'
    })
  }
}
