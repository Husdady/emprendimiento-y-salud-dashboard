// Types
import {
  DELETE_TESTIMONY,
  SET_TESTIMONIALS,
  SHOW_LOADING_TESTIMONIALS,
  HIDE_LOADING_TESTIMONIALS,
} from "@redux/types";

// Thunks
import { getTestimonials, deleteTestimony } from "@redux/thunks";

const initialState = {
  testimonials: [],
  totalTestimonials: 0,
  loadingTestimonials: null,
};

const manageTestimonials = (state = initialState, action) => {
  switch (action.type) {
    // Mostrar cargando en la sección de testimonios
    case SHOW_LOADING_TESTIMONIALS:
      return { ...state, loadingTestimonials: true };

    // Ocultar cargando en la sección de testimonios
    case HIDE_LOADING_TESTIMONIALS:
      return { ...state, loadingTestimonials: false };

    // Seter testimonios
    case SET_TESTIMONIALS:
      return {
        ...state,
        testimonials: action.testimonials,
        totalTestimonials: action.testimonials.length
      };

      // Seter testimonios
    case DELETE_TESTIMONY:
      return {
        ...state,
        testimonials: state.testimonials.filter(testimony => testimony._id !== action.testimonyId)
      };

    default:
      return state;
  }
};

// Obtener el estado del reducer
export const getTestimonialsState = ({ manageTestimonials }) => ({ ...manageTestimonials });

// Exportar reducer
export default manageTestimonials;
