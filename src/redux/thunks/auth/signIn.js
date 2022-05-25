// Librarys
import axios from '@api/axios'
import { message } from 'antd'
import { signIn } from 'next-auth/react'

// API
import { API_URL } from '@api/credentials'

// Types
import { SAVE_SESSION } from '@redux/types'

let isDisabled = false;

// Autorizar inicio de sesión con next-auth
export default function authorizeSignIn(user, extraData) {
  return async (dispatch) => {
    if (isDisabled) return null

    try {
      // Mostrar loading
      extraData.showLoading()

      const res = await axios({
        method: 'POST',
        url: `${API_URL}/api/auth/signin`,
        data: user,
      })

      // Mostrar mensaje exitoso
      await message.success('Se ha iniciado sesión correctamente')

      isDisabled = true
      
      // Ocultar loading
      extraData.hideLoading()

      // Mostrar mensaje redireccionar de página
      await message.loading('Redirigiendo al Dashboard...')

      if (res.data.user) {
        // Guardar sesión en el 'store'
        dispatch({
          type: SAVE_SESSION,
          user: {
            email: user.email,
            role: res.data.user.role,
            fullname: res.data.user.fullname,
            profilePhoto: res.data.user.profilePhoto?.url,
          }
        })
        
        // Definir la ruta que se va a redireccionar
        res.data.user.callbackUrl = '/dashboard'
        res.data.user.profilePhoto = JSON.stringify(res.data.user.profilePhoto)

        // Mantener sesión con next auth y redireccionar al Dashboard
        signIn('credentials', res.data.user)
      }

      return null
    } catch (err) {
      isDisabled = false

      // Ocultar loading
      extraData.hideLoading()

      // Mostrar error por consola
      console.error('[auth]', err)

      // Si no hay respuesta del servidor
      if (!err.response) {
        const txt = 'A ocurrido un error al intentar establecer conexión con el servidor. Inténtalo más tarde'

        return message.error(txt, 8)
      }

      // Obtener el error que envía el servidor
      const { error } = err?.response?.data

      // Si no existe el error, es por un problema de conexión
      if (!error) {
        const txt = 'Error de conexión con el servidor. Inténtalo más tarde'
        return message.error(txt, 4)
      }

      // Mostrar error que envia el servidor
      return message.error(error, 4)
    }
  }
}
