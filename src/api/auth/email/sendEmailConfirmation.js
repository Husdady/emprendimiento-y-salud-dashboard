// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

let limit = 5;
let currentEmail = null;
let isSendingEmail = false;
let totalChecksSent = 0;

/**
 * Enviar verificación al correo electrónico de un usuario
 * @param {email: String}
 * @returns
 */
export default async function sendEmailConfirmation(email) {
  // Actualizar el correo del usuario al que se le enviará una confirmación
  if (currentEmail !== email) {
    currentEmail = email;
    
    // Setear por defecto los intentos para enviar un confirmación
    if (totalChecksSent === limit) {
      totalChecksSent = 0
    }
  }

  try {
    if (totalChecksSent >= limit) {
      return message.warn('Has sobrepasado el límite para enviar verificaciones a tu correo electrónico, te recomendamos que visites tu correo personal y confirmes tu cuenta', 10)
    }

    // Si se está enviando un email y se vuelve a enviar, finalizar función
    if (isSendingEmail) {
      return message.warning('Espera un momento', 10)
    }

    isSendingEmail = true

    message.loading(`Enviando confirmación a ${email}`, 999)

    const URL = `${API_URL}/api/auth/email/send/${email}`
    const res = await axios.post(URL)

    // Ocultar mensaje
    message.destroy()

    // Mostrar mensaje exitoso
    message.success(res.data.message, 7)

    totalChecksSent += 1
    isSendingEmail = false
  } catch(err) {
    // Mostrar error por consola
    console.error('[sendEmailConfirmation.error]', err)

    // Ocultar mensaje
    message.destroy()

    // Setear por defecto
    totalChecksSent = 0
    isSendingEmail = false

    return message.error(`A ocurrido un error al enviar la confirmación al correo electrónico: "${email}"`, 10)
  }
}