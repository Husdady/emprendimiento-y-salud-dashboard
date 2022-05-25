// React
import { Component, Fragment } from "react";

// Components
import { renderError } from "@root/src/components/common/Form";
import { Title, Field, FieldArea } from "@layouts/dashboard/common/Dashboard.Form"

export default class TestimonyFormFields extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.errors !== nextProps.errors ||
      this.props.values.author !== nextProps.values.author ||
      this.props.values.age !== nextProps.values.age ||
      this.props.values.country !== nextProps.values.country ||
      this.props.values.testimony !== nextProps.values.testimony
    );
  }

  // Validar edad de autor
  validAuthorAge(e) {
    // Obtener valor de input
    const { value } = e.target
    const { setErrors, setFieldValue } = this.props

    // Setear edad de autor
    setFieldValue("age", value)

    // Convertir edad a valor numérico
    const age = Number(value)

    // Si la edad es menor a 18
    if (value.length === 2 && age < 18) {
      setErrors({
        age: "El autor debe ser mayor de edad"
      })

      // Si la edad es mayor a 100
    } else if (value.length === 3 && age > 100) {
      setErrors({
        age: "El autor es muy mayor de edad, es recomendable que el autor sea más joven."
      })
    }
  }

  render() {
    const { values, setFieldValue, errors } = this.props;

    return (
      <Fragment>
        {/* Nombre completo */}
        <Title icon="id-badge">Nombre completo de la persona:</Title>
        <Field
          value={values.author}
          placeholder="Ingresa el nombre completo de la persona"
          onChange={(e) => setFieldValue("author", e.target.value)}
        />

        {/* Error en campo 'author' del formulario */}
        {renderError(errors.author)}

        {/* Nombre completo */}
        <Title icon='pagelines'>Edad:</Title>
        <Field
          type="number"
          value={values.age}
          placeholder="Ingresa la edad de la persona | *Opcional"
          onChange={this.validAuthorAge.bind(this)}
        />

        {/* Error en campo 'age' del formulario */}
        {renderError(errors.age)}

        {/* Nombre completo */}
        <Title icon='city'>Ciudad o país de residencia:</Title>
        <Field
          value={values.country}
          placeholder="Ingresa la ciudad o país de residencia"
          onChange={(e) => setFieldValue("country", e.target.value)}
        />

        {/* Error en campo 'country' del formulario */}
        {renderError(errors.country)}

        {/* Nombre completo */}
        <Title icon='book-open'>Testimonio:</Title>
        <FieldArea
          rows={7}
          value={values.testimony}
          placeholder="Ingresa el testimonio de la persona"
          onChange={(e) => setFieldValue("testimony", e.target.value)}
        />

        {/* Error en campo 'testimony' del formulario */}
        {renderError(errors.testimony)}
      </Fragment>
    );
  }
}
