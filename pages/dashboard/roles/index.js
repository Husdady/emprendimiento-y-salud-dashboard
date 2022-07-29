// React
import { Component, createRef } from "react";

// Components
import { Modal, OkButtonModal, CancelButtonModal } from '@common'
import RoleForm from "@layouts/form/Role.Form";
import Items from "@layouts/dashboard/common/Dashboard.Items";
import ActionButtons from "@layouts/dashboard/common/Dashboard.ActionButtons";

// Containers
import DashboardContainer from "@containers/DashboardContainer";

// Librarys
import { message } from "antd";
import { connect } from "react-redux";

// Actions
import mapDispatchToProps from "@redux/actions/users";

// Headers
import { UserRolesHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

const emptyRoles = require("@assets/img/empty-roles.webp").default.src;

class RolesHome extends Component {
  constructor(props) {
    super(props);
    this.refModal = createRef();
    this.refRoleForm = createRef();
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.renderModalFormContent = this.renderModalFormContent.bind(this);

    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        title: "Administrar Roles",
      },
    ];

    this.actionButtons = [
      {
        icon: "plus",
        title: "Nuevo rol",
        color: "var(--bg-purple)",
        onAction: this.onAddRole.bind(this),
      },
      {
        icon: "redo-alt",
        title: "Actualizar datos",
        color: '#3d446c',
        onAction: this.onRefreshRoles.bind(this),
        loading: {
          style: { width: 120, color: "var(--bg-white)" },
        },
      },
    ];

    this.modalAttributes = {
      centered: true,
      cancelText: <CancelButtonModal />,
      onOk: () => this.refRoleForm.current?.runValidateAllFields(),
    };

    this.extraData = {
      updateRole: this.props.updateRole,
      deleteRole: this.props.deleteRole,
      showModal: this.showModal.bind(this),
      hideModal: this.hideModal.bind(this),
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  // Mostrar modal que muestra un formulario para crear un rol
  showModal({ extraData, ...modalAttributes }) {
    const keys = Object.keys(modalAttributes)

    for (let key of keys) {
      Object.assign(this.modalAttributes, {
        [key]: modalAttributes[key]
      })
    }

    this.refModal.current?.show(extraData);
  }

  // Ocultar modal que muestra un formulario para crear un rol
  hideModal() {
    this.refModal.current?.hide();
  }

  // Evento 'click' en botón 'Nuevo rol'
  onAddRole() {
    this.showModal({
      title: "Información del nuevo rol",
      okText: <OkButtonModal icon="plus" title="Crear rol" />,
      okButtonProps: {
        className: "border-0",
        style: {
          backgroundColor: "var(--bg-purple)"
        }
      },
      extraData: {
        defaultValues: undefined,
        onSubmit: this.onCreateNewRole.bind(this),
      },
    });
  }

  // Crear nuevo rol de usuario
  onCreateNewRole({ values }) {
    this.props.createRole(values, {
      hideModal: this.hideModal
    });
  }

  // Refrescar roles
  async onRefreshRoles({ showLoading, hideLoading }) {
    try {
      // Mostrar cargando
      showLoading();

      // Obtener roles
      await this.props.getRoles({ withLoading: true });

      // Ocultar cargando
      hideLoading();

      // Mostrar mensaje
      message.info("Se han actualizado los datos");
    } catch (err) {
      // Ocultar cargando
      hideLoading();

      // Mensaje de error
      message.error("A ocurrido un error al actualizar los roles");
    }
  }

  // Renderizar contenido del modal que contiene un formulario
  renderModalFormContent({ extraData }) {
    return <RoleForm refForm={this.refRoleForm} {...extraData} />;
  }

  render() {
    return (
      <DashboardContainer breadcrumbItems={this.breadcrumbItems}>
        <UserRolesHeader />

        {/* Botones de acción */}
        <ActionButtons
          buttons={this.actionButtons}
          title="Roles del usuario"
          wrapTitleIcon="user-tag"
          helpTitle="En esta sección podrás administrar los roles del usuario, podrás definir los permisos que posee un usuario al administrar el Dashboard de emprendimientoysalud.com"
          containerStyle={{ justifyContent: "flex-end", margin: "24px 0px" }}
        />

        <Roles extraData={this.extraData} />

        <Modal
          ref={this.refModal}
          className="container-modal-items"
          attributes={this.modalAttributes}
        >
          {this.renderModalFormContent}
        </Modal>
      </DashboardContainer>
    );
  }
}

function mapStateToProps({ manageUsers }) {
  const { roles, loadingRoles, totalRoles } = manageUsers
  return { roles, loadingRoles, totalRoles };
}

export { getServerSideProps }
export default connect(mapStateToProps, mapDispatchToProps)(RolesHome);

// <------------------------ Extra Components ------------------------>
class RolesConnected extends Component {
  constructor(props) {
    super(props);
    this.emptyProps = {
      width: 275,
      height: 275,
      image: emptyRoles,
      title: "No existen roles para mostrar...",
    };
    this.itemsStyles = {
      icons: {
        edit: { color: "var(--bg-purple)" },
      },
    };
    this.onEditRole = this.onEditRole.bind(this);
    this.onUpdateRoleInformation = this.onUpdateRoleInformation.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.roles !== nextProps.roles ||
      this.props.loadingRoles !== nextProps.loadingRoles
    )
  }

  componentDidMount() {
    this.props.getRoles({ withLoading: true });
  }

  // Evento click en icono lápiz de cada testimonio
  onEditRole(role) {
    this.props.extraData.showModal({
      title: `Información del rol '${role.name}'`,
      okText: <OkButtonModal icon="arrow-circle-up" title="Actualizar rol" />,
      okButtonProps: {
        className: 'border-0',
        style: {
          backgroundColor: 'var(--bg-purple)'
        }
      },
      extraData: {
        defaultValues: {
          roleName: role.name,
          permissions: role.permissions,
        },
        onSubmit: ({ values, extraData }) => {
          // Asignar propiedades extras a 'values'
          Object.assign(values, {
            _id: role._id,
            previousName: role.name,
          })

          this.onUpdateRoleInformation({ values, extraData });
        },
      },
    });
  }

  // Actualizar información de un rol
  onUpdateRoleInformation({ values, extraData }) {
    // Asignar propiedades extras a 'extraData'
    Object.assign(extraData, {
      hideModal: this.props.extraData.hideModal,
      formHasBeenEdited: extraData.formHasBeenEdited,
    })

    // Actualizar rol
    this.props.extraData.updateRole(values, extraData);
  }

  render() {
    return (
      <Items
        empty={this.emptyProps}
        data={this.props.roles}
        styles={this.itemsStyles}
        customFields={{ title: "name" }}
        loading={this.props.loadingRoles}
        totalItems={this.props.totalRoles}
        onEdit={this.onEditRole}
        onDelete={this.props.deleteRole}
      />
    );
  }
}

const Roles = connect(mapStateToProps, mapDispatchToProps)(RolesConnected);
