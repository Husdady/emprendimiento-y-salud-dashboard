// React
import { Component, Fragment } from "react";

// Components
import { Password } from "@common";
import { renderError } from "@root/src/components/common/Form";
import DashboardForm, { Title } from "@layouts/dashboard/common/Dashboard.Form";

// API
import { changeMyPassword } from "@api/auth";

export default class EditMyPassword extends Component {
  constructor(props) {
    super(props);
    this.defaultValues = {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    this.validationSchema = {
      password: {
        required: "Por favor ingresa tu actual contraseña",
        min: 8,
        max: 48,
      },
      newPassword: {
        required: "Por favor ingresa tu nueva contraseña",
        min: 8,
        max: 48,
      },
      confirmNewPassword: {
        isMatchPassword: true,
        relateWithField: "newPassword",
      },
    };
  }

  shouldComponentUpdate() {
    return false
  }

  onChangePassword(values, extraData) {
    Object.assign(extraData, {
      userId: this.props.user._id,
      userRole: this.props.user.role,
    });

    changeMyPassword(values, extraData);
  }

  render() {
    return (
      <DashboardForm
        renderUploadImage={false}
        defaultValues={this.defaultValues}
        validationSchema={this.validationSchema}
        saveButtonTitle="Actualizar contraseña"
        containerFieldsStyle={{ width: "100%" }}
        onSubmit={this.onChangePassword.bind(this)}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Fragment>
              {/* Contraseña actual */}
              <Title icon="unlock">Ingresa tu contraseña actual:</Title>
              <Password
                className="field"
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
              />

              {/* Error en campo 'password' del formulario */}
              {renderError(errors.password)}

              {/* Nueva contraseña */}
              <Title icon="key">Ingresa tu nueva contraseña:</Title>
              <Password
                className="field"
                value={values.newPassword}
                onChange={(e) => {
                  setFieldValue("newPassword", e.target.value);
                }}
              />

              {/* Error en campo 'newPassword' del formulario */}
              {renderError(errors.newPassword)}

              {/* Confirmar nueva contraseña */}
              <Title icon="unlock">Confirma tu nueva contraseña:</Title>
              <Password
                className="field"
                value={values.confirmNewPassword}
                onChange={(e) => setFieldValue("confirmNewPassword", e.target.value)}
              />

              {/* Error en campo 'confirmNewPassword' del formulario */}
              {renderError(errors.confirmNewPassword)}
            </Fragment>
          );
        }}
      </DashboardForm>
    );
  }
}
