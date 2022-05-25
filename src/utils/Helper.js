// React
import { Fragment } from 'react'

// Components
import { OkButtonModal, CancelButtonModal } from '@common'

// Librarys
import SecureLS from 'secure-ls'
import { message, Modal } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Utils
import dayjs from '@utils/dayjs'
import { isString, isObject, isFunction, isArray, isEmptyArray, isUndefined, isWindowAvailable } from '@utils/Validations'

const { confirm, destroyAll } = Modal

/**
 * Encriptar dato
 * @param {data: String}
 * @returns
 */
export function encryptData(data) {
  if (isUndefined(data)) return null

  const existWindow = isWindowAvailable()
  if (!existWindow) return data
  
  const securityLS = new SecureLS()
  return securityLS.LZString.compress(data)
}

/**
 * Desencriptar dato
 * @param {data: String}
 * @returns
 */
export function decryptData(data) {
  if (isUndefined(data)) return null

  const existWindow = isWindowAvailable()
  if (!existWindow) return data

  const securityLS = new SecureLS()
  const decrompressData = securityLS.LZString.decompress(data)
  
  return decrompressData
}

/**
 * Definir clases a un componente
 * @param {arrClasses: String}
 * @returns
 */
export function classnames(arrClasses) {
  if (!isArray(arrClasses)) return

  return arrClasses.filter((el) => !!el).join(' ')
}

/**
 * Remover espacios en blanco y convertir a minúsculas
 * @param {value: String}
 * @returns
 */
export function removeEmptySpaces(value) {
  if (!value || !isString(value)) return

  return value.replace(/\s+/gim, '').toLowerCase()
}

/**
 * Obtener algunos campos de un objecto
 * @param {data: Object, getFields: Function}
 * @returns
 */
export function getSomeFieldsFromArrayObject(data, getFields) {
  return data.map((item) => (isFunction(getFields) ? getFields(item) : item))
}

/**
 * Obtener algunos campos del usuario
 * @param {str: String, limit: Number}
 * @returns
 */
export function truncate(str, limit = 100) {
  if (!str) return str

  if (str.length > limit) {
    return str.substring(0, limit) + '...'
  }

  return str
}

/**
 * Establecer el índice a una tabla
 * @param {object: Object, i: Number}
 * @returns
 */
export function setIndexToTable({ data, skip, limit }) {
  if (!isArray(data)) return

  return data.map((item, i) => {
    const index = skip === 0 ? i + 1 : limit * skip - (limit - (i + 1))

    return {
      key: item._id,
      index: index,
      ...item,
    }
  })
}

/**
 * Crear estado para usarlo en diferentes componentes
 * @param {objects: Array, methods: Object}
 * @returns
 */
export function createState({ objects, state }) {
  const result = {}

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    const { value, name } = object

    // Si existe un nombre ni valor
    if (!name && !value) {
      // Asignar propiedad "object" a "result"
      Object.assign(result, {
        [object]: state(object),
      })

      continue
    }

    // Asignar propiedades "name" y como valor "state(value)" a "result"
    Object.assign(result, {
      [name]: state(value),
    })
  }

  return result
}

/**
 * Crear dispatch para ejecutar distintas funciones
 * @param {objects: Array, methods: Object}
 * @returns
 */
export function createDispatch({ objects, methods }) {
  const dispatch = {}

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]

    Object.assign(dispatch, {
      [object]: methods(object),
    })
  }

  return dispatch
}

/**
 * Formatear fecha
 * @param {data: String}
 * @returns
 */
export function formatDate(date) {
  // Formatear fecha con day.js
  const formattedDate = dayjs.formatDate({
    date: date,
    format: 'DD [de] MMMM [del] YYYY [a las] h:mm a',
  })

  // Ejm: 20 de Diciembre del 2021 a las 2:06 p.m.
  return formattedDate.replace(/m$/gim, '.m.')
}

/**
 * Evento click en botones de acción
 * @param {data: Array, onDataItem: Function, onDataMultipleItems: Function, emptyMessage: String}
 * @returns
 */
export function onAction(config) {
  const { data, onDataItem, onDataMultipleItems, emptyMessage } = config
  // Si no hay datos
  if (isEmptyArray(data)) {
    isString(emptyMessage) && message.warning(emptyMessage)
    // Si hay un sólo dato
  } else if (isArray(data) && data.length === 1) {
    isFunction(onDataItem) && onDataItem(data[0])
  } else {
    // Si hay más de un dato
    isFunction(onDataMultipleItems) && onDataMultipleItems(data)
  }
}

/**
 * Mostrar modal de confirmación
 * @param {data: Array, onDataItem: Function, onDataMultipleItems: Function, emptyMessage: String}
 * @returns
 */
