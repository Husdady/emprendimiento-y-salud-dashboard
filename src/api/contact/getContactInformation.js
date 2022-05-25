// Librarys
import axios from "@api/axios";
import { message } from 'antd';

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'

// Graphql query
const query = JSON.stringify({
  query: `query {
    contact {
      ...ContactFragment
    }}

    ${fragments.contact}`,
});

/**
 * Obtener información de contacto
 * @param {extraData: Object}
 * @returns
 */
export default async function getContactInformation(extraData) {
  try {
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/api/graphql`,
      data: query,
    });

    // Obtener información de contacto
    const contactInformation = data["data"].contact;

    // Si existe la información de contacto
    if (contactInformation) {
      // Setear información de contacto
      extraData.setContactInformation({
        ...contactInformation,
        contactPhoto: contactInformation?.contactPhoto?.url,
      });

    }

    // Ocultar loading
    extraData.hideLoading();
  } catch (err) {
    // Mostrar error por consola
    console.error("[getContactInformation.error]", err.response);

    // Mostrar error por pantalla
    message.warning('A ocurrido un error al obtener la información de contacto', 7)
  }
}
