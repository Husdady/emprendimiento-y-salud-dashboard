// React
import { Component, createRef } from "react";

// Components
import { Form } from "@common";
import { renderError } from "@root/src/components/common/Form";
import { Title, Field } from "@layouts/dashboard/common/Dashboard.Form"

export default class ContactModalForm extends Component {
  static defaultValues = {
    defaultValues: {
      nameOfThePage: "",
      linkOfThePage: "",
    }
  }

  constructor(props) {
    super(props);
    this.refForm = createRef();
    this.validationSchema = {
      nameOfThePage: {
        required: "Por favor ingresa el nombre de la página",
        min: 10,
        max: 36,
      },
      linkOfThePage: {
        required: "Por favor ingresa el enlace de la página",
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.defaultValues !== nextProps.defaultValues
  }

  // Evento 'paste' en campo 'linkOfThePage'
  onPastePageLink = ({ event, setFieldValue }) => {
    const isPasted = event.nativeEvent.inputType.startsWith("insertFromPaste");

    if (isPasted) {
      setFieldValue("linkOfThePage", event.target.value);
    }
  }

  // Evento que válida el esquema del formulario
  handleSubmit = () => {
    this.refForm.current?.runValidateAllFields();
  }

  render() {
    return (
      <Form
        ref={this.refForm}
        initialValues={this.props.defaultValues}
        validationSchema={this.validationSchema}
        onSubmit={this.props.onUpdateContactInformation}
      >
        {({ values, errors, setFieldValue }) => (
          <div className="form-field-container">
            {/* Nombre de la Página */}
            <Title icon='file' containerClasses="mb-3">
              Nombre de la Página:
            </Title>
            <Field
              style={this.fieldStyle}
              value={values.nameOfThePage}
              placeholder="Ingresa el nombre de la página"
              onChange={(e) => setFieldValue("nameOfThePage", e.target.value)}
            />

            {/* Error en campo 'nameOfThePage' del formulario */}
            {renderError(errors.nameOfThePage)}

            {/* Enlace de la Página */}
            <Title icon='paperclip' containerClasses="my-3">
              Enlace de la Página:
            </Title>
            <Field
              style={this.fieldStyle}
              value={values.linkOfThePage}
              placeholder="Pega el enlace de la página"
              onChange={(event) => this.onPastePageLink({
                event: event,
                setFieldValue: setFieldValue
              })}
            />

            {/* Error en campo 'linkOfThePage' del formulario */}
            {renderError(errors.linkOfThePage)}
          </div>
        )}
      </Form>
    );
  }
}
