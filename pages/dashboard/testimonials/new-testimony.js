// React
import { Component } from "react";

// Components
import TestimonyForm from "@layouts/form/Testimony.Form";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// API
import { createTestimony } from "@api/testimony";

export default class CreateNewTestimony extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbItems = [
      {
        path: "/dashboard",
        title: "Dashboard",
      },
      {
        path: "/dashboard/testimonials",
        title: "Administrar Testimonios Omnilife",
      },
      {
        title: "Crear nuevo testimonio",
      },
    ];
  }

  render() {
    return (
      <Container breadcrumbItems={this.breadcrumbItems}>
        {/* Información del usuario */}
        <WrapTitle
          icon="user-plus"
          title="Información de la persona"
          helpTitle="En esta sección podrás crear un nuevo testimonio. Deberás proporcionar el información acerca de la persona de la cuál narra su testimonio Omnilife."
        />

        {/* Formulario para crear un testimonio */}
        <TestimonyForm
          onSubmit={createTestimony}
          saveButtonTitle="Guardar testimonio"
        />
      </Container>
    );
  }
}
