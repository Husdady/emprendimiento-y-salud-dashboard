// React
import { Component } from "react";

// Librarys
import { connect } from "react-redux";
import { message, Collapse } from "antd";

// Component
import { Button } from "@common";

// Actions 
import setUsers from "@redux/actions/users";

// Utils
import { isNull, isArray, isFunction } from "@utils/Validations";

const { Panel } = Collapse;

class Roles extends Component {
  static defaultProps = {
    hideRoles: false,
  }

  constructor(props) {
    super(props);
    this.placeholder = "Selecciona un rol"
    this.isAdmin = this.props.defaultValue === "Administrador";
    this.setRole = this.setRole.bind(this);
    this.renderRoles = this.renderRoles.bind(this);

  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.roles !== nextProps.roles ||
      this.props.defaultValue !== nextProps.defaultValue
    );
  }

  componentDidMount() {
    !this.props.hideRoles && this.props.getRoles({});
  }

  // Setear un rol
  setRole(role) {
    // Comprobar si el rol ya sea establecido
    if (this.props.defaultValue === role) {
      message.warning("Ya se ha establecido el rol " + role);
    }

    // Ejecutar callback si es una función
    isFunction(this.props.onChange) && this.props.onChange(role);
  }

  // Setear roles
  renderRoles() {
    // Si las roles no son de tipo 'array' o si deben ocultarse los roles de usuarios
    if (!isArray(this.props.roles) || this.props.hideRoles) return;

    // Iterar roles de usuario
    return this.props.roles.map((role, i) => (
      <Button
        key={i}
        title={role.name}
        icon="user-tag"
        className="role-button scale"
        attributes={{ type: "button" }}
        onClick={() => this.setRole(role.name)}
      />
    ));
  }

  render() {
    const { defaultValue } = this.props
    const role = isNull(defaultValue) ? this.placeholder : defaultValue

    return (
      <Collapse className="border-0" collapsible={false}>
        <Panel header={role}>{this.renderRoles()}</Panel>
      </Collapse>
    );
  }
}

function mapStateToProps({ manageUsers }) {
  return {
    roles: manageUsers.roles,
  };
}

function mapDispatchToProps(dispatch) {
  const { getRoles } = setUsers(dispatch)

  return {
    getRoles: getRoles
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
