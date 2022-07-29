// React
import { Component } from "react";

// Components
import { Form } from "@common";
import { Title, FieldArea } from "@layouts/dashboard/common/Dashboard.Form";

export default class BenefitsForm extends Component {
  static defaultProps = {
    defaultValues: {
      benefit: ""
    }
  }

  constructor(props) {
    super(props);
    this.styles = {
      title: {
        fontSize: "1.1em",
      },
    };

    this.validationSchema = {
      benefit: {
        required: "Por favor ingresa el beneficio del producto",
        min: {
          limit: 25,
          message: "La descripción del beneficio es muy corta",
        },
        max: {
          limit: 200,
          message: "La descripción del beneficio es muy larga",
        },
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.defaultValues !== nextProps.defaultValues;
  }

  render() {
    return (
      <Form
        ref={this.props.refForm}
        onSubmit={this.props.onSubmit}
        initialValues={this.props.defaultValues}
        validationSchema={this.validationSchema}
      >
        {({ values, setFieldValue, errors }) => (
          <div className="form-field-container">
            {/* Nombre del Rol */}
            <Title
              className="rubik"
              icon="hand-sparkles"
              style={this.styles.title}
              containerClasses="mb-3"
            >
              Descripción del beneficio del producto
            </Title>
            <FieldArea
              rows={5}
              value={values.benefit}
              // style={this.styles.field}
              onChange={(e) => setFieldValue("benefit", e.target.value)}
              placeholder="Ingresa una pequeña descripción del beneficio del producto"
            />

            {/* Error en campo 'benefit' del formulario */}
            {Form.renderError(errors.benefit)}
          </div>
        )}
      </Form>
    );
  }
}
