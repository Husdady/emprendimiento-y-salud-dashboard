// React
import { Component } from "react";

// Components
import Skeleton from "@layouts/skeletons/Skeleton.Table";
import UserAvatar from "@layouts/dashboard/user/User.Avatar";
import Table, { ActionButton } from "@layouts/dashboard/common/Dashboard.Table";

// Librarys
import { Tag } from "antd";
import { connect } from "react-redux";
import { getSession } from 'next-auth/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import mapDispatchToProps from "@redux/actions/users";

// Utils
import { truncate, formatDate } from "@utils/Helper";

class DeletedUsers extends Component {
  constructor(props) {
    super(props);
    this.getPaginatedDeletedUsers = this.getPaginatedDeletedUsers.bind(this);

    this.styles = {
      columns: {
        role: {
          marginLeft: 3,
          fontWeight: "bold",
          color: "var(--bg-dark)",
        },
      },
      fields: {
        medium: {
          width: 150,
        },
        large: {
          width: 200,
        },
        extraLarge: {
          width: 280,
        }
      },
    };

    this.restoreButton = {
      name: "trash-restore",
      color: "var(--bg-green-100)",
      title: "Restaurar usuario",
    };

    this.deleteButton = {
      name: "trash-alt",
      color: "var(--bg-red)",
      title: "Eliminar cuenta usuario",
    };

    this.fields = [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        render: this.renderIndex,
      },
      {
        title: "Nombre completo del usuario",
        dataIndex: "fullname",
        key: "fullname",
        render: this.renderUsername.bind(this),
      },
      {
        title: "Correo electrónico",
        dataIndex: "email",
        key: "email",
        render: this.renderUserEmail.bind(this),
      },
      {
        title:<span style={this.styles.fields.medium} className="d-block text-center">Rol del usuario</span>,
        dataIndex: "role",
        key: "role",
        render: this.renderUserRole.bind(this),
      },
      {
        title: "Fecha de eliminación",
        dataIndex: "deletedAt",
        key: "deletedAt",
        render: this.renderUserDeleteDate.bind(this),
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        key: "actions",
        render: this.renderActionButtons.bind(this),
      },
    ];
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.deletedUsers !== nextProps.deletedUsers ||
      this.props.loadingDeletedUsers !== nextProps.loadingDeletedUsers
    )
  }

  componentDidMount() {
    this.getPaginatedDeletedUsers();
  }

  // Obtener usuarios eliminados paginados
  getPaginatedDeletedUsers(i, setCurrentPage) {
    const { company, dispatch } = this.props;

    const config = {
      skip: 0,
    }

    if (i) {
      Object.assign(config, {
        skip: i,
        setCurrentPage: setCurrentPage,
      });
    }

    this.props.getPaginatedDeletedUsers(config);
  }

  // Renderizar índice de tabla
  renderIndex(i) {
    return <b>#{i}</b>
  }

  // Renderizar nombre de usuario
  renderUsername(fullname, user) {
    return (
      <div className="d-flex flex-wrap align-items-center" style={this.styles.fields.large}>
        {/* Imagen de usuario */}
        <UserAvatar hideGreenCircle src={user.profilePhoto?.url} />

        {/* Nombre de usuario */}
        <span className="ms-2 fw-bold">{truncate(fullname, 15)}</span>
      </div>
    );
  }

  // Renderizar correo electrónico del usuario
  renderUserEmail(email) {
    return <span className="d-block" style={this.styles.fields.large}>{email}</span>
  }

  // Renderizar rol de usuario
  renderUserRole(role) {
    return (
      <Tag color="var(--bg-darkyellow)" className="me-0">
        <FontAwesomeIcon icon="user-tag" color="var(--bg-dark)" />
        <span style={this.styles.columns.role}>{role?.name}</span>
      </Tag>
    );
  }

  // Renderizar fecha de eliminación de usuario
  renderUserDeleteDate(creationDate) {
    return <i className="d-block" style={this.styles.fields.extraLarge}>{formatDate(creationDate)}</i>;
  }

  // Renderizar botones de acción
  renderActionButtons(_, user) {
    return (
      <div className="d-flex justify-content-around">
        {/* Botón 'restaurar' */}
        <ActionButton
          icon={this.restoreButton}
          onAction={async () => {
            const session = await getSession()
            
            this.props.restoreUser(user, {
              token: session.user.access_token,
            })
          }}
        />

        {/* Botón 'borrar' */}
        <ActionButton
          icon={this.deleteButton}
          onAction={() => this.props.deleteUserAccount(user)}
        />
      </div>
    );
  }

  render() {
    return (
       <Table
        fields={this.fields}
        data={this.props.deletedUsers}
        loading={this.props.loadingDeletedUsers}
        skeletonFields={[25, 180, 180, 90, 200, 60]}
        skeletonItems={[18, 150, 150, 70, 150, 30]}
        emptyMessage="No existen usuarios  temporalmente para mostrar..."
        pagination={{
          pageSize: this.props.limit,
          totalSize: this.props.totalDeletedUsers,
          onPaginate: this.getPaginatedDeletedUsers,
        }}
      />
    );
  }
}

function mapStateToProps({ theme, userLogin, manageUsers, manageUsersFilters, }) {
  const { limit } = manageUsersFilters.deletedUsers;
  const { deletedUsers, totalDeletedUsers, loadingDeletedUsers } = manageUsers;

  return { theme, limit, deletedUsers, totalDeletedUsers, loadingDeletedUsers };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeletedUsers);
