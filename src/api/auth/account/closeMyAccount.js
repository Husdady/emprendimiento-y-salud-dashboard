// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { signOut } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

// Utils
import { showConfirmModal } from "@utils/Helper";

/**
 * Eliminar definitivamente una cuenta de un usuario
 * @param {user: Object, extraData: Object}
 * @returns
 */
export default function closeMyAccount(user, extraData) {
  showConfirmModal({
    theme: extraData.theme,
    title: "¿Estás seguro o segura que deseas cerrar tu cuenta?",
    description:
      "Al eliminar tu cuenta, perderás toda tu información, antes de eliminarla, recomendamos hacer una copia de seguridad de tus datos personales.",
    confirmButtonIcon: "trash-alt",
    confirmButtonTitle: "Eliminar mi cuenta",
    onSuccess: async function (hideConfirmModal) {
      try {
        // Ocultar modal
        hideConfirmModal();

        // Mostrar cargando
        message.loading("Eliminando cuenta...", 999);

        // Verficiar si es un usuario administrador
        const isAdmin = user.role === "Administrador";
        const accountType = isAdmin ? "admin" : 'user';

        const URL = `${API_URL}/api/auth/account/close-my-account`;

        // Configuración de axios
        const config = {
          method: "DELETE",
          url: URL,
          headers: {
            Authorization: `Bearer ${extraData.token}`,
          },
          data: {
            userId: user._id,
            accountType: accountType,
          }
        };

        await axios(config)

        // Ocultar cargando
        message.destroy()

        // Mostrar mensaje existoso
        await message.error("Tu cuenta ha sido eliminada", 4)

        // Cerrar sesión
        return signOut({
          callbackUrl: '/auth/login'
        })
      } catch(error) {console.log('[error]', error.response)
        // Ocultar cargando
        message.destroy()

        // Mostrar mensaje de error
        message.error("Ha ocurrido un error al eliminar tu cuenta", 7);
      }
    }
  })
}
