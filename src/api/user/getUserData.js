// Librarys
import { message } from "antd";
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

// Foto de perfil de usuario por defecto
const defaultProfilePhoto = require("@assets/img/user-avatar.webp").default.src;

/**
 * Obtener la información de un usuario
 * @param {userId: String, extraData: Object}
 * @returns
 */
export default async function getUserData(userId, extraData) {
  // Graphql query
  const query = JSON.stringify({
    query: `query {
    user(_id: "${userId}") {
      _id
      fullname
      email
      role {
        name
      }
      profilePhoto {
        url
      }
    }
  }`,
  });

  try {
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/api/graphql`,
      data: query,
    });

    // Obtener usuario
    const user = data["data"].user;

    if (!user) return message.error("El usuario no ha sido encontrado", 6);

    // Setear información de usuario
    extraData.setUserInformation({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role.name,
      profilePhoto: user.profilePhoto?.url || defaultProfilePhoto,
    });
  } catch (err) {
    console.log("[getUserData]", err.response);
  }
}
