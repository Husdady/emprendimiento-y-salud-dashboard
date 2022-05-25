// Librarys
import axios from "@api/axios";
import { message } from "antd";

// API
import { API_URL } from "@api/credentials";

// Utils
import { isFunction } from "@utils/Validations";

// Cancelar pedido de cliente
export default function confirmOrder({ order, types, company, showLoading, hideLoading, hideModal }) {
  return async (dispatch, getReduxStore) => {
		// Obtener estado
		const { manageProducts } = getReduxStore();

		// Obtener pedidos
		const { orders } = manageProducts[company]

		// Obtener id del cliente y id del producto
    const { product, clientId, clientName } = order;

		const alreadyOrderIsConfirmed = orders.some(item => item.product._id === product._id && item.status == "completed");

		// Si un pedido ya está completado
		if (alreadyOrderIsConfirmed) {
			return message.warn(`El pedido del cliente ${clientName}, ya ha sido completado`, 6)
		}

		const isCancelledOrder = order.status === "cancelled";

		// Si un pedido ha sido cancelado
		if (isCancelledOrder) {
			return message.warning(`El cliente ${clientName}, ha cancelado el pedido del producto: "${order.product.name}", por lo tanto no puedes confirmar un pedido que ha sido cancelado`, 9)
		}

		// Mostrar "loading" en botón del modal que muestra los detalles del pedido
		if (isFunction(showLoading)) showLoading();

  	try {
  		// Mostrar "Completando pedido"
  		message.loading("Completando pedido", 999)

      const res = await axios({
      	method: "PUT",
      	url: `${API_URL}/api/products/${company}/orders/${clientId}/complete/${product._id}`
      })
    
      // Actualizar estado de pedido de la tabla
      dispatch({
      	type: types.changeOrderStatus,
      	clientId: clientId,
      	index: order.index,
      	status: "completed",
      });

      // Ocultar "loading" en botón del modal que muestra los detalles del pedido
      if (isFunction(hideLoading)) hideLoading();

      // Ocultar modal que muestra los detalles del pedido
      if (isFunction(hideModal)) hideModal();

      // Ocultar "Completando pedido"
      message?.destroy();

      // Mostrar mensaje existoso
      return message.success(res.data.message, 7);
  	} catch(err) {
  		// Ocultar "Completando pedido"
      message?.destroy();

      // Ocultar "loading" en botón del modal que muestra los detalles del pedido
	    if (isFunction(hideLoading)) hideLoading();

  		// Si no hay respuesta del servidor
  		if (!err.response) {
  			const k = `A ocurrido un error al completar el pedido del producto: "${order.product.name}"`
  			return message.error(k);
  		}

  		// Si se recibe un error, mostrarlo
      if (err.message) {
        return message.error(err.message, 6)
      }
  	}
  };
}
