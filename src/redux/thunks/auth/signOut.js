// Librarys
import { message } from 'antd'
import { signOut } from 'next-auth/react'

// Types
import { CLEAN_SESSION } from "@redux/types";

// Cerrar sesión de usuario
export default function logout(extraData) {
  return async (dispatch) => {
    // Mostrar loading en botón que cierra la sesión
    extraData.showLoading();

    // Mostrar mensaje
    await message.loading('Cerrando sesión', 3)

    // Ocultar loading en botón que cierra la sesión
    extraData.hideLoading();

    // Limpiar sesión de usuario
    dispatch({ type: CLEAN_SESSION })

    // Eliminar sesión de next-auth
    signOut({
      callbackUrl: '/auth/login'
    })
  }
}