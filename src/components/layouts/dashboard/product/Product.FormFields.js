// React
import { Component, Fragment } from "react";

// Components
import ProductBenefits from "./Product.Benefits";
import ProductSelectCategory from "./Product.SelectCategory";
import { renderError } from '@root/src/components/common/Form'
import { Title, Field, FieldArea, FieldsGroup } from "@layouts/dashboard/common/Dashboard.Form"

export default class FormFields extends Component {
  shouldComponentUpdate(nextProps) {
    const nextValues = nextProps.extraData.values
    const prevValues = this.props.extraData.values
    const nextErrors = nextProps.extraData.errors
    const prevErrors = this.props.extraData.errors

    return (nextValues !== prevValues) || (nextErrors !== prevErrors)
  }

  // Renderizar campos 'content' y 'categories'
  renderGroupFields = ({ values, setFieldValue, errors }) => {
    return [
      {
        icon: 'balance-scale-right',
        title: "Contenido:",
        error: errors.content,
        input: {
          value: values.content,
          placeholder: "Ingresa el contenido del producto",
          onChange: (e) => setFieldValue("content", e.target.value),
        },
      },
      {
        icon: "tags",
        title: "Categorías:",
        error: errors.categories,
        customField: (
          <ProductSelectCategory
            value={values.categories}
            company={this.props.company}
            onChange={(categories) => setFieldValue("categories", categories)}
          />
        ),
      },
    ]
  }

  render() {
    const { values, errors, setFieldValue, setFormStatus } = this.props.extraData
    const secondaryFields = this.renderGroupFields(this.props.extraData)

    return (
      <Fragment>
        {/* Nombre del producto */}
        <Title icon='box'>Nombre del producto:</Title>
        <Field
          value={values.name}
          placeholder="Ingresa el nombre del producto"
          onChange={(e) => setFieldValue("name", e.target.value)}
        />

        {/* Error en campo 'name' del formulario */}
        {renderError(errors.name)}

        {/* Descripción del producto */}
        <Title icon='comment'>Descripción del producto:</Title>
        <FieldArea
          rows={7}
          value={values.description}
          placeholder="Ingresa la descripción del producto"
          onChange={(e) => setFieldValue("description", e.target.value)}
        />

        {/* Error en campo 'description' del formulario */}
        {renderError(errors.description)}

        {/* Grupo de campos 'content' y 'stock' */}
        <FieldsGroup
          fields={secondaryFields}
          containerStyle={{
            marginTop: "1em",
            marginBottom: errors.stock ? "4em" : errors.content ? "3em" : 0
          }}
        />

        {/* Beneficios del producto */}
        <Title icon='box'>Beneficios del producto:</Title>
        <ProductBenefits
          data={values.benefits}
          extraData={{
            setFieldValue: setFieldValue,
            setFormStatus: setFormStatus,
            addBenefit: (newBenefit) => {
              setFieldValue("benefits", [
                ...values.benefits, newBenefit,
              ]);
            },
          }}
        />

        {/* Error en campo 'name' del formulario */}
        {renderError(errors.benefits)}

        {/* Modo de empleo del producto */}
        <Title icon='coffee'>Modo de empleo del producto</Title>
        <FieldArea
          rows={5}
          value={values.usageMode}
          placeholder="Ingresa el modo de empleo del producto"
          onChange={(e) => setFieldValue("usageMode", e.target.value)}
        />

        {/* Error en campo 'usageMode' del formulario */}
        {renderError(errors.usageMode)}
      </Fragment>
    );
  }
}
