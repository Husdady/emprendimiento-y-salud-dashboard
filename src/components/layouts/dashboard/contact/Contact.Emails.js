// React
import { Component, Fragment } from "react";

// Components
import { Button } from "@common";

// Librarys
import { Tag, message, Empty } from "antd";
import TweenOneGroup from "rc-tween-one/lib/TweenOneGroup";

// Utils
import { isEmail, isEmptyArray, isGreaterThan } from "@utils/Validations";

export default class ContactEmails extends Component {
  constructor(props) {
    super(props);
    this.addEmail = this.addEmail.bind(this);
    this.deleteEmail = this.deleteEmail.bind(this);
    this.renderEmails = this.renderEmails.bind(this);

    this.enterTweenOneGroup = {
      scale: 0.8,
      opacity: 0,
      type: "from",
      duration: 100,
    };

    this.leaveTweenOneGroup = {
      scale: 0,
      width: 0,
      opacity: 0,
      duration: 200,
    };

    this.buttonStyle = {
      fontSize: ".87em",
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.extraData.emails !== nextProps.extraData.emails;
  }

  // Evento 'click' en X de Tag
  deleteEmail({ event, removedEmail }) {
    event?.preventDefault();

    // Obtener emails
    const { emails, setFieldValue } = this.props.extraData;

    const deletedEmails = emails.filter(email => email !== removedEmail)

    // Eliminar email
    setFieldValue("emails", deletedEmails);
  }

  // Agregar email
  addEmail() {
    const email = window.prompt("Ingresa un nuevo correo electrónico");

    // Si el valor obtenido de prompt, no es un email válido
    if (!isEmail(email)) {
      message.warn("Ingresa un correo electrónico válido", 4);
      return;
    }

    if (isGreaterThan({ value: email, max: 32 })) {
      message.warn("El correo electrónico es muy largo", 5);
      return;
    }

    // Obtener emails
    const { emails, setFieldValue } = this.props.extraData;

    // Si un correo electrónico ya existe
    if (emails.includes(email)) {
      message.warn("El correo electrónico ya ha sido agregado", 4);
      return;
    }

    // Setear nuevo email
    setFieldValue("emails", [...emails, email]);
  }

  // Renderizar emails
  renderEmails() {
    const { emails } = this.props.extraData;

    // Si no hay emails
    if (isEmptyArray(emails)) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ color: "var(--bg-gray-100)" }}
          description="No existen correos electrónicos"
        />
      );
    }

    // Renderizar emails
    return emails.map((email) => (
      <Tag
        closable
        key={email}
        className="d-inline-flex align-items-center"
        onClose={(event) => this.deleteEmail({
          event: event,
          removedEmail: email,
        })
      }>
          {email}
      </Tag>
    ));
  }

  render() {
    return (
      <Fragment>
        <div className="personal-emails mb-4 d-flex flex-wrap flex-column">
          <TweenOneGroup
            appear={false}
            enter={this.enterTweenOneGroup}
            leave={this.leaveTweenOneGroup}
          >
            {this.renderEmails()}
          </TweenOneGroup>
        </div>

        <Button
          icon="plus"
          title="Añadir correo"
          textColor="var(--bg-white)"
          backgroundColor="var(--bg-darkrose)"
          className='w-100 rounded-2 py-2'
          onClick={this.addEmail}
          style={this.buttonStyle}
        />
      </Fragment>
    );
  }
}
