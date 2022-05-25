// React
import { Component, Fragment, createRef } from "react";

// Components
import { Button, Form } from "@common";
import Wrapper from "./Dashboard.Wrapper";
import UploadImage from "./Dashboard.UploadImage";
import { renderError } from "@root/src/components/common/Form"

// Librarys
import { Input } from "antd";
import { getSession } from 'next-auth/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { classnames } from '@utils/Helper'
import { isFunction, isEmptyArray } from "@utils/Validations";

const { TextArea } = Input;

export default class DashboardForm extends Component {
  static defaultProps = {
    style: {},
    uploadImage: {},
    defaultValues: {},
    containerFieldsStyle: {},
    onSubmit: function () {},
    renderSaveButton: true,
    renderUploadImage: true,
  };

  constructor(props) {
    super(props);
    this.refUploadImage = createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.renderSaveButton = this.renderSaveButton.bind(this);
    this.renderUploadImage = this.renderUploadImage.bind(this);

    this.formAttributes = {
      className: "w-100 d-flex flex-wrap justify-content-between",
      encType: "multipart/form-data",
      style: {
        padding: "2em 1.75em 2.5em",
        ...this.props.style,
      },
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  // Renderizar subida de imagen
  renderUploadImage(extraData) {
    if (!this.props.renderUploadImage) return;

    return (
      <UploadImage
        ref={this.refUploadImage}
        style={this.props.uploadImage.style}
        position={this.props.uploadImage.position}
        value={extraData.values[this.props.uploadImage.field]}
        extraData={{
          field: this.props.uploadImage.field,
          setFieldValue: extraData.setFieldValue,
          avatarStyle: { backgroundColor: "var(--bg-darkrose)" },
        }}
      />
    );
  }

  // Renderizar botón 'Guardar'
  renderSaveButton(extraData) {
    if (!this.props.renderSaveButton) return;

    return (
      <SaveButton
        onSave={extraData.handleSubmit}
        title={this.props.saveButtonTitle}
      />
    );
  }

  // Renderizar campos del formulario
  renderFields(extraData) {
    const isChildrenFunction = isFunction(this.props.children)

    // Si el componente hijo no está envuelto en una función
    if (!isChildrenFunction) return

    return (
      <div
        className="form-field-container"
        style={this.props.containerFieldsStyle}
      >
        {/* Guardar usuario */}
        {this.renderSaveButton(extraData)}

        {/* Campos del formulario */}
        {this.props.children(extraData)}
      </div>
    );
  }

  // Evento 'submit' en formulario
  async handleSubmit({ values, resetForm, extraData }) {
    if (!isFunction(this.props.onSubmit)) return

    const session = await getSession()

    // Setear datos extras
    Object.assign(extraData, {
      resetForm: resetForm,
      token: session.user.access_token,
      removePreviewImage: this.refUploadImage.current?.removePreviewImage,
    })

    // Callback que se ejcuta cuando el formulario es válido
    this.props.onSubmit(values, extraData);
  }

  render() {
    return (
      <Wrapper>
        {/* Formulario */}
        <Form
          onSubmit={this.handleSubmit}
          attributes={this.formAttributes}
          initialValues={this.props.defaultValues}
          validationSchema={this.props.validationSchema}
        >
          {(data) => {
            return (
              <Fragment>
                {/* Subir foto */}
                {this.renderUploadImage({
                  values: data.values,
                  setFieldValue: data.setFieldValue,
                })}

                {/* Campos del formulario */}
                {this.renderFields(data)}
              </Fragment>
            );
          }}
        </Form>
      </Wrapper>
    );
  }
}

// <------------------------ Extra Components ------------------------>
// Botón guardar cambios de formulario
export class SaveButton extends Component {
  static defaultProps = {
    title: "Guardar cambios",
  };

  constructor(props) {
    super(props);
    this.buttonStyles = {
      loading: {
        style: {
          color: "var(--bg-white)",
        },
        containerStyle: {
          padding: ".05em 3em",
        },
      },
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Button
        icon="save"
        className="save-button py-2 px-5 d-block ms-auto rounded-2"
        style={this.props.style}
        title={this.props.title}
        onClick={this.props.onSave}
        loading={{
          style: this.buttonStyles.loading.style,
          containerStyle: this.buttonStyles.loading.containerStyle,
        }}
      />
    );
  }
}

// Titulo de campos de formulario
export class Title extends Component {
  constructor(props) {
    super(props)
    this.titleClasses = classnames([
      "title mb-0 ms-2",
      this.props.className
    ])

    this.containerClasses = classnames([
      "d-flex align-items-center container-title",
      this.props.containerClasses,
    ])
  }

  shouldComponentUpdate(nextProps) {
    return this.props.error !== nextProps.error;
  }

  render() {
    return (
      <div className={this.containerClasses} style={this.props.error ? { marginTop: 0 } : this.props.containerStyle}>
        {/* Título */}
        <FontAwesomeIcon icon={this.props.icon} />

        {/* Título */}
        <h6 className={this.titleClasses}>
          {this.props.children}
        </h6>
      </div>
    );
  }
}

// Campos de formulario
export class Field extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  render() {
    return <Input {...this.props} className="field noto-sans" />;
  }
}

// Campos expansibles de formulario
export class FieldArea extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  render() {
    return <TextArea {...this.props} className="field noto-sans" />;
  }
}

// Campos agrupados
export class FieldsGroup extends Component {
  errorStyle = {
    lineHeight: 1.25
  }

  shouldComponentUpdate(nextProps) {
    return this.props.fields.some((item, i) => {
      if (item.input) {
        const prevValue = item.input.value
        const nextValue = nextProps.fields[i].input.value
        const nextError = nextProps.fields[i].error

        // Renderizar sólo si los valores o errores hayan sido actualizados
        return (prevValue !== nextValue) || (item.error !== nextError)
      }

      // Si es un campo personalizado, renderizar siempre
      if (item.customField) {
        return true
      }

      return false
    })
  }

  renderFields = () => {
    const emptyFields = isEmptyArray(this.props.fields)

    // Si no se han establecido campos, finalizar función
    if (emptyFields) return;

    return this.props.fields.map((field, i) => (
      <div key={i} className={`field-${i + 1}`}>
        <Title icon={field.icon}>{field.title}</Title>
        <Fragment>
          {/* Renderizar entrada o campo personalizado */}
          {field.input ? <Field {...field.input} /> : field.customField}

          {/* Renderizar error en formulario */}
          {renderError(field.error, null, this.errorStyle)}
        </Fragment>
      </div>
    ));
  }

  render() {
    return (
      <div
        style={this.props.containerStyle}
        className="fields-group d-flex flex-wrap justify-content-between"
      >
        {this.renderFields()}
      </div>
    );
  }
}
