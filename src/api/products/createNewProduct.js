// Librarys
import axios from "@api/axios";
import { message } from "antd";
import { getSession } from 'next-auth/react'

// API
import { API_URL } from "@api/credentials";

/**
 * Crear un nuevo producto
 * @param {config: Object}
 * @returns
 */
export default async function createNewProduct(product, extraData) {
  const { company } = extraData

  // Obtener sesión de usuario
  const session = await getSession()

  // Obtener token de usuario
  const token = session.user.access_token;

  try {
    // Crear Form Data
    const productFormData = new FormData();

    // Setear información del nuevo producto
    const newProduct = {
      ...product,
      files: product.images.map(k => k.file)
    }

    // Obtener campos del producto
    const keys = Object.keys(product);

    // Campos para convertir a string
    const fieldsToStringify = ["categories", "benefits", "images"];

    // Por cada campo del producto, setear campos a Form Data
    for (var key of keys) {
      if (fieldsToStringify.indexOf(key) !== -1) {
        productFormData.append(key, JSON.stringify(newProduct[key]))
      } else {
        productFormData.append(key, newProduct[key]);
      }
    }

    // Setear imágenes del producto a Form Data
    for (var file of newProduct.files) {
      productFormData.append('productImages', file)
    }

    // Setear si el formulario ha sido editado
    productFormData.append("formHasBeenEdited", extraData.formHasBeenEdited);

    // Mostrar loading
    extraData.showLoading();

    const timeout = setTimeout(() => {
      message.info("Parece ser que la creación del producto está tomando más de lo debido, por favor espere un poco más", 8);
    }, 10000);

    const res = await axios({
      method: "POST",
      url: `${API_URL}/api/products/${company}/add-new-product`,
      data: productFormData,
      headers: {
        Accept: "*",
        Authorization: `Bearer ${token}`,
      },
    });

    // Ocultar loading
    extraData.hideLoading();

    // Resetear formulario
    extraData.resetForm();

    // Mostrar mensajes
    message.success(res.data.message, 6);

    // Limpiar timeout
    clearTimeout(timeout);
  } catch (err) {
    // Ocultar loading
    extraData.hideLoading();

    // Limpiar timeout
    clearTimeout(timeout);

    // Mostrar error por consola
    console.error(`[createNewProduct.${company}]`, err)

    const errorMessage = "A ocurrido un error al crear un producto. Inténtalo más tarde";

    // Si no hay una respuesta del servidor
    if (!err.response) {
      return message.error(errorMessage, 8);
    }

    return message.error(err.response.data.error || errorMessage, 6);   
  }
}
