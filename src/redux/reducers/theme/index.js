// Types
import { DARK_THEME, LIGHT_THEME } from '@redux/types';

const initialState = 'light';

const theme = (state = initialState, action) => {
  switch (action.type) {
  	// Habilitar modo oscuro
    case DARK_THEME:
      return 'dark';

    // Habilitar modo claro
    case LIGHT_THEME:
      return 'light';

    default:
      return state
  }
}

// Obtener estado del reducer
export const getThemeState = ({ theme }) => ({ theme })
export default theme;
