// Thunks
import { signIn, signOut, updateMyPersonalInformation } from "@redux/thunks";

// Types
import { FORGET_USER, REMEMBER_USER, SAVE_SESSION } from "@redux/types";

export default function(dispatch) {
	return {
		// Olvidar datos de usuario en el inicio de sesión
		forgetUser(){
		  return dispatch({ type: FORGET_USER })
		},

		// Recordar datos de usuario al inicio de sesión
		rememberUser({ userEmail, userPassword }) {
		  return dispatch({
		    type: REMEMBER_USER,
		    userEmail: userEmail,
		    userPassword: userPassword,
		  })
		},

		// Cargar credenciales de inicio de sesión
		loadUserCredentials(user) {
			return dispatch({
				type: SAVE_SESSION,
				user: user,
			})
		},

		// Iniciar sesión
		signIn(credentials, extraData) {
			return dispatch(signIn(credentials, extraData))
		},

		// Cerrar sesión
		signOut(extraData) {
			return dispatch(signOut(extraData))
		},

		// Actualizar la información personal del usuario que ha iniciado sesión
		updateMyPersonalInformation(values, extraData) {
			return dispatch(updateMyPersonalInformation(values, extraData))
		},
	}
}