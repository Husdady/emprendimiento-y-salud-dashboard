// React
import { Component } from "react"

// Components
import Wrapper from "@layouts/dashboard/common/Dashboard.Wrapper";

// Librarys
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Reducers
import { getAuthenticationState } from '@redux/reducers/auth'

// Utils
import { formatDate } from "@utils/dayjs";

export default class PersonalInformation extends Component {
  constructor(props) {
    super(props);
    this.renderData = this.renderData.bind(this);

    this.personalInformation = [
      {
        icon: 'id-card',
        title: "Nombre completo:",
        value: <Fullname />
      },
      {
        title: "Correo electrónico:",
        icon: "envelope",
        value: this.props.user.email,
      },
      {
        title: "Rol actual:",
        icon: "user-tag",
        value: "\"" + this.props.user.role + "\"",
      },
      {
        icon: 'signal',
        title: "Estado:",
        value: 'Conectado',
      },
      {
        icon: 'user-lock',
        title: "Mi clave secreta:",
        value: this.props.user.secretKey,
      },
      {
        icon: 'calendar-alt',
        title: "Fecha de creación de la cuenta:",
        value: formatDate({
          format: "MM/DD/YYYY",
          date: this.props.user.createdAt,
        }),
      },
    ];
  }

  // Renderizar datos del usuario que ha iniciado sesión
  renderData(data, i) {
    return (
      <div key={i} className="d-flex align-items-center user-field">
        <h6 className="title mb-0">
          <FontAwesomeIcon icon={data.icon} className="me-2" />
          {data.title}
        </h6>

        <span className="ms-2 titillium-web">
          <i>{data.value}</i>
        </span>
      </div>
    );
  }

  render() {
    return (
      <Wrapper className="container-personal-information d-flex" paddingY="py-3">
        {this.personalInformation.map(this.renderData)}
      </Wrapper>
    );
  }
}

function mapStateToProps({ authentication }) {
  const { session } = getAuthenticationState({ authentication })
  return { fullname: session.user.fullname }
}

// <------------------------ Extra Components ------------------------>
class FullnameConnect extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.fullname !== nextProps.fullname
  }

  render() {
    return <i>{this.props.fullname}</i>
  }
}

const Fullname = connect(mapStateToProps)(FullnameConnect)
