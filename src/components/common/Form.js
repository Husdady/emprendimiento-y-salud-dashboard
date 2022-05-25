// React
import { Component, createRef } from 'react'

// Librarys
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Utils
import { classnames, getPropertyFromObject } from '@utils/Helper'
import { isFunction, isString, isEmptyString, isObject, isEmptyObject, validateSchemaField } from '@utils/Validations'

export default class Form extends Component {
  static defaultProps = {
    initialValues: {},
    validationSchema: {},
    validateOnChange: true,
    validateAllFields: false,
  }

  constructor(props) {
    super(props)
    this.defaultInitialValues = this.props.initialValues
    this.resetForm = this.resetForm.bind(this)
    this.setErrors = this.setErrors.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setFieldValue = this.setFieldValue.bind(this)
    this.setNestedField = this.setNestedField.bind(this)
    this.setMultipleFields = this.setMultipleFields.bind(this)
    this.updateInitialValues = this.updateInitialValues.bind(this)
    this.verifyIfIsValidForm = this.verifyIfIsValidForm.bind(this)
    this.runMatchPasswords = this.runMatchPasswords.bind(this)
    this.runValidationErrors = this.runValidationErrors.bind(this)
    this.runValidationSubmit = this.runValidationSubmit.bind(this)
    this.runValidateAllFields = this.runValidateAllFields.bind(this)
    this.runValidationSchemaRules = this.runValidationSchemaRules.bind(this)

    this.state = {
      errors: {},
      isValidForm: false,
      formHasBeenEdited: false,
      values: this.props.initialValues,
      initialValues: this.defaultInitialValues,
    }

    this.getRulesSchema = this.props.validationSchema ? Object.values(this.props.validationSchema) : []
    this.getPropertiesNameSchema = this.props.validationSchema ? Object.getOwnPropertyNames(this.props.validationSchema) : []
    this.getPropertiesValues = Object.getOwnPropertyNames(this.props.initialValues)
  }

  componentDidMount() {
    this.verifyIfIsValidForm(this.state.values)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { values, errors, isValidForm, initialValues, formHasBeenEdited } = this.state

    return (
      values !== nextState.values ||
      errors !== nextState.errors ||
      initialValues !== nextState.initialValues ||
      isValidForm !== nextState.isValidForm ||
      formHasBeenEdited !== nextState.formHasBeenEdited ||
      this.props.initialValues !== nextProps.initialValues
    )
  }

  componentDidUpdate() {
    this.updateInitialValues()
    this.verifyIfIsValidForm()
  }

  // Ejecutar validación en el evento 'onSubmit' del formulario para saber si contiene errores
  runValidationSubmit({ errors, extraData = {} }) {
    // Setear errores
    this.setErrors(errors)

    // Si no existen errores en el formulario
    if (isEmptyObject(errors)) {
      // Setear formulario válido
      this.setState({ isValidForm: true, formHasBeenEdited: false })

      // Setear datos adicionales a 'extraData'
      Object.assign(extraData, {
        setFormStatus: this.setState.bind(this),
        formHasBeenEdited: this.state.formHasBeenEdited,
      })

      // Ejecutar evento onSubmit
      if (isFunction(this.props.onSubmit)) {
        this.props.onSubmit({
          values: this.state.values,
          resetForm: this.resetForm,
          extraData: extraData,
          setErrors: this.setErrors,
        })
      }
    }
  }

  // Validar todos los campos
  runValidateAllFields(extraData) {
    const { values } = this.state
    const { validationSchema } = this.props

    if (validationSchema) {
      const schemaErrors = this.getRulesSchema.reduce((acc, _, i) => {
        // Obtener cada campo del esquema
        const field = this.getPropertiesNameSchema[i]
        // Validar reglas del esquema
        const result = this.runValidationSchemaRules(field, values[field])
        return { ...acc, ...result }
      }, {})

      // Validar evento submit
      this.runValidationSubmit({
        errors: schemaErrors,
        extraData: extraData,
      })
    }
  }

