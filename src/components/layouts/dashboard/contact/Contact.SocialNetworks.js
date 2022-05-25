// React
import { Component, Fragment, createRef } from "react";

// Components
import ContactModalForm from "./Contact.ModalForm";
import { Modal, OkButtonModal, CancelButtonModal } from "@common";
import DashboardModal from "@layouts/dashboard/common/Dashboard.Modal";

// Librarys
import { message, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { isValidUrl } from "@utils/Validations";
import { truncate, updateArrayItem, removeArrayItem } from "@utils/Helper";

const tagsSocialNetworks = require('@assets/json/contact/social-networks.json')

export default class SocialNetworks extends Component {
  activeSocialNetwork = null

  constructor(props) {
    super(props);
    this.refModalForm = createRef();
    this.refModalItems = createRef();
    this.refSocialNetworkForm = createRef();
    this.darkTheme = this.props.theme === "dark";

    this.showModalForm = this.showModalForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addPage = this.addPage.bind(this);
    this.setPageId = this.setPageId.bind(this);
    this.verifyIfExistPage = this.verifyIfExistPage.bind(this);
    this.onEditSocialNetwork = this.onEditSocialNetwork.bind(this);
    this.getSocialNetwork = this.getSocialNetwork.bind(this);
    this.onAddSocialNetwork = this.onAddSocialNetwork.bind(this);

    this.okButtonColor = this.darkTheme ? "#2a8db3" : "#00acee";

    this.ModalForm = {
      onOk: this.handleSubmit,
      cancelText: <CancelButtonModal />,
      okText: <OkButtonModal icon="plus" title="Añadir" />,
    }

    this.DashboardModalItems = {
      cancelText: "Cerrar",
      okText: <OkButtonModal icon="plus" title="Nueva página" />,
      onOk: () => {
        this.showModalForm({
          onOk: this.handleSubmit,
          extraData: {
            defaultValues: undefined,
            onSubmit: this.onAddSocialNetwork,
          },
        });
      },
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  // Ocultar modal que muestra las páginas dependiendo de la red social
  hideModalItems = () => this.refModalItems.current?.hide()

  // Mostrar modal que muestra los 'items'
  showModalItems = ({ items }) => {
    this.refModalItems.current?.show({
      items: items,
    });
  }

  // Ocultar modal que muestra un formulario para crear o editar páginas
  hideModalForm = () => this.refModalForm.current?.hide()

  // Mostrar modal que muestra un formulario para crear o editar 'items'
  showModalForm = ({ extraData, ...modalAttributes }) => {
    // Ocultar modal que muestra las páginas
    this.hideModalItems()

    // Obtener 'keys' de 'modalAttributes'
    const keys = Object.keys(modalAttributes)

    // Setear cada 'key' que viene de 'modalAttributes' a 'ModalForm'
    keys.forEach((key) => this.ModalForm[key] = modalAttributes[key])

    this.refModalForm.current?.show(extraData);
  }

  // Evento 'submit' en modal del formulario
  handleSubmit() {
    this.refSocialNetworkForm.current?.handleSubmit();
  }

  // Setear el id de la página
  setPageId(nameOfThePage, socialNetwork) {
    let social = null;

    if (socialNetwork) {
      social = socialNetwork.toLowerCase();
    } else {
      social = this.activeSocialNetwork
    }

    const pageName = nameOfThePage.toLowerCase().replace(/\s/gim, "-");
    return pageName + "." + social;
  }

  // Obtener datos de la red social
  getSocialNetwork() {
    const social = this.activeSocialNetwork;
    return tagsSocialNetworks.find(({ title }) => title.toLowerCase() === social);
  }

  // Verificar si ya existe la página
  verifyIfExistPage(page) {
    // Obtener nombre de la red social
    const social = this.activeSocialNetwork;

    const existPage = this.props.networks[social].some(
      ({ _id }) => _id === page._id
    );

    // Si ya existe la página, mostrar un mensaje por pantalla
    if (existPage) {
      message.warn(`Ya existe la página: '${page.nameOfThePage}'`, 6);
      return true;
    }
  }

  // Agregar nueva página
  addPage({ newItem, newPage, resetForm }) {
    if (this.verifyIfExistPage(newPage)) return;

    // Obtener nombre de la red social
    const social = this.activeSocialNetwork;

    const allPages = [...this.props.networks[social], newPage];

    const filter = `socialNetworks.${social}`;

    this.refModalItems.current?.addItem(newItem);
    this.props.extraData.setNestedField(filter, allPages);
    this.props.extraData.setFormStatus({ formHasBeenEdited: true });

    // Resetear formulario
    resetForm();

    // Ocultar modal que contiene el formulario para añadir una página
    this.hideModalForm();
  }

  // Eliminar una página
  removePage({ item, pageId }) {
    // Obtener nombre de la red social
    const social = this.activeSocialNetwork;

    const allPages = removeArrayItem(this.props.networks[social], {
      _id: pageId,
    });

    const filter = `socialNetworks.${social}`;

    this.refModalItems.current?.deleteItem(pageId);
    this.props.extraData.setNestedField(filter, allPages);
    this.props.extraData.setFormStatus({ formHasBeenEdited: true });

    // Mostrar mensaje por pantalla
    message.warn(`La página '${item.nameOfThePage}' ha sido eliminada`, 6);
  }

  // Evento 'submit' en formulario para añadir red social
  onAddSocialNetwork({ values, resetForm, setErrors }) {
    if (!isValidUrl(values.linkOfThePage)) {
      setErrors({ linkOfThePage: "Por favor ingresa un enlace válido" });
      return;
    }

    const socialNetwork = this.getSocialNetwork();

    // Crear nueva página
    const newPage = { ...values, _id: this.setPageId(values.nameOfThePage) };

    // Renderizar nuevo item en Modal
    const newItem = this.renderPage({
      item: values,
      socialNetwork: socialNetwork,
    });

    // Agregar página
    this.addPage({ newItem, newPage, resetForm });

    // Mostrar mensaje por pantalla
    message.info('Se ha creado una nueva página', 6);
  }

  // Evento 'submit' en formulario para editar una red social
  onEditSocialNetwork({ item, values }) {
    // Obtener nombre de la red social
    const social = this.activeSocialNetwork;
    const pages = this.props.networks[social];

    const existPageName = pages.some(
      (page) => page.nameOfThePage === values.nameOfThePage
    );

    // Comprobar si ya existe una página con ese nombre
    if (existPageName) {
      message.warn("Ya existe una página que tiene en uso ese nombre", 6);
      return true;
    }

    const socialNetwork = this.getSocialNetwork();

    const filter = `socialNetworks.${social}`;

    // Generar nueva página actualizada
    const updatedSocialNetworks = updateArrayItem(pages, {
      filter: { _id: values._id },
      newData: {
        nameOfThePage: values.nameOfThePage,
        linkOfThePage: values.linkOfThePage,
        _id: this.setPageId(values.nameOfThePage),
      }
    });

    // Elementos de modal
    const modalItems = this.refModalItems.current?.state.items

    // Generar nuevo item actualizado
    const updatedModalItems = updateArrayItem(modalItems, {
      filter: { _id: values._id },
      newData: this.renderPage({
        item: values,
        socialNetwork: socialNetwork,
      })
    });

    // Setear nueva página actualizada
    this.props.extraData.setFormStatus({ formHasBeenEdited: true });
    this.props.extraData.setNestedField(filter, updatedSocialNetworks);
    this.refModalItems.current?.setState({ items: updatedModalItems });

    // Ocultar modal que contiene el formulario para añadir una página
    this.hideModalForm();

    // Mostrar mensaje por pantalla
    message.info(`La página '${item.nameOfThePage}' ha sido actualizada`, 6);
  }

  // Evento 'click' en botón 'Editar página'
  onEditPage = ({ item, pageId }) => {
    const modalTitle = `Editar la información de la página: "${truncate(item.nameOfThePage, 20)}"`

    // Mostrar modal que tiene un formulario
    this.showModalForm({
      title: modalTitle,
      okText: (
        <OkButtonModal
          icon="arrow-circle-up"
          title="Actualizar página"
        />
      ),
      extraData: {
        defaultValues: item,
        onSubmit: ({ values }) => {
          values._id = pageId
          return this.onEditSocialNetwork({ item, values });
        },
      },
    })
  }

  // Renderizar página en modal de 'items'
  renderPage = ({ item, socialNetwork }) => {
    const pageId = this.setPageId(item.nameOfThePage, socialNetwork.title);

    return {
      _id: pageId,
      containerTitleStyle: {
        width: "70%",
        flexWrap: "nowrap",
      },
      title: (
        <a
          target="_blank"
          href={item.linkOfThePage}
          style={{ color: socialNetwork.color }}
        >
          <u>{item.nameOfThePage}</u>
        </a>
      ),
      image: (
        <FontAwesomeIcon
          size="lg"
          icon={socialNetwork.customIcon || socialNetwork.icon}
          color={socialNetwork.color}
        />
      ),
      icons: [
        {
          name: "edit",
          color: "var(--bg-darkyellow)",
          onClick: () => this.onEditPage({ item, pageId }),
        },
        {
          name: "trash-alt",
          className: 'ms-3',
          color: "var(--bg-red)",
          onClick: () => this.removePage({ item, pageId }),
        },
      ],
    };
  }

  // Renderizar redes sociales
  renderTagsSocialNetworks = () => {
    return tagsSocialNetworks.map((socialNetwork, i) => (
      <SocialNetwork
        key={i}
        {...socialNetwork}
        onClick={() => {
          const social = socialNetwork.title.toLowerCase();
          const pages = this.props.networks[social].map((item) => {
            return this.renderPage({ item, socialNetwork });
          });

          // Setear red social activa
          this.activeSocialNetwork = social 

          // Mostrar modal que muestra las redes sociales
          this.showModalItems({ items: pages });
        }}
      />
    ));
  }

  // Renderizar contenido de modal que contiene un formulario
  renderModalFormContent = ({ extraData }) => {
    return (
      <ContactModalForm
        ref={this.refSocialNetworkForm}
        defaultValues={extraData.defaultValues}
        onUpdateContactInformation={extraData.onSubmit}
      />
    );
  }

  render() {
    return (
      <Fragment>
        {/* Redes sociales */}
        <div id="social-networks">{this.renderTagsSocialNetworks()}</div>

        {/* Modal que muestra las redes sociales */}
        <DashboardModal
          ref={this.refModalItems}
          title="Mis redes sociales"
          okButtonColor={this.okButtonColor}
          attributes={this.DashboardModalItems}
        />

        {/* Modal que muestra el formulario para añadir una red social */}
        <Modal
          ref={this.refModalForm}
          title="Añadir nueva página"
          okButtonColor={this.okButtonColor}
          attributes={this.ModalForm}
        >
          {this.renderModalFormContent}
        </Modal>
      </Fragment>
    );
  }
}

// <------------------------ Extra Components ------------------------>
export class SocialNetwork extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const tagClasses = this.props.title.toLowerCase();

    return (
      <Tag
        role='button'
        className={tagClasses}
        title={this.props.title}
        color={this.props.color}
        onClick={this.props.onClick}
        icon={<FontAwesomeIcon icon={this.props.icon} className="me-2" />}
      >
        {this.props.title}
      </Tag>
    );
  }
}
