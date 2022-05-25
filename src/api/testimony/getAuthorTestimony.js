// Librarys
import { message } from "antd";
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

// Utils
import fragments from '@utils/fragments'

/**
 * Obtener la información de un usuario
 * @param {testimonyId: String, extraData: Object}
 * @returns
 */
export default async function getAuthorTestimony(author, extraData) {
  // Graphql query
  const query = JSON.stringify({
    query: `query {
    author_testimony(name: "${author}") {
      ...AuthorTestimonyFragment
    }}

    ${fragments.author_testimony}`,
  });

  try {
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/api/graphql`,
      data: query,
    });

    // Obtener usuario
    const author_testimony = data["data"].author_testimony;

    // Setear usuario
    if (author_testimony) {
      extraData.setTestimony({
        id: author_testimony._id,
        author: author_testimony.author.name,
        age: author_testimony.author.age,
        country: author_testimony.author.country,
        testimony: author_testimony.testimony,
        authorPhoto: author_testimony?.author?.photo?.url,
      });
    } else {
      message.error("El autor del testimonio no ha sido encontrado", 6);
    }
  } catch (err) {
    console.log("[getAuthorTestimony.error]", err.response);
  }
}