  // Validar las reglas del esquema
  runValidationSchemaRules(field, value) {
    // Obtener esquema
    const { validationSchema } = this.props
    // Obtener reglas del campo (required, min, max, etc)
    const fieldRules = validationSchema[field]

    // Comprobar si existe la regla min
    const existMinRule = fieldRules?.min
    const min = existMinRule?.limit
    const minMessage = existMinRule?.message

    // Comprobar si existe la regla max
    const existMaxRule = fieldRules?.max
    const max = existMaxRule?.limit
    const maxMessage = existMaxRule?.message

    // Reglas del esquema
    const rules = {
      name: field,
      value: value,
      required: fieldRules?.required,
      min: {
        limit: min || existMinRule,
        message: existMinRule && (isFunction(minMessage) ? minMessage(min) : minMessage),
      },
      max: {
        limit: max || existMaxRule,
        message: existMaxRule && (isFunction(maxMessage) ? maxMessage(min) : maxMessage),
      },
    }

    // Si existe la regla 'isEmail' en un campo del esquema
    if (fieldRules?.isEmail) {
      // Agregar regla 'isEmail' a todos las reglas
      rules.isEmail = fieldRules?.isEmail

      // Si existe la regla 'isMatchPassword' en un campo del esquema
    } else if (fieldRules?.isMatchPassword) {
      // Obtener campo relacionado
      const relateWithField = this.props.validationSchema[fieldRules.relateWithField]
      // Obtener propiedades del campo relacionado
      rules.required = relateWithField?.required
      rules.min.limit = relateWithField?.min || relateWithField?.min?.limit
      rules.min.message = relateWithField?.min?.message
      rules.max.limit = relateWithField?.max || relateWithField?.max?.limit
      rules.max.message = relateWithField?.max?.message

      // Agregar regla 'isMatchPassword' a todos las reglas
      rules.isMatchPassword = {
        value: this.state.values[fieldRules.relateWithField],
        relateWithField: fieldRules.relateWithField,
      }
    }

    // Validar campos del esquema
    const errors = validateSchemaField(rules)

    // Retornar errores encontrados en un campo
    return errors
  }

  // Validar errores en los campos del esquema
  runValidationErrors(field, errors) {
    const withOutErrors = isEmptyObject(errors) && isEmptyObject(this.state.errors)

    // Si no existen errores, finalizar validación
    if (withOutErrors) return

    // Si no existen errores, limpiar errores
    if (isEmptyObject(errors)) {
      const compressedError = { ...this.state.errors }
      delete compressedError[field]
      return this.setErrors(compressedError)
    }

    // Setear errores
    return this.setErrors({ ...this.state.errors, ...errors })
  }

  // Ejecutar validación entre coincidencia de contraseñas
  runMatchPasswords({ password, matchPassword }) {
    // Setear campo
    this.setFieldValue(password.field, password.value)

    const existMatchPassword = !isEmptyString(password.value) && password.value === matchPassword.value

    // Comprobar si las contraseñas coinciden
    if (existMatchPassword) {
      const compressedError = { ...this.state.errors }
      delete compressedError[password.field]
      delete compressedError[matchPassword.field]

      // Setear errores
      this.setErrors(compressedError)
    }
  }

  // Setear un campo
  setFieldValue(field, value) {
    // Destructurar props
    const { validateOnChange, validationSchema } = this.props

    // Nuevo campo
    const newFieldValue = { ...this.state.values, [field]: value }

    // Establecer nuevo estado
    const newState = { values: newFieldValue }

    // Validar formulario cuando se ejecuta el evento 'onChange'
    if (validateOnChange) {
      let errors

      if (validationSchema) {
        // Obtener errores de la validación del esquema
        errors = this.runValidationSchemaRules(field, value)
      }

      this.runValidationErrors(field, errors)
    }

    // Si el formulario no ha sido editado
    if (!this.state.formHasBeenEdited) {
      Object.assign(newState, {
        formHasBeenEdited: true,
      })
    }

    // Actualizar estado
    return this.setState(newState)
  }

  // Setear múltiples campos
  setMultipleFields(fields) {
    // Si no es un objeto el parámetro 'fields'
    if (!isObject(fields)) return

    // Setear nuevos campos
    this.setState({
      formHasBeenEdited: true,
      values: {
        ...this.state.values,
        ...fields,
      },
    })
  }

