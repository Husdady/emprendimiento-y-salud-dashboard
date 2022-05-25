// Librarys
import axios from "@api/axios";
import { message } from 'antd' 

// API
import { API_URL } from "@api/credentials";

// Types
import {
  SET_TESTIMONIALS,
  SHOW_LOADING_TESTIMONIALS,
  HIDE_LOADING_TESTIMONIALS,
} from "@redux/types";

// Utils
import fragments from '@utils/fragments'
import { onGetItems } from "@utils/Helper"
import { isEmptyArray } from "@utils/Validations";

// Obtener testimonios
export default function getTestimonials() {
  // Graphql query
  const query = JSON.stringify({
    query: `query {
      testimonials {
        ...TestimonialsFragment
      }}

      ${fragments.testimonials}`,
  });

  return async (dispatch, getState) => {
    // Obtener estado de testimonios
    const { manageTestimonials } = getState();

    // Obtener sólo los testimonios
    const { testimonials } = manageTestimonials

    // Testimonios vacíos
    const emptyTestimonials = isEmptyArray(testimonials)

    // Si ya se han cargado los testimonios, mostrar loading
    if (!emptyTestimonials) {
      dispatch({ type: SHOW_LOADING_TESTIMONIALS })
    }

    try {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/api/graphql`,
        data: query,
      });

      // Obtener testimonios
      const APITestimonials = data["data"].testimonials;
      
      // Si la API no retorna los testimonios en formato 'Array'
      if (!APITestimonials) return;

      onGetItems({
        items: testimonials, 
        apiItems: APITestimonials,
        secondsToHideLoading: 4000,
        showLoading: () => dispatch({ type: SHOW_LOADING_TESTIMONIALS }),
        hideLoading: () => dispatch({ type: HIDE_LOADING_TESTIMONIALS }),
        onExistApiItems: function() {
          return dispatch({
            type: SET_TESTIMONIALS,
            testimonials: APITestimonials,
          });
        },
      })
    } catch (err) {
      // Mostrar error por consola
      console.error("[getTestimonials.error]", err);

      // Mostrar error por pantalla
      message.warning("A ocurrido un error al obtener los testimonios", 10)
    }
  };
}
