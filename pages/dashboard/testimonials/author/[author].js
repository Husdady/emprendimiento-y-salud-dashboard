// React
import { Component } from "react";

// Components
import Skeleton from "@layouts/skeletons/Skeleton.Form";
import TestimonyForm from "@layouts/form/Testimony.Form";
import Container from "@layouts/dashboard/common/Dashboard.Container";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

// Librarys
import { connect } from "react-redux";

// API
import { editTestimony, getAuthorTestimony } from "@api/testimony";

// Utils
import { isEmptyObject } from "@utils/Validations";

export default class EditTestimony extends Component {
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

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <Container breadcrumbItems={this.breadcrumbItems}>
        {/* Información del usuario */}
        <WrapTitle
          icon="user-edit"
          title="Información del nuevo testimonio"
          helpTitle="En esta sección podrás editar la información del autor del testimonio."
        />

        {/* Información del autor */}
        <AuthorInformation />
      </Container>
    );
  }
}

// Información de un autor
export class AuthorInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testimony: {},
    };

    this.setTestimony = this.setTestimony.bind(this);
    this.onLoadAuthorInformation = this.onLoadAuthorInformation.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
  }

  componentDidMount() {
    this.onLoadAuthorInformation();
  }

  // Setear usuario
  setTestimony(testimony) {
    if (!testimony) return

    this.setState({ testimony: testimony });
  }

  // Obtener información del autor del testimonio
  onLoadAuthorInformation() {
    // Setear datos extras
    const extraData = {
      setTestimony: this.setTestimony,
    };

    // Obtener url de la página
    const url = window.location.href;

    // Obtener nombre del autor en la url de la página
    const authorName = url.substring(url.lastIndexOf("/") + 1);

    getAuthorTestimony(decodeURI(authorName), extraData);
  }

 // Actualizar información del autor
  onSaveChanges(values, extraData) {
    editTestimony(values, {
      ...extraData,
      testimonyId: this.state.testimony.id
    });
  }
  
  render() {
    const emptyTestimonials = isEmptyObject(this.state.testimony)

    return (
      <Skeleton
        fields={[0, 0, 0, 1]}
        loading={emptyTestimonials}
        uploadImage={{ position: 'top' }}
      >
        {/* Formulario para crear un usuario */}
        <TestimonyForm
          onSubmit={this.onSaveChanges}
          defaultValues={this.state.testimony}
        />
      </Skeleton>
    );
  }
}
