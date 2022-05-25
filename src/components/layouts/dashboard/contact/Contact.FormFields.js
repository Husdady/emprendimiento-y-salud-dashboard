// React
import { Component, Fragment } from "react";

// Components
import ContactEmails from "./Contact.Emails";
import SocialNetworks from "./Contact.SocialNetworks";
import { renderError } from "@root/src/components/common/Form";
import { Title, Field, FieldArea } from "@layouts/dashboard/common/Dashboard.Form"

// Librarys
import { connect } from "react-redux";

// API
import { updateContactInformation } from "@api/contact";

const fieldStyle = {
  fontFamily: 'Rubik'
}

export default class ContactInformation extends Component {
  shouldComponentUpdate(nextProps) {
    const { values, errors } = this.props;

    if (values.contactPhoto !== nextProps.values.contactPhoto) {
      return false;
    }

    return (
      values !== nextProps.values ||
      errors !== nextProps.errors
    );
  }

  render() {
    const {
      values,
      setFieldValue,
      setNestedField,
      setFormStatus,
      errors
    } = this.props;

    return (
      <Fragment>
        {/* Nombre completo */}
        <Title icon="id-badge">Nombre completo:</Title>
        <Field
          style={fieldStyle}
          value={values.fullname}
          placeholder="Ingresa tu nombre completo"
          onChange={(e) => setFieldValue("fullname", e.target.value)}
        />

        {/* Error en campo 'fullname' del formulario */}
        {renderError(errors.fullname)}

        {/* Acerca de mí */}
        <Title icon='address-card'>Acerca de mí:</Title>
        <FieldArea
          rows={4}
          style={fieldStyle}
          value={values.aboutMe}
          placeholder="Escribe algo sobre ti..."
          onChange={(e) => setFieldValue("aboutMe", e.target.value)}
        />

        {/* Error en campo 'aboutMe' del formulario */}
        {renderError(errors.aboutMe)}

        {/* Acerca de mí */}
        <Title icon="user-injured">Mi testimonio Omnilife:</Title>
        <FieldArea
          rows={7}
          style={fieldStyle}
          value={values.testimony}
          placeholder="Ingresa tu testimonio Omnilife..."
          onChange={(e) => setFieldValue("testimony", e.target.value)}
        />

        {/* Error en campo 'testimony' del formulario */}
        {renderError(errors.testimony)}

        {/* Nombre completo */}
        <Title icon="key">Código de empresario:</Title>
        <Field
          style={fieldStyle}
          value={values.omnilifeCode}
          placeholder="Ingresa tu código de empresario"
          onChange={(e) => setFieldValue("omnilifeCode", e.target.value)}
        />

        {/* Error en campo 'omnilifeCode' del formulario */}
        {renderError(errors.omnilifeCode)}

        {/* Teléfono de contacto */}
        <Title icon='phone-alt'>Teléfono de contacto:</Title>
        <Field
          type="number"
          style={fieldStyle}
          value={values.phone}
          placeholder="Ingresa tu número de teléfono"
          onChange={(e) => setFieldValue("phone", e.target.value)}
        />

        {/* Error en campo 'omnilifeCode' del formulario */}
        {renderError(errors.phone)}

        <div className="side-left-content position-absolute w-100">
          {/* Redes Sociales */}
          <Title icon='network-wired' containerClasses="pb-1">Mis redes sociales:</Title>
          <SocialNetworks
            networks={values.socialNetworks}
            extraData={{ setNestedField, setFormStatus }}
          />

          {/* Correos Electrónicos */}
          <Title icon='mail-bulk' containerClasses="pb-1">Correos electrónicos:</Title>
          <ContactEmails
            extraData={{
              emails: values.emails,
              setFieldValue: setFieldValue,
            }}
          />
        </div>
      </Fragment>
    );
  }
}
