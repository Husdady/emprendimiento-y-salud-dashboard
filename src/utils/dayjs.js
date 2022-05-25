// Librarys
import dayjs from "dayjs"
import updateLocale from "dayjs/plugin/updateLocale"
import localizedFormat from "dayjs/plugin/localizedFormat"

// Cambiar idioma a español
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  months: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
})

// Formatear a fecha local 
dayjs.extend(localizedFormat)

// Formatear fecha
function formatDate({ date, format }) {
  return dayjs(date).locale('en').format(format)
}

// Añadir funciones extras a dayjs
Object.assign(dayjs, { formatDate })

export default dayjs;
export { formatDate };
