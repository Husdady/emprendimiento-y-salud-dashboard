// Librarys
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

/**
 * Verificar un cuenta de un usuario para poder iniciar sesión
 * @param {email: String, accountType: String, confirmationCode: true}
 * @returns
 */
export default async function verifyUserAccount({ email, accountType, confirmationCode }) {
  try {
    await axios({
      method: "POST",
      url: `${API_URL}/api/auth/account/verifyAccount`,
      data: {
        userEmail: email,
        accountType: accountType,
        confirmationCode: confirmationCode,
      },
    });

    return true;
  } catch (err) {
    console.error("[verifyUserAccount.error]", err.response);
  }
}