export function showConfirmModal(config) {
  const darkTheme = config.theme === 'dark'
  const { title, description, confirmButtonTitle, confirmButtonIcon, onCancel, onSuccess } = config

  // Mostrar modal de confirmación
  confirm({
    title: title,
    centered: true,
    closable: true,
    confirmLoading: false,
    onCancel: onCancel,
    content: description,
    okType: 'danger',
    className: 'confirmation-delete-modal',
    icon: <FontAwesomeIcon size="2x" icon="exclamation-circle" className="mb-2" color={darkTheme ? 'var(--bg-darkyellow)' : 'var(--bg-red)'} />,
    okText: <OkButtonModal icon={confirmButtonIcon} title={confirmButtonTitle} />,
    cancelText: <CancelButtonModal />,
    cancelStyle: { backgroundColor: 'red' },
    onOk: () => onSuccess(destroyAll),
    maskStyle: { backgroundColor: darkTheme ? 'var(--theme-opacity-100)' : 'var(--theme-opacity-400)' },
    closeIcon: <FontAwesomeIcon icon="times" color="var(--theme-opacity-200)" />,
  })
}

/**
 * Función que se ejecuta cuando se obtienen datos de la API
 * @param {items: Array, apiItems: Array, onExistApiItems: Function, showLoading: Function, hideLoading: Function, secondsToHideLoading: Number}
 * @returns
 */
export function onGetItems(config) {
  const { items, apiItems, onExistApiItems, showLoading, hideLoading, secondsToHideLoading = 3000 } = config

  // Si existen datos recibidos de la API
  if (!isEmptyArray(apiItems)) {
    // Ejecutar callback cuando existen datos recibidos
    isFunction(onExistApiItems) && onExistApiItems()

    // Si no se han cargado los datos
    if (isEmptyArray(items)) {
      // Mostrar loading
      showLoading()

      // Ocultar loading después de x seg definidos en secondsToHideLoading
      setTimeout(hideLoading, secondsToHideLoading)
    } else {
      // Ocultar loading
      hideLoading()
    }
  } else {
    // Ocultar loading
    hideLoading()
    
    if (items.length > apiItems.length) {
      onExistApiItems()
    }
  }
}

/**
 * Obtener propiedad de un objeto
 * @param {obj: Object, filter: String}
 * @returns
 */
export function getPropertyFromObject(obj, filter, getObject) {
  if (!filter) return
  if (!isObject(obj)) return

  let i = 0
  let property = null
  let properties = filter.split('.')

  for (i; i < properties.length - 1; i++) {
    if (property !== properties[i]) {
      property = properties[i]
    }

    let value = obj[property]

    if (value) {
      obj = value
    } else {
      break
    }
  }

  if (getObject) return obj

  return obj[properties[i]]
}

/**
 * Retorna un array de una longitud 'x'
 * @param {total: Number}
 * @returns
 */
export function generateArray(total) {
  return Array.from(Array(total).map((_, i) => i))
}

/**
 * Obtener dimensiones de la imagen
 * @param {src: String}
 * @returns
 */
export function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = src
  })
}

/**
 * Convertir el peso de una imagen a 'KB', 'MB', etc.
 * @param {bytes: Number, decimals: Number}
 * @returns
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Encadenar un objeto sin comillas dobles
 * @param {obj: Object}
 * @returns
 */
export function stringifyWithoutDoubleQuotes(obj) {
  if (!isObject) return

  const objectToStringify = JSON.stringify(obj)

  return objectToStringify.replace(/"([^"]+)":/g, '$1:')
}

/**
 * Remover espacios en blanco y convertir a minúsculas
 * @param {value: String}
 * @returns
 */
export function convertEmptySpacesInHyphens(value) {
  if (!value || !isString(value)) return

  return value.replace(/\s+/gim, '-').toLowerCase()
}

/**
 * Eliminar elemento de un array
 * @param {data: Array, filter: Object}
 * @returns
 */
export function removeArrayItem(data, filter) {
  if (!isArray(data)) return
  if (!isObject(filter)) return

  const result = []
  const properties = Object.keys(filter)

  for (const property of properties) {
    const newData = data.filter((item) => {
      return item[property] !== filter[property]
    })

    if (!isEmptyArray(newData)) {
      result.push(...newData)
    }
  }

  return result
}

/**
 * Actualizar un elemento de un array
 * @param {data: Array, config: Object}
 * @returns
 */
export function updateArrayItem(data, config) {
  const result = []
  const { filter, newData } = config
  const keys = Object.keys(filter)

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    if (!item) continue

    if (isObject(item)) {
      const existFilter = keys.every((key) => {
        return JSON.stringify(item[key]) === JSON.stringify(filter[key])
      })

      if (existFilter) {
        if (isFunction(newData)) {
          result[i] = newData(item)
          continue
        }

        result[i] = newData
        continue
      }

      result[i] = item
    }
  }

  return result
}
