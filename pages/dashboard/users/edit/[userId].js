// React
import { Component, Fragment } from "react";

// Components
import UserForm from "@layouts/form/User.Form";
import Skeleton from "@layouts/skeletons/Skeleton.Form";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Librarys
import { connect } from "react-redux";
import { withRouter } from "next/router";

// Headers
import { EditUserHeader } from '@headers'

// API
import { editUser, getUserData } from "@api/user";

// Utils
import { isEmptyObject } from "@utils/Validations";

export default class EditUser extends Component {
  constructor(props) {
    super(props);
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
        title: "Editar Usuario",
      },
    ];
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <EditUserHeader />

        <Container breadcrumbItems={this.breadcrumbItems}>
          {/* Editar la información del producto */}
          <WrapTitle
            icon="user-edit"
            title="Editar la información del usuario"
            helpTitle="En esta sección podrás editar la información de un usuario. Debes tener en cuenta, que la nueva información que vas a establecer, debe ser autentica, evita rellenar información falsa"
          />

          {/* Formulario para editar un usuario */}
          <EditUserForm />
        </Container>
      </Fragment>
    );
  }
}

// <------------------------ Extra Components ------------------------>
class EditUserFormWithRouter extends Component {
  constructor(props) {
    super(props);
    this.setUserInformation = this.setUserInformation.bind(this);
    this.getUserInformation = this.getUserInformation.bind(this);

    this.state = {
      user: {},
    };

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
    };
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.user !== nextState.user;
  }

  componentDidMount() {
    this.getUserInformation();
  }

  // Setear información de usuario
  setUserInformation(userData) {
    this.setState({ user: userData });
  }

  // Obtener información de usuario
  getUserInformation() {
    const { userId } = this.props.router.query;

    // Obtener información del usuario
    getUserData(userId, {
      token: this.props.token,
      setUserInformation: this.setUserInformation,
    });
  }

  // Guardar cambios
  onSaveChanges(values, extraData) {
    extraData.userId = this.state.user.id;
    editUser(values, extraData);
  }

  render() {
    const isLoading = isEmptyObject(this.state.user)

    return (
      <Skeleton fields={[0, 0, 0]} loading={isLoading}>
        <UserForm
          showFieldPassword={false}
          defaultValues={this.state.user}
          validationSchema={this.userFormSchema}
          onSubmit={this.onSaveChanges.bind(this)}
        />
      </Skeleton>
    );
  }
}

const EditUserForm = withRouter(EditUserFormWithRouter);
