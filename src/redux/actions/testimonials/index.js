// Thunks
import { getTestimonials, deleteTestimony } from '@redux/thunks'

export default function(dispatch) {
	return {
		// Obtener testimonios
  	getTestimonials: () => dispatch(getTestimonials()),

  	// Eliminar testimonio
	  deleteTestimony: function(testimony, extraData) {
	    return dispatch(deleteTestimony(testimony, extraData));
	  },
	}
}