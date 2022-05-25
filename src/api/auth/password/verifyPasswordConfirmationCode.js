// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Comprobar si el código de confirmación de la contraseña olvidada es válido
 * @param {extraData: Object }
 * @returns
 */
export default async function verifyPasswordConfirmationCode(data) {
	try {
		await axios({
			method: 'POST',
			url: `${API_URL}/api/auth/recovery/password/verify/confirmation`,
			data: data,
			headers: {
				Authorization: `Bearer ${data.confirmationCode}`,
			}
		})
		
		return true
	} catch(err) {
		return false
	}
}