// React
import { Component, Fragment } from "react";

// Components
import { Developing } from "@common";
import Wrapper from "@layouts/dashboard/common/Dashboard.Wrapper";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Containers
import DashboardContainer from "@containers/DashboardContainer";

// Headers
import { ClientMembershipHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

const developing = require("@assets/img/developing/developing-02.webp").default.src;
const developingStyle = { marginTop: '3em' , marginBottom: '4em' }

const breadcrumbItems = [
  { path: "/dashboard", title: "Dashboard" },
  { title: "Afiliar Cliente" }
];

export { getServerSideProps }
export default class ClientMembershipPage extends Component {
  render() {
    return (
      <Fragment>
        {/* Head */}
        <ClientMembershipHeader />

        <DashboardContainer breadcrumbItems={breadcrumbItems}>
          {/* Información del usuario */}
          <WrapTitle
            icon="address-book"
            title="Administrar clientes"
            helpTitle="En esta sección podrás administrar a los clientes afiliados. Deberás proporcionar información verídica para poder afiliar un cliente Omnilife."
          />

          <Wrapper>
            <Developing
              width={400}
              height={250}
              image={developing}
              style={developingStyle}
            />
          </Wrapper>
        </DashboardContainer>
      </Fragment>
    );
  }
}
