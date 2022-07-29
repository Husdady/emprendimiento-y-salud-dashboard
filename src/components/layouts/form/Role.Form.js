// React
import { Component } from "react";

// Components
import { Form, Checkbox } from "@common";
import { Title, Field } from "@layouts/dashboard/common/Dashboard.Form";

// Librarys
import { Row, Col } from "antd";

// Utils
import userPermissions from '@utils/permissions'

const defaultRoleValues = userPermissions.reduce(
  (acc, item) => ({
    roleName: "",
    permissions: { ...acc.permissions, [item.permission]: false },
  }),
  {}
);

export default  class RoleForm extends Component {
  static defaultProps = {
    defaultValues: defaultRoleValues,
  };

  constructor(props) {
    super(props);
    this.validationSchema = {
      roleName: {
        required: "Por favor ingresa el nombre del rol",
        min: 3,
        max: 18,
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.defaultValues !== nextProps.defaultValues
  }

  render() {
    return (
      <Form
        ref={this.props.refForm}
        onSubmit={this.props.onSubmit}
        initialValues={this.props.defaultValues}
        validationSchema={this.validationSchema}
      >
        {(formData) => <RoleInformation extraData={formData} />}
      </Form>
    );
  }
}

// <------------------------ Extra Components ------------------------>
// Formulario para crear un nuevo rol
class RoleInformation extends Component {
  shouldComponentUpdate(nextProps) {
    const { values, errors } = this.props.extraData

    return (
      values !== nextProps.extraData.values ||
      errors !== nextProps.extraData.errors
    );
  }

  render() {
    const { values, setFieldValue, errors } = this.props.extraData;

    return (
      <div className="form-field-container">
        {/* Nombre del Rol */}
        <Title icon="user-tag" containerClasses="mb-2">
          Nombre del Rol:
        </Title>
        
        <Field
          value={values.roleName}
          placeholder="Ingresa el nombre del rol"
          onChange={(e) => setFieldValue("roleName", e.target.value)}
        />

        {/* Error en campo 'roleName' del formulario */}
        {Form.renderError(errors.roleName)}

        {/* Permisos */}
        <Title icon="key" containerClasses="my-3">
          Permisos:
        </Title>

        <Permissions
          {...values.permissions}
          extraData={{
            roleName: values.roleName,
            permissions: values.permissions,
            setNestedField: this.props.extraData.setNestedField,
          }}
        />
      </div>
    );
  }
}

// Definir permisos del usuario
class Permissions extends Component {
  shouldComponentUpdate(nextProps) {
    const permissions = Object.keys(this.props.extraData.permissions)

    return permissions.some(permission => {
      return this.props[permission] !== nextProps[permission]
    })
  }

  // Renderizar permisos
  renderPermissions({ permissions, setNestedField }) {
    return userPermissions.map((item, i) => {
      const isChecked = permissions[item.permission];

      return (
        <Col
          key={i}
          xxl={{ span: 6 }}
          xl={{ span: 8 }}
          md={{ span: 7 }}
          sm={{ span: 11 }}
          xs={{ span: 12 }}
        >
          <Checkbox
            title={item.title}
            checked={isChecked}
            onCheck={function () {
              const filter = `permissions.${item.permission}`;
              setNestedField(filter, !isChecked);
            }}
          />
        </Col>
      );
    });
  }

  render() {
    return (
      <Row justify="space-between align-items-center" gutter={[0, 8]}>
        {this.renderPermissions.bind(this)({
          permissions: this.props.extraData.permissions,
          setNestedField: this.props.extraData.setNestedField,
        })}
      </Row>
    );
  }
}
