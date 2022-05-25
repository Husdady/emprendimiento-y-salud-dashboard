// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Crear cuenta de usuario
 * @param {accountInformation: Object, extraData: Object}
 * @returns
 */
 export default async function createAccount(accountInformation, extraData) {
  try {
    // Mostrar loading en botón de registro
    extraData.showLoading();

    // Comprobar si la cuenta tiene el rol de administrador
    const isAdmin = extraData.accountType === 'admin'

    // Comprobar si debe saltarse el siguiente middleware
    const skipNextMiddleware = !isAdmin ? { skipNextMiddleware: true } : {}

    // Agregar 'skipNextMiddleware' al objeto 'accountInformation' cuando no es un usuario administrador
    Object.assign(accountInformation, skipNextMiddleware)

    // Endpoint
    const endpoint = isAdmin ? 'admin' : 'user'

    await axios({
      method: "POST",
      url: `${API_URL}/api/auth/signup/${endpoint}`,
      data: accountInformation,
    });

    // Mostrar mensaje exitoso
    await message.success("Se ha creado correctamente la cuenta!");
    
    // Mostrar mensaje de redireccion
    message.loading("Redireccionando...", () => {
      // Redireccionar a confirmación de email
      extraData.goToEmailConfirmation({
        query: {
          email: accountInformation.email
        }
      })
    });
  } catch (err) {
    // Mostrar error por consola
    console.error('[createAccount.error]', err)

    // Ocultar loading en botón de registro
    extraData.hideLoading()
    
    // Resetear formulario
    extraData.resetForm()

    // Si no hay respuesta del servidor
    if (!err.response) {
      const txt = "A ocurrido un error al crear la cuenta. Inténtalo más tarde"
      return message.error(txt, 8);
    }

    const existError = err.response.data;

    // Si existe un error
    if (existError) {
      return message.error(existError.error);
    }
  }

  // Ocultar loading
  extraData.hideLoading();
}
