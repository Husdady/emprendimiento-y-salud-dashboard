// Types
import * as types from '@redux/types';

// Utils
import { encryptData, decryptData } from "@utils/Helper";

const initialState = {
	userSavedInLogin: {},
  isUserRememberedAtLogin: false,
  session: {
    user: {}
  },
};

const authentication = (state = initialState, action) => {
  switch (action.type) {
    // Recordar usuario en inicio de sesión
    case types.REMEMBER_USER:
      return {
        ...state,
        isUserRememberedAtLogin: true,
        userSavedInLogin: {
          email: encryptData(action.userEmail),
          password: encryptData(action.userPassword),
        },
      };

    // Olvidar usuario
    case types.FORGET_USER:
      return {
        ...state,
        userSavedInLogin: {},
        isUserRememberedAtLogin: false,
      };

    // Guardar sesión de usuario
    case types.SAVE_SESSION:
      const user = {}
      const userKeys = Object.keys(action.user);

      for (let key of userKeys) {
        if (!action.user[key]) continue;

        user[key] = action.user[key]
      }

      return {
      	...state,
      	session: {
          user: {
            ...state.session.user,
            ...user
          }
        },
      };

    // Limpiar sesión de usuario
    case types.CLEAN_SESSION:
      return {
        ...state,
        session: {
          user: {}
        }
      }

    default:
      return state
  }
}

export default authentication;

// Obtener el estado del reducer
export const getAuthenticationState = ({ authentication }) => {
  const session = {
    user: {}
  }

  // Desencriptar 'email' y 'password' de usuario que ha iniciado sesión
  const userSavedInLogin = {
    email: decryptData(authentication.userSavedInLogin.email),
    password: decryptData(authentication.userSavedInLogin.password),
  }

  // Obtener al usuario que está en sesión
  const { user } = authentication.session
  const userKeys = Object.keys(user)

  // Iterar cada campo del usuario
  for (let key of userKeys) {
    if (!user[key]) continue

    // Asignar al objeto 'session' cada propiedad del usuario que ha iniciado sesión
    Object.assign(session.user, {
      [key]: user[key]
    })
  }

  return {
    session: session,
    userSavedInLogin: userSavedInLogin,
    isUserRememberedAtLogin: authentication.isUserRememberedAtLogin,
  }
}
