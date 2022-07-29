// React
import { Component, Fragment } from "react";

// Components
import { Developing } from "@common";
import Wrapper from "@layouts/dashboard/common/Dashboard.Wrapper";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Containers
import DashboardContainer from "@containers/DashboardContainer";

// Headers
import { BusinessmanMembershipHeader } from '@headers'

// Redirects
import { getServerSideProps } from '@redirects/dashboard'

const developing = require('@assets/img/developing/developing-01.webp').default.src;
const developingStyle = { marginTop: '4em' , marginBottom: '4em' }

const breadcrumbItems = [
  { path: "/dashboard", title: "Dashboard" },
  { title: "Afiliar Empresario" }
];

export { getServerSideProps }
export default class BusinessmanMembershipPage extends Component {
  render() {
    return (
      <Fragment>
        {/* Head */}
        <BusinessmanMembershipHeader />
      
        <DashboardContainer breadcrumbItems={breadcrumbItems}>
          {/* Información del usuario */}
          <WrapTitle
            icon="user-tie"
            title="Administrar empresarios"
            helpTitle="En esta sección podrás administrar a los empresarios afiliados. Deberás proporcionar información verídica para poder afiliar un empresario Omnilife."
          />

          <Wrapper>
            <Developing
              width={500}
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
