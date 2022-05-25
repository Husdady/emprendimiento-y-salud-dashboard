// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Recuperar correo electrónico de un usuario
 * @param {secretKey: String, extraData: Object }
 * @returns
 */
export default async function verifyUserKey(secretKey, extraData) {
	try {
		// Mostrar loading en el botón 'submit'
		extraData.showLoading()

		// Mostrar mensaje cargando
		message.loading('Comprobando clave secreta....', 999)

		const { data } = await axios({
			method: 'POST',
			url: `${API_URL}/api/auth/recovery/email/verify/secret-key`,
			data: { secretKey }
		})
		
		// Ocultar loading en el botón 'submit'
		extraData.hideLoading()

		// Ocultar mensaje cargando
		message.destroy()

		// Mostrar modal
		extraData.showModal({})
	} catch(err) {
		// Mostrar error por consola
    console.error('[verifyUserKey.err]', err.response)
    
		// Ocultar loading en el botón 'submit'
		extraData.hideLoading()

		// Ocultar mensaje cargando
		message.destroy()

		// Mostrar mensaje de error
		message.error('A ocurrido un error para recuperar tu correo electrónico')
	}
}