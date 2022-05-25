// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'

/**
 * Obtener la información de un producto
 * @param {config: Object}
 * @returns
 */
export default async function getProductInformation(productId, extraData) {
  const { company, graphqlQuery } = extraData;

  // Graphql query
  const query = JSON.stringify({
    query: `query {
      ${graphqlQuery}(_id: "${productId}") {
        ...ProductFragment
      }}

      ${fragments.product}`,
  });

  try {
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/api/graphql`,
      data: query,
    });

    // Obtener producto
    const product = data["data"][graphqlQuery];

    if (!product) throw new Error("El producto no ha sido encontrado")

    // Setear información del producto
    extraData.setProductInformation({
      ...product,
      categories: product.categories.map((category) => category._id),
    });
  } catch (err) {
    // Mostrar error por consola
    console.error(`[getProductInformation.${company}.error]`, err);

    // Mostrar error por pantalla
    message.error(err.message, 8)
  }
}
