// Librarys
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

/**
 * Comprobar si existe el correo electrónico de un usuario
 * @param {email: String}
 * @returns
 */
export default async function verifyUserEmail(email) {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_URL}/api/auth/email/verifyUserEmail`,
      data: { email },
    });

    // Comprobar si existe el correo electrónico
    const { existUserEmail } = res.data

    return existUserEmail
  } catch (err) {
    console.log("[verifyUserEmail.error]", err.response);
  }
}