  // Setear campo anidado
  setNestedField(filter, value) {
    // Obtener el campo anidado a actualizar
    const result = getPropertyFromObject(this.state.values, filter, {
      getObject: true,
    })

    // Dividir filtro por cada punto
    const splitFilter = filter.split('.')
    // Obtener el penúltimo campo del filtro
    const prevField = splitFilter[splitFilter.length - 2]
    // Obtener el último campo del filtro
    const lastField = splitFilter[splitFilter.length - 1]

    Object.assign(result, {
      [lastField]: value,
    })

    // Setear estado
    this.setState((currentState) => ({
      ...currentState,
      formHasBeenEdited: true,
      values: {
        ...this.state.values,
        [prevField]: result,
      },
    }))
  }

  // Setear errores
  setErrors(err) {
    if (this.state.errors === err) return

    return this.setState((currentState) => ({ ...currentState, errors: err }))
  }

  // Método cuando el formulario es válido
  handleSubmit(e) {
    e.preventDefault()
    return this.runValidateAllFields()
  }

  // Verificar si es formulario válido
  verifyIfIsValidForm() {
    // Recorrer las propiedades del esquema, retornar true si el formulario tiene valores válidos y false cuando tiene información vacía
    const isValidForm = Object.keys(this.props.validationSchema).every((property) => this.state.values[property])

    // Si no existen errores, setear formulario válido
    if (isEmptyObject(this.state.errors) && isValidForm) {
      !this.state.isValidForm && this.setState({ isValidForm: true })
    } else {
      this.state.isValidForm && this.setState({ isValidForm: false })
    }
  }

  // Actualizar valores por defecto
  updateInitialValues() {
    if (this.props.initialValues !== this.state.initialValues) {
      this.setState({
        errors: {},
        values: this.props.initialValues,
        initialValues: this.props.initialValues,
      })
    }
  }

  // Resetear formulario
  resetForm() {
    this.setState({
      errors: {},
      isValidForm: false,
      formHasBeenEdited: false,
      values: this.props.initialValues,
      initialValues: this.defaultInitialValues,
    })
  }

  render() {
    return (
      <form className={this.props.className} style={this.props.style} onSubmit={this.handleSubmit} {...this.props.attributes}>
        {this.props.children({
          values: this.state.values,
          setFieldValue: this.setFieldValue,
          setNestedField: this.setNestedField,
          setMultipleFields: this.setMultipleFields,
          setFormStatus: this.setState.bind(this),
          errors: this.state.errors,
          setErrors: this.setErrors,
          isValidForm: this.state.isValidForm,
          resetForm: this.resetForm,
          runMatchPasswords: this.runMatchPasswords,
          handleSubmit: this.runValidateAllFields,
        })}
      </form>
    )
  }
}

// Renderizar error en formulario
export function renderError(error, color, textStyle) {
  if (!error || !isString(error)) return

  const textColor = isString(color) ? color : 'var(--bg-red)'
  return <Error title={error} color={textColor} textStyle={textStyle} />
}

// <------------------------ Extra Components ------------------------>
// Título en el formulario
export class Title extends Component {
  static defaultProps = {
    iconColor: '#000',
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { iconName, iconColor, children } = this.props
    const classes = classnames(["d-flex align-items-center", this.props.className])

    return (
      <div className={classes}>
        <FontAwesomeIcon icon={iconName} color={iconColor} />
        <h4 className="subtitle mb-0 ms-1 fw-bold fs-6 titillium-web">{children}</h4>
      </div>
    )
  }
}

// Error en el formulario
export class Error extends Component {
  static defaultProps = {
    color: 'var(--bg-darkyellow)',
  }

  shouldComponentUpdate(nextProps) {
    return this.props.title !== nextProps.title
  }

  render() {
    const { color, textStyle } = this.props

    return (
      <span className="error-message d-flex align-items-center mt-2">
        {/* Ícono */}
        <FontAwesomeIcon icon="exclamation-circle" color={color} />

        {/* Texto */}
        <span className="ms-1" style={{ color, ...textStyle }}>
          {this.props.title}
        </span>
      </span>
    )
  }
}
