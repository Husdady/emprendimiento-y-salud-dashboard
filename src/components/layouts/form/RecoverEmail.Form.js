// React
import { Component, Fragment, createRef } from "react";

// Components
import { Form } from "@common";

// Librarys
import { Input } from 'antd'

export default class RecoverEmailForm extends Component {
  constructor(props) {
    super(props);
    this.refForm = createRef()
    this.handleSubmit = this.handleSubmit.bind(this)

    this.validationSchema = {
      username: {
        min: 2,
        max: 48,
        required: "Por favor ingresa tu nombre y apellidos",
      },
    };

    this.inputStyle = {
      fontFamily: 'Noto Sans'
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.defaultValues !== nextProps.defaultValues;
  }

  clean() {
    this.refForm.current?.resetForm()
  }

  handleSubmit() {
    this.refForm.current?.runValidateAllFields()
  }

  render() {
    return (
      <Form
        ref={this.refForm}
        onSubmit={this.props.onSubmit}
        initialValues={this.props.defaultValues}
        validationSchema={this.validationSchema}
      >
        {({ values, setFieldValue, errors }) => (
          <Fragment>
            <Input
              rows={5}
              value={values.username}
              style={this.inputStyle}
              className="py-2 px-3 rounded fw-bold placeholder-hidden"
              onChange={(e) => setFieldValue("username", e.target.value)}
              placeholder="Ingresa tu nombre completo"
            />

            {/* Error en campo 'username' del formulario */}
            {Form.renderError(errors.username)}
          </Fragment>
        )}
      </Form>
    );
  }
}
