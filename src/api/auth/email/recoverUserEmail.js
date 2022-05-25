// Librarys
import axios from "@api/axios";
import { message, Modal } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// API
import { API_URL } from "@api/credentials";

/**
 * Recuperar correo electrónico de un usuario
 * @param {user: Object, extraData: Object }
 * @returns
 */
export default async function recoverUserEmail(user, extraData) {
	try {
		// Resetear formulario
		extraData.resetForm()

		// Mostrar mensaje cargando
		message.loading('Comprobando usuario....', 999)

		const { data } = await axios({
			method: 'POST',
			url: `${API_URL}/api/auth/recovery/email/${user.name}/${user.secretKey}`,
		})
		
		// Ocultar modal
		extraData.hideModal()

		// Ocultar mensaje cargando
		message.destroy()

		// Resetear 'secretKey' de formulario
		extraData.resetKey()

		const textStyle = {
			lineHeight: 1.45
		}

		// Mostrar modal que muestra el correo electrónico del usuario
		return Modal.success({
			icon: null,
			closable: true,
			closeIcon: <FontAwesomeIcon icon="times-circle" color="var(--bg-gray-200)" />,
	    title: <b className="rubik">¡Felicidades {user.name}!, hemos encontrado tu correo electrónico</b>,
	    content: <h6 className="text-muted" style={textStyle}>Tu correo electrónico es: <b>"{data.email}"</b>. Te recomendados que la próxima vez, guardes tu correo electrónico en un archivo seguro, para que no vuelvas a realizar este largo proceso.</h6>,
	    okText: 'Finalizar proceso',
	    okButtonProps: {
	    	style: {
	    		color: 'var(--bg-white)',
	    		backgroundColor: 'var(--bg-darkrose)'
	    	}
	    },
	  });
	} catch(err) {
		// Ocultar modal
		extraData.hideModal()

		// Ocultar mensaje cargando
		message.destroy()

		// Resetear 'secretKey' de formulario
		extraData.resetKey()

		const txt = `A ocurrido un error para comprobar al usuario con el nombre ${user.name}`

		// Mostrar mensaje de error
		message.error(txt, 5)
	}
}