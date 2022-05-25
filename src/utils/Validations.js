// Librarys
import { message } from "antd";

// Comprobar si es un string
function isString(string) {
  return typeof string === "string";
}

// Comprobar si es un string vacío
function isEmptyString(string) {
  return typeof string === "string" && string.length === 0;
}

// Comprobar si es un número
function isNumber(number) {
  return typeof number === "number";
}

// Comprobar si es un valor booleano
function isBoolean(data) {
  return typeof data === "boolean";
}

// Comprobar si es una función
function isFunction(func) {
  return typeof func === "function";
}

// Comprobar si es un arreglo
function isArray(array) {
  return Array.isArray(array);
}

// Comprobar si es un arreglo vacío
function isEmptyArray(array) {
  return isArray(array) && array.length === 0;
}

// Comprobar si es un valor nulo
function isNull(data) {
  return data === null;
}

// Comprobar si es un valor indefinido
function isUndefined(data) {
  return typeof data === "undefined";
}

// Comprobar si es un error
function isError(err) {
  return err instanceof Error
}

// Comprobar si es un objeto
function isObject(obj) {
  return typeof obj === "object";
}

// Comprobar si es un objeto vacío
function isEmptyObject(obj) {
  return obj && isObject(obj) && Object.keys(obj).length === 0;
}

// Comprobar si la longitud de un string es menor que el valor asignado
function isLessThan({ value, min }) {
  const validTypes = isString(value) || isArray(value);
  
  return validTypes && isNumber(min) && value.length < min;
}

// Comprobar si la longitud de un string es mayor que el valor asignado
function isGreaterThan({ value, max }) {
  return isString(value) && isNumber(max) && value.length > max;
}

// Comprobar si el objecto 'window' está disponible
function isWindowAvailable() {
  return typeof window !== 'undefined'
}

// Comprobar si es un correo electrónico
function isEmail(email) {
  let isValidEmail = null,
    verifyEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (verifyEmail.test(email)) {
    isValidEmail = true;
  } else {
    isValidEmail = false;
  }
  return isValidEmail;
}

// Comprobar si es una url válida
function isValidUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');
  return !!pattern.test(str);
}

// Comprobar si es un campo válido de un formulario
function validateSchemaField(field) {
  // Errores de la validación
  const errors = {};
  
  // Validar regla 'min' del esquema
  const minValidation = isLessThan({
    value: field.value,
    min: field.min.limit,
  });

  // Validar regla 'max' del esquema
  const maxValidation = isGreaterThan({
    value: field.value,
    max: field.max.limit,
  });

  // Comprobar si existe la regla 'required' en el esquema
  if (!field.value || isEmptyArray(field.value)) {
    // Si el campo no tiene valor
    field.required && (errors[field.name] = field.required);

    // Setear un mensaje por defecto para el campo email
    field.name === 'email' && (errors[field.name] = field.required || "Por favor ingresa un correo electrónico");

    // Comprobar si existe la regla 'min' en el esquema
  } else if (minValidation) {
    if (field.min.limit) {
      const minMessage = `Debe tener un mínimo de ${field.min.limit} cáracteres`;

      errors[field.name] = field.min.message || minMessage;
    }

    // Comprobar si existe la regla 'max' en el esquema
  } else if (maxValidation) {
    if (field.max.limit) {
      const maxMessage = `Se ha excedido la longitud máxima de ${field.max.limit} cáracteres`;

      errors[field.name] = field.max.message || maxMessage;
    }

    // Comprobar si existe la regla 'isEmail' en el esquema
  } else if (field.isEmail) {
    // Si no es un email válido
    if (!isEmail(field.value)) {
      errors[field.name] = "Ingresa un correo electrónico válido";
    }

    // Comprobar si existe la regla 'isMatchPassword' en el esquema
  } else if (field.isMatchPassword) {
   if (field.value !== field.isMatchPassword.value) {
      errors[field.name] = "Ambas contraseñas no coinciden";
    }
  }

  return errors;
}

// Comprobar si es una contraseña de confirmación válida de un formulario
function validateConfirmPassword(password) {
  // Errores de la validación
  const errors = {};

  // Verificar si tiene un validación de un mínimo de carácteres
  const minValidation = isLessThan({
    value: field.value,
    min: field.min.limit,
  });

  // Verificar si tiene un validación de un mínimo de carácteres
  const maxValidation = isGreaterThan({
    value: field.value,
    max: field.max.limit,
  });

  if (!password.value) {
    errors.confirmPassword = password.required;
  } else if (password.value !== password.linkToField) {
    errors.confirmPassword =
      password.messageWithoutEquality || "Ambas contraseñas no coinciden";
  } else if (password.value === password.linkToField && minValidation) {
    errors.confirmPassword = password.shortValue;
  } else if (password.value === password.linkToField && maxValidation) {
  }
  return errors;
}

// Comprobar si es un email válido de un formulario
function validateEmail(email) {
  // Errores de la validación
  const errors = {};

  if (!email.value) {
    errors.email = email.required || "Por favor ingresa un correo electrónico";
  } else if (!isEmail(email.value)) {
    errors.email = email.message || "Ingresa un correo electrónico válido";
  }
  return errors;
}

// Validar creación o edición de una categoría
function validateCategory({ value, onValidCategory }) {
  if (value === null) {
    message.warning("Proceso cancelado", 3);

    // Si no ha establecido el valor de la categoría
  } else if (isEmptyString(value)) {
    message.warning("No se ha establecido el nombre de la categoría", 3);

    //  Si la categoría es menor a 4
  } else if (isLessThan({ value: value, min: 4 })) {
    message.warning("El nombre de la categoría es muy corto", 2);

    //  Si la categoría es mayor a 24
  } else if (isGreaterThan({ value: value, max: 24 })) {
    message.warning("El nombre de la categoría es muy largo", 2);

    // Si la categoría sólo es texto y números, es categoría válida
  } else if (/^[a-zA-Z0-9\u00C0-\u024F -]*$/gim.test(value)) {
    isFunction(onValidCategory) && onValidCategory();
  } else {
    // Categoría inválida
    message.warning("El nombre de la categoría no es válido", 2);
  }
}

export {
  isString,
  isEmptyString,
  isNumber,
  isBoolean,
  isFunction,
  isArray,
  isEmptyArray,
  isNull,
  isUndefined,
  isError,
  isObject,
  isEmptyObject,
  isLessThan,
  isGreaterThan,
  isWindowAvailable,
  isEmail,
  isValidUrl,
  validateConfirmPassword,
  validateEmail,
  validateSchemaField,
  validateCategory,
};
