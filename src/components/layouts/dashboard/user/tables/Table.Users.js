// React
import { Component } from "react";

// Components
import UserAvatar from "@layouts/dashboard/user/User.Avatar";
import Table, { ActionButton } from "@layouts/dashboard/common/Dashboard.Table";

// Librarys
import { Tag } from "antd";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import mapDispatchToProps from "@redux/actions/users";

// Utils
import { truncate, formatDate } from "@utils/Helper";

class TableUsers extends Component {
  constructor(props) {
    super(props);
    this.darkTheme = this.props.theme === 'dark'
    this.getPaginatedUsers = this.getPaginatedUsers.bind(this);

    this.styles = {
      columns: {
        emailVerification: {
          verifiedEmail: {
            marginLeft: 3,
            fontWeight: this.darkTheme ? "bold" : "normal",
            color: this.darkTheme ? "var(--bg-dark)" : "var(--bg-white)",
          },
          unverifiedEmail: {
            marginLeft: 3,
            fontWeight: "normal",
            color: "var(--bg-yellow)",
          },
        },
        role: {
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

    this.editButton = {
      name: "edit",
      color: "var(--bg-blue)",
      title: "Editar usuario",
    };

    this.deleteButton = {
      name: "eraser",
      color: "var(--bg-red)",
      title: "Borrar usuario",
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
        title: <span style={this.styles.fields.medium} className="d-block text-center">Verificación de correo</span>,
        dataIndex: "verifiedEmail",
        key: "verifiedEmail",
        render: this.renderEmailVerification.bind(this),
      },
      {
        title: <span style={this.styles.fields.medium} className="d-block text-center">Rol del usuario</span>,
        dataIndex: "role",
        key: "role",
        render: this.renderUserRole.bind(this),
      },
      {
        title: "Fecha de creación",
        dataIndex: "createdAt",
        key: "createdAt",
        render: this.renderDate.bind(this),
      },
      {
        title: "Última fecha de actualización",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: this.renderDate.bind(this),
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
      this.props.users !== nextProps.users ||
      this.props.loadingUsers !== nextProps.loadingUsers
    )
  }

  componentDidMount() {
    this.getPaginatedUsers();
  }

  // Obtener usuarios paginados
  getPaginatedUsers(i, setCurrentPage) {
    const config = {
      skip: 0,
    }

    if (i) {
      Object.assign(config, {
        skip: i,
        setCurrentPage: setCurrentPage,
      });
    }
    
    this.props.getPaginatedUsers(config);
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
        <UserAvatar
          hideGreenCircle
          src={user.profilePhoto?.url}
          onClick={() => this.props.router.push("/dashboard/users/edit/" + user._id)}
        />

        {/* Nombre de usuario */}
        <span className="ms-2 fw-bold">{truncate(fullname, 15)}</span>
      </div>
    );
  }

  // Renderizar correo electrónico del usuario
  renderUserEmail(email) {
    return <span style={this.styles.fields.large}>{email}</span>
  }

  // Renderizar estado de verificación del correo electrónico del usuario
  renderEmailVerification(isVerifiedEmail) {
    console.log('[renderEmailVerification]', isVerifiedEmail)
    const tagIcon = isVerifiedEmail ? "check-circle" : "clock";
    const tagBackgroundColor = isVerifiedEmail ? "var(--bg-green-100)" : "var(--bg-darkpurple)";
    const tagTitle = isVerifiedEmail ? "Verificado" : "Pendiente";
    const tagTextColor = isVerifiedEmail ? this.styles.columns.emailVerification.verifiedEmail : this.styles.columns.emailVerification.unverifiedEmail;

    return (
      <Tag color={tagBackgroundColor} className="me-0">
        <FontAwesomeIcon icon={tagIcon} color={tagTextColor.color} />
        <span style={tagTextColor}>{tagTitle}</span>
      </Tag>
    );
  }

  // Renderizar rol de usuario
  renderUserRole(role) {
    return (
      <Tag color="var(--bg-darkyellow)" className="me-0">
        <FontAwesomeIcon icon="user-tag" color="var(--bg-dark)" />
        <span style={this.styles.columns.role} className="fw-bold ms-1">
          {role?.name}
        </span>
      </Tag>
    );
  }

  // Renderizar fecha
  renderDate(date) {
    return <i style={this.styles.fields.extraLarge} className="d-block">{formatDate(date)}</i>;
  }
  
  // Renderizar botones de acción
  renderActionButtons(_, user) {
    return (
      <div className="d-flex flex-wrap justify-content-between">
        {/* Botón 'editar' */}
        <ActionButton
          icon={this.editButton}
          onAction={() => this.props.router.push("/dashboard/users/edit/" + user._id)}
        />

        {/* Botón 'borrar' */}
        <ActionButton
          icon={this.deleteButton}
          onAction={() => this.props.deleteUser(user)}
        />
      </div>
    );
  }

  render() {
    return (
      <Table
        fields={this.fields}
        data={this.props.users}
        loading={this.props.loadingUsers}
        emptyMessage="No existen usuarios para mostrar..."
        skeletonFields={[25, 180, 180, 70, 90, 200, 200, 60]}
        skeletonItems={[18, 160, 160, 50, 70, 150, 150, 30]}
        pagination={{
          pageSize: this.props.limit,
          totalSize: this.props.totalUsers,
          onPaginate: this.getPaginatedUsers,
        }}
      />
    );
  }
}

function mapStateToProps({ theme, userLogin, manageUsers, manageUsersFilters, }) {
  const { limit } = manageUsersFilters.users;
  const { users, totalUsers, loadingUsers } = manageUsers;

  return { theme, limit, users, totalUsers, loadingUsers };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TableUsers));
