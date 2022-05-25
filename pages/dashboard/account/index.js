// React
import { Component } from "react";

// Components
import UserForm from "@layouts/form/User.Form";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";
import PersonalInformation from "@layouts/dashboard/account/Account.PersonalInformation";
import SwitchTheme from "@layouts/dashboard/account/Account.SwitchTheme";
import CloseMyAccount from "@layouts/dashboard/account/Account.CloseMyAccount";
import ConnectionStatus from "@layouts/dashboard/account/Account.ConnectionStatus";
import EditMyPassword from "@layouts/dashboard/account/Account.EditMyPassword";
import DownloadUserSecretKey from "@layouts/dashboard/account/Account.DownloadUserSecretKey";

// Librarys
import { connect } from "react-redux";

// Headers
import { AccountHeader } from "@headers";

// Actions
import setActions from "@redux/actions/auth";

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

// Utils
import { isEmptyObject } from '@utils/Validations'

// Foto de perfil por defecto
const defaultProfilePhoto = require("@assets/img/user-avatar.webp").default.src;

class Account extends Component {
  constructor(props) {
    super(props);
    this.defaultValues = {
      role: this.props.user.role,
      email: this.props.user.email,
      fullname: this.props.user.fullname,
      profilePhoto: this.props.user.profilePhoto?.url || defaultProfilePhoto,
    };

    this.validationSchema = {
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

    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        title: "Ajustes de la cuenta",
      },
    ];
  }

  render() {
    return (
      <Container breadcrumbItems={this.breadcrumbItems}>
        {/* Head */}
        <AccountHeader />

        {/*  Información personal del usuario  */}
        <WrapTitle
          icon="user-alt"
          title="Mi información personal"
          helpTitle="Aquí podrás ver tu información personal, te recomendamos evitar compartir tu información personal para más seguridad de tu cuenta"
        />

        <PersonalInformation user={this.props.user} />

        {/* Editar información de la cuenta del usuario  */}
        <WrapTitle
          icon="user-edit"
          title="Editar mi información personal"
          helpTitle="En el siguiente formulario podrás editar tu información personal, la información que ingreses debe ser autentica, procura evitar compartir tu información personal para más seguridad de tu cuenta"
        />

        {/* Formulario para crear un usuario */}
        <UserForm
          hideRoles
          showFieldPassword={false}
          defaultValues={this.defaultValues}
          validationSchema={this.validationSchema}
          onSubmit={this.props.updateMyPersonalInformation}
        />

        {/*  Editar contraseña  */}
        <WrapTitle
          icon="unlock-alt"
          title="Cambiar mi contraseña"
          helpTitle="Aquí podrás cambiar la contraseña, primero deberás ingresar tu actual contraseña y a continuación ingresa tu nueva contraseña."
        />
        
        {/* Editar mi contraseña */}
        <EditMyPassword user={this.props.user} />

        {/* Descargar clave secreta del usuario */}
        <DownloadUserSecretKey
          userKey={this.props.user.secretKey}
          username={this.props.user.fullname}
        />

        {/* Cambiar tema */}
        <SwitchTheme />

        {/* Estado de conexión del usuario que ha iniciado sesi */}
        <ConnectionStatus />

        {/* Eliminar cuenta del usuario que ha iniciado sesión */}
        <CloseMyAccount user={this.props.user} />
      </Container>
    );
  }
}

function mapStateToProps(state, nextAuth) {
  const { session } = getAuthenticationState({ authentication: state.authentication })

  if (isEmptyObject(session.user)) {
    return {
      user: nextAuth.user
    }
  }

  return {
    user: {
      ...session.user,
      secretKey: nextAuth.user.secretKey,
      profilePhoto: { url: session.user.profilePhoto }
    }
  }
} 

function mapDispatchToProps(dispatch) {
  const { updateMyPersonalInformation } = setActions(dispatch);

  return { updateMyPersonalInformation };
}

export { getServerSideProps }
export default connect(mapStateToProps, mapDispatchToProps)(Account);
