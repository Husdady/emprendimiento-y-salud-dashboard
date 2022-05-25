// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { signOut, getSession } from 'next-auth/react'

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth' 

// Types
import { SAVE_SESSION, CLEAN_SESSION } from "@redux/types";

// API
import { API_URL } from "@api/credentials";
import { sendEmailConfirmation } from '@api/auth'

/**
 * Editar la información personal de un usuario
 * @param {values: Object, extraData: Object}
 * @returns
 */
 export default function updateMyPersonalInformation(values, extraData) {
  return async (dispatch, getState) => {
    // Obtener estado de la 'store'
    const { authentication } = getState()
    const previousEmail = getAuthenticationState({ authentication }).session.user.email

    const session = await getSession()
    const { user } = session

    // Crear Form Data
    const userFormData = new FormData();

    // Setear datos que se van a agregar al 'formData'
    const fields = {
      ...values,
      formHasBeenEdited: extraData.formHasBeenEdited,
      existUserPhoto: JSON.stringify(values.profilePhoto),
    }

    // Setear campos a Form Data
    const keys = Object.keys(fields);

    for (const key of keys) {
      userFormData.append(key, fields[key]);
    }

    try {
      // Mostrar loading
      extraData.showLoading();

      // Comprobar si es un usuario administrador
      const isAdmin = values.role === "Administrador";

      // Setear url
      const URL = `${API_URL}/api/${
        isAdmin ? "admin/update" : "users/" + user._id + "/update"
      }`;

      // Setear configuración de axios
      const config = {
        method: "PUT",
        url: URL,
        data: userFormData,
        params: {
          returnUserData: true
        },
        headers: {
          Authorization: `Bearer ${extraData.token}`,
        },
      };

      // Si es un usuario administrador, setear su id
      if (isAdmin) {
        config.params = {
          ...config.params,
          adminId: user._id
        }
      }

      const res = await axios(config);

      const newUserData = {
        email:  values.email,
        fullname: values.fullname,
      }

      const { uploadedImage } = res.data; 

      // Si el usuario ha definido una foto de perfil
      if (uploadedImage) {
        newUserData.profilePhoto = uploadedImage.profilePhoto.url;
      }

      // Actualizar información personal del usuario que ha iniciado sesión
      dispatch({
        type: SAVE_SESSION,
        user: newUserData
      })

      // Ocultar loading
      extraData.hideLoading();

      console.log('[previousEmail]', previousEmail); console.log('[email]', values.email)
      if (previousEmail !== values.email) {
        await message.warning('Tú correo electrónico ha sido actualizado, debes volver a iniciar sesión', 10)

        await sendEmailConfirmation(values.email)

        // Limpiar sesión de usuario
        dispatch({ type: CLEAN_SESSION })

        return signOut({
          callbackUrl: '/auth/login'
        })
      }

      // Mostrar mensaje
      message.success(res.data.message, 4);
    } catch (err) {
      // Ocultar loading
      extraData.hideLoading();

      const errorMessage = "A ocurrido un error al editar la información personal";

      // Si no hay respuesta de la API
      if (!err.response) {
        return message.error(errorMessage, 7);
      }
      
      return message.warn(err.response.data.error, 5);
    }
  };
}
