// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

/**
 * Recuperar contraseña de un usuario
 * @param {user: Object, showLoading: Function, hideLoading: Function, sendEmailVerification: Function }
 * @returns
 */
export default async function recoverPassword(email, extraData) {
	// Resetear formulario
	extraData.resetForm()

	try {
		// Mostrar loading
		extraData.showLoading()

		message.loading('Comprobando correo electrónico', 999)

		const { data } = await axios({
			method: 'POST',
			url: `${API_URL}/api/auth/recovery/password`,
			data: { email }
		})

		// Ocultar mensaje cargando
		message.destroy()

		// Mostrar loading
		extraData.hideLoading()

		await message.success('Usuario encontrado', 4)

		await message.loading('Redireccionando', 2)

		// Redireccionar a otra ruta
		extraData.goToPasswordConfirmation({ email })
	} catch(err) {
		console.error('[recoverPassword.error]', err)

		// Ocultar mensaje cargando
		message.destroy()

		// Mostrar loading
		extraData.hideLoading()

		message.error('A ocurrido un error para recuperar la contraseña del usuario')
	}
}