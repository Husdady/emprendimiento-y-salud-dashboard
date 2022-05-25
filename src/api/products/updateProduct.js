// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

/**
 * Actualizar la información de un Producto
 * @param {config: Object}
 * @returns
 */
export default async function updateProduct(product, extraData) {
  const session = await getSession()

  try {
    // Crear Form Data
    const productFormData = new FormData();

    // Setear campos para agregar al 'formData'
    const fields = {
      ...product,
      images: JSON.stringify(product.images),
      benefits: JSON.stringify(product.benefits),
      categories: JSON.stringify(product.categories),
      formHasBeenEdited: extraData.formHasBeenEdited,
    }

    // Obtener campos del producto
    const keys = Object.keys(fields);

    // Por cada campo del producto, setear campos a Form Data
    for (const key of keys) {
      productFormData.append(key, fields[key]);
    }

    const productImages = product.images.map(k => k.file)

    // Setear archivos de cada imagen del producto al 'formData'
    for (const productImage of productImages) {
      productFormData.append('productImages', productImage);
    }

    // Mostrar loading
    extraData.showLoading();

    const timeout = setTimeout(() => {
      message.info("Parece ser que actualizar el producto está tardando más de lo debido, por favor sea paciente", 8);
    }, 10000);

    const res = await axios({
      method: "PUT",
      url: `${API_URL}/api/products/${product._id}`,
      data: productFormData,
      headers: {
        Accept: "*",
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Mostrar mensajes
    message.success(res.data.message, 6);

    // Limpiar timeout
    clearTimeout(timeout)
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    const errorMessage = `A ocurrido un error al actualizar la información del producto '${product.title}'`;

  	/// Si no hay una respuesta del servidor
    if (!err.response) {
      return message.error(errorMessage, 7);
    }
    
    return message.warn(err.response.data.error, 5);
  }
}
