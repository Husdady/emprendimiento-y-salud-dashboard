// React
import { Component } from "react";

// Components
import Loading from "@layouts/loaders/Loading.Preload";
import Wrapper from "@layouts/dashboard/common/Dashboard.Wrapper";
import DashboardForm from "@layouts/dashboard/common/Dashboard.Form";
import ContactFormFields from "@layouts/dashboard/contact/Contact.FormFields";

// Librarys
import { connect } from "react-redux";

// Reducers
import { getThemeState } from '@redux/reducers/theme'

// API
import { getContactInformation, updateContactInformation } from "@api/contact";

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.darkTheme = this.props.theme === "dark"
    this.state = {
      loadingContactInformation: true,
      contactInformation: {
        email: "",
        phone: "",
        location: "",
        facebookPage: {},
        contactPhoto: {},
      },
    };

    this.validationSchema = {
      location: {
        required: "Por favor ingresa la ubicación del negocio",
      },
      email: {
        isEmail: true,
        required: "Por favor ingresa el correo electrónico de contacto",
      },
      phone: {
        required: "Por favor ingresa tu número de celular",
      },
    };

    this.uploadImage = {
      position: 'top',
      field: "contactPhoto",
    };

    this.formStyle = { position: "relative" };
    this.loadingColor = this.darkTheme ? "var(--bg-darkyellow)" : "var(--bg-darkrose)"
  }

  shouldComponentUpdate(_, nextState) {
    return (
      this.state.contactInformation !== nextState.contactInformation ||
      this.state.loadingContactInformation !== nextState.loadingContactInformation
    );
  }

  componentDidMount() {
    getContactInformation({
      hideLoading: this.hideLoading,
      setContactInformation: this.setContactInformation,
    });
  }

  // Ocultar cargando
  hideLoading = () => {
    this.setState({ loadingContactInformation: false });
  }

  // Setear información de contacto
  setContactInformation = (data) => {
    this.setState({ contactInformation: data });
  }

  render() {
    if (this.state.loadingContactInformation) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }

    return (
      <DashboardForm
        style={this.formStyle}
        uploadImage={this.uploadImage}
        onSubmit={updateContactInformation}
        validationSchema={this.validationSchema}
        defaultValues={this.state.contactInformation}
      >
        {(formData) => <ContactFormFields {...formData} />}
      </DashboardForm>
    );
  }
}

export default connect(getThemeState)(ContactForm);
