// Types
import { DARK_THEME, LIGHT_THEME } from "@redux/types";

export default function(dispatch) {
	return {
		// Habilitar el tema oscuro
		changeToDarkTheme(userEmail) {
		  return dispatch({ type: DARK_THEME });
		},

		// Habilitar el tema claro
		changeToLightTheme(userEmail) {
		  return dispatch({ type: LIGHT_THEME });
		}
	}
}