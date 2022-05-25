// Librarys
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

// Utils
import { onGetItems } from "@utils/Helper";
import { isEmptyArray } from "@utils/Validations";

export default function getCategories({ types, company, graphqlQuery }) {
  return async (dispatch, getState) => {
    // Graphql query
    const query = JSON.stringify({
      query: `query {
        ${graphqlQuery} {
          _id
          name
        }
      }`,
    });

    // Obtener estado
    const { manageProducts } = getState();

    // Obtener categorías
    const { categories } = manageProducts[company];

    // Si ya se han cargado las categorías, mostrar loading
    if (!isEmptyArray(categories)) {
      dispatch({ type: types.showLoading });
    }

    try {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      // Obtener categorías de productos
      const APICategories = data["data"][graphqlQuery];
      
      if (!APICategories) return;

      // Función para obtener datos de una API
      onGetItems({
        items: categories,
        apiItems: APICategories,
        showLoading: () => dispatch({ type: types.showLoading }),
        hideLoading: () => dispatch({ type: types.hideLoading }),
        onExistApiItems: function() {
          const field = company + 'Categories'

          // Setear categorías de productos
          return dispatch({
            type: types.setCategories,
            [field]: APICategories,
          });
        }
      });
    } catch (err) {
      console.log(`[getCategories.${company}.error]`, err);
    }
  };
}
