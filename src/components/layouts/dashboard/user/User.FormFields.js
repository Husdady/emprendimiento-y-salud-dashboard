// React
import { Component, Fragment } from "react";

// Components
import { Password } from "@common";
import Roles from "./User.Roles";
import { renderError } from "@root/src/components/common/Form";
import { Title, Field } from "@layouts/dashboard/common/Dashboard.Form"

export default class UserFormFields extends Component {
  shouldComponentUpdate(nextProps) {
  	const { extraData } = this.props
  	const nextData = nextProps.extraData

    return (
      extraData.errors !== nextData.errors ||
      extraData.values.fullname !== nextData.values.fullname ||
      extraData.values.email !== nextData.values.email ||
      extraData.values.password !== nextData.values.password ||
      extraData.values.role !== nextData.values.role
    );
  }

  // Renderizar campo de contraseña
  renderFieldPassword({ values, errors, setFieldValue, showFieldPassword }) {
    if (!showFieldPassword) return

    return (
      <Fragment>
        <Title icon="unlock-alt" error={errors.email}>
          Contraseña:
        </Title>

        <Password
          className="field"
          value={values.password}
          eyeStyles={{ right: 10 }}
          onChange={(e) => setFieldValue("password", e.target.value)}
        />
      </Fragment>
    );
  }

  render() {
    const { values, setFieldValue, errors } = this.props.extraData;

    return (
      <Fragment>
        {/* Nombre del usuario */}
        <Title icon="user-alt">Nombre completo del usuario:</Title>
        <Field
          value={values.fullname}
          placeholder="Ingresa el nombre completo del usuario"
          onChange={(e) => setFieldValue("fullname", e.target.value)}
        />

        {/* Error en campo 'fullname' del formulario */}
        {renderError(errors.fullname)}

        {/* Correo electrónico */}
        <Title icon="envelope" error={errors.fullname}>
          Correo electrónico:
        </Title>

        <Field
          type="email"
          value={values.email}
          placeholder="Ingresa el correo electrónico del usuario"
          onChange={(e) => setFieldValue("email", e.target.value)}
        />

        {/* Error en campo 'email' del formulario */}
        {renderError(errors.email)}

        {/* Contraseña */}
        {this.renderFieldPassword.bind(this)(this.props.extraData)}

        {/* Error en campo 'password' del formulario */}
        {renderError(errors.password)}

        {/* Rol del usuario */}
        <Title icon="user-tag" error={errors.password}>
          Rol del usuario:
        </Title>

        <Roles
          defaultValue={values.role}
          hideRoles={this.props.extraData.hideRoles}
          onChange={(role) => setFieldValue("role", role)}
        />

        {/* Error en campo 'role' del formulario */}
        {renderError(errors.role)}
      </Fragment>
    );
  }
}
