// React
import { Component, Fragment } from "react";

// Components
import ProductBenefits from "./Product.Benefits";
import ProductSelectCategory from "./Product.SelectCategory";
import { renderError } from '@root/src/components/common/Form'
import { Title, FieldArea, FieldsGroup } from "@layouts/dashboard/common/Dashboard.Form"

export default class ProductFormFields extends Component {
  shouldComponentUpdate(nextProps) {
    const nextValues = nextProps.extraData.values
    const prevValues = this.props.extraData.values
    const nextErrors = nextProps.extraData.errors
    const prevErrors = this.props.extraData.errors

    return (nextValues !== prevValues) || (nextErrors !== prevErrors)
  }

  // Renderizar campos 'name' y 'price'
  renderPrimaryFields = ({ values, setFieldValue, errors }) => {
    return [
      {
        icon: 'box',
        title: "Nombre del producto:",
        error: errors.name,
        input: {
          value: values.name,
          placeholder: "Ingresa el nombre del producto",
          onChange: (e) => setFieldValue("name", e.target.value),
        },
      },
      {
        icon: 'dollar-sign',
        title: "Precio:",
        error: errors.price,
        input: {
          type: "number",
          value: values.price,
          placeholder: "Ingresa el precio del producto",
          onChange: (e) => setFieldValue("price", e.target.value),
        },
      },
    ]
  }

  // Renderizar campos 'content' y 'stock'
  renderSecondaryFields = ({ values, setFieldValue, errors }) => {
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
        icon: 'cubes',
        title: "Total de unidades:",
        error: errors.stock,
        input: {
          type: "number",
          value: values.stock,
          placeholder: "Ingresa el stock del producto",
          onChange: (e) => setFieldValue("stock", e.target.value),
        },
      },
    ]
  }

  // Renderizar campos 'benefits' y 'categories'
  renderTerciaryFields = ({ values, setFieldValue, setFormStatus, errors }) => {
    return [
      {
        icon: "hand-sparkles",
        title: "Beneficios:",
        error: errors.benefits,
        customField: (
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
        ),
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
    const mq = window.innerWidth <= 768;
    const { values, setFieldValue, errors } = this.props.extraData
    const primaryFields = this.renderPrimaryFields(this.props.extraData)
    const secondaryFields = this.renderSecondaryFields(this.props.extraData)
    const terciaryFields = this.renderTerciaryFields(this.props.extraData)

    return (
      <Fragment>
        {/* Grupo de campos 'name' y 'price' */}
        <FieldsGroup
          fields={primaryFields}
          containerStyle={{
            marginBottom: errors.name || errors.price ? "3em" : 0
          }}
        />

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

        {/* Grupo de campos 'benefits' y 'categories' */}
        <FieldsGroup
          fields={terciaryFields}
          containerStyle={{
            marginTop: "1em",
            marginBottom: mq ? 0 : (errors.benefits || errors.categories) ? "3em" : 0,
          }}
        />

        {/* Nombre del producto */}
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
