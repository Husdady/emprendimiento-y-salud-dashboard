// React
import { Component, Fragment } from "react";

// Components
import UserForm from "@layouts/form/User.Form";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Headers
import { CreateUserHeader } from '@headers'

// API
import { createUser } from "@api/user";

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

export { getServerSideProps }
export default class CreateNewUser extends Component {
  constructor(props) {
    super(props);
    this.userFormSchema = {
      fullname: {
        required: "Por favor ingresa el nombre completo del usuario",
        min: 2,
        max: 48,
      },
      email: {
        required: "Por favor ingresa tu correo electrónico",
        min: 6,
        max: 36,
        isEmail: true,
      },
      password: {
        required: "Por favor ingresa tu contraseña",
        min: 8,
        max: 32,
      },
      role: {
        required: "Por favor selecciona un rol",
      },
    };

    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        path: "/dashboard/users",
        title: "Administrar Usuarios",
      },
      {
        title: "Crear nuevo usuario",
      },
    ];
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <CreateUserHeader />
      
        <Container breadcrumbItems={this.breadcrumbItems}>
          {/* Información del usuario */}
          <WrapTitle
            icon="user-plus"
            title="Información del nuevo usuario"
            helpTitle="En esta sección podrás crear un nuevo usuario. Recuerda que su información debe ser auténtica, ya que, si el usuario creado no valida su correo electrónico en 1 semana, se eliminará automáticamente su cuenta."
          />

          {/* Formulario para crear un usuario */}
          <UserForm
            onSubmit={createUser}
            saveButtonTitle="Guardar usuario"
            validationSchema={this.userFormSchema}
          />
        </Container>
      </Fragment>
    );
  }
}
