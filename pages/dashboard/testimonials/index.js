// React
import { Component, Fragment } from "react";

// Components
import Items from "@layouts/dashboard/common/Dashboard.Items";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import ActionButtons from "@layouts/dashboard/common/Dashboard.ActionButtons";
import Testimonials from '@layouts/dashboard/testimonials/Testimonials.Items'

// Librarys
import { message } from "antd";
import { withRouter } from "next/router";

// Headers
import { TestimonialsHeader } from '@headers'

class TestimonialsPage extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        title: "Administrar Testimonios Omnilife",
      },
    ];

    this.actionButtons = [
      {
        icon: "user-plus",
        title: "Nuevo testimonio",
        color: "var(--bg-darkyellow)",
        style: { color: "var(--bg-dark)", fontWeight: "bold" },
        onAction: () => this.navigateTo("/dashboard/testimonials/new-testimony")
      },
      {
        icon: "redo-alt",
        title: "Actualizar datos",
        color: "var(--bg-blue)",
        onAction: this.onRefreshTestimonials.bind(this),
        loading: {
          style: { width: 118, color: "var(--bg-white)" },
        },
      },
    ];
  }

  shouldComponentUpdate() {
    return false;
  }

  // Navegar a otra ruta
  navigateTo = (path) => this.props.router.push(path)

  // Refrescar testimonios
  async onRefreshTestimonials({ showLoading, hideLoading }) {
    try {
      showLoading();
      await this.props.getTestimonials();
      hideLoading();
      message.info("Se han actualizado los datos");
    } catch (error) {
      hideLoading();
      message.error("A ocurrido un error al actualizar los datos");
    }
  }

  render() {
    return (
      <Fragment>
        {/* Head */}
        <TestimonialsHeader />

        <Container breadcrumbItems={this.breadcrumbItems}>
          {/* Botones de acción */}
          <ActionButtons
            buttons={this.actionButtons}
            title="Testimonios Omnilife"
            wrapTitleIcon="user-injured"
            className="testimonials-action-buttons"
            containerStyle={{ margin: "24px 0px" }}
            helpTitle="En esta sección podrás administrar los testimonios Omnilife de distintas personas que afirman los beneficios de los productos."
          />

          <Testimonials navigateTo={this.navigateTo} />
        </Container>
      </Fragment>
    );
  }
}

export default withRouter(TestimonialsPage)
