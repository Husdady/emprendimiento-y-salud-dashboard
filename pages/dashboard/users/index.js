// React
import { Component, Fragment, createRef } from "react";

// Components
import Modal from "@layouts/dashboard/common/Dashboard.Modal";
import Filters from "@layouts/dashboard/common/Dashboard.Filters";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";
import ActionButtons from "@layouts/dashboard/common/Dashboard.ActionButtons";
import UserAvatar from "@layouts/dashboard/user/User.Avatar";
import UsersTable from "@layouts/dashboard/user/tables/Table.Users";
import DeletedUsersTable from "@layouts/dashboard/user/tables/Table.DeletedUsers";

// Containers
import DashboardContainer from "@containers/DashboardContainer";

// Librarys
import { message } from "antd";
import { connect } from "react-redux";
import { withRouter } from "next/router";

// Headers
import { UsersHeader } from "@headers"

// Actions
import setUsers from "@redux/actions/users";
import setUserFilters, { config } from "@redux/actions/filters/users";

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

// Utils
import { isEmptyArray } from "@utils/Validations";
import { onAction, getSomeFieldsFromArrayObject } from "@utils/Helper";

class Users extends Component {
  constructor(props) {
    super(props);
    this.refModal = createRef();
    this.usersTypes = config.users.types;
    this.deletedUsersTypes = config.deletedUsers.types;
    this.showModal = this.showModal.bind(this);
    this.renderEditIcon = this.renderEditIcon.bind(this);
    this.renderEraserIcon = this.renderEraserIcon.bind(this);
    this.renderRestoreIcon = this.renderRestoreIcon.bind(this);
    this.renderTrashIcon = this.renderTrashIcon.bind(this);

    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        title: "Administrar Usuarios",
      },
    ];

    this.options = {
      users: {
        date: [
          {
            key: this.usersTypes.sortByMostRecentCreatedAt,
            value: "Ordenar por fecha de creación más reciente",
          },
          {
            key: this.usersTypes.sortByOldestCreatedAt,
            value: "Ordenar por fecha de creación más antigua",
          },
          {
            key: this.usersTypes.sortByMostRecentUpdatedAt,
            value: "Ordenar por fecha de actualización más reciente",
          },
          {
            key: this.usersTypes.sortByOldestUpdatedAt,
            value: "Ordenar por fecha de actualización más antigua",
          },
        ],
        default: [
          {
            key: this.usersTypes.sortByAscName,
            value: "Ordenar por nombre ascendente",
          },
          {
            key: this.usersTypes.sortByDescName,
            value: "Ordenar por nombre descendente",
          },
          {
            key: this.usersTypes.sortByAscEmail,
            value: "Ordenar por email ascendente",
          },
          {
            key: this.usersTypes.sortByDescEmail,
            value: "Ordenar por email descendente",
          },
        ],
      },
      deletedUsers: {
        date: [
          {
            key: this.deletedUsersTypes.sortByMostRecentDeletedAt,
            value: "Ordenar por fecha de eliminación más reciente",
          },
          {
            key: this.deletedUsersTypes.sortByOldestDeletedAt,
            value: "Ordenar por fecha de eliminación más antigua",
          },
        ],
        default: [
          {
            key: this.deletedUsersTypes.sortByAscName,
            value: "Ordenar por nombre ascendente",
          },
          {
            key: this.deletedUsersTypes.sortByDescName,
            value: "Ordenar por nombre descendente",
          },
          {
            key: this.deletedUsersTypes.sortByAscEmail,
            value: "Ordenar por email ascendente",
          },
          {
            key: this.deletedUsersTypes.sortByDescEmail,
            value: "Ordenar por email descendente",
          },
        ],
      }
    }

    this.searchOptions = {
      users: {
        value: this.props.searchValueInUsers,
        onSearch: this.props.searchUsers,
        placeholder: "Busca un usuario...",
      },
      deletedUsers: {
        value: this.props.searchValueInDeletedUsers,
        onSearch: this.props.searchDeletedUsers,
        placeholder: "Busca un usuario eliminado...",
      },
    }

    this.selectOptions = {
      users: {
        onChange: this.props.sortUsersBy,
        sortByDate: {
          items: this.options.users.date,
          defaultValue: this.props.sortKeyInUsers.date,
        },
        sortDefault: {
          placeholder: "Ordenar usuarios por",
          items: this.options.users.default,
          defaultValue: this.props.sortKeyInUsers.default,
        },
      },
      deletedUsers: {
        onChange: this.props.sortDeletedUsersBy,
        sortByDate: {
          items: this.options.deletedUsers.date,
          defaultValue: this.props.sortKeyInDeletedUsers.date,
        },
        sortDefault: {
          placeholder: "Ordenar usuarios por",
          items: this.options.deletedUsers.default,
          defaultValue: this.props.sortKeyInDeletedUsers.default,
        },
      },
    }

    this.actionButtons = {
      users:[
        {
          icon: "user-plus",
          title: "Nuevo usuario",
          color: "var(--bg-blue)",
          onAction: () => {
            this.props.router.push("/dashboard/users/create-new-user");
          },
        },
        {
          icon: "user-edit",
          title: "Editar usuario",
          color: "var(--bg-green-200)",
          onAction: this.onEditUser.bind(this),
        },
        {
          icon: "user-times",
          title: "Borrar usuario",
          color: "var(--bg-red)",
          onAction: this.onRemoveUser.bind(this),
        },
        {
          icon: "redo-alt",
          title: "Actualizar datos",
          color: "var(--bg-blue)",
          onAction: this.onRefreshUsers.bind(this),
          loading: {
            style: { width: 118, color: "var(--bg-white)" },
          },
        },
      ],
      deletedUsers: [
        {
          icon: "user-shield",
          title: "Restaurar usuario",
          color: "var(--bg-green-200)",
          onAction: this.onRestoreUser.bind(this),
        },
        {
          icon: "user-alt-slash",
          title: "Eliminar usuario",
          color: "var(--bg-red)",
          onAction: this.onDeleteUserAccount.bind(this),
        },
        {
          icon: "redo-alt",
          title: "Actualizar datos",
          color: "var(--bg-blue)",
          onAction: this.onRefreshDeletedUsers.bind(this),
          loading: {
            style: { width: 118, color: "var(--bg-white)" },
          },
        },
    ]};

    this.extraData = {
      hideModal: this.hideModal.bind(this),
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  // Mostrar modal
  showModal(items, extraContent) {
    // Obtener algunos datos de los usuarios
    const users = getSomeFieldsFromArrayObject(items, (user) => ({
      _id: user._id,
      title: user.fullname,
      image: <UserAvatar hideGreenCircle src={user.profilePhoto?.url} />,
      ...extraContent(user),
    }));

    this.refModal.current?.show({ items: users });
  }

  // Ocultar modal
  hideModal() {
    this.refModal.current?.hide();
  }

  // Editar usuario
  onEditUser() {
    onAction({
      data: this.props.users,
      onDataItem: (item) => {
        return this.props.router.push("/dashboard/users/edit/" + item._id);
      },
      onDataMultipleItems: (items) => {
        return this.showModal(items, this.renderEditIcon);
      },
      emptyMessage: "No hay usuarios disponibles para editar",
    });
  }

  // Borrar temporalmente un usuario
  onRemoveUser() {
    onAction({
      data: this.props.users,
      onDataItem: (item) => this.props.deleteUser(item, this.extraData),
      onDataMultipleItems: (items) => {
        return this.showModal(items, this.renderEraserIcon);
      },
      emptyMessage: "No hay usuarios disponibles para eliminar",
    });
  }

  // Actualizar datos de usuarios
  async onRefreshUsers({ showLoading, hideLoading }) {
    if (isEmptyArray(this.props.users)) {
      await message.warning("No existen usuarios para actualizar sus datos", 4)
      return null;
    } 

    try {
      showLoading();
      await this.props.getPaginatedUsers({ skip: 0, resetTableIndex: true });
      hideLoading();
      message.info("Se han actualizado los datos");
    } catch (error) {
      hideLoading();
      message.error(
        "A ocurrido un error al actualizar los datos de la tabla de usuarios"
      );
    }
  }

  // Restaurar usuario
  onRestoreUser() {
    onAction({
      data: this.props.deletedUsers,
      emptyMessage: "No hay usuarios disponibles para restaurar",
      onDataItem: (item) => this.props.restoreUser(item, this.extraData),
      onDataMultipleItems: (items) => this.showModal(items, this.renderRestoreIcon),
    });
  }

  // Eliminar permanentemente usuario
  onDeleteUserAccount() {
    onAction({
      data: this.props.deletedUsers,
      emptyMessage: "No hay usuarios disponibles para eliminar",
      onDataItem: (item) => this.props.deleteUserAccount(item, this.extraData),
      onDataMultipleItems: (items) => this.showModal(items, this.renderTrashIcon),
    });
  }

  // Actualizar datos de usuarios eliminados
  async onRefreshDeletedUsers({ showLoading, hideLoading }) {
    if (isEmptyArray(this.props.deletedUsers)) {
      await message.warning("No hay usuarios eliminados para actualizar sus datos", 4)
      return null;
    } 

    try {
      showLoading();
      await this.props.getPaginatedDeletedUsers({ skip: 0, resetTableIndex: true });
      message.info("Se han actualizado los datos", 4);
      return hideLoading();
    } catch (error) {
      hideLoading();
      message.error(
        "A ocurrido un error al actualizar los datos de la tabla de usuarios eliminados"
      );
    }
  }

  // Renderizar icono 'editar' en modal
  renderEditIcon(user) {
    return {
      icon: {
        name: "edit",
        color: "var(--bg-blue)",
        onClick: () => this.props.router.push("/dashboard/users/edit/" + user._id),
      },
    };
  }

  // Renderizar icono 'borrar temporalmente' en modal
  renderEraserIcon(user) {
    return {
      icon: {
        name: "eraser",
        color: "var(--bg-red)",
        onClick: () => {
          return this.props.deleteUser(user, {
            ...this.extraData,
            modal: this.refModal.current,
          });
        },
      },
    };
  }

  // Renderizar icono 'restaurar' en modal
  renderRestoreIcon(user) {
    return {
      icon: {
        name: "trash-restore",
        color: "var(--bg-green)",
        onClick: () => {
          return this.props.restoreUser(user, {
            ...this.extraData,
            modal: this.refModal.current,
          })
        }
      },
    };
  }

  // Renderizar icono 'eliminar' en modal
  renderTrashIcon(user) {
    return {
      icon: {
        name: "trash-alt",
        color: "var(--bg-red)",
        onClick: () => {
          return this.props.deleteUserAccount(user, {
            ...this.extraData,
            modal: this.refModal.current,
          })
        }
      },
    };
  }

  // Renderizar texto en tooltip de filtros de usuarios
  renderHelpTitleInUsers() {
    return (
      <Fragment>
        <span>Aquí podrás encontrar varios botones, a continuación una breve explicación sobre estos.</span>
        <br /><br />
        <span><b>Nuevo usuario:</b> para crear un nuevo usuario.</span>
        <br /><span><b>Editar usuario:</b> para editar la información de un usuario.</span>
        <br /><span><b>Borrar usuario:</b> para borrar temporalmente a un usuario.</span>
        <br /><span><b>Actualizar datos:</b> para actualizar los datos que se muestran en la tabla.</span>
        <br /><br /><span>Más abajo encontrarás un buscador con el cuál podrás buscar usuarios por su nombre o correo electrónico y a su costado "selectores", para poder ordernar a los usuarios dependiendo de cada opción.</span>
      </Fragment>
    )
  }

  // Renderizar texto en tooltip de filtros de usuarios eliminados
  renderHelpTitleInDeletedUsers() {
    return (
      <Fragment>
        <span>Aquí podrás encontrar varios botones, a continuación una breve explicación sobre estos.</span>
        <br /><br />
        <span><b>Restaurar usuario:</b> para restaurar a un usuario borrado.</span>
        <br /><span><b>Eliminar usuario:</b> para eliminar definitivamente a un usuario.</span>
        <br /><span><b>Actualizar datos:</b> para actualizar los datos que se muestran en la tabla.</span>
        <br /><br /><span>Más abajo encontrarás un buscador con el cuál podrás buscar usuarios eliminados por su nombre o correo electrónico y a su costado "selectores", para poder ordernar a los usuarios eliminados dependiendo de cada opción.</span>
      </Fragment>
    )
  }

  render() {
    return (
      <DashboardContainer breadcrumbItems={this.breadcrumbItems}>
        <UsersHeader />
        
        {/* Filtros de usuarios */}
        <Filters
          title="Filtrar usuarios por:"
          helpTitle={this.renderHelpTitleInUsers}
          searchOptions={this.searchOptions.users}
          selectOptions={this.selectOptions.users}
        >
          {/* Botones de acción en usuarios */}
          <ActionButtons
            title="Acciones principales:"
            buttons={this.actionButtons.users}
            wrapTitleIcon={["far", "hand-pointer"]}
          />
        </Filters>

        {/* Total de usuarios */}
        <WrapTitle
          icon="users"
          className="mb-3"
          title="Total de usuarios"
          helpTitle="En la siguiente tabla aparecerán los usuarios que has creado, puedes administrar a los usuarios mientras tengas los permisos necesarios, de lo contrario se te negará el acceso."
        />

        {/* Tabla de usuarios */}
        <UsersTable />

        {/* Filtrar usuarios eliminados */}
        <Filters
          title="Filtrar usuarios eliminados por:"
          helpTitle={this.renderHelpTitleDeletedUsers}
          searchOptions={this.searchOptions.deletedUsers}
          selectOptions={this.selectOptions.deletedUsers}
        >
          {/* Botones de acción en usuarios eliminados */}
          <ActionButtons
            title="Acciones secundarias:"
            wrapTitleIcon="hand-point-up"
            buttons={this.actionButtons.deletedUsers}
          />
        </Filters>

        {/* Usuarios eliminados */}
        <WrapTitle
          icon="users-slash"
          className="mb-3"
          title="Usuarios eliminados"
          helpTitle="En la siguiente tabla aparecerán los usuarios que has eliminado. Puedes volver a restaurar la cuenta de un usuario presionando el botón 'Restaurar usuario'."
        />

        {/* Tabla de usuarios eliminados */}
        <DeletedUsersTable />

        {/* Modal que muestra los usuarios */}
        <Modal ref={this.refModal} title="Selecciona un usuario" />
      </DashboardContainer>
    );
  }
}

function mapStateToProps({ manageUsers, manageUsersFilters }) {
  const { users, deletedUsers } = manageUsers

  return {
    users: users,
    deletedUsers: deletedUsers,
    searchValueInUsers: manageUsersFilters.users.searchValue,
    searchValueInDeletedUsers: manageUsersFilters.deletedUsers.searchValue,
    sortKeyInUsers: manageUsersFilters.users.sortKey,
    sortKeyInDeletedUsers: manageUsersFilters.deletedUsers.sortKey,
  };
}

function mapDispatchToProps(dispatch) {
  const usersDispatch = setUsers(dispatch);
  const usersFiltersDipsatch = setUserFilters(dispatch);

  return {
    deleteUser: usersDispatch.deleteUser,
    deleteUserAccount: usersDispatch.deleteUserAccount,
    getPaginatedDeletedUsers: usersDispatch.getPaginatedDeletedUsers,
    getPaginatedUsers: usersDispatch.getPaginatedUsers,
    restoreUser: usersDispatch.restoreUser,
    ...usersFiltersDipsatch
  }
}

export { getServerSideProps }
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Users));
