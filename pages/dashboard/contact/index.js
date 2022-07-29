// React
import { Component, Fragment } from "react";

// Components
import ContactForm from "@layouts/form/Contact.Form";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Containers
import DashboardContainer from "@containers/DashboardContainer";

// Headers
import { ContactHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

export { getServerSideProps }
export default class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        title: "Administrar información de contacto",
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
        <ContactHeader />

        <DashboardContainer breadcrumbItems={this.breadcrumbItems}>
          {/* Información del usuario */}
          <WrapTitle
            icon="id-card-alt"
            title="Editar información de contacto"
            helpTitle="En esta sección podrás editar la información de contacto, deberás proporcionar tus datos reales como empresario omnilife, código de empresario, tu testimonio omnilife, etc."
          />

          {/* Formulario para editar información de contacto */}
          <ContactForm />
        </DashboardContainer>
      </Fragment>
    );
  }
}
